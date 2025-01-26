

import User from "../models/client.models.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const generateAccessToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET,
        { expiresIn: '2m' }
    );
};
const generateRefreshToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET,
        { expiresIn: '7d' }
    );
};
import nodemailer from "nodemailer"
// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'elmer.strosin5@ethereal.email',
//         pass: 'tBwAuJqpe3wV5kJrY1'
//     }
// });
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jensen.kessler@ethereal.email',
        pass: 'jGp9T9rUuJgG7dFYGy'
    }
});
function generatePassword(length) {
    const characters = "abcdefghijklmnopqrstyvwxyz";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}
const registerUser = async (req, res) => {
    try {
        const { cnic, email, name, } = req.body;
        if (!cnic) return res.status(400).json({ message: "Please Enter Your CNIC Number" });
        if (!name) return res.status(400).json({ message: "Please Enter Your Name Number" });
        if (!email) return res.status(400).json({ message: "Please Enter Your Email" });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        };
        const password = generatePassword(10)
        await User.create({ cnic, name, email, password, });
        const info = await transporter.sendMail({
            from: '"Maddison Foo Koch 👻" <vernie11@ethereal.email>', // sender address
            to: "talhazahid218@gmail.com", // list of receivers
            subject: "Hello Talha✔", // Subject line
            text: `your password is :${password}`, // plain text body
            html: "<b>Hello world salfgosagoasgvtoa?</b>", // html body
        });
        res.status(201).json({ message: "your are register successfully" })

    } catch (error) {
        console.log(error.message);
    }
}

const clientLogin = async (req, res) => {
    const { cnic, password } = req.body;
    if (!cnic) return res.status(400).json({ message: "Please Enter Your Email" });
    if (!password) return res.status(400).json({ message: "Please Enter Your Password" });
    try {
        const user = await User.findOne({ cnic });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        };
        const validPassword = await bcrypt.compare(password, user.password); // Use existingUser.password
        if (!validPassword) return res.status(400).json({ message: "Incorrect Password" });
        const refreshToken = generateRefreshToken(user)
        const accessToken = generateAccessToken(user)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        res.status(200).json({ message: "Login successful", refreshToken, accessToken }); // Corrected this line
    } catch (error) {
        console.error(error); // Log the actual error
        res.status(500).json({ message: "Internal Server Error" }); // Return server error in case of an exception
    }
};

const clientPasswordUpdate = async (req, res) => {
    const { password } = req.body;
    const userRef = req.user?._id;
    if (!userRef) {
        return res.status(400).json({ message: "Please login first." });
    }
    try {
        await User.findByIdAndUpdate(userRef, { password });
        res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export { registerUser, clientLogin, clientPasswordUpdate }