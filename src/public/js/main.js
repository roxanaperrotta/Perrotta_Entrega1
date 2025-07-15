const socket = io ();

socket.emit ("mensaje", "hola, estoy en front");

socket.on ('saludito', (data)=>{
    console.log(data);
});


socket.on("products", products=> {
    if (Array.isArray(products)) {
        const productsContainer = document.getElementById("table");
        productsContainer.innerHTML = `
        <tr>
            <th>Id:</th>
            <th>Título:</th>
            <th>Descripción:</th>
            <th>Código:</th>
            <th>Precio:</th>
            <th>Stock:</th>
            <th>Imágenes:</th>
        </tr>
        `;

        products.forEach((product) => {
            productsContainer.innerHTML += `
            <tr>
                <td>${product._id}</td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.code}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.thumbnail}</td>
                <button>Eliminar</button>
            </tr>`;

            productsContainer.querySelector("button").addEventListener("click", ()=>{
                eliminarProducto(product._id);
            })
        });
    } else {
        console.error('Expected an array of products but received:', products);
    }

 
});

 const eliminarProducto= (id)=>{
    socket.emit("delete-product", id);
 }
  

 document.getElementById("addNewProduct").addEventListener("submit", (event) => {
     event.preventDefault()
 
 
              socket.emit("new-Product", {
                 title: document.getElementById("title").value,
                 description: document.getElementById("description").value,
                 code: document.getElementById("code").value,
                 price: parseInt(document.getElementById("price").value), 
                 stock: parseInt(document.getElementById("stock").value), 
                 thumbnail: "no disponible"
             });
             
             event.target.reset();
             
 });
 
 
 
 
 socket.on('response', (response) => {
     if(response.status === 'success') {
         document.getElementById('responseContainer').innerHTML = `<p class="success">${response.message}</p>`;
     } else {
         document.getElementById('responseContainer').innerHTML = `<p class="error">${response.message}</p>`;
     }
 });   