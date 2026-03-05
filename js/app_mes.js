const params = new URLSearchParams(window.location.search);
const mesAhora = params.get('mes');
const inputNota = document.querySelector("#nuevaNota");
const btnAdd = document.querySelector("#addNota");
const listaNotas = document.querySelector("#listaNotas");
const btnBorrar = document.querySelector("#btnBorrar");

let tareas = cargarMes();

function cargarMes(){
    const raw = localStorage.getItem(mesAhora);

    if(!raw) return [];

    try {
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];

    }catch(error){
        console.error("JSON inválido", error);
        return[];
    }


};

init();

function init(){
    render();
};

//TODO: revisar, no funciona el render (fallo en forEach¿?)
function render(){
    listaNotas.innerHTML="";
    tareas.forEach(tarea,index){
        const li = document.createElement("li");
        li.innerHTML=`
        <span>${tarea}</span>
        <button onclick="borrarTarea(${index})">Borrar</button>
        `;
        listaNotas.appendChild(li);
    }
};

btnAdd.addEventListener("click",() =>{
    if (inputNota.value.trim() != ""){
        tareas.push(inputNota.value);
        localStorage.setItem(mesAhora),JSON.stringify(tareas);
        inputNota.value="";
        render();
    }
});

btnBorrar.addEventListener("click",() => {
    if (inputNota.value.trim() != ""){
        localStorage.removeItem(mesAhora);
        inputNota.value="";
        render();
    }
});

render();