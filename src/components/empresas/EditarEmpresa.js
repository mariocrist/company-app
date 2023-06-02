import React, {Fragment, useState, useEffect, useContext} from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useParams , useNavigate } from "react-router-dom";
import { Context } from '../../context/Context';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import nitIsValid from '../../utils/validaNit'



function EditarEmpresa(props){
    const navigate = useNavigate();

    // obtener el ID
    let { id } = useParams();

    // empresa = state, datosEmpresa = funcion para guardar el state
    const[empresa, datosEmpresa] = useState({
        nit: '',
        nombre: '',
        direccion : '',
        telefono :''
    });
    // context para la autenticacion
    const [auth, guardarAuth ] = useContext(Context );

    // Query a la API
    const consultarAPI = async () => {
        const empresaConsulta = await clienteAxios.get(`/empresas/${id}`, {
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
        });

       // colocar en el state
       datosEmpresa(empresaConsulta.data);
    }

    // useEffect, cuando el componente carga
    useEffect( () => {
        consultarAPI();
    }, []);

    // leer los datos del formulario
    const actualizarState = e => {
        // Almacenar lo que el usuario escribe en el state

        datosEmpresa({
            // obtener una copia del state actual
            ...empresa, 
            [e.target.name] : e.target.value
        })
    }

    const handleChange = (inputValue) => {
        
        datosEmpresa({
            // obtener una copia del state actual
            ...empresa, 
            telefono : String(inputValue)
        })
    }

    // Envia una petición por axios para actualizar el empresa
    const actualizarEmpresa = e => {
        e.preventDefault();

        if(!nitIsValid(empresa.nit)){
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'El nit no es válido'
            });
            return
        }

        // enviar petición por axios
        clienteAxios.put(`/empresas/${empresa.id}`, empresa,{
            headers: {
                Authorization : `Bearer ${auth.token}`
            }}
            ) 
            .then(res => {
                // validar si hay errores de mongo 
                console.log(res);
                if(res.status != 200) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error',
                        text: 'Ese empresa ya esta registrado'
                    })
                } else {
                    Swal.fire(
                        'Correcto',
                        'Se actualizó Correctamente',
                        'success'
                    )
                }

                // redireccionar
                navigate('/');
            })
    }

    // Validar el formulario
    const validarEmpresa = () => {
        // Destructuring
        const {nit, nombre,  direccion, telefono} = empresa;

        console.log(telefono)

        // revisar que las propiedades del state tengan contenido
        let valido = !nombre.length || !nit.length || !direccion.length || !telefono.length;

        // return true o false
        return valido;
    }

    return (
        <Fragment>
            <h2>Editar Empresa</h2>
            
            <form
                onSubmit={actualizarEmpresa}
            >
                <legend>Llena todos los campos</legend>
                <div className="campo">
                    <label>Nit:</label>
                    <input  type="text" 
                            placeholder="Nit Empresa" 
                            name="nit"
                            onChange={actualizarState}
                            value={empresa.nit}
                    />
                </div>

                <div className="campo">
                    <label>Nombre:</label>
                    <input  type="text" 
                            placeholder="Nombre Empresa" 
                            name="nombre"
                            onChange={actualizarState}
                            value={empresa.nombre}
                    />
                </div>

                <div className="campo">
                    <label>Direccion:</label>
                    <input type="text" 
                          placeholder="Direccion Empresa" 
                          name="direccion" 
                          onChange={actualizarState}
                          value={empresa.direccion}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <PhoneInput
                        name="telefono"
                        country={'co'}
                        placeholder="Teléfono Empresa"
                        value={empresa.telefono}
                        onChange={handleChange}/>
                    
                </div>

                <div className="enviar">
                    <input 
                        type="submit" 
                        className="btn btn-azul" 
                        value="Guardar Cambios" 
                        disabled={ validarEmpresa() }
                    />
                </div>
            </form>
        </Fragment>
    )
}

// HOC, es una función que toma un componente y retorna un nuevo componente
export default EditarEmpresa;