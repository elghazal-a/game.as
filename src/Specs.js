'use strict'

var Spec = require('./Spec')

function Specs (specs) {
  this.specs = []
  var self = this
  if (specs) {
    specs.forEach(function (spec, i) {
      self.specs.push(new Spec(spec))
    })
  }
}

Specs.prototype.addSpec = function (spec) {
  var i = this.specExist(spec.id)
  if (i === -1) {
    this.specs.push(new Spec(spec))
    return null
  } else {
    // replace socketID with new socketID
    var oldSocketID = this.specs[i].socketID
    this.specs[i].socketID = spec.socketID
    return oldSocketID
  }
}

Specs.prototype.deleteSpecById = function (id) {
  for (var i = 0; i < this.specs.length; i++) {
    if (this.specs[i].id === id) { return this.specs.splice(i, 1) }
  }
}

Specs.prototype.deleteSpecBySocketID = function (socketID) {
  for (var i = 0; i < this.specs.length; i++) {
    if (this.specs[i].socketID === socketID) { return this.specs.splice(i, 1) }
  }
  return -1
}

Specs.prototype.specExist = function (id) {
  for (var i = 0; i < this.specs.length; i++) {
    if (this.specs[i].id === id) {
      return i
    }
  };
  return -1
}

module.exports = Specs
