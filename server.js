import express from "express"
import cors from "cors"
import { connectDB } from "./backend/config/db.js"
import foodRouter from "./backend/routes/foodRoute.js"
import userRouter from "./backend/routes/userRoute.js"
import cartRouter from "./backend/routes/cartRoute.js"
import 'dotenv/config'
import orderRouter from "./backend/routes/orderRoute.js"

//app config
const app = express()
const port = 4000 //changed the port number from 4000 to 4001 on 7th jan //port number where our server will be running

//middleware
app.use(express.json()) //whenever we will get request from frontend to backend, that will be parsed using this json
app.use(cors()) //using this we can access the backend from any frontend

//db connection
connectDB();

//api endpoints
app.use("/api/food",foodRouter)  /* {/add,/list,/remove} */
app.use("/images",express.static('backend/uploads'))
app.use("/api/user",userRouter)  /* {/register,/login} */
app.use("/api/cart",cartRouter)  /* {/add,/remove,/get} */
app.use("/api/order",orderRouter)

//it is an http method, using that we can request the data from the server
app.get("/",(req,res)=>{
    res.send("API Working");
})

//after that we will run the express server
app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`);
});

//mongodb+srv://greatstack:Tanisha@04@cluster0.xoo9x.mongodb.net/?









