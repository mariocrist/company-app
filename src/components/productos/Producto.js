import React from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import {
    Link,
  } from 'react-router-dom';

function Producto({producto}) {


    // elimina un producto
    const eliminarProducto = id => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Un producto eliminado no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText : 'No, Cancelar'
        }).then((result) => {
            if (result.value) {
              // eliminar en la rest api
              clienteAxios.delete(`/productos/${id}`)
                .then(res => {
                    if(res.status === 200) {
                        Swal.fire(
                            'Eliminado',
                            res.data.mensaje,
                            'success'
                        )
                    }
                })
            }
        })
    }

    console.log(producto)

    const {id, nombre, descripcion, precio, imagen, cantidad } = producto;
    var nombreempresa
    var nitempresa
    if(producto.empresa){
        nombreempresa=producto.empresa.nombre;
        nitempresa=producto.empresa.nit;
    }

    return (
        <li className="producto">
            <div className="info-producto">

                <p className="nombre">Empresa: {nitempresa} {nombreempresa}</p>
                <p className="nombre">{nombre}</p>
                <p className="nombre">Descripcion: {descripcion}</p>
                <p className="precio">Precio: $ {precio}</p>
                <p className="precio">Cantidad: {cantidad}</p>
                { imagen ? (
                    <img src={`http://localhost:5000/${imagen}`} alt="imagen"  width="200" />
                ) : null  }
            </div>
            <div className="acciones">
                <Link to={`/productos/editar/${id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Producto
                </Link>

                <button 
                    type="button" 
                    className="btn btn-rojo btn-eliminar"
                    onClick={() => eliminarProducto(id) }
                >
                    <i className="fas fa-times"></i>
                    Eliminar Producto
                </button>
            </div>
        </li>
    )
}
export default Producto;