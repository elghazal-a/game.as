'use strict'

var User = require('./User')

function Spec (spec) {
  User.call(this, spec)
  this.socketID = spec.socketID
}

Spec.prototype = Object.create(User.prototype)
Spec.prototype.constructor = Spec

Spec.prototype.setSpec = function (spec) {
  User.prototype.setUser.call(this, spec)
  this.socketID = spec.socketID
}

module.exports = Spec
