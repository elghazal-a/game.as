var should = require('should')
var Specs = require('../../src/Specs')
var it = global.it
var describe = global.describe
var specs = new Specs()

describe('Spec: addSpec()', function () {
  it('should add spec1', function () {
    var response = specs.addSpec({
      id: 'spec1-id',
      socketID: 'spec1-socketID'
    })

    should.not.exist(response)

    specs.specs.length.should.equal(1)
    specs.specs[0].id.should.equal('spec1-id')
    specs.specs[0].socketID.should.equal('spec1-socketID')
  })

  it('should add spec2', function () {
    var response = specs.addSpec({
      id: 'spec2-id',
      socketID: 'spec2-socketID'
    })

    should.not.exist(response)

    specs.specs.length.should.equal(2)
    specs.specs[0].id.should.equal('spec1-id')
    specs.specs[0].socketID.should.equal('spec1-socketID')

    specs.specs[1].id.should.equal('spec2-id')
    specs.specs[1].socketID.should.equal('spec2-socketID')
  })

  it('should not add spec1, but update its socketID', function () {
    var response = specs.addSpec({
      id: 'spec1-id',
      socketID: 'spec1-socketID2'
    })

    response.should.equal('spec1-socketID')

    specs.specs.length.should.equal(2)
    specs.specs[0].id.should.equal('spec1-id')
    specs.specs[0].socketID.should.equal('spec1-socketID2')

    specs.specs[1].id.should.equal('spec2-id')
    specs.specs[1].socketID.should.equal('spec2-socketID')
  })
})

describe('Spec: deleteSpecBySocketID()', function () {
  it('should delete spec1', function () {
    var response = specs.deleteSpecBySocketID('spec1-socketID2')
    response.should.not.equal(-1)

    specs.specs.length.should.equal(1)
    specs.specs[0].id.should.equal('spec2-id')
    specs.specs[0].socketID.should.equal('spec2-socketID')
  })

  it('should not delete unexisting spec', function () {
    var response = specs.deleteSpecBySocketID('specX-socketID2')
    response.should.equal(-1)
    specs.specs.length.should.equal(1)
  })

  it('should delete spec2', function () {
    specs.deleteSpecBySocketID('spec2-socketID')

    specs.specs.length.should.equal(0)
  })
})
