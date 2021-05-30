if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}
const express = require('express');

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

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

require('./config/passport')(passport);

// models
const User = require('./models/user');

const Novel = require('./models/novel');
const { error } = require('console');

// image store
const uploadPath = path.join('public', Novel.coverImageBasePath);

const upload = multer({
    dest: 'public/uploads',
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
        console.log(uploadPath);
    },
    filename: function (request, file, callback) {
        console.log(file);
          callback(null, Date.now() + path.extname(file.originalname));
        },
    
})



// express app
const app = express();

const PORT = process.env.PORT || 9005;


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
//app.use(express.json());
app.use(express.json({limit: '200mb'}));
app.set('view engine', 'ejs');
//static files
app.use(express.static(__dirname + '/public'));

//app.use(express.urlencoded({ extended: false}));

app.use(express.urlencoded({limit: '20mb', extended: true}));



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

app.get('/browse', async (req, res) => {

    
   
    try {
        const novels = await Novel.find({});
        res.render('genrePage',{
            style:"css/styles.css",
            novels: novels,
        },);
      } catch {
        res.redirect('/')
    }
    
    
    console.log(novels);
    
    
    
    
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

app.post('/create', upload.single("cover_image"), ensureAuthenticated, async (req, res) => {
    
    const fileName = req.file != null ? req.file.filename : null;
    console.log(fileName);
    
    const {genre} = req.body;

    let uploadNovel = new Novel({title: req.body.title, author: req.user.username,cover_pic: fileName, content: req.body.content, genre: genre})

    
    
    console.log(uploadNovel);
    
    try {
        uploadNovel = await uploadNovel.save();
    
        res.redirect('/');
      } catch (error) {
          if(uploadNovel.cover_pic != null) {
              removeCover(uploadNovel.cover_pic);
          }
        console.log(error);
      } 
    
})

function removeCover(fileName){
    fs.unlink(path.join(uploadPath), err => {
        console.log(err);
    });
}


app.get('/profile', ensureAuthenticated, (req, res) => {
    
    res.render('profilePage',{
        style:"css/styles.css",  user: req.user,
    });
    
})


app.get('/novel/:id', (req, res) => {

    const id = req.params.id;
    Novel.findById(id).then(result => {
        res.render('detailsNovel',{
            style:"css/styles.css",
            novel: result,
            

        });

    }).catch(err => {
        console.log(err);
    })
    
    
    
})


app.use((req, res) => {
    res.status(404).render('errorPage',{
        style:"css/styles.css"

    });
});
