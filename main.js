function mostrar_Producto_Precio(producto, precio, cantidad){
  return "Producto: " + producto + "\tCantidad: x" + cantidad + "\tPrecio por unidad: $" + precio;
}

let detalle_compra = "";
let totalCompra = 0;
let rta = "";

do {
  let producto = prompt("Ingrese su producto");
  if (producto === "ESC") {
    break;
  }

  let cantidad = Number(prompt("Ingrese la cantidad de productos"));
  let precio = Number(prompt("Ingrese el precio"));

  detalle_compra = detalle_compra + mostrar_Producto_Precio(producto, precio, cantidad) + "\n";
  totalCompra = totalCompra + precio * cantidad
  alert (detalle_compra)
  rta = prompt("Ingrese ESC para salir. ACEPTAR para continuar la compra.");
} 


while (rta !== "ESC");

alert(detalle_compra + "\nTotal compra: $" + totalCompra);