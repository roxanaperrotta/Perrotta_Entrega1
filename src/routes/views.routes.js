import { Router} from "express";
import ProductManager from "../dao/db/product.manager.db.js";
import productModel from "../dao/models/product.model.js";
import User from "../dao/models/user.model.js";
import passportCall from '../middleware/auth.js'

const router =  Router ();
const productManager = new ProductManager ();

router.get ('/products', async (req, res)=>{
    let page= req.query.page || 1
    let limit = 4
    
    const products = await productManager.getProducts();
    const listadoProductos= await productModel.paginate({}, {limit, page});
   // console.log(listadoProductos);

    const ordenado = await productModel.aggregate([
    {
        $sort: {
            price: 1 // Orden ascendente
        }
    }
]);

console.log(ordenado);

const productsResultadoFinal = await listadoProductos.docs.map( prod =>{
   const {_id, ...rest} = prod.toObject();
   return rest;
  });
   res.render("home", {
       products:productsResultadoFinal,
       hasPrevPage:listadoProductos.hasPrevPage,
       hasNextPage:listadoProductos.hasNextPage,
       prevPage:listadoProductos.prevPage,
       nextPage:listadoProductos.nextPage,
       currentPage:listadoProductos.page,
       totalPages:listadoProductos.totalPages
   })
   //res.render('home', {products:nuevoArray});

   
})


router.get ('/realtimeproducts', async (req, res)=>{
   // const products = await productManager.getProducts();
    res.render('realTimeProducts')
});

router.get('/cart', async(req, res)=>{
    res.render('cart')
})
router.get ('/chat', async (req, res)=>{
    res.render('chat' )
});

router.get('/login', (req, res) => {
    const error = req.query.error;
    res.render('login', { error });
  });
  
  router.get('/current', passportCall, async (req, res) => {
    const user = await User.findById(req.user.id).lean();
    res.render('current', { user });
  });
  

export default router;