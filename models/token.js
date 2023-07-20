const mongoose=require('mongoose')
const tokenSchema=mongoose.Schema({

    token:{
        type: String,
        required:[true,"Porvide token"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
         required:[true, "Reference needed"],
         ref: 'userMod'
    },
    name: {
        type: String,
        required: [true, "name ref. required "],
        ref: 'userMod'
    },
    createdAt:{
        type: Date
    },
    expiresAt: {
type: Date
    }
})
const tokenMod=mongoose.model("tokenMod", tokenSchema)
module.exports=tokenMod