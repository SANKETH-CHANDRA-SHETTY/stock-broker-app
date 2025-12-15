const db=require("../db");
const bcrypt=require("bcrypt");
const logger=require("../logger")

const saltRounds = 12;

const validateLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Both email and password must be submitted" });
  }

  try {
    const [rows] = await db.query(
      "SELECT id, name, email, password_hash FROM Users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    logger.error("Error occurred while login validation", { err });
    res.status(500).json({ message: "Internal server error" });
  }
};

const addSignup = async (req,res)=>{
    const {name,email,password}=req.body;
    if(name===undefined || email===undefined || password===undefined){
        return res.status(400).json({message:"All name, email and password must be submitted"});
    }
    try{
        const [result]=await db.query("SELECT 1 from Users WHERE email=?",[email]);
        if(result.length !== 0){
            return res.status(400).json({message:"User already present by this email "});
        }
        const passwordHash=await bcrypt.hash(password,saltRounds);
        
        try{
            const [result]=await db.query("INSERT INTO Users(name,email,password_hash,created_at) VALUES (?,?,?,?)",[name,email,passwordHash,new Date()]);
            res.status(200).json({message:"Signup Successfull"});
        }
        catch(err){
            logger.error("Error occured while user Signup",{err});
            res.status(500).json({ message: "Internal server error" });
        }
        
    }
    catch(err){
        logger.error("Error occured while user Signup",{err});
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {validateLogin,addSignup};