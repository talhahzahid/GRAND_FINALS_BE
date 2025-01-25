import cors from "cors";
import "dotenv/config";
import express from "express";
import connectdb from "./src/db/index.js";
import authRouter from "./src/routes/auth.routes.js"

const app = express();

const corsOption = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(express.json());
app.use(cors(corsOption));
app.use("/api/v1",authRouter)
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Database Connection
connectdb()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Server Is Running On The Port", process.env.PORT);
        })
    })
    .catch((err) => {
        console.log(err);
    });