// app.js
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const app = express();
const {connection} = require("./config/config")
const {audioRouter} = require("./routes/audio.route")
require("dotenv").config()
// Middleware
app.use(bodyParser.json());
app.use(express.json())
app.use("/api", audioRouter)


        
      

// Start the server

app.listen(process.env.port, async () => {
    try {
      await connection;
      console.log("Connected to DB");
       console.log("Server is running on port  8000");
    } catch (error) {
      console.log(error);
    }
   
  });