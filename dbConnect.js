const mongoose=require('mongoose')
async function connectDB(){
try{
const connect= await mongoose.connect(process.env.mongo_uri, {
    useNewUrlParser:true
})
console.log('db is up')
} catch(err){

    console.log(err.message)
}
}
module.exports=connectDB