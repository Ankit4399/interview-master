const express = require('express');

const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "https://interview-master-red.vercel.app",
  credentials: true
}))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://interview-master-red.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  res.header("Access-Control-Expose-Headers", "Content-Disposition");

  next();
});

const authRouter = require('./routes/auth.routes.js')
const interviewRouter = require('./routes/interview.routes.js')

app.use("/api/auth",authRouter)
app.use('/api/interview',interviewRouter)


module.exports = app;