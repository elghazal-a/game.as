module.exports = function (Rsmq, Trueskill, io, GameUrl) {
  return {
    game: require('./src/Game')(Rsmq, Trueskill, io, GameUrl),
    player: require('./src/Player'),
    players: require('./src/Players')
  }
}
