module.exports=(catchAsyncError)=>(req,res,next)=>{

    Promise.resolve(catchAsyncError(req,res,next)).catch(next)
}