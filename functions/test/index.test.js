/**
 * Offline unit test
 */
const fs = require('fs')
const path = require('path')
const chai = require('chai')
const assert = chai.assert
const sinon = require('sinon')
const admin = require('firebase-admin')
const imageDataURI = require('image-data-uri')
// Require and initialize firebase-functions-test. Since we are not passing in any parameters, it will
// be initialized in an "offline mode", which means we have to stub out all the methods that interact
// with Firebase services.
const test = require('firebase-functions-test')()
const helpers = require('../helpers')

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
      it('when given new unpublished data', async () => {
        childStub.withArgs('slug').returns({ set: setStub })
        setStub.withArgs('saker-som-ar-bra-att-veta').returns(true)

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
    describe('should create, update or delete _prodContent', () => {
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
    })
    describe('should ignore _prodContent', () => {
      it('when isEditing is true and no _prodContent exists', async () => {
        const fakeProdContent = {
          name: 'Fake Prod Content',
          slug: 'fake-prod-content'
        }

        childStub.withArgs('slug').returns({ set: setStub })
        setStub.withArgs('is-edit-and-never-pub').returns(true)

        const data_IsEdit_NotPub_WithoutProd = Object.assign(
          {},
          data_IsEdit_NotPub,
          {
            slug: 'is-edit-and-never-pub'
          }
        )
        const changeData = test.makeChange(
          {
            val: () => data_IsEdit_NotPub_WithoutProd,
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
        assert.lengthOf(result, 1)
        assert.equal(result.every(promise => promise === true), true)
      })
    })
  })

  describe('addPreview', () => {
    /**
     * Whenever a change is detected to the images property of a content object,
     * a preview needs to be added to the object's preview array
     */
    // Define mock data
    const emptyData = {
      val: () => null,
      exists: () => false
    }

    // Declare stubbed function vars
    let childStub, setStub, onceStub, removeStub

    beforeEach(() => {
      // Stubs
      childStub = sinon.stub()
      setStub = sinon.stub()
      onceStub = sinon.stub()
      removeStub = sinon.stub()
    })

    afterEach(() => {
      childStub = undefined
      setStub = undefined
      onceStub = undefined
      removeStub = undefined
    })
    /**
     * Slug tests
     */
    describe('should return null', () => {
      it('when images property is deleted', () => {
        const changeData = test.makeChange(
          {
            val: () => '1234_an_image_id_5678',
            exists: () => true
          },
          emptyData
        )
        const wrapped = test.wrap(fornbyFunctions.addPreview)
        const result = wrapped(changeData)
        // addPreview should return null
        assert.equal(result, null)
      })
      it('when no change occurred', () => {
        const changeData = test.makeChange(
          {
            val: () => '1234_same_image_id_5678',
            exists: () => true
          },
          {
            val: () => '1234_same_image_id_5678',
            exists: () => true
          }
        )
        const wrapped = test.wrap(fornbyFunctions.addPreview)
        const result = wrapped(changeData)
        assert.isNull(result)
      })
    })

    describe('should add a preview', () => {
      it('when an image is added to an entry', async () => {
        const preview = {
          dataURL: 'dataURLFor_12345678',
          color: '#FF00DD'
        }
        const snapshot = {
          val: () => preview
        }
        const onceStub = sinon.stub()
        childStub
          .withArgs('/previews/1234_an_image_id_5678')
          .returns({ once: onceStub })
        onceStub.withArgs('value').resolves(snapshot)
        childStub.withArgs('previews').returns({ set: setStub })
        setStub.withArgs({ imageIndex: preview }).returns(true)

        const changeData = test.makeChange(emptyData, {
          val: () => '1234_an_image_id_5678',
          exists: () => true,
          ref: {
            root: {
              child: childStub
            },
            parent: {
              parent: {
                child: childStub
              }
            }
          }
        })

        const wrapped = test.wrap(fornbyFunctions.addPreview)
        const result = await wrapped(changeData, {
          params: {
            imageIndex: 'imageIndex'
          }
        })
        // addPreview should resolve to true
        assert.equal(result, true)
      })

      it('when an image is updated', async () => {
        const newImgId = '9999_new_image_id_9999'
        const preview = {
          dataURI: 'aDataURI',
          color: '#FF0000'
        }
        const snapshot = {
          val: () => preview
        }
        childStub.withArgs(`/previews/${newImgId}`).returns({ once: onceStub })
        onceStub.withArgs('value').resolves(snapshot)
        const childStub2 = sinon.stub()
        const setStub2 = sinon.stub()
        childStub2.withArgs('previews').returns({ set: setStub2 })
        setStub2.withArgs({ imageIndex: preview }).returns(true)
        const changeData = test.makeChange(
          {
            val: () => '1234_old_image_id_5678',
            exists: () => true
          },
          {
            val: () => newImgId,
            exists: () => true,
            ref: {
              root: {
                child: childStub
              },
              parent: {
                parent: {
                  child: childStub2
                }
              }
            }
          }
        )
        const wrapped = test.wrap(fornbyFunctions.addPreview)
        const result = await wrapped(changeData, {
          params: {
            imageIndex: 'imageIndex'
          }
        })
        // Result should be true.
        assert.equal(result, true)
      })
    })
  })

  describe('imageChangeDetected', () => {
    /**
     * Whenever a change is detected in the image storage,
     * a preview dataURI and a background color needs to be
     * created and added to database/previews
     */
    it('should only process images', () => {
      const wrapped = test.wrap(fornbyFunctions.imageChangeDetected)
      const imageObject = test.storage.makeObjectMetadata({
        contentType: 'application/octet-stream'
      })
      const result = wrapped(imageObject)
      assert.isNull(result)
    })

    it('should only process high res images', async () => {
      const wrapped = test.wrap(fornbyFunctions.imageChangeDetected)
      const imageObject = test.storage.makeObjectMetadata({
        contentType: 'image/jpg',
        name: '/path/to/this/sized/lores/fileName.jpg'
      })
      const result = await wrapped(imageObject)
      assert.isNull(result)
    })

    // it('should create a preview object and save to database', async () => {
    //   const wrapped = test.wrap(fornbyFunctions.imageChangeDetected)
    //   console.log(test.storage.exampleObjectMetadata())
    //   const imageObject = test.storage.makeObjectMetadata({
    //     bucket: 'bucket',
    //     contentType: 'image/jpg',
    //     name: '/path/to/this/hires/12345678_fileName.jpg'
    //   })
    //   const result = await wrapped(imageObject)
    //   assert.isNull(result)
    // })
  })
})

describe('Helper functions', () => {
  describe('getFileId', () => {
    it('should return a file id when given a flamelink file name', () => {
      const fileName = '123424232_something.jpg'
      const result = helpers.getFileId(fileName)
      assert.strictEqual(result, '123424232')
    })
    it('should return zero when given an invalid file name', () => {
      const fileName = 'invalid_123424232_something.jpg'
      const result = helpers.getFileId(fileName)
      assert.strictEqual(result, 0)
    })
  })
  describe('generateThumbnail', () => {
    it('should create a 20px thumbnail', async () => {
      const targetPath = path.resolve(__dirname, './fileToThumbnail.jpg')
      // Remove (possibly) existing file
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath)
      }
      // Make sure no file exists
      assert(!fs.existsSync(targetPath))
      // Duplicate source file
      fs.copyFileSync(
        path.resolve(__dirname, './testOriginalImg.jpg'),
        targetPath
      )
      const result = await helpers.generateThumbnail(targetPath)
      // Check that a file was created
      assert(fs.existsSync(targetPath))
    })
  })
  describe('createDataURI', () => {
    it('should return a dataURI', async () => {
      const targetPath = path.resolve(__dirname, './fileToThumbnail.jpg')
      const result = await helpers.createDataURI(targetPath)
      assert.equal(
        result.startsWith('data:image/jpg;base64,/9j/4AAQSkZJRg'),
        true
      )
    })
  })
  describe('findAverageColor', () => {
    it('should return a result.stdout, containing color info', async () => {
      const targetPath = path.resolve(__dirname, './fileToThumbnail.jpg')
      const result = await helpers.findAverageColor(targetPath)
      assert.equal(
        result.stdout,
        '# ImageMagick pixel enumeration: 1,1,65535,srgb\n0,0: (39650,40627.6,33201.9)  #9A9E81  srgb(154,158,129)\n'
      )
    })
  })
  describe('findHexColorCode', () => {
    it('should return a hex color code', async () => {
      const result = await helpers.findHexColorCode(
        '# ImageMagick pixel enumeration: 1,1,65535,srgb\n0,0: (39650,40627.6,33201.9)  #9A9E81  srgb(154,158,129)\n'
      )
      assert.equal(result, '#9A9E81')
    })
  })
})
