import type { IcartItem } from "../../../types/cartItem";
import { actualizarContadorCarrito, obtenerCarrito, guardarCarrito } from "../../../utils/cartUtils";


// FUNCION PRINCIPAL
function init(): void {
   cargarCarrito();

   // AGREGO FUNCIONALIDAD AL BOTON PARA VACIAR CARRITO
   document.getElementById("btn-vaciar")!.addEventListener("click", () => {
      guardarCarrito([]);
      cargarCarrito();
   });
}


// FUNCION QUE CARGA LOS ELEMENTOS DEL CARRITO, SI ES QUE NO ESTA VACIO
function cargarCarrito(): void {
   const carrito = obtenerCarrito();

   const divVacio = document.getElementById("carrito-vacio")!;
   const divConItems = document.getElementById("lista-items")!;

   if (carrito.length === 0) {
      divVacio?.classList.remove("oculto");
      divConItems.innerHTML = "";
   } else {
      divVacio.classList.add("oculto");
      renderItems(carrito);
   }

   actualizarResumen(carrito);
   actualizarContadorCarrito();
}


// FUNCION QUE RENDERIZA LOS ITEMS DEL CARRITO
function renderItems(items: IcartItem[]): void {
   const divItems = document.getElementById("lista-items") as HTMLDivElement;
   divItems.innerHTML = "";

   items.forEach(item => {
      const article = document.createElement("article");
      article.classList.add("item-carrito");

      article.innerHTML = `
         <img class="item-carrito-img" src="/src/assets/img/${item.img}" alt="${item.nombre}">

         <div class="item-carrito-info">
            <h3 class="item-carrito-nombre">${item.nombre}</h3>
            <p class="item-carrito-categoria">${item.categoria}</p>
            <p class="item-carrito-subtotal">Subtotal: $${(item.precio * item.cantidad).toLocaleString("es-AR")}</p>
         </div>

         <div class="item-carrito-controles">
            <div class="btn-controles">
               <button class="btn-menos">-</button>
               <button class="btn-cant">${item.cantidad}</button>
               <button class="btn-mas">+</button>
            </div>
            <button class="btn-eliminar">Eliminar</button>
         </div>
      `

      divItems.appendChild(article);

      const btnMenos = article.querySelector(".btn-menos")!;
      const btnMas = article.querySelector(".btn-mas")!;
      const btnEliminar = article.querySelector(".btn-eliminar");

      // FUNCIONALIDAD BOTON MENOS: RESTAR CANTIDAD DEL PRODUCTO
      btnMenos.addEventListener("click", () => {
         const carrito = obtenerCarrito();
         const encontrado = carrito.find(i => i.id === item.id)!;

         if (encontrado.cantidad > 1) {
            encontrado.cantidad--;
            guardarCarrito(carrito);
         } else {
            const carritoActualizado = carrito.filter(i => i.id !== item.id);
            guardarCarrito(carritoActualizado);
         }
         cargarCarrito();
      });

      // FUNCIONALIDAD BOTON MAS: AGREGAR CANTIDAD DEL PRODUCTO
      btnMas.addEventListener("click", () => {
         const carrito = obtenerCarrito();
         const encontrado = carrito.find(i => i.id === item.id)!;

         encontrado.cantidad++;
         guardarCarrito(carrito);
         cargarCarrito();
      });

      // ELIMINA EL PRODUCTO DEL CARRITO
      btnEliminar?.addEventListener("click", () => {
         const carrito = obtenerCarrito().filter(i => i.id !== item.id);
         guardarCarrito(carrito);
         cargarCarrito();
      });
   });
}

function actualizarResumen(items: IcartItem[]): void {
   const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

   document.getElementById("subtotal")!.textContent = `$${subtotal.toLocaleString("es-AR")}`;
   document.getElementById("total")!.textContent = `$${subtotal.toLocaleString("es-AR")}`;
}

init();