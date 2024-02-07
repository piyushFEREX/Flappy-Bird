var express = require('express');
const passport = require('passport');
var router = express.Router();
var User = require('./users');
const mongoose = require('mongoose');
var multer = require('multer')
var fs = require('fs')
var crypto = require('crypto')
//requireing nodemailer function
var mailer = require('../nodemailer');
//multer disk storage 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/users')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+file.originalname
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage ,fileFilter })
//filefilter code goes in here
function fileFilter (req, file, cb) {
  if(file.mimetype==='image/jpeg' ||file.mimetype==='image/jpg'||
  file.mimetype==='image/png'||file.mimetype==='image/svg'){
    cb(null, true)
  }
  else{
    cb(new Error('sahi file insert kro'), false)
  }

}
//for register route
router.post('/signup',(req,res,next)=>{
  var newUser = new User({
    email: req.body.email,
    username: req.body.username,
    age: req.body.age,
    phone: req.body.phone,
    gender:req.body.gender
  })
  console.log(newUser)
  User.register(newUser,req.body.password)
  .then(function(u){
    passport.authenticate('local')(req,res,function(){
    res.redirect('/profile')
     })
  })
  .catch(function(e){
    res.send(e)
  })
})
//for login route
router.post('/login',passport.authenticate('local',
{
  successRedirect:'/profile',
  failureRedirect:'/'
}),function(req,res,next){});
// is logged in middileware
function isLoggedIn(req,res,next){
  if(req.isAuthenticated){
    return next();
  }
  else{
    res.redirect('/')
  }
}
//logout
router.get('/logout',function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})
/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index');
});
router.get('/game',isLoggedIn,(req,res,next)=>{
  User.findOne({username:req.session.passport.user})
  .then((use)=>{
    if(use){
      res.render('game',{use})
    }
  }).catch((e)=>{
    res.send(e)
  })
 
})
router.get('/profile',isLoggedIn,(req,res,next)=>{
  User.findOne({username: req.session.passport.user })
  .then((foundUser)=>{
    User.find().then((allUser)=>{
      //for sorting all users 
      allUser.sort((a, b) => b.highScore - a.highScore);
      console.log(allUser)
      //for checking the ranking according to the sorted array index
      const ranking = allUser.findIndex(user => user.username == foundUser.username)+1;
      console.log(ranking)
      res.render('profile',{foundUser,ranking,admin:true})

    })
  })
  .catch((err)=>{
    res.send(err)
  })
})
//for username validation thorugh AJAX & JSON 
router.get('/username/:name',(req,res,next)=>{
  User.findOne ({username : req.params.name})
  .then((foundIT)=>{
   if(foundIT){
    res.json(true)
   }
   else{res.json(false)}
  })
  .catch((err)=>{
    console.log(err)
  })
})
// Route parameter name should match
router.get('/info/:user', isLoggedIn,(req, res, next) => {
  User.findOne({ username: req.params.user })
    .then((find) => {
      if (find) {
        res.json(find);
      }
    })
    .catch((e) => {
      res.send(e);
    });
});

router.post('/edit',isLoggedIn,upload.single('profilePic'),(req,res,next)=>{
  // console.log(req.file)
  User.findOne({username:req.session.passport.user})
  .then((use)=>{
    // console.log(req.body)
    // console.log('this is '+ req.file.filename)
    var old = use.profilePic
    if(req.file){
      use.profilePic = req.file.filename;
    }
    use.age = req.body.age;
    use.phone = req.body.phone;
    use.bio = req.body.bio;
    use.insta = req.body.insta;
    use.facebook = req.body.facebook;
    use.twitter  = req.body.twitter;
    use.gender = req.body.gender;
    use.save().then(()=>{
      if(req.file){
        if(old !== 'null'){
          fs.unlink(`./public/images/uploads/users/${old}`,(err)=>{
            if(err){
              console.log('this is error' + err)
            }
            else{
              console.log('back from else')
              res.redirect('back')
            }
          })}
          else{
            console.log('koi image nhi thi is liye else wala back')
            res.redirect('back')
          }
        }
      else{res.redirect('back');console.log('back from 2nd else')}
    })
  })
})
router.get('/scoreCheck',isLoggedIn,(req,res,next)=>{
  User.findOne({username:req.session.passport.user})
  .then((foundUse)=>{
    if(foundUse){
      res.json(foundUse)
    }
  })
})
router.get('/scoreSet/:score',isLoggedIn,(req,res,next)=>{
  User.findOne({username:req.session.passport.user})
  .then((foundUse)=>{
    foundUse.highScore = req.params.score;
    foundUse.save().then(()=>{res.send('sucess')})
  })
})


//leader board route
router.get('/leaderBoard',isLoggedIn,(req,res,next)=>{
  User.find()
  .then((foundUser)=>{
    res.render('leader',{foundUser})
  })
 
})
//visiting a user profile
router.get('/userProfile/:u',isLoggedIn,(req,res)=>{
  var admin;
  User.findOne({username:req.params.u})
  .then((foundUser)=>{
    User.find().then((allUser)=>{
      //for sorting all users 
      allUser.sort((a, b) => b.highScore - a.highScore);
      // console.log(allUser)
      //for checking the ranking according to the sorted array index
      const ranking = allUser.findIndex(user => user.username == foundUser.username)+1;
      console.log(ranking)
      if(foundUser.username == req.session.passport.user){admin = true}
      res.render('profile',{foundUser,ranking,admin})

    })
  })
})
//forgot possword page route
router.get("/forgot",(req,res)=>{
  res.render('forgot')
})
//code for rpassword recovery email
router.post("/forgot",async function(req,res){
  // console.log(req.body.email)
  var use = await User.findOne({email : req.body.email})
  .then((use)=>{
    console.log(use)
    if(!use){
      res.send(`A recovery Link will bw sent to ${req.body.email} if user Exists!`)
    }
    else{
      crypto.randomBytes(80, async function(err,buff){
        let key = buff.toString('hex');
        use.key = key;
        await use.save()
        console.log(key)
        res.send('<h1>We have sent a recovery link , If the User Exist ,so plese Check</h1>')
        mailer(req.body.email,use.username,key)
      })
    }
  }).catch((err)=>{
    console.log(err)
  })
 
})

router.get('/recover/:username/:key',async (req,res)=>{
  console.log(req.params.username  ,  req.params.key)
 var use = await User.findOne({username:req.params.username})
 if(!use){
  res.send('NOTYYY ho RHA BHEN ke LODE!!!')
 }
 else{
  res.render('recover', {use})
 }
})

router.post('/restore', async (req,res)=>{
  console.log(req.body.name , req.body.password , req.body.key);
  var user = await User.findOne({username : req.body.name})
  if(!user){
    res.send('Hacking Kar rha hai kya bhen ke LAWDE')
  }
  else{
    if(user.key == req.body.key){
      console.log('sahi hai bahi')
      user.setPassword(req.body.password, async ()=>{
        user.key = '';
        await user.save();
        req.logIn(user,()=>{
          res.redirect('/profile')
        })
      })
    }
    else{
      res.send('hacking kar rha hai kya lawde')
    }
  }
})
module.exports = router;
