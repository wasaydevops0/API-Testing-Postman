import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import {User} from "../models/user.model.js"

import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //getting details from user
    const { fullname, email, username, password } = req.body;
    
    // Safely check if any field is missing or just whitespace
    if (!fullname?.trim() || !email?.trim() || !username?.trim() || !password?.trim()) {
        throw new ApiError(400, "All fields (fullname, email, username, password) are required");
    } 
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
        
    })
    if (existedUser) {
        throw new ApiError(409,"User already exists")
    }
    console.log(req)
    console.log("Body received:", req.body);
    
    const user = await User.create({
        fullname,
        email,
        username : username.toLowerCase(),
        password,
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken",
    )
    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while creating the user")
    }
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )
    //validation
    //check if already exist
    //create user object - create entry in db
    // remove password and refresh token fireld from response
    // check for user creation
    // if yes return res
    // else return error

    console.log("Email: ",email);
    
})

const loginUser = asyncHandler(async (req, res) => {
    // getting data from user
    const { username, password , email} = req.body;
    //validating

    if (!username && !email) {
        throw new ApiError(400,"Username or email is required");
    }
    if (!password) {
        throw new ApiError(400,"Password is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404,"User does not Exists")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401,"Password is incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.
        status(200).
        cookie("accessToken", accessToken, options).
        cookie("refreshToken", refreshToken, options).
        json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User Logged in successfully"
            )
        )
    // find the user
    //check password
    // generate access and refresh tokens
    //send to user

})

const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
               refreshToken:undefined,
           }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res.
        status(200).
        clearCookie("accessToken", options).
        clearCookie("refreshToken", options).
        json(
            new ApiResponse(
                200,
            {},
                "User logged out"
            
           )
        )

})

const refreshAccessToken= asyncHandler(async (req,res) => {
    
   try {
     const incomingRefreshToken =
         req.cookies.refreshToken
         || req.body.refreshToken;
     
     if (!incomingRefreshToken) {
         throw new ApiError(401, "Unauthorized request");
     }
 
     const decodedRefreshToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
     const user = await User.findById(decodedRefreshToken?._id)
     if (!user) {
         throw new ApiError(401, "Invalid refresh token")
     }
     if (incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401, "Refresh token is expired");
     };
 
     const options = {
         httpOnly: true,
         secure: true
     }
     const { accessToken, newRefreshToken } =
         await generateAccessAndRefreshToken(user._id);
     
     
     return res
         .status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", newRefreshToken, option)
         .json(
             new ApiResponse(
                 200,
                 {
                     accessToken,
                     refreshToken: newRefreshToken,
                     
                 },
                 "Access token refreshed"
         )
     )
   } catch (error) {
    throw new ApiError(401, error?.message || "Something went wrong");
    
   }

})

const changeUserPassword = asyncHandler(async (req,res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.
        isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400,"Password is incorrect")
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    
    return res.
        status(200).
        json(
            new ApiResponse(
                200,
                {},
                "Password changed successfully"
        )
    )
    

})

const getCurrentUser = asyncHandler(async (req,res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
    )
})

const changeUserDetails = asyncHandler(async (req,res) => {
    const { fullname, email } = req.body;
    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email: email
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User details updated successfully"
            )
    )
})

const replaceUserDetails = asyncHandler(async (req,res) => {
    const { fullname, email, username } = req.body;
    
    if (!fullname || !email || !username) {
        throw new ApiError(400, "All fields (fullname, email, username) are required to replace account details");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email,
                username: username.toLowerCase()
            }
        },
        { new: true, runValidators: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User details replaced successfully"
            )
        )
})

const deleteUserAccount = asyncHandler(async (req, res) => {
    await User.findByIdAndDelete(req.user._id);

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User account deleted successfully"
            )
        )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    changeUserDetails,
    replaceUserDetails,
    deleteUserAccount
}