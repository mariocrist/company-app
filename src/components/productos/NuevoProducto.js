import React, {useState, Fragment, useEffect, useContext} from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context/Context';

function NuevoProducto() {
    const navigate = useNavigate();

    //producto = state, guardarProducto = setstate
    const [producto, guardarProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        cantidad: '',
        empresa: ''
    });
    // context para la autenticacion
    const [auth, guardarAuth ] = useContext(Context );

    // archivo = state, guardarArchivo = setState
    const [archivo, guardarArchivo] = useState('');

    // empresas = state, guardarEmpresas= setState
    const [empresas, guardarEmpresas] = useState([]);

    // cuando el componente carga
    useEffect(() => {
       consultarAPI();
    }, [])

    // consultar la api para traer las empresas del select
    const consultarAPI = async () => {
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

    // almacena el nuevo producto en la base de datos.
    const agregarProducto = async e => {
        e.preventDefault();

        // crear un formdata
        console.log("agregarproducto")
        console.log(producto)
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('descripcion', producto.descripcion);
        formData.append('cantidad', producto.cantidad);
        formData.append('empresa', producto.empresa);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        // almacenarlo en la BD
        try {
            const res = await clienteAxios.post('/productos', formData, {
                headers: {
                    Authorization : `Bearer ${auth.token}`,
                    'Content-Type' : 'multipart/form-data'
                }
            } );

            // Lanzar una alerta
            if(res.status === 200) {
                Swal.fire(
                    'Agregado Correctamente',
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
        console.log(e.target.name)
        console.log(e.target.value)
        guardarProducto({
            // obtener una copia del state y agregar el nuevo
            ...producto,
            [e.target.name] : e.target.value
        })
        console.log(producto)
    }

    // coloca la imagen en el state
    const leerArchivo = e => {
        guardarArchivo( e.target.files[0] );
    }

    return (
        <Fragment>
            <h2>Nuevo Producto</h2>

            <form
                onSubmit={agregarProducto}>

                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Empresa:</label>
                    <select  name="empresa" placeholder="Selecciona una empresa" onChange={leerInformacionProducto} >
                        <option key='0' value='0'></option>
                        {empresas.map(
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
                    />
                </div>

                <div className="campo">
                    <label>Descripcion:</label>
                    <input 
                        type="text" 
                        placeholder="Descripcion Producto" 
                        name="descripcion"
                        onChange={leerInformacionProducto}
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
                    />
                </div>
                <div className="campo">
                    <label>Cantidad:</label>
                    <input 
                        type="number" 
                        name="cantidad" 
                        min="0" 
                        step="1" 
                        placeholder="Cantidad"
                        onChange={leerInformacionProducto}
                    />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    <input 
                        type="file"  
                        name="imagen"
                        onChange={leerArchivo}
                    />
                </div>

                <div className="enviar">
                        <input type="submit" className="btn btn-azul" value="Agregar Producto" />
                </div>
            </form>
        </Fragment>
    )
}
export default NuevoProducto;