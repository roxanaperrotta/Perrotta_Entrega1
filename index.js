import express from 'express';
import productsRouter from './src/routes/product.routes.js';
import cartRouter from './src/routes/carts.routes.js';
import ProductManager from './src/dao/db/product.manager.db.js';
import userRouter from './src/routes/user.routes.js'
import CartManager from './src/dao/db/cart.manager.db.js';
import expresshandlebars from 'express-handlebars';
import viewsRouter from './src/routes/views.routes.js';
import { Server } from 'socket.io';
import "./src/config/database/db.js";
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './src/config/passport/passport.config.js';
import  passportCall from './src/middleware/auth.js';
import { generateToken } from './src/utils.js';



//iniciamos el servidor
const app = express ();
const PORT= 8080;

const productManager =  new ProductManager ();
const cartManager = new CartManager ();

//Middlewares

app.use(express.json ());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use('/api/users', userRouter)


// Passport
initializePassport();
app.use(passport.initialize());


app.get('/api/current', passportCall, (req, res) => {
  res.json({
    message: 'Usuario autenticado',
    user: req.user
  });
});

//configuramos express-handlebars

app.engine('handlebars', expresshandlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use ('/', viewsRouter);
app.use ('/chat', viewsRouter);
app.use("/cart", viewsRouter);
app.use('/login', viewsRouter);
app.use('/register', viewsRouter);


//configuración de socket

const httpServer = app.listen(PORT, ()=>{
    console.log(`Servidor con express en el puerto ${PORT}`)

const io = new Server(httpServer);

    io.on ('connection', async (socket)=>{

    console.log('cliente conectado');
    socket.on ('mensaje', (data)=>{
        console.log(data);
    });
   
    socket.emit ("saludito", "hola cliente, como estas?");
   // socket.emit ('products', await productManager.getProducts());
   try {
    const products = await productManager.getProducts();
    socket.emit("products", products);
   // console.log(products)

    } catch (error) {
    socket.emit('response', { status: 'error', message: error.message });
    }

    

    socket.on("new-Product", async (newProduct) => {
    
        try {

                // validar price
                if (typeof newProduct.price !== 'number') {
                console.error('Price must be a number');
                // error
        }

               // validar stock
                if (typeof newProduct.stock !== 'number') {
                console.error('Stock must be a number');
                }
            

        const productoNuevo = {
              
                title: newProduct.title,
                description: newProduct.description,
                code: newProduct.code,
                price: newProduct.price,
                stock: newProduct.stock,
                thumbnail: newProduct.thumbnail,
                category:newProduct.category,
                staus:newProduct.status

        }

        const pushProduct =  await productManager.addProduct(productoNuevo);
        const listaActualizada =   await productManager.getProducts();
        socket.emit("products", listaActualizada);
        socket.emit("response", { status: 'success' , message: pushProduct});

    } catch (error) {
        socket.emit('response', { status: 'error', message: error.message });
    }

    socket.on("delete-product",  async (id) => {
        try {
            const pid = (id);
            const deleteProduct =  await productManager.deleteProduct(pid)
            const listaActualizada = await productManager.getProducts()
            socket.emit("products", listaActualizada)
            socket.emit('response', { status: 'success' , message: "producto eliminado correctamente"});
        } catch (error) {
            socket.emit('response', { status: 'error', message: error.message });
        }
    } )
})

// socket para chat

    
    let messages = [];
    
    io.on('connection', (socket) => {
    console.log('Nuevo usuario de chat conectado');

    socket.on('message', (data) => {
       
      
     messages.push(data);
     socket.emit ('messageLogs', messages)  ;

    });

})


    })
})