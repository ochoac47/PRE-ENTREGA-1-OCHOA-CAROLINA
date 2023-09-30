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
                        <button class= "btn btn-dark btn-disminuir" id="disminuir-${this.id}"><i class="fa-solid fa-minus"></i></button>
                        ${this.cantidad}
                        <button class= "btn btn-dark btn-aumentar" id="aumentar-${this.id}"><i class="fa-solid fa-plus"></i></i></button>
                        </p>
                        <p class="card-text">Precio: $${this.precio}</p>
                        <button class= "btn btn-custom-danger" id="ep-${this.id}"><i class="fa-solid fa-trash"></i></button>
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
                 <button class="btn btn-custom-info" id="ap-${this.id}">Agregar al Carrito</button>
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
            this.listaProductos.push(producto)
        }
    }
     
    async cargarProductos() {
        try {
            const response = await fetch('productos.json'); 
          if (!response.ok) {
            throw new Error('No se pudo cargar la lista de productos.');
          }
          const data = await response.json();
          this.listaProductos = data.map(
            (productoData) =>
              new Producto(
                productoData.id,
                productoData.nombre,
                productoData.precio,
                productoData.descripcion,
                productoData.img,
                productoData.alt
              )
          );
          this.mostrarEnDOM();
        } catch (error) {
          console.error('Error al cargar productos:', error);
        }
      }

        mostrarToastify(){
            Toastify({
                text: "Se agregó al carrito",
                duration: 3000,
                gravity: "bottom", 
                position: "right", 
                stopOnFocus: true, 
                style: {
                  background: "info-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function(){} 
              }).showToast();
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
                this.mostrarToastify()
                })
            })
        }

    }   

    class Carrito {
        constructor() {
            this.listaCarrito = []
            this.localStoragekey = "listaCarrito";
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
            this.listaCarrito.forEach(producto => {
              const btn_eliminar = document.getElementById(`ep-${producto.id}`);
              
              btn_eliminar.addEventListener("click", () => {
                Swal.fire({
                  title: 'Deseas Eliminar?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Si, Eliminar!'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.eliminar(producto);
                    this.guardarEnStorage();
                    this.mostrarEnDOM();
                    Swal.fire(
                      'Eliminado!',
                      'El producto fue eliminado.',
                      'success'
                    );
                  }
                });
              });
            });
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
            const finalizarcompra = document.getElementById("finalizarcompra");
           
            finalizarcompra.addEventListener("click", () => {
                const totalPagar = this.calcularTotal().toFixed(2);
        
                if (this.listaCarrito.length === 0) {
                    Swal.fire({
                        position: 'center',
                        icon: 'info',
                        title: 'Agregue productos para continuar',
                        showConfirmButton: false,
                        timer: 3000
                    });
                } else {
                    localStorage.setItem(this.localStoragekey, "[]");
                    this.mostrarEnDOM();
        
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Compra realizada con éxito',
                        text: `Monto total a pagar: $${totalPagar}`,
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            });
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
              this.eventoFinalizarCompra()
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
   
    CP.cargarProductos();  
    
    carrito.eventoFinalizarCompra();
    carrito.recuperarStorage();
    carrito.mostrarEnDOM();