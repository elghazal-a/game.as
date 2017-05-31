var Spec = require('./Spec')

function Player (player) {
  Spec.call(this, player)

  this.dateRemoved = player.dateRemoved
  this.hand = player.hand || []
}

Player.prototype = Object.create(Spec.prototype)
Player.prototype.constructor = Player

Player.prototype.setPlayer = function (player) {
  Spec.prototype.setSpec.call(this, player)

  this.pouvoir = {demasquerBluff: 1}
  this.dateRemoved = null
  // Keep the hand, subsequent players need it
}

Player.prototype.deleteCardFromHand = function (indexCardPlayed) {
  this.hand.splice(indexCardPlayed, 1)
}

module.exports = Player
