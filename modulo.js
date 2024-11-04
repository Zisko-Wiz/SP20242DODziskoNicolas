import {Vehiculo} from "./ClassVehiculo.js";
import{Camion}from"./ClassCamion.js";
import{Auto}from"./ClassAuto.js";

const colorRojo = "rgb(246, 76, 76)";
var arrayVehiculos;
var datos = document.getElementById("datos");
var abm = document.getElementById("abm");
var formCamion = document.getElementById("formCamion");
var formAuto = document.getElementById("formAuto");
var dropTipo = document.getElementById("select_tipo");
var btnAgregar = document.getElementById("btn_agregar");
var btnAceptar = document.getElementById("btn_aceptar");
var btnCancelar = document.getElementById("btn_cancelar");
var txtAnoFabricacion = document.getElementById("txt_anoFabricacion");
var txtModelo= document.getElementById("txt_modelo");
var txtVelMax = document.getElementById("txt_velMax");
var txtCarga = document.getElementById("txt_carga");
var txtAutonomia = document.getElementById("txt_autonomia");
var txtCantidadPuertas = document.getElementById("txt_cantidadPuertas");
var txtAsientos = document.getElementById("txt_asientos");
var lblAdvertenciaInvalido = document.getElementById("advertenciaInvalido");
var txtId = document.getElementById("txt_id");
var spinner = document.getElementById("spinner");
var errorScreen = document.getElementById("errorScreen");
var modoAceptar = "modificar";

//funciones

function cambiarVisibilidadDelSpinner()
{
    if (spinner.style.display == "none")
    {
        spinner.style.display = "block"
    }
    else
    {
        spinner.style.display = "none"
    }
}

function mostrarAlerta()
{
    window.alert("No se pudo realizar la operación");
}

function getLista(){
    let http = new XMLHttpRequest();
    http.onreadystatechange = function(){
        if (http.readyState==4 && http.status==200)
        {
            arrayVehiculos = deserializarJson(http.response);
            dibujarTabla(arrayVehiculos);
            datos.style.display="block";
            cambiarVisibilidadDelSpinner()
        }else
        {
            if (http.readyState==4)
            {
                datos.style.display = "none";
                errorScreen.style.display="block";
                let p = document.createElement("p");
                let txt = document.createTextNode("No encontrado");
                p.appendChild(txt);
                errorScreen.appendChild(p);
                cambiarVisibilidadDelSpinner()
            }
        }                
    }
    
    http.open("GET","https://examenesutn.vercel.app/api/VehiculoAutoCamion");
    http.send();
}

function pedirAlta()
{
    cambiarVisibilidadDelSpinner()
    let e = crearVehiculo();

    if (e != "error")
    {
        let promesa = new Promise(async (exito, fracaso)=>{
            try {
                let respuesta = await fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(e.getAll(false))
                    });

                if (respuesta.ok)
                {
                    let contenido = await respuesta.json();
                    e.id = contenido["id"];
                    exito();
                }else
                {
                    console.log(`Error : ${respuesta.status}`);
                    fracaso();
                }
            } catch (e)
            {
                console.log(e);
            }
        })
        .then(()=>{
            
            // e.id = respuesta.json["id"];
            arrayVehiculos.push(e);
        })
        .catch(mostrarAlerta)
        .finally(()=>{
            cambiarVisibilidadDelSpinner();
            cambiarForm();
            limpiarForm();
        });
    }
    else
    {
        cambiarVisibilidadDelSpinner();
    }
}

function pedirModificar()
{
    cambiarVisibilidadDelSpinner();
    
    let e = crearVehiculo();
    if (e != "error")
    {
        fetch('https://examenesutn.vercel.app/api/VehiculoAutoCamion')
        .then(response => {
        if (response.ok)
        {
            console.log('Éxito');
        } else
        {
            console.log(`Error : ${response.status}`);
        }
        })
        .then(modificar)
        .catch(mostrarAlerta)
        .finally(()=>{
            cambiarVisibilidadDelSpinner();
            cambiarForm();
            limpiarForm();
        });
    }
    else
    {
        cambiarVisibilidadDelSpinner();
    }
}

function pedirEliminar(id)
{
    cambiarVisibilidadDelSpinner();
    
    let promesa = new Promise(async (exito, fracaso)=>{
        try {
            let respuesta = await fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                'Content-Type': 'application/json'
                },
                body:'{"id":' + id + '}'
                })
    
            if (respuesta.ok)
            {
                modoAceptar = "eliminar";
                exito();
            }else
            {
                console.log(`Error : ${respuesta.status}`);
                fracaso();       
            }
        } catch (e)
        {
            console.log(e);
        }
    })
    .then(borrar)
    .catch(mostrarAlerta)
    .finally(()=>{
        cambiarVisibilidadDelSpinner();
        cambiarForm();
    });
}


//legacy

function getUltimaId()
{
    let arrayIds = [];

    arrayVehiculos.forEach(element =>{
        arrayIds.push(element.id);
    });

    let arrayOrdenado = arrayVehiculos.sort((a,b)=>{
        if (a.id > b.id)
        {
            return -1;
        }
        else if (a.id < b.id)
        {
            return 1;
        }
        else
        {
            return 0
        }
    })

    return arrayOrdenado[0].id;
}

function deserializarJson(json)
{
    var arrayDeObjetos = JSON.parse(json);
    var arrayCamiones = [];
    var arrayAutos = [];

    var i = 0;
    while (i < arrayDeObjetos.length)
    {
        if(arrayDeObjetos[i].asientos == undefined)
        {
            arrayCamiones.push(Object.assign(new Camion(), arrayDeObjetos[i]));
        }

        if(arrayDeObjetos[i].carga == undefined)
        {
            arrayAutos.push(Object.assign(new Auto(), arrayDeObjetos[i]));
        }

        i++;
    }

    var arrayVehiculos = arrayCamiones.concat(arrayAutos);
    return arrayVehiculos;
}

function dibujarTabla(lista)
{
    //ordenar array por ID
    arrayVehiculos.sort((x,y)=> {
        if (x.id > y.id)
        { 
            return 1;
        } 
        else if (x.id < y.id) 
        { 
            return -1;
        } else 
        { 
            return 0;
        }
    });
    //remover tabla
    document.getElementById("tablaVehiculos").remove();
    //crear nueva tabla
    let nuevaTabla = document.createElement("table");
    //crear headers
    var dataHeaders = [];
    dataHeaders = Vehiculo.generarListaCompletaDeAtributos();    
    //crear rows
    var dataRows = [];
    lista.forEach(element => {
        if(element.asientos == undefined)
        {
            element.asientos = "N/A";
        }

        if(element.carga == undefined)
        {
            element.carga = "N/A";
        }

        if(element.cantidadPuertas == undefined)
        {
            element.cantidadPuertas = "N/A";
        }
        
        if(element.autonomia == undefined)
        {
            element.autonomia = "N/A";
        }
    });

    lista.forEach(element => {
        dataRows.push(element.getAll());
    });

    nuevaTabla.setAttribute("id", "tablaVehiculos");
    generateTableHead(nuevaTabla, dataHeaders);
    generateTable(nuevaTabla, dataRows);
    //agregar nueva tabla
    document.getElementById("divTabla").appendChild(nuevaTabla);
}

function generateTableHead(table, data) 
{
    let thead = table.createTHead();
    let row = thead.insertRow();

    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }

    let thModificar = document.createElement("th");
    let textModificar = document.createTextNode("Modificar");
    thModificar.appendChild(textModificar);
    row.appendChild(thModificar);

    let thEliminar = document.createElement("th");
    let textEliminar = document.createTextNode("Eliminar");
    thEliminar.appendChild(textEliminar);
    row.appendChild(thEliminar);

}

function generateTable(table, data)
{
    for (let element of data)
    {
        let row = table.insertRow();
        for (let key in element)
        {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }

        let btnModificar = document.createElement("button");
        btnModificar.setAttribute("type", "button");
        let textModificar = document.createTextNode("Modificar");
        btnModificar.appendChild(textModificar);
        let cellMod = row.insertCell();
        cellMod.appendChild(btnModificar);
        btnModificar.addEventListener("click", cambiarForm);
        btnModificar.addEventListener("click", ()=>{popularForm(element.id)});
        btnModificar.addEventListener("click", ()=>{document.title="Modificar";});
        btnModificar.addEventListener("click", ()=>{modoAceptar="modificar";});

        let btnEliminar = document.createElement("button");
        btnEliminar.setAttribute("type", "button");
        let textEliminar = document.createTextNode("Eliminar");
        btnEliminar.appendChild(textEliminar);
        let cellDel = row.insertCell();
        cellDel.appendChild(btnEliminar);
        btnEliminar.addEventListener("click", cambiarForm);
        btnEliminar.addEventListener("click", ()=>{popularForm(element.id)});
        btnEliminar.addEventListener("click", ()=>{document.title="Eliminar";});
        btnEliminar.addEventListener("click", ()=>{modoAceptar="eliminar";});
    }
}

function cambiarForm()
{
    if (datos.style.display == "none")
    {
        document.title = "Segundo Parcial";
        actualizarTabla();
        datos.style.display = "block";
    }
    else
    {
        datos.style.display = "none";
    }

    if (abm.style.display == "none")
    {
        abm.style.display = "block";
        actualizarForm();
        txtId.value = getUltimaId() + 1;
    }
    else
    {
        abm.style.display = "none";
        dropTipo.disabled = false;
    }
}

function popularForm(idVehiculo)
{
    let p = arrayVehiculos.filter((elemento) => {return elemento.id == idVehiculo});

    txtId.value = p[0].id;
    txtAnoFabricacion.value = p[0].anoFabricacion;
    txtModelo.value = p[0].modelo;
    txtVelMax.value = p[0].velMax;

    if (p[0] instanceof Camion)
    {
        dropTipo.value = "camion";
        dropTipo.disabled = true;
        actualizarForm()
        txtCarga.value = p[0].carga;
        txtAutonomia.value = p[0].autonomia;
    }
    else if (p[0] instanceof Auto)
    {
        dropTipo.value = "auto";
        dropTipo.disabled = true;
        actualizarForm()
        txtCantidadPuertas.value = p[0].cantidadPuertas;
        txtAsientos.value = p[0].asientos;
    }
}

function crearVehiculo()
{
    if (dropTipo.value == "camion")
    {
        if (validarDatosIngresados())
        {
            let e = new Camion(parseInt(txtId.value), txtModelo.value, parseInt(txtAnoFabricacion.value), parseInt(txtVelMax.value), parseInt(txtCarga.value), parseInt(txtAutonomia.value));
            return e;
        }
        else
        {
            lblAdvertenciaInvalido.style.display = "block";
            return "error";
        }

    }
    else if (dropTipo.value == "auto")
    {
        if (validarDatosIngresados())
        {
            let c = new Auto(parseInt(txtId.value), txtModelo.value, parseInt(txtAnoFabricacion.value), parseInt(txtVelMax.value), parseInt(txtCantidadPuertas.value), parseInt(txtAsientos.value));
            return c;
        }
        else
        {
            lblAdvertenciaInvalido.style.display = "block";
            return "error";
        }
    }
}

function validarDatosIngresados()
{
    let x = true;

    if (!isNaN(parseInt(txtAnoFabricacion.value)) && isFinite(txtAnoFabricacion.value) && !/\./.test(txtAnoFabricacion.value) && parseInt(txtAnoFabricacion.value) > 1985)
        {
            txtAnoFabricacion.style.backgroundColor = "white";
        }
        else
        {
            txtAnoFabricacion.style.backgroundColor = colorRojo;
            if (parseInt(txtAnoFabricacion.value) <= 15 && !/\./.test(txtAnoFabricacion.value))
            {
                lblAdvertenciaInvalido.textContent += ". VelMax > 15";
            }
            x = false;
        }

    if (txtModelo.value == "")
    {
        txtModelo.style.backgroundColor = colorRojo;
        x = false;
    }
    else
    {
        txtModelo.style.backgroundColor = "white";
    }

    if (!isNaN(parseInt(txtVelMax.value)) && isFinite(txtVelMax.value) && !/\./.test(txtVelMax.value) && parseInt(txtVelMax.value) > 0)
    {
        txtVelMax.style.backgroundColor = "white";
    }
    else
    {
        txtVelMax.style.backgroundColor = colorRojo;
        x = false;
    }

    if (formCamion.style.display == "none" || !isNaN(parseInt(txtCarga.value)) && isFinite(txtCarga.value) && parseInt(txtCarga.value) > 0)
    {
        txtCarga.style.backgroundColor = "white";
    }
    else
    {
        txtCarga.style.backgroundColor = colorRojo;
        x = false;
    }

    if (formCamion.style.display == "none" || !isNaN(parseInt(txtAutonomia.value)) && isFinite(txtAutonomia.value) && parseInt(txtAutonomia.value) > 0)
    {
        txtAutonomia.style.backgroundColor = "white";
    }
    else
    {
        txtAutonomia.style.backgroundColor = colorRojo;
        x = false;
    }

    if (formAuto.style.display == "none" || !isNaN(parseInt(txtCantidadPuertas.value)) && isFinite(txtCantidadPuertas.value) && parseInt(txtCantidadPuertas.value) > 2)
    {
        txtCantidadPuertas.style.backgroundColor = "white";
    }
    else
    {
        txtCantidadPuertas.style.backgroundColor = colorRojo;
        x = false;
    }

    if (formAuto.style.display == "none" || !isNaN(parseInt(txtAsientos.value)) && isFinite(txtAsientos.value) && !/\./.test(txtAsientos.value) && parseInt(txtAsientos.value) > 2)
    {
        txtAsientos.style.backgroundColor = "white";
    }
    else
    {
        txtAsientos.style.backgroundColor = colorRojo;
        x = false;
    }

    return x;
}

function modificar()
{
    if (validarDatosIngresados())
    {
        arrayVehiculos.forEach((item) => {
            if (item.id == txtId.value)
            {
                item.modelo = txtModelo.value;
                item.anoFabricacion = txtAnoFabricacion.value;
                item.velMax = txtVelMax.value;

                if (dropTipo.value == "auto")
                {
                    item.cantidadPuertas = parseInt(txtCantidadPuertas.value);
                    item.asientos = txtAsientos.value;
                }
                else if(dropTipo.value == "camion")
                {
                    item.autonomia = parseInt(txtAutonomia.value);
                    item.carga = parseInt(txtCarga.value);
                }
            }
        });
    }
    else
    {
        lblAdvertenciaInvalido.style.display = "block";
    }
}


//eventos

function borrar()
{
    let indexVehiculo = -1;

    for (let i = 0; i < arrayVehiculos.length; i++) {
        if (arrayVehiculos[i].id == txtId.value)
        {
            indexVehiculo = i;
            break;
        }
    }

    arrayVehiculos.splice(indexVehiculo, 1);
}

function aceptar()
{
    let p = arrayVehiculos.filter((elemento) => {return elemento.id == txtId.value});

    if(p.length == 0)
    {
        pedirAlta();
    }
    else if (modoAceptar == "modificar")
    {
        pedirModificar();
    }
    else if (modoAceptar == "eliminar")
    {
        pedirEliminar(parseInt(txtId.value));
    }

}

function actualizarTabla()
{
    dibujarTabla(arrayVehiculos);
}

function actualizarForm()
{
    if (dropTipo.value == "camion")
    {
        formAuto.style.display = "none";
        formCamion.style.display = "block";
    }
    else if (dropTipo.value == "auto")
    {
        formCamion.style.display = "none";
        formAuto.style.display = "block";
    }

    limpiarForm(false);
}

function limpiarForm(completo = true)
{
    lblAdvertenciaInvalido.style.display = "none";
    
    if (completo)
    {
        txtAnoFabricacion.value="";
        txtAnoFabricacion.style.backgroundColor = "white";
        txtModelo.value="";
        txtModelo.style.backgroundColor = "white";
        txtVelMax.value="";
        txtVelMax.style.backgroundColor = "white";
    }

    txtCantidadPuertas.value="";
    txtCantidadPuertas.style.backgroundColor = "white";
    txtAutonomia.value="";
    txtAutonomia.style.backgroundColor = "white";
    txtAsientos.value="";
    txtAsientos.style.backgroundColor = "white";
    txtCarga.value="";
    txtCarga.style.backgroundColor = "white";
}

addEventListener("load", getLista);

dropTipo.addEventListener("change", actualizarForm);
btnAgregar.addEventListener("click", cambiarForm);
btnAgregar.addEventListener("click", limpiarForm);
btnAgregar.addEventListener("click", ()=>{document.title="Alta";});
btnAceptar.addEventListener("click", ()=>aceptar(modoAceptar));
btnCancelar.addEventListener("click", cambiarForm);
btnCancelar.addEventListener("click", limpiarForm);



