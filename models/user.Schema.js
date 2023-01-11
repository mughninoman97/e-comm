import mongoose from "mongoose"
import AuthRoles from "../util/authRoles"

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

export default mongoose.model("User", userSchema)