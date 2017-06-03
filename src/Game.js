var util = require('util')
var EventEmitter = require('events').EventEmitter
var async = require('async')
var _ = require('lodash')
var request = require('request')

var Specs = require('./Specs')

module.exports = function (Rsmq, Trueskill, io, GameUrl) {
  function Game (table, specs) {
    this.table = table
    this.specs = new Specs(specs)
  }
  util.inherits(Game, EventEmitter)

  /*
    Child classes must implement
      startGame()
      startOrResume()
      dropped_seat_taken(indexDroppedSeat)
      playerLeft(indexDroppedSeat)
  */

  Game.prototype.specConnected = function (players, spec) {
    var indexSeat = players.playerExistById(spec.id)
    var oldSocketID
    if (indexSeat >= 0) {
      // Update SocketID
      oldSocketID = players.setSocketID(indexSeat, spec.socketID)
      // Disconnect Old SocketID
      // Notify others

      var remainingPlayers = players.getRemainingPlayers()
      if (remainingPlayers === 0) {
        this.startOrResume()
      }

      return {
        wasPlayer: true,
        wasSpec: false,
        oldSocketID: oldSocketID,
        indexSeat: indexSeat,
        hand: players.players[indexSeat].hand,
        remainingPlayers: remainingPlayers
      }
    }

    oldSocketID = this.specs.addSpec(spec)
    if (oldSocketID === null) {
      // Spec didn't exist => added
      // Notify others
      return {
        wasPlayer: false,
        wasSpec: false
      }
    } else {
      // Spec existed and its socketID has been updated
      // Remote disconnect its old socketID
      return {
        wasPlayer: false,
        wasSpec: true,
        oldSocketID: oldSocketID
      }
    }
  }

  Game.prototype.specTakePlace = function (stateGame, players, spec, indexSeat) {
    if (indexSeat < 0 || indexSeat >= this.table.nbrPlayers) {
        // It's a bad guy
      return {
        err: {
          code: 400,
          msg: 'OPERATION_NOT_PERMITTED'
        }
      }
    }

    if (players.playerExistById(spec.id) >= 0) {
        // It's a bad guy
      return {
        err: {
          code: 400,
          msg: 'OPERATION_NOT_PERMITTED'
        }
      }
    }

    if (!stateGame.free && spec.coins < this.table.coins) {
      return {
        err: {
          code: 400,
          msg: 'NOT_ENOUGH_COINS'
        }
      }
    }

    var response = players.isCertainlyFreeSeat(indexSeat)
    if (response.free) {
      if (response.seatDropped) {
        // a dropped seat has taken by an *other* player
        this.dropped_seat_taken(indexSeat)
      }
      this.specs.deleteSpecById(spec.id)

      players.setPlayer(indexSeat, spec)
      var remainingPlayers = players.getRemainingPlayers()
      if (remainingPlayers === 0) {
        this.startOrResume()
      }
      return {
        err: null,
        hand: players.players[indexSeat].hand,
        remainingPlayers: remainingPlayers
      }
    } else {
      if (response.diffTime) {
        return {
          err: {
            code: 400,
            msg: 'SEAT_STILL_NOT_FREE',
            diffTime: response.diffTime
          }
        }
      } else {
        return {
          err: {
            code: 400,
            msg: 'SEAT_NOT_FREE'
          }
        }
      }
    }
  }

  Game.prototype.userLeft = function (players, socketID) {
    var indexSeat = players.playerExistBySocketID(socketID)
    if (indexSeat >= 0) {
      players.removeTmpPlayer(indexSeat)
      this.playerLeft(indexSeat)
      return {
        isPlayer: true,
        nbrPlayers: this.table.nbrPlayers - players.getRemainingPlayers(),
        nbrTotalPlayers: this.table.nbrPlayers
      }
    } else {
      var response = this.specs.deleteSpecBySocketID(socketID)
      if (response !== -1) {
        return {
          isPlayer: false,
          nbrPlayers: this.table.nbrPlayers - players.getRemainingPlayers(),
          nbrTotalPlayers: this.table.nbrPlayers
        }
      } else {
        return {
          err: {
            code: 404,
            msg: 'USER_NOT_FOUND'
          }
        }
      }
    }
  }

  Game.prototype.askCards = function (players, socketID) {
    var indexSeat = this.players.playerExistBySocketID(socketID)
    if (indexSeat > -1) {
      return {
        err: null,
        isPlayer: true,
        hand: this.players.players[indexSeat].hand
      }
    } else {
      return {
        err: null,
        isPlayer: false,
        handLength: this.players.players[0].hand.length
      }
    }
  }

  Game.prototype.rematch = function (socketID) {
    var self = this
    if (this.stateGame.endGame === false) {
      return {
        err: {
          code: 400,
          msg: 'GAME_NOT_YET_FINISHED'
        }
      }
    }

    var indexSeat = this.players.playerExistBySocketID(socketID)
    if (indexSeat < 0) {
      return {
        err: {
          code: 404,
          msg: 'PLAYER_NOT_FOUND'
        }
      }
    }
    if (this.stateGame.wantToRematch.indexOf(this.players.players[indexSeat].id) >= 0) {
      return {
        err: {
          code: 400,
          msg: 'REMATCH_ALREADY_ASKED'
        }
      }
    }
    if (this.players.players[indexSeat].coins < this.table.coins) {
      return {
        err: {
          code: 400,
          msg: 'NOT_ENOUGH_COINS'
        }
      }
    }

    // Don't forget to disable replay button client-side
    this.stateGame.wantToRematch.push(this.players.players[indexSeat].id)
    if (this.stateGame.wantToRematch.length >= this.table.nbrPlayers) {
      self.startGame()
      return {
        err: null,
        indexSeat: indexSeat,
        rematch: true
      }
    } else {
      return {
        err: null,
        indexSeat: indexSeat,
        rematch: false
      }
    }
  }

  Game.prototype.updateNewSkillsAndCoins = function (teams, ranks) {
    var self = this
    async.waterfall([
      function (callback) {
        Trueskill.call('trueskill', {
          numPlayersInTeam: self.table.nbrPlayers / 2,
          ranks: ranks,
          teams: teams
        }, callback)
      },
      function (newTeamsRating, callback) {
        console.log('teams', require('util').inspect(teams, false, null))
        console.log('newTeamsRating', require('util').inspect(newTeamsRating, false, null))
        var flattenTeams = _.flatten(teams)
        flattenTeams.forEach(function (team, i) {
          team.mu = newTeamsRating[i].mu
          team.sigma = newTeamsRating[i].sigma
        })
        io.of('/' + self.table.gameName).to(self.table.route).emit('rating:new', flattenTeams)
        request({
          baseUrl: GameUrl,
          json: true,
          url: '/games/' + self.table.route + '/players/rating',
          method: 'PUT',
          body: {
            teams: flattenTeams
          }
        }, function (err, res) {
          if (err) console.error('Error updating new rating', flattenTeams)
        })
        callback(null, flattenTeams)
      },
      function (flattenTeams, callback) {
        var endGameData = JSON.stringify({
          gameName: self.table.gameName,
          room: self.table.route,
          tableName: self.table.name,
          tableCoins: self.table.coins,
          teams: flattenTeams
        })
        console.log('endGameData', require('util').inspect(endGameData, false, null))
        Rsmq.sendMessage({
          qname: global.Config.params.rsmq.queueNameEndGameData,
          message: endGameData
        }, callback)
      }
    ], function (err, result) {
      if (err) {
        console.error('ERROR updating final data game', err, teams)
      }
    })
  }
  return Game
}
