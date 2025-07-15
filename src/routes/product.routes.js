import {Router} from "express";
import ProductManager from "../dao/db/product.manager.db.js";


const router = Router();

const productManager = new ProductManager();

router.get('/', async (req, res) => {
   
        const productsArray = await productManager.getProducts();
        res.send(productsArray);
   
});


router.get('/:pid', async (req, res) => {
    let id  = req.params.pid;
    
    try {
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.status(404).send('Producto no encontrado')
        }
        res.status(200).send({ result: 'Success', message: product })
    } catch (error) {
        res.status(404).send({ result: 'Error', message: 'No encontrado' })
    }
});

router.post('/', async (req, res)=>{
    const newProduct = req.body;
    try {
        await productManager.addProduct(newProduct);
        res.status(201).send("Producto agregado");

    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})


export default router;