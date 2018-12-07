const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
    { 
        name:'Himalaya', 
        image:'https://i.ytimg.com/vi/-hTVNidxg2s/maxresdefault.jpg', 
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id pharetra nisl, id iaculis est. Donec sollicitudin, nunc in pulvinar fringilla, sapien mauris vehicula tellus, posuere auctor magna nisi eu magna. Quisque dignissim auctor enim ut tincidunt. Suspendisse nec gravida nisi. Nulla interdum est velit, et mattis tellus lobortis eu.' 
    },
    { 
        name:'Katmandu', 
        image:'https://cdn.getyourguide.com/img/tour_img-97716-148.jpg', 
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id pharetra nisl, id iaculis est. Donec sollicitudin, nunc in pulvinar fringilla, sapien mauris vehicula tellus, posuere auctor magna nisi eu magna. Quisque dignissim auctor enim ut tincidunt. Suspendisse nec gravida nisi. Nulla interdum est velit, et mattis tellus lobortis eu.' 
    },
    { 
        name:'Pokhran', 
        image:'https://www.livemint.com/rf/Image-621x414/LiveMint/Period2/2018/05/12/Photos/Processed/pokhran-knT--621x414@LiveMint.jpg', 
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id pharetra nisl, id iaculis est. Donec sollicitudin, nunc in pulvinar fringilla, sapien mauris vehicula tellus, posuere auctor magna nisi eu magna. Quisque dignissim auctor enim ut tincidunt. Suspendisse nec gravida nisi. Nulla interdum est velit, et mattis tellus lobortis eu.' 
    },
    { 
        name:'Shimla', 
        image:'https://d1u4oo4rb13yy8.cloudfront.net/article/80013-jhamqgbpav-1516791727.jpg', 
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id pharetra nisl, id iaculis est. Donec sollicitudin, nunc in pulvinar fringilla, sapien mauris vehicula tellus, posuere auctor magna nisi eu magna. Quisque dignissim auctor enim ut tincidunt. Suspendisse nec gravida nisi. Nulla interdum est velit, et mattis tellus lobortis eu.' 
    }
]

function seedDB(){
    Campground.remove({}, (err)=>{
        if(err) return console.log(err);
            console.log('removed campgrounds');
            data.forEach(function(seed){
                Campground.create(seed, (err, campground)=>{
                    if(err) return console.log(err);
                        console.log('Added a campground');
                        Comment.create({
                            text:'Wawa re Tawa',
                            author:'Chapli'
                        }, function(err, comment){
                            if(err) console.log(err);
                                campground.comments.push(comment);
                                campground.save();
                                console.log('created new comment');
                        });
                });
            });         
    });
}

module.exports = seedDB;