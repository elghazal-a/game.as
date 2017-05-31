var sinon = require('sinon')
var should = require('should')
var it = global.it
var describe = global.describe

global.Config = {
  services: {
    ronda: {
      url: ''
    }
  },
  params: {
    feesCoinsPercentage: 20,
    rsmq: {
      queueNameEndGameData: 'end_game'

    }
  }
}

// describe('game#prepareEndGameData', function () {
//   it('should #prepareEndGameData in 4-players table when no indexPlayerLost provided', function (done) {
//     var Game = require('../../game/Game')({
//       sendMessage: function (data, cb) {
//         data = JSON.parse(data.message)
//         data.gameName.should.eql('ronda')
//         data.teams.should.eql([{
//           id: null,
//           mu: 50,
//           sigma: 5,
//           coinsEarned: 60,
//           win: true
//         }, {
//           id: null,
//           mu: 50,
//           sigma: 5,
//           coinsEarned: 60,
//           win: true

//         }, {
//           id: null,
//           mu: 50,
//           sigma: 5,
//           coinsEarned: -100,
//           win: false

//         }, {
//           id: null,
//           mu: 50,
//           sigma: 5,
//           coinsEarned: -100,
//           win: false

//         }])
//         cb(null)
//         done()
//       }
//     }, {
//       call: function (procedure, data, cb) {
//         // callback with newTeamsRating
//         cb(null, [{mu: 50, sigma: 5}, {mu: 50, sigma: 5}, {mu: 50, sigma: 5}, {mu: 50, sigma: 5}])
//       }
//     }, {
//       of: function () {
//         return this
//       },
//       to: function () {
//         return this
//       },
//       emit: function () {
//         return this
//       }
//     }, sinon.spy())
//     var game = new Game({
//       nbrPlayers: 4,
//       coins: 100
//     })

//     game.players.players.forEach(function (player) {
//       player.rating = {
//         mu: 25,
//         sigma: 8
//       }
//     })
//     game.players.players[1].dateRemoved = (new Date()).getTime()
//     game.players.players[0].dateRemoved = (new Date()).getTime() + 2000
//     game.players.players[2].dateRemoved = (new Date()).getTime() + 5000
//     game.players.players[3].dateRemoved = (new Date()).getTime() + 7000

//     game.prepareEndGameData()
//     game.stateGame.free.should.be.true()
//   })

//   it('should #prepareEndGameData in 4-players table when indexPlayerLost provided', function (done) {
//     var Game = require('../../game/Game')({
//       sendMessage: function (data, cb) {
//         data = JSON.parse(data.message)
//         data.gameName.should.eql('ronda')
//         data.teams.should.eql([{
//           id: null,
//           mu: 50,
//           sigma: 5,
//           coinsEarned: -100,
//           win: false
//         }, {
//           id: null,
//           mu: 50,
//           sigma: 5,
//           coinsEarned: -100,
//           win: false

//         }, {
//           id: null,
//           mu: 50,
//           sigma: 5,
//           coinsEarned: 60,
//           win: true

//         }, {
//           id: null,
//           mu: 50,
//           sigma: 5,
//           coinsEarned: 60,
//           win: true

//         }])
//         cb(null)
//         done()
//       }
//     }, {
//       call: function (procedure, data, cb) {
//         // callback with newTeamsRating
//         cb(null, [{mu: 50, sigma: 5}, {mu: 50, sigma: 5}, {mu: 50, sigma: 5}, {mu: 50, sigma: 5}])
//       }
//     }, {
//       of: function () {
//         return this
//       },
//       to: function () {
//         return this
//       },
//       emit: function () {
//         return this
//       }
//     }, sinon.spy())
//     var game = new Game({
//       nbrPlayers: 4,
//       coins: 100
//     })

//     game.players.players.forEach(function (player) {
//       player.rating = {
//         mu: 25,
//         sigma: 8
//       }
//     })
//     game.prepareEndGameData(0)
//     game.stateGame.free.should.be.true()
//   })
// })

// describe('game#rematch', function () {
//   var Game = require('../../game/Game')(null)
//   it('should not #rematch when game not yet finished', function () {
//     var game = new Game({
//     })
//     game.stateGame.endGame = false
//     var response = game.rematch()
//     response.err.code.should.be.eql(400)
//     response.err.msg.should.be.eql('GAME_NOT_YET_FINISHED')
//   })
//   it('should not #rematch when user doesnt exist', function () {
//     var game = new Game({
//     })
//     game.stateGame.endGame = true
//     var response = game.rematch('xxxx')
//     response.err.code.should.be.eql(404)
//     response.err.msg.should.be.eql('PLAYER_NOT_FOUND')
//   })
//   it('player1 should #rematch', function () {
//     var game = new Game({
//       nbrPlayers: 2
//     })
//     game.stateGame.endGame = true
//     game.players.players.forEach(function (player, i) {
//       player.id = 'id' + i
//       player.socketID = 'socketID' + i
//       player.rating = {
//         mu: 25,
//         sigma: 8
//       }
//     })
//     var response = game.rematch('socketID1')
//     should.not.exist(response.err)
//     response.indexSeat.should.be.eql(1)
//     response.rematch.should.be.false()
//   })
//   it('same player cant #rematch', function () {
//     var game = new Game({
//       nbrPlayers: 2
//     })
//     game.stateGame.endGame = true
//     game.players.players.forEach(function (player, i) {
//       player.id = 'id' + i
//       player.socketID = 'socketID' + i
//       player.rating = {
//         mu: 25,
//         sigma: 8
//       }
//     })
//     var response = game.rematch('socketID1')
//     should.not.exist(response.err)
//     response.rematch.should.be.false()

//     response = game.rematch('socketID1')
//     response.err.code.should.be.eql(400)
//     response.err.msg.should.be.eql('REMATCH_ALREADY_ASKED')
//   })
//   it('all players should #rematch', function () {
//     var game = new Game({
//       nbrPlayers: 2
//     })
//     game.stateGame.endGame = true
//     game.players.players.forEach(function (player, i) {
//       player.id = 'id' + i
//       player.socketID = 'socketID' + i
//       player.rating = {
//         mu: 25,
//         sigma: 8
//       }
//     })
//     var response = game.rematch('socketID0')
//     should.not.exist(response.err)
//     response.indexSeat.should.be.eql(0)
//     response.rematch.should.be.false()

//     response = game.rematch('socketID1')
//     should.not.exist(response.err)
//     response.indexSeat.should.be.eql(1)
//     response.rematch.should.be.true()
//     game.stateGame.endGame.should.be.false()
//   })
// })
