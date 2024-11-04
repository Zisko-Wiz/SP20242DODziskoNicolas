import { Vehiculo } from "./ClassVehiculo.js";

export class Auto extends Vehiculo
{
    #cantidadPuertas = -1; //Int > 2
    #asientos = -1; //Int > 2

    constructor(id, modelo, anoFabricacion, velMax, cantidadPuertas, asientos)
    {
        super(id,modelo,anoFabricacion,velMax);
        this.#cantidadPuertas = cantidadPuertas;
        this.#asientos = asientos;
    }

    get cantidadPuertas()
    {
        return this.#cantidadPuertas;
    }
    set cantidadPuertas(cantidadPuertas)
    {
        this.#cantidadPuertas = cantidadPuertas;
    }

    get asientos()
    {
        return this.#asientos;
    }
    set asientos(asientos)
    {
        this.#asientos = asientos;
    }

    getAll(enviarId = true)
    {
        let v = super.getAll(enviarId);

        v.carga = this.carga;
        v.autonomia = this.autonomia;
        v.cantidadPuertas = this.#cantidadPuertas;
        v.asientos = this.#asientos;
        
        return v;
    }

    toString()
    {
        var txt = super.toString() + "\nCantidad de Puertas: " + this.#cantidadPuertas + "\nAsientos: " + this.#asientos;
        return txt;
    }

    generarListaDeAtributos()
    {
        let atributosPadre = super.generarListaDeAtributos();
        let atributosHijo = atributosPadre.concat(["Cantidad de Puertas", "Asientos"]);
        return atributosHijo;
    }
}