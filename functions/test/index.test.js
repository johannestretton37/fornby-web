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
    fornbyFunctions = undefined
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

    beforeEach(() => {
      // Stubs
      childStub = sinon.stub()
      setStub = sinon.stub()
      removeStub = sinon.stub()
    })

    afterEach(() => {
      childStub = undefined
      setStub = undefined
      removeStub = undefined
    })
    /**
     * Slug tests
     */
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

    /**
     * Preview dataURI tests
     *
     * When an update is made (via flamelink), every property is cleared
     * and then written again. That means that we need to preserve our
     * custom properties (slug, previews) somehow.
     * The way we do this is by copying those values from the already
     * stored data before it is cleared
     */
    describe('should preserve array of previews', () => {
      it('when edits are made but images has not changed', async () => {
        const data_withPreviews_withImages = {
          isEditing: false,
          isPublished: true,
          previews: [
            {
              dataURI: 'aPreviewDataURI',
              color: '#FF0000'
            }
          ],
          images: ['123456789']
        }
        childStub.withArgs('previews').returns({ set: setStub })
        childStub.withArgs('_prodContent').returns({ remove: removeStub })
        setStub.withArgs(data_withPreviews_withImages.previews).returns(true)
        // Technically the .remove() method returns nothing but for easier
        // assertion we just assumes it returns true
        removeStub.returns(true)

        const changeData = test.makeChange(
          {
            val: () => data_withPreviews_withImages,
            exists: () => true,
            ref: {
              child: childStub
            }
          },
          {
            val: () => data_withPreviews_withImages,
            exists: () => true,
            ref: {
              child: childStub
            }
          }
        )
        const wrapped = test.wrap(fornbyFunctions.contentChangeDetected)
        const result = await wrapped(changeData)
        // Result should contain an array with two promises that both resolves
        // to true.
        assert.lengthOf(result, 2)
        assert.equal(result.every(promise => promise === true), true)
      })
    })

    /**
     * Edit mode/Published tests
     *
     *
     */
    describe('should create, update or delete _prodContent', () => {
      const data_NotEdit_NotPub = {
        isEditing: false,
        isPublished: false,
        name: 'Not Edit and Not Pub'
      }
      const data_IsEdit_NotPub = {
        isEditing: true,
        isPublished: false,
        name: 'Is Edit and Not Pub'
      }
      const data_NotEdit_IsPub = {
        isEditing: false,
        isPublished: true,
        name: 'Not Edit and Is Pub'
      }
      const data_IsEdit_IsPub = {
        isEditing: true,
        isPublished: true,
        name: 'Is Edit and Is Pub'
      }
      /**
       * isEditing switch
       */
      it('when isEditing switches from false to true', async () => {
        childStub.withArgs('slug').returns({ set: setStub })
        setStub.withArgs('is-edit-and-not-pub').returns(true)
        childStub.withArgs('_prodContent').returns({ set: setStub })
        setStub.withArgs(data_NotEdit_NotPub).returns(true)

        const changeData = test.makeChange(
          {
            val: () => data_NotEdit_NotPub,
            exists: () => true
          },
          {
            val: () => data_IsEdit_NotPub,
            exists: () => true,
            ref: {
              child: childStub
            }
          }
        )
        const wrapped = test.wrap(fornbyFunctions.contentChangeDetected)
        const result = await wrapped(changeData)
        // Result should contain an array with two promises that both resolves
        // to true.
        assert.lengthOf(result, 2)
        assert.equal(result.every(promise => promise === true), true)
      })
      it('when isEditing switches from true to false', async () => {
        childStub.withArgs('slug').returns({ set: setStub })
        setStub.withArgs('not-edit-and-not-pub').returns(true)
        childStub.withArgs('_prodContent').returns({ remove: removeStub })
        removeStub.returns(true)

        const changeData = test.makeChange(
          {
            val: () => data_IsEdit_NotPub,
            exists: () => true
          },
          {
            val: () => data_NotEdit_NotPub,
            exists: () => true,
            ref: {
              child: childStub
            }
          }
        )
        const wrapped = test.wrap(fornbyFunctions.contentChangeDetected)
        const result = await wrapped(changeData)
        // Result should contain an array with two promises that both resolves
        // to true.
        assert.lengthOf(result, 2)
        assert.equal(result.every(promise => promise === true), true)
      })
      it('when isEditing is false', async () => {
        childStub.withArgs('slug').returns({ set: setStub })
        setStub.withArgs('not-edit-and-not-pub').returns(true)
        childStub.withArgs('_prodContent').returns({ remove: removeStub })
        removeStub.returns(true)

        const data_WithSlug = Object.assign({}, data_NotEdit_NotPub, {
          slug: 'not-edit-and-not-pub'
        })
        const changeData = test.makeChange(
          {
            val: () => data_WithSlug,
            exists: () => true
          },
          {
            val: () => data_NotEdit_NotPub,
            exists: () => true,
            ref: {
              child: childStub
            }
          }
        )
        const wrapped = test.wrap(fornbyFunctions.contentChangeDetected)
        const result = await wrapped(changeData)
        // Result should contain an array with two promises that both resolves
        // to true.
        assert.lengthOf(result, 2)
        assert.equal(result.every(promise => promise === true), true)
      })
      it('when isEditing is true', async () => {
        const fakeProdContent = {
          name: 'Fake Prod Content',
          slug: 'fake-prod-content'
        }

        childStub.withArgs('slug').returns({ set: setStub })
        setStub.withArgs('is-edit-and-not-pub').returns(true)
        childStub.withArgs('_prodContent').returns({ set: setStub })
        setStub.withArgs(fakeProdContent).returns(true)

        const data_IsEdit_NotPub_WithProd = Object.assign(
          {},
          data_IsEdit_NotPub,
          {
            slug: 'is-edit-and-not-pub',
            _prodContent: fakeProdContent
          }
        )
        const changeData = test.makeChange(
          {
            val: () => data_IsEdit_NotPub_WithProd,
            exists: () => true
          },
          {
            val: () => data_IsEdit_NotPub,
            exists: () => true,
            ref: {
              child: childStub
            }
          }
        )
        const wrapped = test.wrap(fornbyFunctions.contentChangeDetected)
        const result = await wrapped(changeData)
        // Result should contain an array with two promises that both resolves
        // to true.
        assert.lengthOf(result, 2)
        assert.equal(result.every(promise => promise === true), true)
      })
      it('when isEditing switches from false to true', async () => {
        childStub.withArgs('slug').returns({ set: setStub })
        setStub.withArgs('is-edit-and-not-pub').returns(true)
        childStub.withArgs('_prodContent').returns({ set: setStub })
        setStub.withArgs(data_NotEdit_NotPub).returns(true)

        const changeData = test.makeChange(
          {
            val: () => data_NotEdit_NotPub,
            exists: () => true
          },
          {
            val: () => data_IsEdit_NotPub,
            exists: () => true,
            ref: {
              child: childStub
            }
          }
        )
        const wrapped = test.wrap(fornbyFunctions.contentChangeDetected)
        const result = await wrapped(changeData)
        // Result should contain an array with two promises that both resolves
        // to true.
        assert.lengthOf(result, 2)
        assert.equal(result.every(promise => promise === true), true)
      })
      it('when isEditing switches from true to false', async () => {
        childStub.withArgs('slug').returns({ set: setStub })
        setStub.withArgs('not-edit-and-not-pub').returns(true)
        childStub.withArgs('_prodContent').returns({ remove: removeStub })
        removeStub.returns(true)

        const changeData = test.makeChange(
          {
            val: () => data_IsEdit_NotPub,
            exists: () => true
          },
          {
            val: () => data_NotEdit_NotPub,
            exists: () => true,
            ref: {
              child: childStub
            }
          }
        )
        const wrapped = test.wrap(fornbyFunctions.contentChangeDetected)
        const result = await wrapped(changeData)
        // Result should contain an array with two promises that both resolves
        // to true.
        assert.lengthOf(result, 2)
        assert.equal(result.every(promise => promise === true), true)
      })
      it('when isEditing is false', async () => {
        childStub.withArgs('slug').returns({ set: setStub })
        setStub.withArgs('not-edit-and-not-pub').returns(true)
        childStub.withArgs('_prodContent').returns({ remove: removeStub })
        removeStub.returns(true)

        const data_WithSlug = Object.assign({}, data_NotEdit_NotPub, {
          slug: 'not-edit-and-not-pub'
        })
        const changeData = test.makeChange(
          {
            val: () => data_WithSlug,
            exists: () => true
          },
          {
            val: () => data_NotEdit_NotPub,
            exists: () => true,
            ref: {
              child: childStub
            }
          }
        )
        const wrapped = test.wrap(fornbyFunctions.contentChangeDetected)
        const result = await wrapped(changeData)
        // Result should contain an array with two promises that both resolves
        // to true.
        assert.lengthOf(result, 2)
        assert.equal(result.every(promise => promise === true), true)
      })
      it('when isEditing is true', async () => {
        const fakeProdContent = {
          name: 'Fake Prod Content',
          slug: 'fake-prod-content'
        }

        childStub.withArgs('slug').returns({ set: setStub })
        setStub.withArgs('is-edit-and-not-pub').returns(true)
        childStub.withArgs('_prodContent').returns({ set: setStub })
        setStub.withArgs(fakeProdContent).returns(true)

        const data_IsEdit_NotPub_WithProd = Object.assign(
          {},
          data_IsEdit_NotPub,
          {
            slug: 'is-edit-and-not-pub',
            _prodContent: fakeProdContent
          }
        )
        const changeData = test.makeChange(
          {
            val: () => data_IsEdit_NotPub_WithProd,
            exists: () => true
          },
          {
            val: () => data_IsEdit_NotPub,
            exists: () => true,
            ref: {
              child: childStub
            }
          }
        )
        const wrapped = test.wrap(fornbyFunctions.contentChangeDetected)
        const result = await wrapped(changeData)
        // Result should contain an array with two promises that both resolves
        // to true.
        assert.lengthOf(result, 2)
        assert.equal(result.every(promise => promise === true), true)
      })
    })
  })
})
