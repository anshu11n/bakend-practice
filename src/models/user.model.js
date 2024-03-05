import mongoose, {Schema} from "mongoose";

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new Schema({

}, {timestamps: true})


// middleware
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.getAccessToken = function(){
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.getRefreshToken = function(){
    return jwt.sign(
        {
            _id: this.id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema)