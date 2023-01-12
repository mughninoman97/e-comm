import mongoose from "mongoose"
import AuthRoles from "../util/authRoles"
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import crypto from 'crypto'

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
        if(this.modified("password")){
            this.password = encryptedPassword;
        }

        if(!this.modified("password")) return next();
        this.password = await bcrypt.hash(this.password,10)
        next()
    })

export default mongoose.model("User", userSchema)