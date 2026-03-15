# Práctica evaluable - Calendario de notas
Jorge González Burgos - 1ºDAM

## Descripción
El proyecto consta de la siguiente estructura: 

```
/
├── index.html
├── mes.html
├── css/
│   └── styles.css
└── js/
│    ├── app_index.js
│    └── app_mes.js
└── assets/
    └── (capturas)
```
### index.html
En `index.html` tenemos una vista general del calendario, mostrando el año y los distintos meses. Podemos distinguir si un mes tiene notas o no por su color y por el texto que aparece debajo de cada mes, en su propio cuadro.
(captura 1)

También cuenta con dos botones, uno que dice "Listar Tareas" que se encarga de mostrar todas las notas que tengamos en los diferentes meses. Si no hay tareas, también lo especifica.
(captura 2)
(captura 3)

El otro botón que tiene el index se trata de "Limpiar Calendario", cuya función es borrar todas las notas en todos los meses. Primero pregunta si estamos seguros de querer borrar todas las notas, y después las elimina.
(captura 4)
(captura 5)

---

### mes.html
Si nos encontramos en `index.html` y pulsamos en cualquiera de los meses, nos llevará a `mes.html`, de forma que si pulsamos, por ejemplo, en enero, nos llevará a `mes.html` con los datos de dicho mes.
(captura 6)

En esta página tenemos un formulario que sirve para introducir el título de la nota y su descripción, ambas obligatorias. Cuando pulsamos en "Añadir nota" se crea una lista debajo del formulario con los datos introducidos.
(captura 7)
(captura 8)

A su vez, cuando tenemos una nota creada en un mes, aparecen dos botones nuevos. El botón "Editar" lleva la información de la nota al formulario y nos permite editarla y guardar los cambios, sustituyendo la información en la nota ya existente.
(captura 9)
(captura 10)

El otro botón, "Eliminar", hace lo mismo que el botón elimnar de `index.html` solo que a nivel de esa nota individual. Pregunta por una confirmación y entonces dicha nota.
(captura 11)
(captura 12)

Por último, tenemos el botón "Volver al calendario" que nos lleva de vuelta a `index.html`.

---

### app_mes.js
Pasando ahora a javaScript, empezando por el relacionado a `mes.html`, explicaré las funciones utilizadas para la lógica de la web:

``` js
function cargarMes(mes){
    return arrayMes[mes];
}
```
* **cargarMes(mes)** se encarga de devolver el mes correspondiente al que hemos clicado desde `index.html`. Para ello, en el html del index, el enlace de cada mes está construidode la siguiente forma: `a href="mes.html?mes=0"` (enero) y después en `app_mes.js`
uso las constantes `params` y `mesAhora` para identificar cada número y después utilizarlo para la posición en el array `arrayMes` y distinguir de qué mes en concreto estamos hablando.
(captura 13)
(cpatura 14)

``` js
function cargarNotas(){
    const datos = localStorage.getItem(KEY_CALENDAR);
    return datos ? JSON.parse(datos) : [];
}
```
* **cargarNotas()** se encarga de consultar el localStorage y devolver los datos si los hubiera y si no, un array vacío. Utiliza la constante `KEY_CALENDAR` con la clave utilziada para guardar datos en localStorage.

``` js
function guardarNotas(notas){
    localStorage.setItem(KEY_CALENDAR, JSON.stringify(notas));
}
```
* **guardarNotas(notas)** sirve para "introducir" en el localStorage la nota que se le pasa por parámetro.

``` js
function renderNotas(){
    const notasMes = [];

    allNotas.forEach(nota =>{
        if (nota.mes === mesAhora){
            notasMes.push(nota);
        }
    });

    listaNotas.innerHTML = "";
    notasMes.forEach(nota => {
        const li = document.createElement("li");
        li.innerHTML= `
            <div class="nota">
                <div>
                    <h3>${nota.titulo}</h3>
                    <p>${nota.desc}</p>
                </div>
                <button class ="btnEditar" onclick="editarNota(${nota.id})">Editar</button>
                <button class ="btnBorrar" onclick="eliminarNota(${nota.id})">Eliminar</button>
            </div>
        `;
        listaNotas.appendChild(li);
    });
}
```
* La función de **renderNotas()** es dibujar en la web las actualizaciones en las notas que se hayan introducido. `allNotas` es un array creado en `app_index.js` que guarda todas las notas y lo utilizo en esta parte parar recorrerlo con un *forEach()* y que
cuando coincida el mes en el que estamos, con el mes de `allNotas`, se haga *push* de dicha nota. Más abajo recorro el array con las notas de ese mismo mes (`notasMes`) y creo con *innerHTML* la estructura de la nota cuando se crea (visualmente es cuando se pulsa
el botón de "Añadir nota").

``` js
formNota.addEventListener("submit", (event)=>{
    event.preventDefault();

    const titulo = tituloNota.value.trim();
    const desc = descNota.value.trim();

    if (titulo ==="" || desc ===""){
        errorMsj.innerHTML=`<h3>El título y la descripción son obligatorios.</h3>`
        return;
    }

    if (editando !== null){
        allNotas.forEach(nota =>{
            if (nota.id === editando){
                nota.titulo = titulo;
                nota.desc = desc;
            }
        });

        editando = null;
        btnAdd.textContent="Añadir nota";

    }else{
        const nuevaNota = {
            id: Date.now(),
            mes: mesAhora,
            titulo: titulo,
            desc: desc
        };
        allNotas.push(nuevaNota);
    }

    guardarNotas(allNotas);
    formNota.reset();
    errorMsj.innerHTML="";
    renderNotas();

});
```
* La función `formNota` se llama cuando en el formulario pulsamos el botón "Añadir nota" (lo primero es hacer que el formulario no se actualice automáticamente), el primer *if* sirve de validación para que no se pueda introducir una nota sin título ni descripción, el segundo
(`if (editando !== null)`) sirve para comprobar que el formulario no está en modo "edición" (cuando se pulsa el botón "Editar" en una nota), lo utilizo para para que no se cree una nota nueva cada vez que se quiere editar una misma nota. Si no está en modo "edición", entonces
sí que se crea una nota nueva, con la constante `nuevaNota` que guarda los datos de la nota según un *id*, *mes*, *título* y *descripción*. Cuando se ha creado o editado la nota, se llama a `guardarNotas(allNotas)`, se resetea el formulario con `formNota.reset()`, limpio
el mensaje de error (`errorMsj.innerHTML=""`) y dibujamos la actualización llamando a `renderNotas()`.

``` js
window.eliminarNota = function(id){
    if (confirm("¿Está seguro que desea borrar esta nota?")){
        
        let notasNoBorrar = [];

        allNotas.forEach(nota =>{
            if (nota.id !== id){
                notasNoBorrar.push(nota);
            }
        });

        allNotas = notasNoBorrar;
        guardarNotas(allNotas);
        renderNotas();
    }
};
```
* Esta función se llama cuando se pulsa el botón de "Eliminar" en una nota creada. Este botón se crea en el *innerHTML* de la función `renderNotas()` y de la siguiente forma: `<button class ="btnBorrar" onclick="eliminarNota(${nota.id})">Eliminar</button>`. Como es una etiqueta que
no está desde el principio en `mes.html`, sino que se crea durante el flujo de la página, tengo que llamar a la función usando *window* (igual que hice para diferenciar cada mes dentro de `index.html`). Lo que hace es buscar en el array con todas las notas (`allNotas`) las notas
que no coincidan comparando sus id y a esas les hace un *push*, dejando a las que coinciden sus id (que será la nota que queremos borrar) fuera del array. Termina llamando a `guardarNotas(allNotas)` y `renderNotas()`.

``` js
window.editarNota = function(id){
    let editNota;

    allNotas.forEach(nota =>{
        if (nota.id === id){
            editNota = nota;
        }
    });

    if (editNota !== null){
        tituloNota.value = editNota.titulo;
        descNota.value = editNota.desc;

        editando=id;

        btnAdd.textContent = "Guardar cambios";

    }
}
```
* Similar con la anterior, esta función se encarga de comparar los id de la nota que queremos editar con todos los id de las notas en `allNotas` y cuando coincide, la cambia. Aquí es donde juego con `editando` y su valor nulo. En mitad del proceso de editar la nota, cuando
sustituyo los valores del título y la descripción, también cambio el valor de `editando` para que no sea nulo y luego entre en el *if*  de `fromNota` (`if (editando !== null)`), para evitar lo que dije antes, que no se cree una nota nueva cada vez, sino que se edite la que
ya existe.

---

### app_index.js
Para terminar, comentaré por encima también el contenido del javaScript que utiliza `index.html`

``` js
function cargarNotas(){
    const datos = localStorage.getItem(KEY_CALENDAR);
    return datos ? JSON.parse(datos) : [];
}
```
* Esta función es calcada a su omónima en `app_mes.js` y sirve para lo mismo, carga los datos (si los hay) en un array y si no, devuelve uno vacío.

``` js
btnLista.addEventListener("click", ()=>{ 

    allNotas=cargarNotas();

    if (allNotas.length === 0){
        lista.innerHTML += "<h3>Sin notas guardadas</h3>";
        return;
    }

    lista.innerHTML = "<h3>Lista global de tareas:</h3>";

    let ul = document.createElement("ul");
    allNotas.forEach(nota =>{
        let li = document.createElement("li");
        li.innerHTML = `
            <div class="nota">
                <strong>${arrayMes[nota.mes]}:</strong> ${nota.titulo} - ${nota.desc}
            </div>
        `;
        ul.appendChild(li);
    });

    lista.appendChild(ul);
});
```
* Esta función hace que cuando pulsamos el botón "Listar Tareas", cargue las notas del array `allNotas` y las muestre si las hay, en caso contrario mostrará un mensaje diciendo que no hay notas guardadas.

``` js
btnLimpiar.addEventListener("click",() =>{ 
    
    if (confirm("¿Estás seguro que desea eliminar todas las notas del calendario?")){
        localStorage.removeItem(KEY_CALENDAR);
        lista.innerHTML="";
        init();
    }

});
```
* Esta función se llama cuando pulsamos el botón "Limpiar" y su funcionamiento es muy simple, primero pide confirmacíon del usuario y cuando la tiene, borra del localStorage `KEY_CALENDAR` y toda la información mostrada en la lista.

``` js
function init(){

    allNotas=cargarNotas();

    cuadroMes.forEach((cuadro, index) =>{
        let notasMes = [];

        allNotas.forEach(nota =>{
            if (nota.mes === index){
                notasMes.push(nota);
            }
        });

        const infoTarea = cuadro.querySelector(".tareasInfo");

        if(notasMes.length > 0){
            cuadro.classList.add("conNotas");
            cuadro.classList.remove("sinNotas");
            infoTarea.textContent = `${notasMes.length} tarea(s) pendiente(s)`;
        }else{
            cuadro.classList.add("sinNotas");
            cuadro.classList.remove("conNotas");
            infoTarea.textContent = "0 tareas pendientes";
        }
    });

}
```
* Esta función se llama al iniciar la página y se encarga de comprobar si hay algún mes con notas guardadas y reflejarlo en su cuadro correspondiente. Para ello recorro cada cuadro (`cuadroMes`) y compruebo con un segundo *forEach* para relacionar las notas de un mes
concreto con su número, comparando su mes y su index (como dije al principio, 0 = enero). Después hago un *if* para comprobar si hay alguna nota en un mes concreto (usando *length*) y edito la clase del html, para luego mostrar con un color u otro en el css, y mostrar
también el número de tareas pendientes.

---

### styles.css
El css lo he estructurado en varias partes, algunas cosas de forma general (body, header, *), luego hago el estilo de las cajas del calendario, los botones, los estilos específicos para cosas de `mes.html` (como el formulario) y al final una pequeña parte para adaptar
las dimensiones a pantallas más pequeñas pensando en móviles y tablets, para hacer más cómodo el uso de la web en estos dispositivos.

``` css
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: system-ui, Arial, sans-serif;
  margin: 0px;
  padding: .2em;
  background-color: #e2e2e2;
  color: black;
}

.mainHeader{
  text-align: center;
  margin-bottom: .4em;
}
```

``` css
/*
    --------------------
    cajas del calendario
    --------------------
*/
.calendarioGrid{
  display: grid;
  grid-template-columns: repeat(6,1fr);
  gap: 20px;
  max-width:1100px ;
  margin: 0 auto;
}

.cuadroMes{
  text-decoration: none;
  color: inherit;
  padding: .2em;
  border-radius: 15px;
  text-align: center;
  transition: transform .2s, box-shadow .2s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 1.2em;
}

.cuadroMes:hover{
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.cuadroMes h2{
  margin-bottom: .1em;
  font-size: 1.2em;
}

.tareasInfo{
  font-size: .8em;
  opacity: .8;
}

/*según si el mes tiene alguna nota o no, la clase cambiará usando js*/
.conNotas{
  background-color: #d4edda;
  border: 2px solid #28a745;
}

.sinNotas{
  background-color: #e9ecef;
}

#errorMensaje{
  margin: 2em 0;
  text-align: center;
  color: #e74c3c;
}
```

``` css
/*
    -------
    Botones
    -------
*/

.accionesBotones{
  margin-top: 1.5em;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 1em;
}

button{
  padding: 1.2em 1.5em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity .2s;
}

button:hover{
  opacity: .8;
}

#listarTareas ul{
  list-style: none;
}

#listarTareas h3{
  text-align: center;
  margin: 2em 0 .5em 0;
}
```

``` css
/*
    -------------------
    Estilos de mes.html
    -------------------
*/

.headerMes{
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1.2em 1.5em;
  box-shadow: 0 2px 10px rgba(0,0,0,.5);
  margin-bottom: 1em;
}

.headerMes h1{
  margin: 0;
  font-size: 3em;
  text-transform: capitalize;
}

.btnVolver{
  text-decoration: none;
  color: #4a90e2;
  font-weight: bold;
  padding: .8em 1em;
  font-weight: 1.6em;
  font-size: .9em;
}

.btnVolver:hover{
  color: #1b59a5;
}

.seccionNotas form, .nota{
  width: 50%;
  margin: auto;
  gap: 1em;
  max-width: 600px;
  margin-bottom: 1.2em;
  background-color: white;
  padding: 1.2em;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

#listaNotas{
  list-style: none;
}

.nota{
  list-style: none;
  background-color: #e9ecef;
}

.seccionNotas textarea, input{
  width: 100%;
  margin-top: .5em;
}

.btnBorrar, .btnEditar{
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  width: 49%;
}

.btnBorrar{
  color: #e74c3c;
}

.btnEditar{
  color:#28a745;
}
```

``` css
/*
    ---------------------------------
    Adaptación para móviles y tablets
    ---------------------------------
*/

@media (max-width: 900px){
  .calendarioGrid {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
}

@media (max-width: 600px){
  .calendarioGrid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .cuadroMes {
    padding: 1.2em .5em;
    min-height: 90px;
  }

  .cuadroMes h2 {
    font-size: 1.2em;
  }

  .tareasInfo {
    font-size: .8em;
  }

  .nota, .seccionNotas form {
    width: 95%;
  }

  .accionesBotones {
    flex-direction: column;
    align-items: center;
  }

  button {
    width: 90%;
  }
}
```














