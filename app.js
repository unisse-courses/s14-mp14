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
    {useNewUrlParser: true,useUnifiedTopology: true})
    .then(()=> console.log('connected to db!'))
    .then(app.listen(PORT, () =>{
        console.log('listening at port ' + PORT);
    }))
    .catch(err => console.error(error));

const db = mongoose.connection




//middleware
app.use(express.json());
app.set('view engine', 'ejs');
//static files
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false}));





app.get('/', (req, res) => {
    res.render('index',{
        style:"css/styles.css"
    });
});

app.get('/login', (req, res) => {
    res.render('loginPage',{
        style:"css/styles.css"
    });
})

app.get('/register', (req, res) => {
    res.render('registerPage',{
        style:"css/styles.css"
    });
})

app.post('/register', (req, res) => {
    const {name, password, password2} = req.body;
    console.log(req.body);
    res.send('hello')
    
})

app.get('/browse', (req, res) => {
    
    res.render('genrePage',{
        style:"css/genreStyles.css"
    });
    
})

app.use((req, res) => {
    res.status(404).render('errorPage',{
        style:"css/genreStyles.css"

    });
});
