var express = require('express');
var router = express.Router();

var flash=require('connect-flash');
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;

var multer=require('multer');
var upload=multer({dest:'./uploads'});

var User=require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET register listing. */
router.get('/register', function(req, res, next) {
  res.render('register', { title :'Register'});
});

router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success','You are logged out');
  res.redirect('/users/login');
});


router.post('/register',upload.single('profileimage'), function(req, res, next) {
  var name=req.body.name;
  var email=req.body.email;
  var username=req.body.username;
  var password=req.body.password;
  var confirm=req.body.password2;

  if(req.file){
     console.log('File Uploaded...')
     var profilename=req.file.filename;
  }else{
  	console.log('No file Uploaded');
  	var profilename='noimage.jpg';
    }

    //Form Validator
    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Email field is Not Valid').isEmail();
    req.checkBody('username','Username field is required').notEmpty();
    req.checkBody('password','Password field is required').notEmpty();
    req.checkBody('password2','Password do not match').equals(req.body.password);
    
    var errors=req.validationErrors();

    if(errors){
    	res.render('register',{errors:errors});
    }else{
    	var newUser=new User({
    		name:name,
    		password:password,
    		email:email,
    		username:username,
    		profileimage:profilename
    	});

    	User.createUser(newUser,function(err,user){
    		if(err)throw err;
    		console.log(user);
    	});

    	req.flash('success','Now you register. You can do login');

    		res.location('/');
    		res.redirect('/');
    }
});


router.get('/login', function(req, res, next) {
  res.render('login', {title :'Login'});
});


router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash: true }),
  function(req, res) {
    req.flash('success','you are now logged In');
    res.redirect('/');
  });

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(function(username,password,done){
User.getUserByUsername(username,function(err,user){
if(err)throw err;
if(!user){
	return done(null,false,{message:'Unknown User'});
}
User.comparePassword(password,user.password,function(err,isMatch){
	if(err) return done(err);
	if(isMatch){
		return done(null,user);
	}else{
		return done(null,false,{message:'Invalid Password'});
	}
		});
	});
}));



module.exports = router;
