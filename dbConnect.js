const mongoose=require('mongoose')
const mongo_uri= 'mongodb+srv://venkats9:weather9@cluster0.9ftgfg0.mongodb.net/why?retryWrites=true&w=majority'
async function connectDB(){
try{
const connect= await mongoose.connect(mongo_uri, {
    useNewUrlParser:true
})
console.log('db is up')
} catch(err){

    console.log(err.message)
}
}
module.exports=connectDB