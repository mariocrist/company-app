import React, {useState, useContext} from 'react';
import Swal from 'sweetalert2';

import clienteAxios from '../../config/axios';
import { useNavigate} from 'react-router-dom';

// Context
import {Context } from '../../context/Context';

function Login( ){
    const navigate = useNavigate();

    // Auth y token
    const [auth, guardarAuth] = useContext(Context);


    // State con los datos del formulario
    const [ credenciales, guardarCredenciales] = useState({});


    // iniciar sesión en el servidor
    const iniciarSesion = async e => {
        e.preventDefault();

        // autenticar al usuario

        try {
            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales);
            
            // extraer el token y colocarlo en localstorage
            const {token } = respuesta.data;
            localStorage.setItem('token', token);

            // colocarlo en el state
            guardarAuth({
                token, 
                auth: true
            })

            // alerta
            Swal.fire(
                'Login Correcto',
                'Has iniciado Sesión',
                'success'
            )

            // redireccionar
            navigate('/');

            
        } catch (error) {
            console.log(error);
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: error.response.data.mensaje
            })
        }
    }

    // almacenar lo que el usuario escribe en el state
    const leerDatos = e => {
        guardarCredenciales({
            ...credenciales,
            [e.target.name] : e.target.value
        })
    }

    return(

        <div className="login">
            <h2>Iniciar Sesión</h2>

            <div className="contenedor-formulario">
                <form
                    onSubmit={iniciarSesion}
                >

                    <div className="campo">
                        
                        <input 
                            type="text"
                            name="email"
                            placeholder="Email para Iniciar Sesión"
                            required
                            onChange={leerDatos}
                        />
                    </div>

                    <div className="campo">
                        
                        <input 
                            type="password"
                            name="password"
                            placeholder="Password para Iniciar Sesión"
                            required
                            onChange={leerDatos}
                        />
                    </div>

                    <input type="submit" value="Iniciar Sesión" className="btn btn-verde btn-block" />
                </form>
            </div>
        </div>
    )
}

export default Login;