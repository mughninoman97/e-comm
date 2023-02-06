import User from "../models/user.Schema.js"
import JWT from 'jsonwebtoken'
import asyncHandler from '../services/asyncHandler'
import CustomError from '../util/customError'
import config from "../config/index.js"

export const isLoggedIn = asyncHandler(async(req,res) => {
    let token;

    if(req.cookies.token || 
      (req.headers.authorization && req.headers.authorization.startWith("Bearer"))  
        ){
            token = req.cookies.token || req.headers.authorization.
            split(" ")[1]
        }

        if(!token) {
            throw new CustomError("Not authorized to access this route", 401)
        }

        try {
            const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET)
            // _id,find user based on id , set this is req.user
            req.user = await User.findById(decodedJwtPayload._id, "name email role")
            next()
            // req.user = await User.f
        } catch (error) {
            throw new CustomError('not authorized to access this route',401)
            
        }
})