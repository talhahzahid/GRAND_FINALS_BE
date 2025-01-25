

import User from "../models/client.models.js"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'elmer.strosin5@ethereal.email',
        pass: 'tBwAuJqpe3wV5kJrY1'
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
        const existingUser = await User.findOne({ cnic });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist" });
        };
        const validPassword = await bcrypt.compare(password, existingUser.password); // Use existingUser.password
        if (!validPassword) return res.status(400).json({ message: "Incorrect Password" });
        
        res.status(200).json({ message: "Login successful" }); // Corrected this line
    } catch (error) {
        console.error(error); // Log the actual error
        res.status(500).json({ message: "Internal Server Error" }); // Return server error in case of an exception
    }
};

export { registerUser , clientLogin }