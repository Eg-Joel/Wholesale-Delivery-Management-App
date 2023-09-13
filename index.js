const express =require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const adminRouter = require("./routes/admin")
const truckDriverRouter = require("./routes/truckDriver")

dotenv.config()

mongoose.connect(
    process.env.MONGODB
).then(()=>console.log("Database connected"))
.catch((err) => {
    console.log(err);
})
app.use(express.json()) 
app.use("/api/admin",adminRouter)
app.use("/api/truckDriver",truckDriverRouter)

app.listen( 3000, () => {
console.log("server is running");
})