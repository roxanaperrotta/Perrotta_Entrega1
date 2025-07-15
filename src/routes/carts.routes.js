import express from "express";
import CartManager from "../dao/db/cart.manager.db.js";


const cartManager = new CartManager();

const router = express.Router();

//Crear carrito

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).send("Error del servidor, acción denegada");
    }
});

//Listar carritos

router.get("/", async (req, res)=>{
    try {
       const carts= await cartManager.getCarts();
       res.json(carts);

    } catch (error) {
         res.status(500).send("Error del servidor, al obtener carritos");
    }
})
//Obtener carrito por id

router.get("/:cid", async (req, res) => {
    let cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);
        console.log(cart);
        res.json(cart.products);
    } catch (error) {
        res.status(500).send("error, no se pudo obtener el producto del carrito");
    }
});


//Actualizar carrito

router.post("/", async (req, res)=>{
    try {
        const cart=req.body
        const newCart = await cartManager.addCart(cart)
        res.json(newCart);

    } catch (error) {
        console.error("error")

    }
 });


//Agregar producto al carrito

 router.post("/:cid/product/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let quantity = req.body.quantity || 1;

    try {
        const cartUpdated = await cartManager.addProductCart(cartId, productId, quantity);
        res.json(cartUpdated.products);
    } catch (error) {
        res.status(500).send("error al agregar producto al carrito");
    }
});



//Eliminar producto del carrito

router.delete("/:cid/product/:pid", async(req, res)=>{
    try {
        const cartId = req.params.cid;
        const productId=req.params.pid;
        const cart= await cartManager.deleteProduct(cartId, productId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({error:error.message})

    };
});



export default router 