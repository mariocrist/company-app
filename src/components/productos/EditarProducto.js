import React, {useState, useEffect, Fragment, useContext} from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import Spinner from '../layout/Spinner';
import { useParams , useNavigate } from "react-router-dom";
// import el Context
import { Context } from '../../context/Context';

function EditarProductos(props) {
    const navigate = useNavigate();

    // obtener el ID
    let { id } = useParams();


    // producto = state, y funcion para actualizar
    const [producto, guardarProducto ] = useState({
        nombre: '',
        precio: '',
        imagen : '',
        cantidad: '',
        empresaId: ''
    });

    // archivo = state, guardarArchivo = setState
    const [archivo, guardarArchivo] = useState('');

    // empresas = state, guardarEmpresas= setState
    const [empresa, guardarEmpresas] = useState([]);

    const [auth, guardarAuth ] = useContext(Context );

    const consultarAPI = async () => {
        const productoConsulta = await clienteAxios.get(`/productos/${id}`, {
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
        });
        guardarProducto(productoConsulta.data);
    }

    // consultar la api para traer las empresas del select
    const consultarEmpresas = async () => {
        try {
            const empresasConsulta = await clienteAxios.get(`/empresas`, {
                headers: {
                    Authorization : `Bearer ${auth.token}`
                }
            });
            guardarEmpresas(empresasConsulta.data);
        } catch (error) {
            console.log(error);
        }

    }

    // cuando el componente carga
    useEffect(() => {
         // consultar la api para traer el producto a editar
        
        consultarAPI();
        consultarEmpresas();
        
    }, [])

    // Edita un Producto en la base de datos
    const editarProducto = async e => {
        e.preventDefault();

        // crear un formdata
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        // almacenarlo en la BD
        try {
            const res = await clienteAxios.put(`/productos/${id}`, formData, {
                headers: {
                    Authorization : `Bearer ${auth.token}`,
                    'Content-Type' : 'multipart/form-data'
                }
            } );

            // Lanzar una alerta
            if(res.status === 200) {
                Swal.fire(
                    'Editado Correctamente',
                    res.data.mensaje,
                    'success'
                )
            }

            // redireccionar
            navigate('/productos');

        } catch (error) {
            console.log(error);
            // lanzar alerta
            Swal.fire({
                type:'error',
                title: 'Hubo un error',
                text: 'Vuelva a intentarlo'
            })
        }
    }

    // leer los datos del formulario
    const leerInformacionProducto = e => {
        guardarProducto({
            // obtener una copia del state y agregar el nuevo
            ...producto,
            [e.target.name] : e.target.value
        })
    }

    // coloca la imagen en el state
    const leerArchivo = e => {
        guardarArchivo( e.target.files[0] );
    }

    // extraer los valores del state
    const {nombre, precio, imagen } = producto;

    if(!nombre) return <Spinner />

    return (
        <Fragment>
            <h2>Editar Producto</h2>

            <form
                onSubmit={editarProducto}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Empresa:</label>
                    <select  name="empresaId" value={producto.empresaId} placeholder="Selecciona una empresa" onChange={leerInformacionProducto} >
                        {empresa.map(
                            empresa =>(
                            <option key={empresa.id} value={empresa.id} > {empresa.nit} {empresa.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Producto" 
                        name="nombre"
                        onChange={leerInformacionProducto}
                        defaultValue={nombre}
                    />
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input 
                        type="number" 
                        name="precio" 
                        min="0.00" 
                        step="0.01" 
                        placeholder="Precio"
                        onChange={leerInformacionProducto}
                        defaultValue={precio}
                    />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    { imagen ? (
                        <img src={`http://localhost:5000/${imagen}`} alt="imagen" width="300" />
                    ) : null }
                    <input 
                        type="file"  
                        name="imagen"
                        onChange={leerArchivo}
                    />
                </div>

                <div className="enviar">
                        <input type="submit" className="btn btn-azul" value="Editar Producto" />
                </div>
            </form>
        </Fragment>
    )
}
export default EditarProductos;