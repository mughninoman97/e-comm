import User from '../models/user.Schema.js'
import asyncHandler from '../services/asyncHandler'
import CustomError from '../util/customError'
import mailHelper from '../util/mailHelper'
import crypto from ' crypto'


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

    const user =await User.findOne({email}).select("+password")

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


/****************************************
 *  @FORGOT PASSWORD 
 *  @route http://localhsot:5000/api/auth/password/forgot
 *  @DESCRIPTION user will submit email and we will generate a token
 *  @returns success message-email sent
 *  @parameters email
 
 ******************************************/
export const forgotpassword = asyncHandler(async (req,res) => {
    const {email} = req.body
    const user = await User.findOne({email})

    //check if user exist
    if(!user){
        throw new CustomError('user not found',404)
    }
   const resetToken = user.generateForgotPasswordToken

   await user.save({validateBeforeSave: false})

   const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`
    
   const text = `your password reset url is \n\n ${resetUrl}`
  
   try{
        await mailHelper({
            email:user.email,
            subject:"password reset email for website",
            text:text,
        })
        res.status(200).json({
            success:true,
            message:`email send to ${user.email}`
        })
   }catch(error){
        //rollback - clear field and save
        user.forgotPasswordToken = undefined,
        user.forgotPasswordExpiry = undefined

        await user.save({validateBeforeSave:false})

        throw new CustomError(error.message || 'email send fail') 

   }
})

/****************************************
 *  @RESET PASSWORD 
 *  @route http://localhsot:5000/api/auth/password/reset/resetPasswordToken
 *  @DESCRIPTION user will submit email and we will generate a token
 *  @returns success message-email sent
 *  @parameters email
 
 ******************************************/
export const resetPassword =  asyncHandler(async(req,res) => {
    const {token:resetToken} = req.params
    const {password,confirmPassword} = req.body

    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    const user = await User.findOne({
        forgotPasswordToken:resetPasswordToken,
        forgotPasswordExpiry:{ $gt: Date.now()}
    })

    if(!user){
        throw new CustomError('password token is invalid or expired',400)
    }

    if(password !== confirmPassword ){
        throw new CustomError('password and conf password doesnt match',400)

    }
    user.password = password
    user.forgotPasswordToken  = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()

    //create a token anf send a response
    const token = user.getJwtToken()
    user.password=undefined
    res.cookie("token ", token, cookieOptions)
    res.status(200).json()

})

// TODO:  create a controller for change password


/****************************************
 *  @GET_PROFILE
 *  @REQUEST_TYPE get
 *  @route http://localhsot:5000/api/auth/PROFILE
 *  @DESCRIPTION CHECK FOR token and populate req.user
 *  @returns User Object
 *  @parameters email
 
 ******************************************/

export const getProfile = asyncHandler(async(req,_res,) => {
    const {user} = req
    if(!user){
        throw new CustomError('user not found', 404)

    }
    res.status(200).json({
        success:true,
        user
    })
})