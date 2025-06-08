import express from 'express'
const app = express()
const PORT = process.env.PORT || 9991
app.listen(PORT, ()=> console.log(`Server Running on Port: ${PORT}`))
app.use(express.static('../dist'))
const items = [
    {name:"Laptop", price: 500},
    {name:"Desktop", price: 700}
]
app.get('/api/items', (req,res)=>res.send(items))