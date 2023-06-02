import React, {Fragment, useState, useContext, useEffect} from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import nitIsValid from '../../utils/validaNit'

// import el Context
import { Context } from '../../context/Context';

function NuevaEmpresa({history}){
    const navigate = useNavigate();

    // utilizar valores del context
    const [auth, guardarAuth ] = useContext( Context );

    // empresa = state, guardarEmpresa = funcion para guardar el state
    const[empresa, guardarEmpresa] = useState({
        nit: '',
        nombre: '',
        direccion : '',
        telefono :''
    });

    // leer los datos del formulario
    const actualizarState = e => {
        // Almacenar lo que el usuario escribe en el state
        guardarEmpresa({
            // obtener una copia del state actual
            ...empresa, 
            [e.target.name] : e.target.value
        })

    }

    const handleChange = (inputValue) => {
        
        guardarEmpresa({
            // obtener una copia del state actual
            ...empresa, 
            telefono : String(inputValue)
        })
    }

    // Añade en la REST API una empresa nueva
    const agregarEmpresa = e => {
        e.preventDefault();

        if(!nitIsValid(empresa.nit)){
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'El nit no es válido'
            });
            return
        }


        // enviar petición
        clienteAxios.post('/empresas', empresa, {
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
            })
            .then(res => {
                // validar si hay errores de mongo 
                if(res.status != 200) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error',
                        text: 'Esa empresa ya esta registrada'
                    })
                } else {
                    Swal.fire(
                        'Se agregó la empresa',
                        res.data.mensaje,
                        'success'
                    )
                }
                // Redireccionar
                navigate('/');
            });
    }

    // Validar el formulario
    const validarEmpresa = () => {
        // Destructuring
        const { nombre, nit, direccion, telefono} = empresa;

        // revisar que las propiedades del state tengan contenido
        let valido = !nombre.length || !nit.length || !direccion.length ||  !telefono.length;

        // return true o false
        return valido;
    }
    const validateToken = async () => {

        // verificar si el usuario esta autenticado o no
        if(!auth.auth && (localStorage.getItem('token') === auth.token ) ) {
            navigate('/iniciar-sesion');
        }
    }
    useEffect( () => {
        validateToken();
    },[]);
    

    

    return(
        <Fragment>
            <h2>Nueva Empresa</h2>
            
            <form
                onSubmit={agregarEmpresa}
            >
                <legend>Llena todos los campos</legend>
                <div className="campo">
                    <label>Nit:</label>
                    <input  type="text" 
                            placeholder="Nit Empresa" 
                            name="nit"
                            onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text" 
                          placeholder="Nombre Empresa" 
                          name="nombre" 
                          onChange={actualizarState}
                    />
                </div>
            
                <div className="campo">
                    <label>Direccion:</label>
                    <input type="text" 
                          placeholder="Direccion Empresa" 
                          name="direccion" 
                          onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <PhoneInput
                        name="telefono"
                        country={'co'}
                        placeholder="Teléfono Empresa"
                        onChange={handleChange}/>
                    
                </div>

                <div className="enviar">
                    <input 
                        type="submit" 
                        className="btn btn-azul" 
                        value="Agregar Empresa" 
                        disabled={ validarEmpresa() }
                    />
                </div>
            </form>
        </Fragment>
    )
}
export default NuevaEmpresa