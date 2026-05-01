import { PRODUCTS, getCategories } from "../../../data/data.ts";
import { agregarAlCarrito, actualizarContadorCarrito } from "../../../utils/cartUtils.ts";
import type { ICategory } from "../../../types/category.ts";
import type { Product } from "../../../types/product.ts";

// VARIABLES GLOBALES
let catSeleccionada: number | null = null;
let textoBusqueda: string = "";
const inBusqueda = document.querySelector("#busqueda") as HTMLInputElement;
const grProductos = document.querySelector(".grilla-productos") as HTMLElement;
const ulCategorias = document.querySelector("#ul-categorias") as HTMLUListElement;

// FUNCION PARA AGREGAR EVENTO CLICK AL BOTON PARA AGREGAR PRODUCTOS
function agregarEventoAProductos(productos: Product[]):void {
   const btnAgregar = document.querySelectorAll(".card-producto button");

   btnAgregar.forEach((btn, index) => {
      btn.addEventListener("click", () => {
         agregarAlCarrito(productos[index]);
      });
   });
}

// FUNCION QUE CARGA LA GRILLA DE PRODUCTOS
function cargarProductos(productos: Product[]) {
   grProductos.innerHTML = "";

   if (productos.length === 0) {
      grProductos.innerHTML = `
         <p class="sin-resultados">
            No se encontraron productos
         </p> 
      `;
      return;
   }

   productos.forEach(prod => {
      const card = document.createElement("article");
      card.classList.add("card-producto");

      card.innerHTML = `
         <img src="/src/assets/img/${prod.imagen}" alt="${prod.nombre}">
         <h4>${prod.categorias[0].nombre}</h4>
         <h3>${prod.nombre}</h3>
         <p>${prod.descripcion}</p>

         <div class="card-footer">
            <span>$${prod.precio}</span>
            <button>Agregar</button>
         </div>
      `;

      grProductos.appendChild(card);
   });

   agregarEventoAProductos(productos);
}

// FUNCION QUE CARGA LAS CATEGORIAS
function cargarCategorias(): void {
   const categorias: ICategory[] = getCategories();

   categorias.forEach(cat => {
      
      const liCategoria = document.createElement("li");
      liCategoria.textContent = cat.nombre;
      liCategoria.dataset.id = cat.id.toString();

      ulCategorias.appendChild(liCategoria);
   })
}

function aplicarFiltros(): void {
   let prodFiltrados: Product[] = PRODUCTS;

   // FILTRO POR CATEGORIA
   if (catSeleccionada !== null) {
      prodFiltrados = prodFiltrados.filter(p =>
         p.categorias.some(c => c.id === catSeleccionada)
      );
   }

   // FILTRO POR INPUT DE BUSQUEDA
   if (textoBusqueda) {
      prodFiltrados = prodFiltrados.filter(p =>
         p.nombre.toLowerCase().includes(textoBusqueda)
      );
   }

   cargarProductos(prodFiltrados);
}


// FUNCION PRINCIPAL
function init() {
   cargarCategorias();
   cargarProductos(PRODUCTS);
   actualizarContadorCarrito();

   inBusqueda.addEventListener("input", () => {
      textoBusqueda = inBusqueda.value.toLowerCase();
      aplicarFiltros();
   });

   ulCategorias.addEventListener("click", (e) => {
      const li = e.target as HTMLElement;

      if (li.tagName !== "LI") return;

      const liActiva = ulCategorias.querySelector(".activa");
      liActiva?.classList.remove("activa");
      li.classList.add("activa");

      const id = li.dataset.id;
      catSeleccionada = id ? Number(id) : null;

      aplicarFiltros();
   });
}

init();