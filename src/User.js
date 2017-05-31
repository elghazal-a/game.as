function User (user) {
  this.id = user.id
  this.email = user.email
  this.name = user.name
  this.avatar = user.avatar
  this.facebookId = user.facebookId
  this.googleId = user.googleId
  this.strategy = user.strategy
  this.rating = user.rating
  this.coins = user.coins
}

User.prototype.setUser = function (user) {
  this.id = user.id
  this.email = user.email
  this.name = user.name
  this.avatar = user.avatar
  this.facebookId = user.facebookId
  this.googleId = user.googleId
  this.strategy = user.strategy
  this.rating = user.rating
  this.coins = user.coins
}

User.prototype.setNewCoin = function (newCoin) {
  this.coins = newCoin
}

User.prototype.setNewRating = function (mu, sigma) {
  this.rating.mu = mu
  this.rating.sigma = sigma
}

module.exports = User
