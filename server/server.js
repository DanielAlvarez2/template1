import express from 'express'
import mongoose from 'mongoose'
import Dinner from './models/Dinner.js'
const app = express()
const PORT = process.env.PORT || 9991
app.listen(PORT, ()=> console.log(`Server Running on Port: ${PORT}`))
app.use(express.static('../dist'))
app.use(express.json());

// MUST HAVE A SEMICOLON ON THE LINE BEFORE AN IIFE
(async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database Connected')
    }catch(err){
        console.log(err)
    }
})()
app.post('/api/dinner', async(req,res)=>{
    try{
        await Dinner.create({
            section:req.body.section,
            name:req.body.name,
            allergies:req.body.allergies,
            description:req.body.description,
            price:req.body.price
        })
        console.log(`Added to Database: ${req.body.name}`)
        res.json(`Added to Database: ${req.body.name}`)
    }catch(err){
        console.log(err)
    }
})

