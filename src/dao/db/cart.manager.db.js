import CartModel from "../models/cart.model.js";

class CartManager {
  async addCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log("Error al crear carrito");
      return null;
    }
  }

  async getCartById(cartId) {
    try {
      const cartie = await CartModel.findById(cartId);
      if (!cartie) {
        console.log("Carrito inexistente");
        return null;
      }
      return cartie;
    } catch (error) {
      console.log("Error al obtener carrito por ID");
      throw error;
    }
  }

  async getCarts() {
    try {
      const carts = await CartModel.find();
      if (!carts) {
        console.log("No hay carritos");
        return null;
      }
      return carts;
    } catch (error) {
      console.log("Error al obtener carritos");
    }
  }

  async addProductCart(cartId, productId, quantity = 1) {
    try {
      const cartie = await this.getCartById(cartId);
      const existingProduct = cartie.products.find(
        (item) => item.product.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cartie.products.push({ product: productId, quantity });
      }

      cartie.markModified("products");
      await cartie.save();
      return cartie;
    } catch (error) {
      console.log("Error al agregar producto");
      throw error;
    }
  }

  async deleteProduct(cartId, productId) {
    try {
      const carrito = await CartModel.findById(cartId);
      if (!carrito) {
        console.log("Carrito no encontrado");
        return null;
      }

      const productIndex = carrito.products.findIndex(
        (product) => product.id === productId
      );
      if (productIndex === -1) {
        console.log(
          `Producto con id ${productId} en el carrito con id ${cartId} no encontrado`
        );
        return null;
      }

      const product = carrito.products[productIndex];
      if (product.quantity > 1) {
        product.quantity--;
      } else {
        carrito.products.splice(productIndex, 1);
      }

      await carrito.save();

      console.log("Producto eliminado correctamente ");
      return carrito;
    } catch (error) {
      console.error("Error eliminando el producto del carrito", error);
      return `Error eliminando el producto. Error: ${error.message}`;
    }
  }
}

const cartManager = new CartManager();

export default CartManager;
