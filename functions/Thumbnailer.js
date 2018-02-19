// const Canvas = require('canvas')
const fs = require('fs')
const im = require('imagemagick')

im.convert(['test.jpg', '-resize', '30x20', 'inline:-'], function(err, stdout){
  if (err) throw err;
  console.log(stdout);
  fs.writeFile('index.html', preview('output.jpg'), function(err) {
    if (err) throw err;
    console.log('success')
  })
})
let fileName = '56756_666666_yhh.lorejsd.jpg'
let match = /^([0-9]*)_/.exec(fileName)
let fileId = match !== null ? match[1] : 0
console.log(fileId)

const preview = dataUrl => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <img src="${dataUrl}" />
</body>
</html>`
}
