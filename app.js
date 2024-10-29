import 'dotenv/config';
import express from "express";
import userRouter from "./routes/userRouter.js";
import path from "path"

const __dirname = import.meta.dirname


const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use('/',userRouter)

const PORT = process.env.AppPort || 8080;

app.listen(PORT, () => console.log(`Express app listening on PORT ${PORT}`));