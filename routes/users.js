var mongoose = require('mongoose')
var plm = require('passport-local-mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/gasaa')

var userSchema = mongoose.Schema({
  key:String,
  profilePic:{
    type:String,
    default:'null'
  },
  email:String,
  DP: {
    type:Object,
    default:{
      male:'maleDP.gif',
      female:'femaleDP.gif',
      other:'otherDP.jpg'
    }
  },
  username:String,
  password:String,
  age:String,
  phone:Number,
  highScore:{
    type:Number,
    default:0
  },
  bio:{
    type:String,
    default:'Hey, I am playing'
  },
  insta:String,
  facebook:String,
  twitter:String,
  gender:String,
})

userSchema.plugin(plm)
module.exports = mongoose.model('user',userSchema)