const mongoose=require('mongoose')

const userSchema= mongoose.Schema({
name: {
    type: String,
    required: [true,"Please enter name"],
    unique:true
},
email:{
    type: String,
    required: [true,"Please enter email"],
    unique: [true,"Already existing"]
},
password:{
    type: String,
    required:[true, "Please enter password"]
}


})
const userMod=mongoose.model("userMod", userSchema)
module.exports=userMod