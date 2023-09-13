class Producto {
    constructor(id, nombre, precio, descripcion,img, alt, cantidad =1) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.img = img;
        this.alt = alt;
}
    aumentarCantidad () {
        this.cantidad = this.cantidad +1
    }
    
    disminuirCantidad () {
        if( this.cantidad > 1)
        this.cantidad = this.cantidad -1
    }
    
        descripcionCarrito () {
            return `
            <div class="card mb-1" style="max-width: 18rem;">
               <div class="row g-0">
                  <div class="col-lg-4 col-md-6 col-sm-12">
                        <img src="${this.img}" class="img-center rounded-start" alt="${this.alt}">
                    </div>
                        <div class="card-body">
                            <h5 class="card-title">${this.nombre}</h5>
                            <p class="card-text">Cantidad: 
                            <button class= "btn btn-dark" id="disminuir-${this.id}"><i class="fa-solid fa-minus"></i></button>
                            ${this.cantidad}
                            <button class= "btn btn-dark" id="aumentar-${this.id}"><i class="fa-solid fa-plus"></i></i></button>
                            </p>
                            <p class="card-text">Precio: $${this.precio}</p>
                            <button class= "btn btn-danger" id="ep-${this.id}"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>`
    };
    
    descripcionProducto () {
        return `
        <div class="card mb-1" style="max-width: 18rem;">
        <div class="row g-0">
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <img src="${this.img}" class="img-center rounded-start" alt="${this.alt}">
                </div>
                    <div class="card-body">
                        <h5 class="card-title">${this.nombre}</h5>
                        <p class="card-text">${this.descripcion}</p>
                        <p class="card-text">$${this.precio}</p>
                     <button class="btn btn-info" id="ap-${this.id}">Agregar al Carrito</button>
                    </div>
                </div>
            </div>
        </div>`
    };
}
    
    class ProductoController {
        constructor() {
            this.listaProductos = [];
        }
    
     agregar(producto) {
            this.listaProductos.push(producto)
    
        }
    
        mostrarEnDOM() {
            let contenedor_productos = document.getElementById("contenedor_productos");
            this.listaProductos.forEach(producto => {
                contenedor_productos.innerHTML += producto.descripcionProducto ();
            });
    
            this.listaProductos.forEach(producto => {
            const btn_ap = document.getElementById(`ap-${producto.id}`)
    
                btn_ap.addEventListener("click",()=>{
                carrito.agregar(producto)
                carrito.guardarEnStorage()
                carrito.mostrarEnDOM()
                })
            })
        }
    }
    
       class Carrito {
        constructor() {
            this.listaCarrito = []
        }
    
        agregar(productoAñadir) {
            let productoExistente = this.listaCarrito.find(producto => producto.id === productoAñadir.id);
        
            if (productoExistente) {
                
                productoExistente.cantidad += 1;
                 
            } else {
                
                productoAñadir.cantidad = 1;
                this.listaCarrito.push(productoAñadir);
            }
        
            this.guardarEnStorage();
        }
    
        eliminar(productoParaeliminar) {
            let indice = this.listaCarrito.findIndex(producto => producto.id == productoParaeliminar.id);
            this.listaCarrito.splice(indice, 1);
            this.guardarEnStorage(); 
         }
    
        guardarEnStorage() {
            const listaCarritoJSON = JSON.stringify(this.listaCarrito);
            localStorage.setItem("listaCarrito", listaCarritoJSON);
        }
    
        recuperarStorage() {
            let listaCarritoJSON = localStorage.getItem("listaCarrito");
            let listaCarrito = JSON.parse(listaCarritoJSON);
            let listaAuxiliar = [];
    
            if (listaCarrito) {
                listaCarrito.forEach(producto => {
                    let nuevoProducto = new Producto(producto.id, producto.nombre, producto.precio, producto.descripcion, producto.img, producto.alt, producto.cantidad);
                    listaAuxiliar.push(nuevoProducto);
                });
                this.listaCarrito = listaAuxiliar;
            }
        }
    
        eventoeliminar() {
            this.listaCarrito.forEach(producto=> {
                const btn_eliminar=document.getElementById(`ep-${producto.id}`)
                btn_eliminar.addEventListener ("click", ()=>{ 
                this.eliminar (producto)
                this.guardarEnStorage()
                this.mostrarEnDOM()
                })
                })
            }

        eventoaumentar(){
            this.listaCarrito.forEach(producto=> {
                const btn_aumentar=document.getElementById(`aumentar-${producto.id}`)
                btn_aumentar.addEventListener ("click", ()=>{ 
                    producto.aumentarCantidad()
                    this.mostrarEnDOM()
                })
                })
        }

        eventodisminuir(){
            this.listaCarrito.forEach(producto=> {
                const btn_disminuir=document.getElementById(`disminuir-${producto.id}`)
                btn_disminuir.addEventListener ("click", ()=>{ 
                    producto.disminuirCantidad()
                    this.mostrarEnDOM()
                })
                })
        }
            
        mostrarEnDOM() {
            let contenedor_carrito = document.getElementById("contenedor_carrito");
            contenedor_carrito.innerHTML = ""
            this.listaCarrito.forEach(producto => {
                contenedor_carrito.innerHTML += producto.descripcionCarrito ();   
            });
              this.eventoeliminar()
              this.eventoaumentar()
              this.eventodisminuir()
              this.mostrarTotal()
        }

        calcularTotal () {
            return this.listaCarrito.reduce ((acumulador, producto)=> acumulador+ producto.precio* producto.cantidad,0)
        }

        mostrarTotal(){
            const total_pagar= document.getElementById("total_pagar")
            total_pagar.innerText = `Total a Pagar: $ ${ this.calcularTotal()}`
        }
    }

    
    const p1 = new Producto(1, "Dona Caramelo", 2, "Dona en baño de Caramelo, sin glutén", "img/Caramelo.jpg", "Dona Caramelo");
    const p2 = new Producto(2, "Choco Sorpresa", 3, "Dona con topping de Chocolate Sorpresa", "img/Choco Sorpresa.jpg","Dona con topping de Chocolate Sorpresa");
    const p3 = new Producto (3, "Dulce de Leche", 5, "Dulce de Leche Clásica es la mejor","img/Dulce de Leche Clásica.jpg","Dona con topping de Chocolate Sorpresa");
    const p4 = new Producto (4, "Pack Duo Relleno", 8, "Pack Duo relleno Sorpresa, llevate el 2x1", "img/Duo Relleno.jpg","Pack Duo relleno Sorpresa, llevate el 2x1");
    const p5 = new Producto (5, "Explosión Choco Fiesta", 8, "Una fiesta de sabores te espera","img/Explosión Choco Fiesta.jpg","Una fiesta de sabores te espera");
    const p6 = new Producto (6, "Fiesta Azul", 2, "Con topping de caramelo Azul y lluvias a elección", "img/Fiesta Azul.jpg","Con topping de caramelo Azul y lluvias a elección");
    const p7 = new Producto (7, "Glaseada Clásica", 3, "La mas sencilla pero delicioso gustito","img/Glaseada Clásica.jpg","La mas sencilla pero delicioso gustito");
    const p8 = new Producto (8, "Lard Lad", 4, "Dona de Vainilla cubierta con fina capa de almivar","img/Lard Lad.jpg","Dona de Vainilla cubierta con fina capa de almivar");
    const p9 = new Producto (9, "Maracuyá", 8, "Vive la experiencia de los Simpson con esta donita", "img/Maracuyá.jpg","Vive la experiencia de los Simpson con esta donita");
    const p10 = new Producto(10, "Pie de Limón", 8, "El sabor de un Pie de Limón en una sola Donita","img/Pie de Limón.jpg","El sabor de un Pie de Limón en una sola Donita");
    const p11 = new Producto(11, "Special Day", 6, "Ideal para esa persona especial","img/Special Day.jpg","Ideal para esa persona especial");
    const p12 = new Producto(12, "Vainilla Clásica", 8, "El sabor de la vainilla en un mordisco","img/Vainilla Clasica.jpg","El sabor de la vainilla en un mordisco");
       
    
    const CP = new ProductoController();
    const carrito = new Carrito ();
    
    
    CP.agregar(p1);
    CP.agregar(p2);
    CP.agregar(p3);
    CP.agregar(p4);
    CP.agregar(p5);
    CP.agregar(p6);
    CP.agregar(p7);
    CP.agregar(p8);
    CP.agregar(p9);
    CP.agregar(p10);
    CP.agregar(p11);
    CP.agregar(p12);
    
    CP.mostrarEnDOM();

    carrito.recuperarStorage();
    carrito.mostrarEnDOM();
    
    