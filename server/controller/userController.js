import User from "../models/user.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/car.js"


const generateToken = (userId) =>{
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

export const registerUser = async(req,res) =>{
    
    try{
        const {name, email, password} = req.body;
        if(!name || !password ){
            return res.json({
                success: false,
                message: 'fill all the fields'
            })
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({
                success: false,
                message: 'User already exists'
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email , password: hashPassword })

        const token = generateToken(user._id.toString())
        res.json({success:true, token})

    } catch(error){
       console.log(error);
       res.json({ success: false, message: error.message})
    }
}

export const loginUser = async(req, res) =>{
    try{
        const { email, password} = req.body;

        const user = await User.findOne({email})

        if(!user){
            return res.json({
                success:false,
                message: "User not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({ success: false, message:'Wrong password'})
        }

        const token = generateToken(user._id.toString())
        res.json({success:true, token})

    } catch(error){
       console.log("error.message");
       res.json({ success: false, message: error.message})
    }
}

export const getUserData = async(req,res) =>{
    try{
        const {user} = req;
        res.json({success:true, user})
    } catch(error){
        console.log(error.message);
        res.json({success: false, message:error.message});
    }
}

export const getCars = async(req ,res) =>{
    try{
      const cars = await Car.find({isAvailable : true})
      console.log(cars);
      res.json({ success: true, cars})
    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}