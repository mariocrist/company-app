import React, {useEffect, useState, useContext,  Fragment} from 'react';
import { pdfFromReact } from "generate-pdf-from-react-html";

import { sendPDFEmail } from '../../utils/sendPDFEmail';

// importar cliente axios
import clienteAxios from '../../config/axios';
import Producto from './Producto';
//import Spinner from '../layout/Spinner';

import {
    Link,
    useNavigate,
  } from 'react-router-dom';

// import el Context
import { Context } from '../../context/Context';

function Productos() {
    const navigate = useNavigate();


    // productos = state, guardarproductos = funcion para guardar el state
    const [productos, guardarProductos] = useState([]);
    const [email, setEmail] = useState('');

    // utilizar valores del context
    const [auth, guardarAuth ] = useContext(Context );

    // useEffect para consultar api cuando cargue
    useEffect( () => {

        if(auth.token !== '') {
            // Query a la API
            const consultarAPI = async () => {
                try {
                    const productosConsulta = await clienteAxios.get('/productos', {
                        headers: {
                            Authorization : `Bearer ${auth.token}`
                        }
                    });
                    guardarProductos(productosConsulta.data);
                } catch (error) {
                    // Error con authorizacion
                    if(error.response.status === 500) {
                        navigate('/iniciar-sesion');
                    }
                }
            }
            // llamado a la api
            consultarAPI();

        } else {
            navigate('/iniciar-sesion');
        }
    }, []);

    // Validar el formulario
    const validaremail= () => {
        // Destructuring

        // revisar que las propiedades del state tengan contenido
        let valido = !email ;

        // return true o false
        return valido;
    }

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    };
     

    // spinner de carga
    //if(!productos.length) return <Spinner /> 


    return (
        <Fragment>
            <h2>Productos</h2>
            <div className='campo'>
            <Link to={'/productos/nuevo'} className="btn btn-verde nvo-empresa"> 
                <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>
            <button  className="btn btn-naranja-light nvo-empresa"
                onClick={() =>
                pdfFromReact(".listado-productos", "My-file", "p", true, false)
                }
            >Descargar Listado</button>

                <input type='email' className='campo2' onChange={handleChangeEmail} name='email' placeholder='Email' value={email}></input>
                <button  className="btn btn-verde nvo-empresa" disabled={validaremail()}
                onClick={ () =>
                    sendPDFEmail(".listado-productos", "My-file", "p", true,email, false)
                }
            >Enviar Correo</button>
            </div>
            


            <ul className="listado-productos">
                {productos.map(producto => (
                    <Producto
                        key={producto.id}
                        producto={producto}
                    />
                ))}
            </ul>
        </Fragment>
    )
}
export default Productos;