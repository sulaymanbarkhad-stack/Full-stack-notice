import bcrypt from "bcryptjs";
import User from "../models/user.js";
import tokenGenerate from "../utils/tokenGenerate.js";


export const registerUser = async (req, res) => {
    try {
        const { name, email, password} = req.body;

        // check required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please add all fields" });
        }

        // check user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
            
        });

        // response
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: tokenGenerate(user) // check to send user object the token
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.error("Register User Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const login = async (req, res) => {
    const {email, password} = req.body;
       
    try {
        
        const user = await User.findOne({email});
            // check for user
        if(!user) {
            return res.status(400).json({message: "User not found"});
        }
        // check password match
        const isMatch = await bcrypt.compare(password, user.password);
          
        if(!isMatch) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: tokenGenerate(user)
        })
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const updatedUser = async (req, res) => {
    
    const id = req.params.id;

    try {
        const user = await User.findById(id);

        if(!user) {
            return res.status(400).json({message: "User not found"});

        }
        
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: tokenGenerate(updatedUser)
        })
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const deleteUser = async (req, res) => {
    
    const id = req.params.id;

    try {
        const user = await User.findById(id);

        if(!user) {
            return res.status(400).json({message: "User not found"});

        }
        
        await user.deleteOne();

        res.status(200).json({message: "User deleted"});
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
