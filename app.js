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
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {ensureAuthenticated} = require('./config/auth');

require('./config/passport')(passport);

// models
const User = require('./models/user');

const Novel = require('./models/novel');

// image store
const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback) {
      callback(null, './public/img');
    },
  
    //add back the extension
    filename: function (request, file, callback) {
      callback(null, Date.now() + file.originalname);
    },
  });
  
  //upload parameters for multer
  const upload = multer({
    storage: storage,
    limits: {
      fieldSize: 1024 * 1024 * 3,
    },
  });

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

//express-session

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
  });



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

//register
app.post('/register', (req, res) => {
    const {username, password, password2} = req.body;
    
    let errors = [];

    if (!username || !password || !password2) {
        errors.push({msg: 'Please fill in all fields!'})
    }
    if (password !== password2){
        errors.push({msg: 'Passwords do not match!'})
    }

    if (password.length < 6) {
        errors.push({msg: 'Password  must be at least 6 characters!'})
    }

    if (errors.length > 0) {
        res.render('registerPage',{
            style:"css/styles.css",
            errors,
            username,
            password,
            password2
        });
    } else {
        User.findOne({ username: username}).then( user =>{
                if (user) {
                    errors.push({msg: 'user is already registered!'});
                    res.render('registerPage',{
                        style:"css/styles.css",
                        errors,
                        username,
                        password,
                        password2
                    });

                } else {
                    const newUser = new User({
                        username, password
                    });

                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if (err) throw err;
                        // hasing the password
                        newUser.password = hash;
                        //save user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'you are now registered and can login');
                            res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                    }))
                }
            })
    }     
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });

  app.get('/logout', (req, res) =>{
      req.logout();
      res.redirect('/');
  })

app.get('/browse', (req, res) => {
    
    res.render('genrePage',{
        style:"css/styles.css"
    });
    
})

app.get('/search', (req, res) => {
    
    res.render('searchPage',{
        style:"css/styles.css"
    });
    
})


app.get('/create',  ensureAuthenticated, (req, res) => {

    
    res.render('createNovel',{
        style:"css/styles.css",
    });
    
})

app.post('/create', upload.single('image'), ensureAuthenticated, (req, res) => {
    console.log(req.file)
    const author = req.user.username;

    //const cover_pic = req.file.filename;

    const {title, genre, content} = req.body;

    const uploadNovel = new Novel({title, author, cover_pic:'placeholder.jpg', content, genre})

    console.log(genre);

    console.log(uploadNovel);
    
    
    
})

app.get('/test', (req, res) => {
    
    res.render('test',{
        style:"css/styles.css",
    });
    
})


app.get('/profile', ensureAuthenticated, (req, res) => {
    
    res.render('profilePage',{
        style:"css/styles.css",  user: req.user,
    });
    
})

app.use((req, res) => {
    res.status(404).render('errorPage',{
        style:"css/styles.css"

    });
});
