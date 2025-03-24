// Estructura de datos de la lista de compras (un objeto con un array vacío)
let shoppingList = { shoppingItems: [] };

// Espera a que el DOM esté completamente cargado antes de ejecutar las funciones
document.addEventListener('DOMContentLoaded', () => {
  loadItems()
    .then(() => console.log("Datos cargados correctamente"))
    .catch((error) => console.error("Error al cargar los datos:", error));
});

// Función para cargar elementos desde el servidor y almacenarlos en localStorage
async function loadItems() {
  try {
    // Hacemos una solicitud GET al servidor para obtener la lista de compras
    const response = await fetch('http://localhost:3000/shopping-list');
    
    // Si la respuesta no es exitosa, lanzamos un error
    if (!response.ok) throw new Error('Error al cargar los datos del servidor');

    // Parseamos la respuesta JSON y la almacenamos en shoppingList.shoppingItems
    shoppingList.shoppingItems = await response.json();

    // Guardamos la lista en localStorage para persistencia
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList.shoppingItems));

    // Renderizamos la lista en la interfaz de usuario
    renderList();
    console.log('Datos cargados correctamente');
  } catch (error) {
    // Si ocurre un error, lo mostramos en la consola
    console.error('Error al cargar la lista:', error);
  }
}

// Función  para guardar elementos en el servidor y localStorage
async function saveItems() {
  try {
    // Guardamos la lista actualizada en localStorage
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList.shoppingItems));
    
    // Hacemos una solicitud POST al servidor para guardar la lista
    await fetch('http://localhost:3000/shopping-list', {
      method: 'POST', // Indicamos que es una solicitud POST
      headers: { 'Content-Type': 'application/json' }, // Especificamos el tipo de contenido como JSON
      body: JSON.stringify(shoppingList.shoppingItems), // Enviamos la lista en el cuerpo de la solicitud
    });

    console.log('Elementos guardados correctamente');
  } catch (error) {
    // Si ocurre un error, lo mostramos en la consola
    console.error('Error al guardar los elementos:', error);
  }
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




