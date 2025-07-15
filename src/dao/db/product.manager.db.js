import productModel from "../models/product.model.js";

class ProductManager{


     async addProduct (product ){

        const {title, description, price, code, stock, thumbnail, category, status }= product 
    
         try{   
        
            // Validación de inputs
   
       
            if (!title || !description || !price || !thumbnail || !code || !stock  ) {
            console.log("Todos los campos son obligatorios");
            }
        
            //Revisar que no se dupliquen códigos

            const existingProduct = await productModel.findOne({code:code});
            if (existingProduct){

                console.log(`El producto con código ${code} ya existe`);

            }

             


       // crear el producto nuevo

        const newProduct= new productModel({
            title,
            description,
            price, 
            thumbnail: thumbnail || [],
            code,
            stock,
            category:"producto",
            status:true
        });

        await newProduct.save();
        console.log("Producto agregado correctamente")

}
catch(error){
    console.log("Error al agregar el producto", error)
}

     }
//Obtener productos


async getProducts() { 
    try {
        const arrayProductos = await productModel.find();
        return arrayProductos;

    } catch (error) {
        console.log("Error al obtener productos");
        throw error; 
    }
}

  
         
//Obtener producto por id

    async getProductById(id){

        try {
            const product = await productModel.findById(id);
            if (!product){
                console.log("Producto no encontrado");
                return null
            };
            return product; 
        } catch (error) {
            console.log("Error al buscar por id", error);
        }
}

  async updateProduct (id, updatedFields){

    try {
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedFields);
       if (!updatedProduct){
        console.log("No se encuentra el producto");
        return null;
       };
       return updatedProduct;

    } catch (error) {
        console.log("Error al actualizar productos");
        throw error;
    }

    }

    async deleteProduct (id){

        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            if (!deletedProduct){
             console.log("No se encuentra el producto");
             return null;
            };
            console.log("Producto eliminado correctamente");
        } catch (error) {
            return `Error eliminando el producto. Error ${error}`;
        };
    };

};


export default ProductManager;