const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let products = [];

const validateProduct = (product) => {
    return product.id && product.name && product.count !== undefined && product.unitCost !== undefined && product.currency;
};

app.post('/products', (req, res) => {
    const product = req.body;
    
    if (!validateProduct(product)) {
        return res.status(400).send({ message: 'Faltan datos necesarios para crear un producto: id, name, count, unitCost, currency.' });
    }

    const existingProduct = products.find(p => p.id === product.id);
    if (existingProduct) {
        return res.status(400).send({ message: 'El producto con este id ya existe.' });
    }

    products.push(product);
    res.status(201).send(product);
});

app.get('/products', (req, res) => {
    res.send(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send({ message: 'Producto no encontrado.' });
    res.send(product);
});

app.put('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send({ message: 'Producto no encontrado.' });

    const updatedProduct = req.body;
    
    if (!validateProduct(updatedProduct)) {
        return res.status(400).send({ message: 'Faltan datos necesarios para actualizar un producto: id, name, count, unitCost, currency.' });
    }

    Object.assign(product, updatedProduct);
    res.send(product);
});

app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).send({ message: 'Producto no encontrado.' });

    products.splice(productIndex, 1);
    res.status(200).send({ message: 'Producto eliminado correctamente.' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});