
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

// DATABASE
var knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: "./db/database.sqlite"
  },
  useNullAsDefault: true,
  debug: true
});

var create_data = function(){
    console.log('using sqlite3')    
    knex.schema.createTableIfNotExists('campaing',function(table){
        table.increments('id');
        table.string('name');        
        table.timestamps();
    })
    .createTableIfNotExists('date_time', function(table){
      table.increments('id');
        table.date('start');
        table.date('end');
        table.timestamps();
    })
    .createTableIfNotExists('address',function(table){
        table.increments('id');
        table.string('name');
        table.integer('campaing_id').unsigned().references('campaing.id');
        table.timestamps();
    })
    .catch(function(e){
        console.error(e);
    })
//    .then(function(){
//        return knex.insert({user_name: 'TIM'}).into('users');
//    })
//    .then(function(rows){
//        return knex.table('accounts').insert({account_name: 'knex', user_id: rows[0]})
//    })
//    .then(function (){
//        return knex('users').join('accounts','users.id','accounts.user_id')
//        .select('users.user_name as user', 'accounts.account_name as account')
//    })
//    .map(function(row){
//        console.log(row);
//    })
//    .catch(function(e) {
//        console.error(e);    
//    })
}
