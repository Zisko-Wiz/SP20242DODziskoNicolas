export class Vehiculo
{
    #id =-1; //Int
    #modelo =""; //Str
    #anoFabricacion =-1; //Int >1985
    #velMax =-1; //Int >1985

    constructor(id, modelo, anoFabricacion, velMax)
    {
        this.#id = id;
        this.#modelo = modelo;
        this.#anoFabricacion = anoFabricacion;
        this.#velMax = velMax;
    }

    get id()
    {
        return this.#id;
    }
    set id(id)
    {
        this.#id = id;
    }

    get modelo()
    {
        return this.#modelo;
    }
    set modelo(modelo)
    {
        this.#modelo = modelo;
    }

    get anoFabricacion()
    {
        return this.#anoFabricacion;
    }
    set anoFabricacion(anoFabricacion)
    {
        this.#anoFabricacion = anoFabricacion;
    }

    get velMax()
    {
        return this.#velMax;
    }
    set velMax(velMax)
    {
        this.#velMax = velMax;
    }

    getAll(enviarId = true)
    {
        let v = {};
        
        if (enviarId == true)
        {            
            v.id = this.#id;
        }

        v.modelo = this.#modelo;
        v.anoFabricacion = this.#anoFabricacion;
        v.velMax = this.#velMax;
        
        return v;
    }

    toString()
    {
        var txt = "ID: " + this.#id + "\nModelo: " + this.#modelo + "\nAño de Fabricacion: " + this.#anoFabricacion + "\nVelocidad Máxima: " + this.#velMax;
        
        return txt;
    }

    toJson()
    {
        return JSON.stringify(this);
    }

    generarListaDeAtributos()
    {
        let atributos = ["ID","Año de Fabricación", "Modelo", "Velocidad Máxima"]
        return atributos;
    }

    static generarListaCompletaDeAtributos()
    {
        let atributos = ["ID","Año de Fabricación", "Modelo", "Velocidad Máxima", "Carga", "Autonomia", "cantidad de Puertas", "Asientos"];
        return atributos;
    }
}