import jwt from "jsonwebtoken";


const token = (user) => {
    const payload = {
        _id: user._id, role: user.role
    };


    const token=jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn:process.env.JWT_EXPIREIN
    });

    return token;
}


export default token;