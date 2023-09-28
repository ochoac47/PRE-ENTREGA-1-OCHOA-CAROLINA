
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
        <div class="card mb-3" style="max-width: 540PX;">
           <div class="row g-0">
              <div class="col-md-4">
                    <img src="${this.img}" class="img-center rounded-start" alt="${this.alt}">
                </div>
                <div class="col-md-8">
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
    <div class="card mb-3" style="max-width: 540px;">
    <div class="row g-0">
              <div class="col-md-4">
                <img src="${this.img}" class="img-center rounded-start" alt="${this.alt}">
            </div>
            <div class="col-md-8">
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

    agregar(producto){ 
        if(producto instanceof Producto){
            this.listaProductos.push(producto);
        }
    }
     
    async  contenido_productos() {
        
        let listaProductosJSON = await fetch('productos.json');
        let listaProductosJS = await listaProductosJSON.json();

        listaProductosJS.forEach(producto => {
            let nuevoProducto = new Producto(producto.id, producto.nombre, producto.precio, producto.descripcion, producto.img, producto.alt);
            this.agregar(nuevoProducto);
        });

        this.mostrarEnDOM();
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


        eventoFinalizarCompra() {
            const finalizarcompra = document.getElementById("finalizarcompra")
    
            finalizarcompra.addEventListener("click", () => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Su compra ha sido exitosa',
                    showConfirmButton: false,
                    timer: 3000
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
 
    const CP = new ProductoController();
    const carrito = new Carrito ();
    
    carrito.eventoFinalizarCompra();
    carrito.recuperarStorage();
    carrito.mostrarEnDOM();
    CP.contenido_productos();   
    