const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      mongoose = require('mongoose'),
      Campground = require('./models/campground'),
      seedDB = require('./seeds'),
      Comment = require('./models/comment');

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

app.get('/campgrounds/:id/comments/new', function(req, res){
    Campground.findById(req.params.id, (err, campground)=>{
        if(err) return console.log(err);
            res.render('comments/new', {campground:campground});
    });
});

app.post('/campgrounds/:id/comments', function(req, res){
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

app.listen(3000, ()=>{
    console.log('server started on port 3000');
});