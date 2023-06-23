const express = require('express');
const brcypt = require('bcryptjs');
const session = require('express-session');
const alert = require('alert'); 
const mongoSession = require('connect-mongodb-session')(session);
const app = express();
require('./config/database');
const userModel = require('./models/user.model');
const mongoUrl = 'mongodb://127.0.0.1:27017/SessionAuthApp';

app.use(express.static("public"));
//set view engine
app.set("view engine", "pug");
app.set('views', './views/');
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//store session in mongoDB
const store = new mongoSession({
    uri: mongoUrl,
    collection: "UserSessions"
});

//create session
app.use(session({
    secret: 'key that willsign cookie',
    resave: false,
    saveUninitialized: false,
    store: store,
}));

//is auth middleware
const isAuth= (req, res, next)=>{
    if(req.session.isAuth){
        next();
    }else{
        res.render('login');
    }
}

//careate get home route
app.get('/',(req, res)=>{
    res.render("home");
});

app.get('/home',(req, res)=>{
    res.render("home");
});

//
app.get('/login',isAuth, (req, res)=>{
    alert("User already registerd");
    res.redirect('/profile');
});

app.post('/login',async (req, res)=>{
    const {email, password} = req.body;

    const user =await userModel.findOne({email});
    if(!user){
        alert("Email not register, Please register first");
        return res.redirect('/register');
    }
    const isMatch = await brcypt.compare(password, user.password);
    if(!isMatch){
        alert("Wrong passord!");
        return res.redirect("/login");
    }

    req.session.isAuth = true;
    res.redirect('/profile');
});

app.get('/register',(req, res)=>{
    res.render('register');
});

//user registration

app.post('/register', async (req, res)=>{
    const {userName, phone, email, password} = req.body;
    let user = await userModel.findOne({email});
    if(user){
        alert("Email already exists, Please try to use another email");
        return res.redirect('register');
    }

    const hashedPsw = await brcypt.hash(password, 12);

    user = new userModel({
        userName,
        phone,
        email,
        password: hashedPsw,
    });
    await user.save();
    res.redirect('/login');
});

app.get('/profile', isAuth, (req, res)=>{
    userModel.find({})
    .then((results)=>{
        res.render('profile', {results: results});
        console.log(results)
    })
    .catch((err)=>{
        console.log(err);
    })
});

//contact
app.get('/contact',(req, res)=>{
    res.render('contact');
});

app.get('/logout',(req, res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/');
    });
});

module.exports = app;
//app.listen(4000, console.log(`Server Running on http://localhost:4000`));