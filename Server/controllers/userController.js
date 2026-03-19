import bcrypt from "bcryptjs";
import User from "../models/user.js";
import tokenGenerate from "../utils/tokenGenerate.js";


export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Hubi in dhammaan fields la bixiyay
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please add all fields" });
        }

        // Hubi in user horay u jiro
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password-ka
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Jawaab
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: tokenGenerate(user) // hubi inaad user object u dirto
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.error("Register User Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};