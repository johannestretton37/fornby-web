/**
 * Offline unit test
 */

const chai = require('chai')
const assert = chai.assert
const sinon = require('sinon')
const admin = require('firebase-admin')
// Require and initialize firebase-functions-test. Since we are not passing in any parameters, it will
// be initialized in an "offline mode", which means we have to stub out all the methods that interact
// with Firebase services.
const test = require('firebase-functions-test')()

describe('Fornby Cloud Functions', () => {
  let adminInitStub
  let fornbyFunctions

  before(() => {
    // [START stubAdminInit]
    // If index.js calls admin.initializeApp at the top of the file,
    // we need to stub it out before requiring index.js. This is because the
    // functions will be executed as a part of the require process.
    // Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Now we can require index.js and save the exports inside a namespace called fornbyFunctions.
    fornbyFunctions = require('../index')
    // [END stubAdminInit]
  })

  after(() => {
    // Restore admin.initializeApp() to its original method.
    adminInitStub.restore()
    // Do other cleanup tasks.
    test.cleanup()
  })

  describe('contentChangeDetected', () => {
    // Content changes triggers this function.
    // It should return an array of Promises,
    // each Promise represents one edit.
    // It may also return null if no edits are
    // necessary
    const emptyData = {
      val: () => null,
      exists: () => false
    }
    const data_WithoutSlug_IsEdit_NotPub = {
      name: 'Saker som är bra att veta',
      isEditing: true,
      isPublished: false
    }
    const data_WithSlug_IsEdit_NotPub = {
      name: 'Saker som är bra att veta',
      slug: 'saker-som-ar-bra-att-veta',
      isEditing: true,
      isPublished: false
    }
    const prodContent = {
      name: 'ProdName',
      slug: 'prodname',
      isEditing: false,
      isPublished: true
    }
    let childStub, setStub

    before(() => {
      // Stubs
      childStub = sinon.stub()
      setStub = sinon.stub()
    })

    after(() => {
      childStub = undefined
      setStub = undefined
    })

    describe('should create a slug', () => {
      it('when given new data', async () => {
        childStub.withArgs('_prodContent').returns({ set: setStub })
        setStub.withArgs(data_WithoutSlug_IsEdit_NotPub).returns(true)

        const changeData = test.makeChange(emptyData, {
          val: () => data_WithoutSlug_IsEdit_NotPub,
          exists: () => true,
          ref: {
            child: childStub
          }
        })
        const wrapped = test.wrap(fornbyFunctions.contentChangeDetected)
        const result = await wrapped(changeData)
        // Creating a new entry should only create a slug,
        // so result should contain an array of exactly one
        // promise that resolves to true
        assert.lengthOf(result, 1)
        assert.equal(result[0], true)
      })
    })

    describe('should update slug', () => {
      it('when name changes', async () => {
        const beforeData = Object.assign({}, data_WithSlug_IsEdit_NotPub)
        beforeData._prodContent = prodContent
        const afterData = Object.assign({}, data_WithSlug_IsEdit_NotPub)
        afterData.name = 'Detta är ett nytt namn'
        setStub.withArgs('detta-ar-ett-nytt-namn').returns(true)
        setStub.withArgs(prodContent).returns(true)
        childStub.withArgs('slug').returns({ set: setStub })
        childStub.withArgs('_prodContent').returns({ set: setStub })
        const changeData = test.makeChange(
          {
            val: () => beforeData,
            exists: () => true,
            ref: {
              child: childStub
            }
          },
          {
            val: () => afterData,
            exists: () => true,
            ref: {
              child: childStub
            }
          }
        )
        const wrapped = test.wrap(fornbyFunctions.contentChangeDetected)
        const result = await wrapped(changeData)
        // Updating a name should update slug and _prodContent
        // so result should contain an array of exactly two
        // promises that resolves to true
        assert.lengthOf(result, 2)
        assert.equal(result.every(promise => promise === true), true)
      })

      it('when slug doesnt exist', async () => {
        const beforeData = Object.assign({}, data_WithoutSlug_IsEdit_NotPub)
        beforeData._prodContent = prodContent
        const afterData = Object.assign({}, data_WithoutSlug_IsEdit_NotPub)
        afterData.name = 'Detta är ett nytt namn'
        setStub.withArgs('detta-ar-ett-nytt-namn').returns(true)
        setStub.withArgs(prodContent).returns(true)
        childStub.withArgs('slug').returns({ set: setStub })
        childStub.withArgs('_prodContent').returns({ set: setStub })
        const changeData = test.makeChange(
          {
            val: () => beforeData,
            exists: () => true,
            ref: {
              child: childStub
            }
          },
          {
            val: () => afterData,
            exists: () => true,
            ref: {
              child: childStub
            }
          }
        )

        const wrapped = test.wrap(fornbyFunctions.contentChangeDetected)
        const result = await wrapped(changeData)
        // Updating a slug should update slug and _prodContent
        // so result should contain an array of exactly two
        // promises that resolves to true
        assert.lengthOf(result, 2)
        assert.equal(result[0], true)
      })
    })
  })
})
