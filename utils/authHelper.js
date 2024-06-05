const bcrypt= require("bcrypt");

const hashPassword= async(password)=>{
    try {
        const saltRounds=10;
        const hash=await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.log(error);
    }
}

const comparePassword= async(password, hashPassword)=>{
    return bcrypt.compare(password, hashPassword);
}

module.exports={hashPassword, comparePassword};