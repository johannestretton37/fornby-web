// const Canvas = require('canvas')
const fs = require('fs')
const im = require('imagemagick')
const path = require('path')


// im.convert([path.join(__dirname, 'test.jpg'), '-resize', '20x20>', 'inline:-'], function(err, stdout){
//   if (err) throw err;
//   console.log(stdout);
//   fs.writeFile('index.html', preview('output.jpg'), function(err) {
//     if (err) throw err;
//     console.log('success')
//   })
// })
// let fileName = '56756_666666_yhh.lorejsd.jpg'
// let match = /^([0-9]*)_/.exec(fileName)
// let fileId = match !== null ? match[1] : 0
// console.log(fileId)

// const preview = dataUrl => {
//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <meta http-equiv="X-UA-Compatible" content="ie=edge">
//   <title>Document</title>
// </head>
// <body>
//   <img src="${dataUrl}" />
// </body>
// </html>`
// }

im.convert([path.join(__dirname, 'test.jpg'), '-resize', '1x1', 'txt:'], function(err, stdout) {
  if (err) throw err
  let regex = /#([A-F0-9]){6}/gi
  let matches = regex.exec(stdout)
  let color
  if (matches != null) {
    color = matches[0]
  }
  console.log('color:', color)
})
