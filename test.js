
var pdf = require('pdfkit')
var fs = require('fs')

var savePDF = function (img){
    var doc = new pdf;
    doc.pipe(fs.createWriteStream('node.pdf'))
    doc.font('Times-Roman').fontSize(14).text('NodeJS PDF DOCUMENT',100,100)
    doc.image(img,0,0)
    doc.end()

}

var canvas; 
var context;
var img;

var draw_canvas = function() {
      console.log('test'+__dirname)

      canvas = document.getElementById('myCanvas');
      context = canvas.getContext('2d');

      img = new Image();
      img.src = 'assets/img/115.png';
      context.drawImage(img,0,0);

      var newimgData = canvas.toDataURL("image/png", 1.0); // guardo imagem do canvas

      savePDF(newimgData);
}
