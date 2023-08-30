class Producto {
  constructor(id, nombre, precio) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = 1;
  }

  descripcion() {
    return "id: " + this.id + " nombre: " + this.nombre + " precio: " + this.precio + "\n\n";
  }

  descripcioncarrito() {
    return "id: " + this.id + " nombre: " + this.nombre + " precio: " + this.precio + " cantidad: " + this.cantidad + "\n\n";
  }
}

class Carrito {
  constructor() {
    this.listacarrito = [];
    this.precio = 0;
  }

  agregar(producto) {
    this.listacarrito.push(producto);
  }

  mostrarProductos() {
    let descripcionlistadeproductos = "Lista de productos en el carrito:\n\n";
    this.listacarrito.forEach(producto => {
      descripcionlistadeproductos += producto.descripcioncarrito();
    });
    return descripcionlistadeproductos;
  }

  calcularTotal() {
    return this.listacarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  }
}

class RevisorDeProductos {
  constructor() {
    this.listadeproductos = [];
  }

  agregar(producto) {
    this.listadeproductos.push(producto);
  }

  mostrarProductos() {
    let descripcionlistadeproductos = "Lista de productos disponibles:\n\n";
    this.listadeproductos.forEach(producto => {
      descripcionlistadeproductos += producto.descripcion();
    });
    return descripcionlistadeproductos;
  }

  obtenerProducto(id) {
    return this.listadeproductos.find(producto => producto.id === id);
  }
}

const p1 = new Producto(1, "Dona Clásica", 15);
const p2 = new Producto(2, "Dona de Chocolate", 17);
const p3 = new Producto(3, "Dona de Fresa", 20);
const p4 = new Producto(4, "Dona Glaseada", 3.5);
const p5 = new Producto(5, "Dona Rellena de Crema", 20);
const p6 = new Producto(6, "Dona de Canela", 25);

const carrito = new Carrito();
const revisordeproductos = new RevisorDeProductos();
 
revisordeproductos.agregar(p1);
revisordeproductos.agregar(p2);
revisordeproductos.agregar(p3);
revisordeproductos.agregar(p4);
revisordeproductos.agregar(p5);
revisordeproductos.agregar(p6);

alert(revisordeproductos.mostrarProductos());

let rta = "aceptar"; 
while (rta.toLowerCase() === "aceptar") {
  id = Number(prompt("Por favor ingrese el id del producto que desea comprar"));
  const producto = revisordeproductos.obtenerProducto(id);
  
  if (producto) {
    cantidadrequerida = Number(prompt("Por favor ingrese la cantidad que desea comprar"));
    producto.cantidad = cantidadrequerida;
    carrito.agregar(producto);
  } else {
    alert("El producto no existe en la lista.");
  }

  rta = prompt("Ingrese ACEPTAR para agregar más productos al carrito. Ingrese ESC para finalizar.");
}


alert(carrito.mostrarProductos());
alert("El Total a pagar es de: $" + carrito.calcularTotal());

if (rta.toLowerCase() === "aceptar") {
  alert("El Total a pagar es de: $" + carrito.calcularTotal());
} 