const express = require('express');

// express app
const app = express();
//const db = mongoose.connect('mongodb://Admin:NRcmnt28@ds125068.mlab.com:25068/api-test2');

const PORT = process.env.PORT || 9005;

app.set('view engine', 'ejs');


app.listen(PORT, () =>{
    console.log('listening at port ' + PORT);
})

app.use(express.static(__dirname + '/public'));


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