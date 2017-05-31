var should = require('should')
var Players = require('../../src/Players')
var it = global.it
var describe = global.describe
var players = new Players()

describe('Player: initializePlayers()', function () {
  it('should initialize players array with 4 players', function () {
    players.initializePlayers(4)

    players.players.length.should.equal(4)

    should.equal(players.players[0].id, null)
    should.equal(players.players[0].socketID, null)
    should.equal(players.players[0].email, null)
    should.equal(players.players[0].dateRemoved, null)

    should.equal(players.players[1].id, null)
    should.equal(players.players[1].socketID, null)
    should.equal(players.players[1].email, null)
    should.equal(players.players[1].dateRemoved, null)

    should.equal(players.players[2].id, null)
    should.equal(players.players[2].socketID, null)
    should.equal(players.players[2].email, null)
    should.equal(players.players[2].dateRemoved, null)

    should.equal(players.players[3].id, null)
    should.equal(players.players[3].socketID, null)
    should.equal(players.players[3].email, null)
    should.equal(players.players[3].dateRemoved, null)
  })
})

describe('Player: setPlayer()', function () {
  it('should set seat2 with spec1', function () {
    players.setPlayer(2, {
      id: 'spec1-id',
      socketID: 'spec1-socketID',
      rating: {
        mu: 25,
        sigma: 8
      }
    })

    players.players[2].id.should.equal('spec1-id')
    players.players[2].socketID.should.equal('spec1-socketID')
  })

  it('should set seat3 with spec2', function () {
    players.setPlayer(3, {
      id: 'spec2-id',
      socketID: 'spec2-socketID',
      rating: {
        mu: 25,
        sigma: 8
      }
    })

    players.players[3].id.should.equal('spec2-id')
    players.players[3].socketID.should.equal('spec2-socketID')
  })

  it('should set seat1 with spec3', function () {
    players.setPlayer(1, {
      id: 'spec3-id',
      socketID: 'spec3-socketID',
      rating: {
        mu: 25,
        sigma: 8
      }
    })

    players.players[1].id.should.equal('spec3-id')
    players.players[1].socketID.should.equal('spec3-socketID')
  })

  it('should overwrite seat2 with spec4', function () {
    players.setPlayer(2, {
      id: 'spec4-id',
      socketID: 'spec4-socketID',
      rating: {
        mu: 25,
        sigma: 8
      }
    })

    players.players[2].id.should.equal('spec4-id')
    players.players[2].socketID.should.equal('spec4-socketID')
    should.equal(players.players[2].dateRemoved, null)
  })
})

describe('Player: playerExistById()', function () {
  it('should find spec3 in seat1', function () {
    var response = players.playerExistById('spec3-id')
    response.should.equal(1)
  })

  it('should not find spec5', function () {
    var response = players.playerExistById('spec5-id')
    response.should.equal(-1)
  })
})

describe('Player: getRemainingPlayers()', function () {
  it('should get the remaining players', function () {
    players.getRemainingPlayers().should.equal(1)
  })
})

describe('Player: isCertainlyFreeSeat()', function () {
  it('seat0 should be certainly free', function () {
    var response = players.isCertainlyFreeSeat(0)
    response.free.should.be.true()
    should.not.exist(response.diffTime)
  })

  it('seat1 should not be free', function () {
    var response = players.isCertainlyFreeSeat(1)
    response.free.should.be.false()
  })
})

describe('Player: removeTmpPlayer()', function () {
  it('remove temporary spec3 from seat1', function () {
    players.removeTmpPlayer(1)
    should.not.exist(players.players[1].socketID);
    (((new Date()).getTime() - players.players[1].dateRemoved) >= 0).should.be.true()
  })
})

describe('Player: getRemainingPlayers()', function () {
  it('should get the remaining players', function () {
    players.getRemainingPlayers().should.equal(2)
  })
})

describe('Player: isCertainlyFreeSeat()', function () {
  it('seat1 should not be certainly free', function () {
    global.Config = {
      params: {
        timeWaitinPlayerBack: 3
      }
    }
    var response = players.isCertainlyFreeSeat(1)
    response.free.should.be.false()
    should.exist(response.diffTime)
  })
})

describe('Player: setNewRatings()', function () {
  var players = new Players()
  players.initializePlayers(4)
  players.players.forEach(function (player, i) {
    players.setPlayer(i, {
      id: 'spec' + i + '-id',
      socketID: 'spec' + i + '-socketID',
      rating: {
        mu: 25,
        sigma: 8
      }
    })
  })
  it('should set seat2 with spec1', function () {
    players.setNewRatings([{
      id: 'spec1-id',
      mu: 15,
      sigma: 2
    }, {
      id: 'spec3-id',
      mu: 71,
      sigma: 14
    }, {
      id: 'spec0-id',
      mu: 52,
      sigma: 4
    }, {
      id: 'spec2-id',
      mu: 147,
      sigma: 7
    }
    ])
    players.players[0].rating.mu.should.eql(52)
    players.players[0].rating.sigma.should.eql(4)

    players.players[1].rating.mu.should.eql(15)
    players.players[1].rating.sigma.should.eql(2)

    players.players[2].rating.mu.should.eql(147)
    players.players[2].rating.sigma.should.eql(7)

    players.players[3].rating.mu.should.eql(71)
    players.players[3].rating.sigma.should.eql(14)
  })
})
