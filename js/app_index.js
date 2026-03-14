const btnLista = document.querySelector("#btnLista");
const btnLimpiar = document.querySelector("#btnLimpiar");
const lista = document.querySelector("#listarTareas");
const cuadroMes = document.querySelectorAll(".cuadroMes");

const KEY_CALENDAR = "calendarioNotas123";
let allNotas=null;
const arrayMes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

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

function cargarNotas(){
    const datos = localStorage.getItem(KEY_CALENDAR);
    return datos ? JSON.parse(datos) : [];
}

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

btnLimpiar.addEventListener("click",() =>{ 
    
    if (confirm("¿Estás seguro que desea eliminar todas las notas del calendario?")){
        localStorage.removeItem(KEY_CALENDAR);
        lista.innerHTML="";
        init();
    }

});

init();