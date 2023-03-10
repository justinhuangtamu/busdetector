const express = require('express')
const app = express()
const port = 3001

const route_model = require('./route_model')

app.use(express.json())
app.use(function(req,res,next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});


app.get('/:query', async (req,res) => {
    const {query} = req.params;
    try {
        const response = await route_model.getRoutes(query);
        res.json(response.rows);
    } catch (error) {
        res.status(500).send(error);
    }
})


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})