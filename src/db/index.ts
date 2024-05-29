import { connect } from "mongoose";
const uri ='mongodb://localhost:27017/earnMachine'
connect(uri)
    .then(() => {
    console.log('connected to mongodb')
    })
    .catch(err => {
        console.log(err)
    })