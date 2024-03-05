import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser = asyncHandler( async (req,res) => {
    const {fullName, username, email, password} = req.body;
    console.log("email: ", email);

    if( [fullName, username, email, password].some( (field)=> field?.trim() === "" )){
        throw new Error
    }

    const existedUser = User.findOne({
        $or: [{email}, {username}]
    })

    const avatarLocalPath = req.files?.avatar[0].path
    const coverImageLocalPath = req.files?.coverImage[0].path

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new Error;
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new Error;
    }

    return res.status(201).json(
        {createdUser}
    )
    
} )

export { registerUser }