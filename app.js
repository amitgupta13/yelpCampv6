const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      mongoose = require('mongoose'),
      passport = require('passport'),
      localStrategy = require('passport-local'),
      Campground = require('./models/campground'),
      seedDB = require('./seeds'),
      Comment = require('./models/comment'),
      User = require('./models/user');

mongoose.connect('mongodb://localhost/yelpCamp',{useNewUrlParser:true})
.then(()=>{
    console.log('Connected to mongoDB')
})
.catch(()=>{
    console.log('error connecting to DB');
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"))
seedDB();

//passport config
app.use(require('express-session')({
    secret:'Eat banana',
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    Campground.find({},function(err, campgrounds){
        if(err) return console.log(err);
        res.render('campgrounds/index', {campgrounds:campgrounds});
    });
});

app.post('/campgrounds', function(req, res){
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const newCampground = {
                name:name,
                image:image,
                description:description
            }

        Campground.create(newCampground,(err, campground)=>{
            if(err) return console.log(err);
                res.redirect('/campgrounds');
        });
});

app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

//Show - show more info about one campground
app.get('/campgrounds/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        if(err) return console.log(err);
            res.render('campgrounds/show', {campground:campground});
    });
});

//================
//Comments routes
//================

app.get('/campgrounds/:id/comments/new',isLoggedIn, function(req, res){
    Campground.findById(req.params.id, (err, campground)=>{
        if(err) return console.log(err);
            res.render('comments/new', {campground:campground});
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            return res.redirect('/campgrounds');
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err) console.log(err);
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
            });
        }  
                

    });
});

//===========
//Auth Route
//===========

app.get('/register', function(req, res){
    res.render('register');
});

//hander sign up logic
app.post('/register', function(req, res){
    const newUser = new User({username:req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        });
    });
});

//show login form
app.get('/login', function(req,res){
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}), function(req,res){
});

//logout
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen(3000, ()=>{
    console.log('server started on port 3000');
});