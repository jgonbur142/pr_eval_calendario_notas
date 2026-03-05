const btnLista = document.querySelector("#btnLista");
const btnLimpiar = document.querySelector("#btnLimppiar");
const lista = document.querySelector("#listarTareas");

const arrayMeses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

btnLista.addEventListener("click",() =>{
    lista.innerHTML=`<h2>Lista de tareas:</h2>`
    let hayTarea = false;

    //TODO: ¿Cómo cargo la lista de tareas del app_mes.js? (investigar)
    //TODO: si la lista de tareas tiene contenido -> innerHTML con la lista de tareas

    if (!hayTarea){
        lista.innerHTML = `<p>Sin tareas</p>`;
    }
});

btnLimpiar.addEventListener("click",() =>{
    if (confirm("Esta acción borrará por completo TODAS las tareas, ¿estás seguro que deseas continuar?")){
        //TODO: cuando consiga consultar la lista de tareas de app_mes.js, borrar los datos (localStorage.removeItem())
    }
});