const jwt=require('jsonwebtoken')
const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')

const  userMod=require('../models/userMod')
const tokenMod=require('../models/token')
const bcrypt=require('bcryptjs')


const {auth, auth2forRT}=require('../middleware/auth')
const Errorhandler=require('../utils/errorhandler')
const catchAsyncError=require('../middleware/catchasyncerror')


router.post('/cu', catchAsyncError( async (req,res,next)=>{

const {name,email,password}=req.body
// if(!name||!email||!password){
//     return next(new Errorhandler("Enter ", 404))
// }
const hashp=await bcrypt.hash(password,8)
const user=new userMod({
    name,
    email,
    password: hashp
})
const y=await user.save()
res.status(201).json({
   success:true,
    y
})
 
}

)
)

router.post('/Login', catchAsyncError(async (req,res,next)=>{

const {email,password}=req.body
const user=await userMod.findOne({ email })
if(!user){
    return next(new Errorhanndler("No scuh user found, please enter correct credentials",404))
}

const isMatch= await bcrypt.compare(password, user.password)
if(!isMatch){
   return next(new Errorhandler("wrong detailsm enter again", 404))
}
const AT=await jwt.sign ({id: user._id}, 'atprivatekey', {expiresIn: '30s'})
const RT=await jwt.sign({id: user._id}, 'Rtprivateket', {expiresIn: '15d'})
const expiresAt=new Date()
expiresAt.setDate(expiresAt.getDate()+15)
const Rtoken= new tokenMod({
    token:RT,
    user: user._id,
    name: user.name,
    createdAt: new Date(),
    expiresAt
})
await Rtoken.save()




res.cookie('accessT', AT, {httpOnly:true, Secure:true, expires:new Date(Date.now()+ 24*60*60*1000)})
res.cookie('refreshT', RT, {httpOnly: true, Secure:true,expires:new Date(Date.now()+ 15*24*60*60*1000) })
res.status(201).json({
    success:true
})


}))

router.get('/getMyself',auth,  async (req,res,next)=>{
    
const user=await userMod.findById(req.user._id)
if(!user){
    return next(new Errorhandler("You are missing", 404))
}

res.status(201).json({
    success:true,
    user
})
})

router.get('/getNewPair', auth2forRT, catchAsyncError( async (req,res,next)=>{

if(!req.token){
    return next(new Errorhandler("Somewhere went wrong",404))
}
const decodeRT= await jwt.verify(req.token, 'Rtprivateket')
if(!decodeRT){
    return next(new Errorhandler("you cant go further", 404))
}
const token=await tokenMod.findOne({
    token: req.token,
    user: decodeRT.id,
    expiresAt: {$gte: new Date()}
})
if(!token){
    return next(new Errorhandler('You are not authenticated', 404))
}
const uname=await userMod.findById(decodeRT.id)
const accessT=await jwt.sign({id: decodeRT.id},'atprivatekey',{expiresIn:'30s'}  )
const refresht=await jwt.sign({id: decodeRT.id }, 'Rtprivateket',{expiresIn: '15d'})
const expiresAt=new Date()
expiresAt.setDate(expiresAt.getDate()+15)
const newrefresht= new tokenMod({
    token: refresht,
    user: decodeRT.id,
    name:uname.name,
    createdAt: new Date(),
    expiresAt
})
await newrefresht.save()

res.cookie('accessT', accessT, {httpOnly: true, Secure:true, expires:new Date(Date.now()+ 24*60*60*1000)})
res.cookie('refreshT', refresht, {httpOnly: true, Secure:true, expires:new Date(Date.now()+ 15*24*60*60*1000)})
res.status(201).json({
    success:true,
    accessT,
    refresht, 
    newrefresht

})
}))

router.get('/Logout', auth2forRT, catchAsyncError( async (req,res,next)=>{
if(!req.cookies.accessT && !req.cookies.refreshT){
    return next(new Errorhandler(" already logged out", 404))
}
const token =await tokenMod.deleteOne({token: req.token})

res.clearCookie('accessT')
res.clearCookie('refreshT')
res.status(201).json({
    success:true,
    "Logged out": "yes",
    token
})
}))

router.get('/LogoutFromAllDevices',auth2forRT, catchAsyncError( async (req,res,next)=>{
const tokens=await tokenMod.deleteMany({ user: req.user._id})
res.clearCookie('accessT')
res.clearCookie('refreshT')
res.status(200).json({
    success:true,
    "Logged out": "from all devices",
    tokens
})


}))





router.delete('/deleteManyUsers', async (req,res)=>{
const users=await userMod.deleteMany({ email: 'venky.bablu9@gmail.com'})

res.status(201).json({
    success:true,
    users
})




})
module.exports=router