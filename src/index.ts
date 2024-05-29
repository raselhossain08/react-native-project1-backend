import"./db"
import"express-async-errors"
import express, { RequestHandler } from 'express'
import bodyParser from 'body-parser'
import authRouter from './routes/AuthRoutes'
import dotenv from "dotenv";

dotenv.config();
const app = express()

app.use(express.static("src/public"))
// body parser for express

app.use(bodyParser.json())

app.use(express.json())
app.use(express.urlencoded({extended:false}))
// Api Routes
app.use('/auth',authRouter)
app.use(function (err,req,res,nextTick) {
  res.status(500).json({message:err.message});
} as express.ErrorRequestHandler)
dotenv.config();
app.listen(3000, () => {
  console.log(' http://localhost:3000 server running')
})