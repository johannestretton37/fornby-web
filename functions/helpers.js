const spawn = require('child-process-promise').spawn
const imageDataURI = require('image-data-uri')

exports.getFileId = fileName => {
  const match = /^([0-9]*)_/.exec(fileName)
  const fileId = match !== null ? match[1] : 0
  return fileId
}

exports.generateThumbnail = tempFilePath => {
  // Generate a thumbnail using ImageMagick.
  console.log(
    'Generating a thumbnail using ImageMagick. tempFilePath:',
    tempFilePath
  )
  return spawn('convert', [tempFilePath, '-resize', '20x20>', tempFilePath])
}

exports.createDataURI = tempFilePath => {
  console.log('Create dataURI from', tempFilePath)
  return imageDataURI.encodeFromFile(tempFilePath)
}

exports.findAverageColor = tempFilePath => {
  return spawn('convert', [tempFilePath, '-resize', '1x1', 'txt:'], {
    capture: ['stdout']
  })
}

exports.findHexColorCode = string => {
  const regex = /#([A-F0-9]){6}/gi
  const matches = regex.exec(string)
  let colorCode
  if (matches != null) {
    colorCode = matches[0]
  }
  return colorCode
}
