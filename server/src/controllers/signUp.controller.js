import bcrypt from "bcrypt";
import DB from "../config/db.js";
//sign up controller
async function signUp(req,res){
    try{
        const {name,username,email,password,role,admin_secret_key}=req.body;
        //check inputs
        if(!name){
            return res.status(400).json({
                status:"failed",
                message:"name is required"
            })};
        if(!username){
            return res.status(400).json({
                status:"failed",
                message:"username is required"
            });};
        if(!email){
            return res.status(400).json({
                status:"failed",
                message:"email is required"
            })};
        if(!password){
            return res.status(400).json({
                status:"failed",
                message:"password is required"
            })};
        //check if user already exists
        const checkUserByEmail=DB.prepare("select * from users where email=?").get(email);
        if(checkUserByEmail){
            return res.status(400).json({
                status:"failed",
                message:"a user with this email already exists. please change and try again."
            })};
        const checkUserByUsername=DB.prepare("select * from users where username=?").get(username);
        if(checkUserByUsername){
            return res.status(400).json({
                status:"failed",
                message:"a user with this username already exists. please change and try again"
            })};
        //assigned role=> user
        let assignedRole="user";
        if(role==='admin'){
            const ADMIN_KEY=process.env.ADMIN_SECRET_KEY||"devArcAiAdmin2";
            if(admin_secret_key===ADMIN_KEY){
                assignedRole='admin';

            }else{
                return res.status(403).json({
                    status:"failure",
                    message:"Invalid admin key. you can't register as admin."
                })
            }
        }
            //hash password
            const salt=await bcrypt.genSalt(12);
            const hashedPass=await bcrypt.hash(password,salt);
        //create user insert statement
        const insertStmt=DB.prepare("insert into users(name,username,email,password,role) values(?,?,?,?,?)");
        //execute statement
        const result=insertStmt.run(name,username,email,hashedPass,assignedRole);
        //prepare statement to get user by id
        const getNewUserStmt=DB.prepare("select * from users where id=?");
        //get the newly created user using id
        const newUser=getNewUserStmt.get(result.lastInsertRowid);
        //delete password from the user object before responding
        delete newUser.password;
        //response
        res.status(201).json({
            status:"success",
            message:"user created successfully",
            user:newUser
        });
    }catch(e){
        console.error("something went wrong while signing up:",e);
        res.status(500).json({
            status:"failed",
            message:"something went wrong while signing up"
        })
    }
};
export default signUp;