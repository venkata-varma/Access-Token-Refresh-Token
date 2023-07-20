const Errorhandler=require('../utils/errorhandler')
const catchAsyncError=require('../middleware/catchasyncerror')
const jwt=require('jsonwebtoken')
const userMod=require('../models/userMod')
const tokenMod=require('../models/token')

const auth=catchAsyncError( async (req,res,next)=>{
const {accessT}=req.cookies
if(!accessT){
    return next(new Errorhandler(" No token , please login",404))
}
const decoded= jwt.verify(accessT, 'atprivatekey')
if(!decoded){
return next(new Errorhandler(" You are nto authenticated, please login",404))
}
req.user=await userMod.findById(decoded.id)
next()

})

const auth2forRT= catchAsyncError( async (req,res,next)=>{

const {refreshT}=req.cookies
if(!refreshT){
return next(new Errorhandler(" No RT, Not authenticated", 404))

}
const decodeR=await jwt.verify(refreshT, 'Rtprivateket')
if(!decodeR){
    return next(new Errorhandler(" No RT, Not authenticated", 404))
}
req.token=refreshT
req.user=await userMod.findById(decodeR.id)
next()
})


module.exports={
auth,
 auth2forRT
}