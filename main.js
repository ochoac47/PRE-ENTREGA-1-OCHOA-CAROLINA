let totalCompra = 0;
let rta= ""
rta = prompt("Ingrese ESC para salir. Aceptar para continuar.")
const listaProductos = document.getElementById("lista-productos");
const totalElement = document.getElementById("total");

function agregarProducto() {
  const productoSelect = document.getElementById("producto");
  const productoValue = parseInt(productoSelect.value);

  if (productoValue === 0) {
    alert("Selecciona un producto válido");
    return;
  }

  let descripcion = "";
  let precio = 0;

  switch (productoValue) {
    case 15:
      descripcion = "Dona Glaseada";
      precio = 15;
      break;
    case 20:
      descripcion = "Dona Fudge";
      precio = 20;
      break;
    case 30:
      descripcion = "Pack de Donas";
      precio = 30;
      break;
  }

  totalCompra += precio;
  listaProductos.innerHTML += `<li>${descripcion} - $${precio}</li>`;
  totalElement.textContent = totalCompra;

  productoSelect.value = 0; // Reiniciar selección
}


