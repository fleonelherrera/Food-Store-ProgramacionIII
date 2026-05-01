import type { Product } from "../types/product";
import type { IcartItem } from "../types/cartItem";


export function obtenerCarrito(): IcartItem[] {
   return JSON.parse(localStorage.getItem("carrito") ?? "[]");
}


export function guardarCarrito(carrito: IcartItem[]): void {
   localStorage.setItem("carrito", JSON.stringify(carrito));
}


// FUNCION PARA AGREGAR PRODUCTOS AL CARRITO
export function agregarAlCarrito(producto: Product): void {
   const carrito = obtenerCarrito();

   const itemExistente = carrito.find(item => item.id === producto.id);

   // SI EL PRODUCTO YA ESTA EN EL CARRITO, SE AUMENTA SU CANTIDAD
   // SI NO ESTA, SE LO AGREGA AL CARRITO
   if (itemExistente) {
      itemExistente.cantidad++;
   } else {
      carrito.push({
         id: producto.id,
         nombre: producto.nombre,
         precio: producto.precio,
         cantidad: 1,
         categoria: producto.categorias[0]?.nombre ?? "Sin categoría",
         img: producto.imagen,
      });
   }
   
   // SE AGREGA EL CARRITO AL LOCALSTORAGE Y SE ACTUALIZA EL CONTADOR
   guardarCarrito(carrito);
   actualizarContadorCarrito();
   mostrarMsjAgregado(`${producto.nombre} agregado al carrito.`);
}


// FUNCION PARA ACTUALICAR LA CANTIDAD DE ITEMS DEL CARRITO
export function actualizarContadorCarrito(): void {
   const carrito = obtenerCarrito();

   // CUENTO CANTIDAD DE ITEMS EN EL CARRITO
   let cantItems = 0;
   carrito.forEach((item: any) => {
      cantItems = cantItems + item.cantidad;
   });

   // OBTENGO EL CONTADOR DEL HTML Y LE ASIGNO LA CANTIDAD DE ITEMS
   const contadorCarrito = document.getElementById("cont-carrito");
   if (contadorCarrito) contadorCarrito.textContent = String(cantItems);
}


// FUNCION PARA MOSTRAR NOTIFICACION AL AGREGAR PRODUCTO
export function mostrarMsjAgregado(mensaje: string): void {
   const divMsjAgregado = document.getElementById("msj-agregado");
   
   if (!divMsjAgregado) return;

   divMsjAgregado.textContent = mensaje;
   divMsjAgregado.classList.add("visible");

   // MUESTRO EL MENSAJE DE PRODUCTO AGREGADO 2,5 SEGUNDOS
   setTimeout(() => {
      divMsjAgregado.classList.remove("visible");
   }, 2500);
}