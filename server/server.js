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
            price:req.body.price,
            sequence:req.body.sequence
        })
        console.log(`Added to Database: ${req.body.name}`)
        res.json(`Added to Database: ${req.body.name}`)
    }catch(err){
        console.log(err)
    }
})
app.delete('/api/dinner/:id',async(req,res)=>{
    try{
        await Dinner.findByIdAndDelete(req.params.id)
        console.log(`Item Deleted from Database`)
        res.json(`Item Deleted from Database`)
    }catch(err){
        console.log(err)
    }
})
app.get('/api/dinner',async(req,res)=>{
    try{
        const allDinner = await Dinner.find()
        console.log(`
            All Items From Dinner Menu: 
            ${allDinner}`)
        res.json(allDinner)
    }catch(err){
        console.log(err)
    }
})
app.get('/api/dinner/:id', async(req,res)=>{
    try{
        const dinner = await Dinner.findById(req.params.id)
        console.log(dinner)
        res.json(dinner)
    }catch(err){
        console.log(err)
    }
})
app.put('/api/dinner/:id', async(req,res)=>{
    try{
        await Dinner.findByIdAndUpdate({_id:req.params.id},{
            section:req.body.section,
            name:req.body.name,
            allergies:req.body.allergies,
            description:req.body.description,
            price:req.body.price,
            sequence:req.body.sequence
        })
        console.log(`Updated in Database: ${req.body.name}`)
        res.json(`Updated in Database: ${req.body.name}`)
    }catch(err){
        console.log(err)
    }
})

