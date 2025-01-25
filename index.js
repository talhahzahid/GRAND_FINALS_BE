import cors from "cors";
import "dotenv/config";
import express from "express";
import connectdb from "./src/db/index.js";
import authRouter from "./src/routes/auth.routes.js"
import cookieParser from "cookie-parser";
import clientRoutes from "./src/routes/client.routes.js"
import loanRoutes from "./src/routes/loan.routes.js"
const app = express();

const corsOption = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(express.json());
app.use(cors(corsOption));
app.use(cookieParser())
app.use("/api/v1", authRouter)
app.use("/api/v2", clientRoutes)
app.use("/api/v3", loanRoutes)
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