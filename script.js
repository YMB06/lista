// Estructura de datos de la lista de compras (un objeto con un array vacío)
let shoppingList = { shoppingItems: [] };

// Espera a que el DOM esté completamente cargado antes de ejecutar las funciones
document.addEventListener('DOMContentLoaded', () => {
  loadItems()
    .then(() => console.log("Datos cargados correctamente"))
    .catch((error) => console.error("Error al cargar los datos:", error));
});

// Función para cargar elementos desde localStorage
function loadItems() {
  return new Promise((resolve, reject) => {
    // Intenta obtener los datos desde localStorage
    const localData = localStorage.getItem('shoppingList');
    if (localData) {
      shoppingList.shoppingItems = JSON.parse(localData);
      renderList(); // Renderiza la lista en el DOM con los datos locales
      resolve("Datos cargados desde localStorage");
    } else {
      reject("No hay datos en localStorage");
    }
  });
}

// Función para guardar los elementos en localStorage
function saveItems() {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem('shoppingList', JSON.stringify(shoppingList.shoppingItems)); // Guarda los datos en localStorage
      resolve("Elementos guardados exitosamente en localStorage");
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
      reject(error);
    }
  });
}

// Función para renderizar la lista en el DOM
function renderList() {
  const list = document.getElementById("myUL");
  list.innerHTML = ''; // Limpia la lista antes de renderizarla

  // Recorre cada elemento del array y lo agrega al DOM
  shoppingList.shoppingItems.forEach(({ text, checked }) => {
    const li = document.createElement("li"); // Crea un elemento <li>
    li.textContent = text; // Asigna el texto del elemento
    if (checked) li.classList.add('checked'); // Si el elemento estaba marcado, añade la clase 'checked'
    addCloseButton(li); // Agrega el botón de cerrar
    list.appendChild(li); // Agrega el elemento <li> a la lista <ul>
  });
}

// Función para agregar botón de cierre a cada elemento de la lista
function addCloseButton(li) {
  const span = document.createElement("SPAN"); // Crea un elemento <span>
  span.className = "close"; // Asigna la clase "close"
  span.textContent = "x"; // Asigna el texto "x" como botón de cierre

  // Cuando se hace clic en "x", se elimina el elemento de la lista
  span.onclick = function () {
    this.parentElement.remove(); // Elimina el elemento <li> padre
    updateListFromDOM() // Actualiza la lista de compras en el almacenamiento
      .then(() => console.log("Lista actualizada"))
      .catch(error => console.error("Error al actualizar la lista:", error));
  };
  li.appendChild(span); // Agrega el botón de cierre al elemento <li>
}

// Evento que permite marcar elementos como comprados al hacer clic en ellos
document.querySelector('ul').addEventListener('click', (ev) => {
  if (ev.target.tagName === 'LI') { // Verifica que se haya hecho clic en un <li>
    ev.target.classList.toggle('checked'); // Alterna la clase "checked"
    updateListFromDOM() // Actualiza la lista después del cambio
      .then(() => console.log("Estado de la lista actualizado"))
      .catch(error => console.error("Error al actualizar estado:", error));
  }
}, false);

// Función para agregar un nuevo elemento a la lista
function newElement() {
  const input = document.getElementById("myInput"); // Obtiene el input de usuario
  const inputValue = input.value.trim(); // Elimina espacios al inicio y final

  if (!inputValue) { // Si el input está vacío, muestra una alerta y detiene la ejecución
    alert("No has escrito nada");
    return;
  }

  const li = document.createElement("li"); // Crea un nuevo <li>
  li.textContent = inputValue; // Asigna el texto ingresado por el usuario
  addCloseButton(li); // Agrega botón de cierre
  document.getElementById("myUL").appendChild(li); // Agrega el <li> a la lista <ul>
  input.value = ""; // Limpia el campo de entrada

  // Agrega el nuevo elemento al array de la lista de compras
  shoppingList.shoppingItems.push({ text: inputValue, checked: false });

  // Guarda los cambios en localStorage
  saveItems()
    .then(() => console.log("Nuevo elemento guardado"))
    .catch(error => console.error("Error al guardar nuevo elemento:", error));
}


// Función para actualizar la lista en localStorage
function updateListFromDOM() {
  return new Promise((resolve, reject) => {
    const list = document.getElementById("myUL"); // Obtiene la lista del DOM

    // Mapea los elementos del DOM al array de objetos en shoppingList
    shoppingList.shoppingItems = [...list.children].map(({ textContent, classList }) => ({
      text: textContent.slice(0, -1), // Extrae el texto, eliminando la "x" del botón de cierre
      checked: classList.contains('checked') // Verifica si está marcado
    }));

    // Guarda los cambios en localStorage
    saveItems()
      .then(resolve) // Si todo va bien, resuelve la promesa
      .catch(reject); // Si hay un error, lo rechaza
  });
}




