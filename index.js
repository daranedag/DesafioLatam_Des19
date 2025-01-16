const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
const PORT = 3000
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch(error){
        return [];
    }
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

//read
app.get("/canciones", (req, res) => {
    const data = readData();
    res.json(data);
});

//create
app.post("/canciones", (req, res) =>{
    const data = readData();
    const newItem = req.body;
    newItem.id = data.length ? data[data.length - 1].id + 1 : 1;
    data.push(newItem);
    writeData(data);
    res.status(201).json(newItem);
});

//update
app.put("/canciones/:id", (req, res) =>{
    const data = readData();
    const id = parseInt(req.params.id, 10);
    const index = data.findIndex((item) => item.id === id);

    if(index !== -1){
        data[index] = { ...data[index], ...req.body };
        writeData(data);
        res.json(data[index]);
    }
    else{
        res.status(404).json({ error: 'Elemento no encontrado' });
    }
});

//delete
app.delete("/canciones/:id", (req, res) =>{
    const data = readData();
    const id = parseInt(req.params.id, 10);
    const newData = data.filter((item) => item.id !== id);

    if (newData.length !== data.length){
        writeData(newData);
        res.json({ message: 'Elemento eliminado'});
    }
    else{
        res.status(404).json({ error: 'Elemento no encontrado' });
    }
});


//search
app.get("/canciones/buscar", (req, res) => {
    const { key, value } = req.query;
    const data = readData();
    const results = data.filter((item) => item[key] === value );
    res.json(results);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
