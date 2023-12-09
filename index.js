const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

const orders = []

const verifyRoute = (request, response, next) => {
    const url = request.url
    const route = request.method
    console.log(route, url)
    next()
}

const validateOrderExists = (request, response, next) => {
    const { id } = request.params;
    const index = orders.findIndex(item => item.id === id);
    request.orderId = id

    if (index !== -1) {
        request.orderIndex = index;
        next(); 
    } else {
        return response.status(404).json({ message: "Pedido não encontrado" });
    }
};


app.get('/order', verifyRoute, (request, response) =>{
    return response.json(orders)
})

app.post('/order', verifyRoute, (request, response) =>{
    try{
    const {order, clientName, price} = request.body
    if(clientName === "Gabriel") throw new Error("Fala, gabriel, tudo tranquilo cara?")

    const user = {id: uuid.v4(), order, clientName, price, status: "Em preparação"}
    
    orders.push(user)
    return response.json(orders)
}catch(err){
    return response.json({message: err.message})
}
    
})

app.put('/order/:id', verifyRoute, validateOrderExists,(request, response) =>{
    const {order, clientName, price} = request.body
    const index = request.orderIndex
    const id = request.orderId
    const newOrder = {id, order, clientName, price, status: "Em preparação"}
    orders[index] = newOrder
    return response.json(newOrder)
})

app.delete('/order/:id', verifyRoute, validateOrderExists, (request, response) =>{
    const index = request.orderIndex
    orders.splice(index, 1)
    return response.json({message: "User deleted"})
})

app.patch('/order/:id', verifyRoute, validateOrderExists, (request, response) =>{
    const index = request.orderIndex 
    orders[index].status = "Concluído"
    return response.json({message: "Pedido concluído!"})
})

app.listen(port, () =>{
    console.log("Server started on port 3000")
})