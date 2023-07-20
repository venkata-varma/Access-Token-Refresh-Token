const express=require('express')
const app=express()

app.use(express.json())
const mongoose=require('mongoose')

const middle=require('./middleware/error')
const connectDB=require('./dbConnect.js')
const cookieparser=require('cookie-parser')
app.use(cookieparser())



connectDB()
const userMod=require('./models/userMod')
const userRoute=require('./routes/userRoute')
app.use(userRoute)
app.use(middle)



app.get('/', (req,res)=>{
    res.send('Hellowrshf world')
})

app.listen(4000, ()=>{
    console.log('server is up')
})