var Player = require('./Player')

function Players (players) {
  this.players = []// Static Array
  var self = this
  if (players) {
    players.forEach(function (player, i) {
      self.players.push(new Player(player))
    })
  }
}

Players.prototype.initializePlayers = function (nbrPlayers) {
  for (var i = 0; i < nbrPlayers; i++) {
    this.players[i] = new Player({
      id: null,
      socketID: null,
      email: null,
      name: null,
      avatar: null,
      facebookId: null,
      googleId: null,
      strategy: null,
      dateRemoved: null,
      rating: null,
      coins: null
    })
  }
}

Players.prototype.setPlayer = function (i, spec) {
  this.players[i].setPlayer(spec)
}

Players.prototype.removeTmpPlayer = function (i) {
  this.players[i].socketID = null
  this.players[i].dateRemoved = (new Date()).getTime()
}

Players.prototype.playerExistById = function (id) {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i]) {
      if (this.players[i].id === id) {
        return i
      }
    }
  };
  return -1
}

Players.prototype.playerExistBySocketID = function (socketID) {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i]) {
      if (this.players[i].socketID === socketID) {
        return i
      }
    }
  };
  return -1
}

Players.prototype.setSocketID = function (indexSeat, socketID) {
  var oldSocketID = this.players[indexSeat].socketID
  this.players[indexSeat].socketID = socketID
  this.players[indexSeat].dateRemoved = null
  return oldSocketID
}

Players.prototype.getRemainingPlayers = function () {
  // It's the sum of the free seats, the purpose is to get a reliable value so we don't start the game until this value=0
  // Free seat is defined here as socketID=null which mean that even if the player has just quit, it's a free seat
  var nbrFreePlaces = 0
  this.players.forEach(function (player, i) {
    if (player.socketID === null) { nbrFreePlaces++ }
  })
  return nbrFreePlaces
}

Players.prototype.isCertainlyFreeSeat = function (indexSeat) {
  if (this.players[indexSeat] === null || this.players[indexSeat] === undefined) {
    console.error('Unexisting Seat', indexSeat)
    return {free: false}
  }

  if (this.players[indexSeat].socketID) return {free: false}
  else {
    // socketID = null
    if (this.players[indexSeat].dateRemoved === null) return {free: true}

    var diffTime = (new Date()).getTime() - this.players[indexSeat].dateRemoved
    if (diffTime > global.Config.params.timeWaitinPlayerBack * 1000) {
      // It's been long time this place has been dropped
      return {
        free: true,
        seatDropped: true,
        player: this.players[indexSeat]
      }
    } else {
      // The system is still waiting for the old player to comeback in diffTime
      // When the old player comeback in diffTime, he will automatically take back his seat when join:room
      return {
        free: false,
        diffTime: diffTime
      }
    }
  }
}

Players.prototype.cleanHands = function () {
  this.players.forEach(function (player, i) {
    player.hand = []
  })
}

Players.prototype.addCoinsEarned = function (teams) {
  if (this.players.length === 2) {
    this.players[0].setNewCoin(this.players[0].coins + teams[0][0].coinsEarned)
    this.players[1].setNewCoin(this.players[1].coins + teams[1][0].coinsEarned)
  } else if (this.players.length === 4) {
    this.players[0].setNewCoin(this.players[0].coins + teams[0][0].coinsEarned)
    this.players[2].setNewCoin(this.players[2].coins + teams[0][1].coinsEarned)

    this.players[1].setNewCoin(this.players[1].coins + teams[1][0].coinsEarned)
    this.players[3].setNewCoin(this.players[3].coins + teams[1][1].coinsEarned)
  }
}

Players.prototype.setNewRatings = function (players) {
  var self = this
  players.forEach(function (player, i) {
    self.setNewRating(player.id, player.mu, player.sigma)
  })
}

Players.prototype.setNewRating = function (id, mu, sigma) {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i] && this.players[i].id === id) {
      this.players[i].setNewRating(mu, sigma)
      return
    }
  }
}

module.exports = Players
