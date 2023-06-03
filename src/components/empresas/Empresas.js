import React, {useEffect, useState, useContext, Fragment } from 'react';

// importar cliente axios
import clienteAxios from '../../config/axios';
import Empresa from './Empresa';
import Spinner from '../layout/Spinner';
import {
    Link,
    useNavigate,
  } from 'react-router-dom';

// import el Context
import {Context } from '../../context/Context';

function Empresas(props) {
    const navigate = useNavigate();
    // Trabajar con el state
    // empresas = state,  guardarEmpresas = funcion para guardar el state
    const [ empresas, guardarEmpresas ] = useState([]);

    // utilizar valores del context
    const [auth, guardarAuth ] = useContext(Context );

    // use effect es similar a componentdidmount y willmount
    useEffect( () => {

        if(auth.token !== '') {
            // Query a la API
            const consultarAPI = async () => {
                try {
                    const empresasConsulta = await clienteAxios.get('/empresas', {
                        headers: {
                            Authorization : `Bearer ${auth.token}`
                        }
                    });
    
                    // colocar el resultado en el state
                    guardarEmpresas(empresasConsulta.data);

                } catch (error) {
                    // Error con authorizacion
                    if(error.response.status = 500) {
                        navigate('/iniciar-sesion');
                    }
                }
            }
            consultarAPI();
        } else {
            navigate('/iniciar-sesion')
        }
    }, [] );


    // Si el state esta como false


    //f(!empresas.length) return <Spinner /> 

    
    return (
        <Fragment>
        
            <h2>Empresas</h2>

            <Link to={"/empresas/nueva"} className="btn btn-verde nvo-empresa"> 
                <i className="fas fa-plus-circle"></i>
                Nueva Empresa
            </Link>

            <ul className="listado-empresas">
                {empresas.map(empresa => (
                    <Empresa 
                        key={empresa.id}
                        empresa={empresa}
                    />
                ))}
            </ul>

        </Fragment>
    )
}
export default Empresas;