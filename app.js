if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}
const express = require('express');
//const crypto = require("crypto");
//https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
//const GridFsStorage = require("multer-gridfs-storage");
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


// express app
const app = express();

const PORT = process.env.PORT || 9005;
/*
const db = 'mongodb+srv://Admin:NRcmnt28@lnreader.7e0pp.mongodb.net/ln_reader?retryWrites=true&w=majority';
const conn = mongoose.createConnection(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let gfs;
conn.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "uploads"
    });
  });
  //https://dev.to/shubhambattoo/uploading-files-to-mongodb-with-gridfs-and-multer-using-nodejs-5aed
*/

//db 
mongoose.connect(process.env.DATABASE_URL,
    {useNewUrlParser: true,useUnifiedTopology: true
});

const db = mongoose.connection
db.on('error',error => console.error(error))
db.on('open',() => console.log('connected to db!'))


//middleware
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(PORT, () =>{
    console.log('listening at port ' + PORT);
})



app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('loginPage');
})

app.get('/register', (req, res) => {
    res.render('registerPage');
})

app.use((req, res) => {
    res.status(404).render('errorPage');
});