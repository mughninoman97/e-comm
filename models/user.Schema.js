import mongoose from "mongoose"
import AuthRoles from "../util/authRoles"
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import crypto from 'crypto'
import config from '../config/index'

const userSchema = mongoose.Schema(
    {
    
    name:{
        type:String,
        required:[true, "name is required"],
        maxLength: [50, 'name must be less than 50 char']
    },
    email: {
        type:String,
        required:[true, 'email is requred'],
        unique:true

    },
    password: {
        type:String,
        required:[true, 'email is requred'],
        minLength:[8, 'password must be atleat 8 chars length'],
        select:false,
    },
    
    role:{
        type: String,
        enum: Object.values(AuthRoles),
        default: AuthRoles.USER

    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,




},
    {
        timestamps: true

    }

);

// challege 1- encrypt the password
    userSchema.pre('save', async function(next){
        if(!this.modified("password")){
            this.password = encryptedPassword()
        }

        if(!this.modified("password")) return next();
        this.password = await bcrypt.hash(this.password,10)
        next()
    })
// functionality-comp pwd, jwt, 
userSchema.methods = {
    // feature1- compare password
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
    },
    // generate jwt token 
    getJwtToken: function(){
        return JWT.sign(
            {
                _id: this._id,
                role: this.role
            },
            config.JWT_SECRET,
            {
                expiresIn: config.JWT_EXPIRY

            }
            
        )
    }
}    
// getneate jwt token 


export default mongoose.model("User", userSchema)