const params = new URLSearchParams(window.location.search);
const mesAhora = params.get("mes");
const inputNota = document.querySelector("#nuevaNota");
const btnAdd = document.querySelector("#addNota");
const listaNotas = document.querySelector("#listaNotas");
const nombreMes = document.querySelector("#nombreMes");
const borrarGeneral = document.querySelector("#btnBorrarGeneral");

function cargarMes(mes){
    arrayMes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    return arrayMes[mes];
}
nombreMes.innerHTML=cargarMes(mesAhora);

//const btnBorrar = document.querySelector("#btnBorrar");

//const KEY_CALENDAR = "calendarioNotas123";

/*
//esto para el localStorage
function cargarMes(){
    const raw = localStorage.getItem(KEY_CALENDAR);

    if(!raw) return [];

    try {
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];

    }catch(error){
        console.error("JSON inválido", error);
        return[];
    }
};
*/

btnAdd.addEventListener("click",() =>{
    const li = document.createElement("li");
    if (inputNota.value.trim() != ""){
        li.innerHTML = `
        <span>${inputNota.value}</span>
        `;
        listaNotas.appendChild(li);
        inputNota.value="";
    
    }
});

//TODO: crear boton dentro de la lista para borrar solo esa tarea
function borrarLista(){

};

//TODO: crear boton dentro de la lista para editar el contenido de esa tarea
function editarLista(){

};

borrarGeneral.addEventListener("click",() => {

});
