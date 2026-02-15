import DB from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
//signin controller — accepts either email or username (plus password)
async function signin(req,res){
    try{
        const {email,username,password}=req.body;
        const identifier=email?.trim()||username?.trim();
        if(!password||!identifier){
            return res.status(400).json({
                status:"failed",
                message:"missing credentials! please provide email or username and password."
            });
        }
        const user=DB.prepare("select * from users where email=? or username=?").get(identifier,identifier);
        if(!user){
            return res.status(400).json({
                status:"failed",
                message:"no user found! please check credentials and try again."
            });
        }
        //compare provided password with the hashed password in the database
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                status:"failed",
                message:"invalid credentials! please check and try again."
            })
        };
        //delete password from user object before sending it to the client
        delete user.password;
        const token=jwt.sign({
            id:user.id,
            name:user.name,
            role:user.role,
        },process.env.JWT_SECRET,
        {expiresIn:"1h"}
    );
    res.cookie("token",token,{
        httpOnly:true,
        secure:false,//set to true in when reaching production
        maxAge:3600000 //an hour
    });
        res.status(200).json({
            status: "success",
            message: `signed in successfully. welcome ${user.name}.`,
            user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
        });

    }catch(err){
        console.error("something went wrong while sigining in: ",err);
        res.status(500).json({
            status:"failed",
            message:"something went wrong while sigining in. please try again later."
        });
    }
};
export default signin;