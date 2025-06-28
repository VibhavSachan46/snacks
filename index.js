const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const database = require("./config/database")
const userRoutes = require("./routes/User");

const app = express()

database.connect()

const PORT = process.env.PORT || 5000


app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
// app.use(cookieParser());



app.use("/api/v1/auth", userRoutes)

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	}); 
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})
