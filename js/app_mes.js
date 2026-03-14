const params = new URLSearchParams(window.location.search);
const mesAhora = Number(params.get("mes"));
const KEY_CALENDAR = "calendarioNotas123";

const formNota = document.querySelector("#formularioNotas");
const tituloNota = document.querySelector("#tituloNota");
const descNota = document.querySelector("#descNota");
const errorMsj = document.querySelector("#errorMensaje");
const listaNotas = document.querySelector("#listaNotas");
const btnAdd = document.querySelector("#addNota");

const arrayMes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
let allNotas = cargarNotas();
let editando=null;

function cargarMes(mes){
    return arrayMes[mes];
}
nombreMes.innerHTML=cargarMes(mesAhora);

function cargarNotas(){
    const datos = localStorage.getItem(KEY_CALENDAR);
    return datos ? JSON.parse(datos) : [];
}

function guardarNotas(notas){
    localStorage.setItem(KEY_CALENDAR, JSON.stringify(notas));
}

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

renderNotas();
