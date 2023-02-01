import User from '../models/user.Schema.js'
import asyncHandler from '../services/asyncHandler'
import CustomError from '../util/customError'


export const cookieOptions = {
    expires: new Date(Date.now()+3 *24 * 60 *60 *1000 ),
    httpOnly:true,
    // could be in separate file in utils
}


/*
@signup
@route http://localhost:4000/api/auth/signup
@description User signup controller for creating a new user
@parameters name,email,password
@return User Object
*/


export const signup = asyncHandler(async (req,res) => {
    const {name,email,password} = req.body

    if(! name || email || password){
        throw new CustomError('Please fill all fields',400)
    }
    //check if iser exists
    const ExistingUser = User.findOne({email})

    if(ExistingUser){
        throw new CustomError('user already exist',400)

    }
    const user = await User.create({
        name:name,
        email:email,
        password:password
    })

    const token = user.getJwtToken()
    user.password = undefined

    //res.cookie(string, name from line38, line6  )
    res.cookie("token", token, cookieOptions  )

    res.status(200).json({
        success:true,
        token,
        user
    })
})

/****************************************
 *  @LOGIN 
 *  @route http://localhsot:5000/api/auth/login
 *  @parameters email ,password
 *  @returns User Object
 ******************************************/

export const login = asyncHandler(async(req,res) => {
    const {email,password} = req.body

    if(!email || !password){
        throw new CustomError('Please fill all fields',400)
    }

    const user = User.findOne({email}).select("+password")

    if(!user){
        throw new CustomError('invalid credentials', 400)
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(isPasswordMatched){
        const token = user.getJwtToken()
        user.password = undefined
        res.cookie('token',token ,cookieOptions)
        return res.status(200).json({
            success:true,
            token,
            user
        })
    }
    throw new CustomError('Invalid credentials',400)
})


/****************************************
 *  @LOGOUT 
 *  @route http://localhsot:5000/api/auth/login
 *  @DESCRIPTION LOGOUT user by clearing cookies
 *  @returns success message
 ******************************************/
export const logout = asyncHandler(async(req,res) =>{
    // res.clearcookie
    res.cookie('token',null, {
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged out succesfully"
    })
} )

