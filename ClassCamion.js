import { Vehiculo } from "./ClassVehiculo.js";

export class Camion extends Vehiculo
{
    #carga =-1.5; //Float
    #autonomia =-1.5; //Float

    constructor(id, modelo, anoFabricacion, velMax, carga, autonomia)
    {
        super(id,modelo,anoFabricacion,velMax);
        this.#carga = carga;
        this.#autonomia = autonomia;
    }

    get carga()
    {
        return this.#carga;
    }
    set carga(carga)
    {
        this.#carga = carga;
    }
    
    get autonomia()
    {
        return this.#autonomia;
    }
    set autonomia(autonomia)
    {
        this.#autonomia = autonomia;
    }

    getAll(enviarId = true)
    {
        let v = super.getAll(enviarId);

            v.carga = this.#carga;
            v.autonomia = this.#autonomia;
            v.cantidadPuertas = this.cantidadPuertas;
            v.asientos = this.asientos;

        return v;
    }

    toString()
    {
        var txt = super.toString() + "\nCarga: " + this.#carga + "\nAutonomía" + this.#autonomia;
        return txt;
    }

    generarListaDeAtributos()
    {
        let atributosPadre = super.generarListaDeAtributos();
        let atributosHijo = atributosPadre.concat(["Carga", "Autonomía"]);
        return atributosHijo;
    }
}