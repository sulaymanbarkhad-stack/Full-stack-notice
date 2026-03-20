import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authmiddleWare = async (req, res, next) => {
    let token;


    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
       token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        return res.status(401).json({message: "Not authorized"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded._id || decoded.id;
        req.user = await User.findById(userId).select("-password");

        if (!req.user) {
            return res.status(401).json({message: "User not found"});
        }

        next();
    } catch (error) {
        return res.status(401).json({message: "invalid token"});
    }
}

export const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({message: "Admin access required"});
    }
    next();
};

export const adminOrOwner = (req, res, next) => {
    const ownerId = req.params.id;
    const currentUserId = req.user?._id?.toString();

    if (req.user?.role === "admin" || currentUserId === ownerId) {
        return next();
    }

    return res.status(403).json({message: "Not authorized"});
};
