import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';


function Empresa({ empresa }) {
	// extraer los valores
	const { id, nit, nombre, direccion, telefono } = empresa;

	// Eliminar cliente
	const eliminarEmpresa = idEmpresa => {
		Swal.fire({
			title: '¿Estas seguro?',
			text: "Una Empresa eliminada no se puede recuperar",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'Cancelar'
		}).then((result) => {
			if (result.value) {
                // Llamado a axios
                clienteAxios.delete(`/empresas/${idEmpresa}`)
                    .then(res => {
                        Swal.fire(  
                            'Eliminado', 
                            res.data.mensaje, 
                            'success'
                        );
                    });
                    
			}
		});
	};

	return (
		<li className="empresa">
			<div className="info-empresa">
                <p >
					NIT: {nit}
				</p>
				<p className="nombre">
					{nombre}
				</p>
				<p>Direccion: {direccion}</p>
				<p>Tel: {telefono}</p>
			</div>
			<div className="acciones">
				<Link to={`/empresas/editar/${id}`} className="btn btn-azul">
					<i className="fas fa-pen-alt" />
					Editar Empresa
				</Link>

                <button 
                    type="button" 
                    className="btn btn-rojo btn-eliminar" 
                    onClick={() => eliminarEmpresa(id)}
                >
					<i className="fas fa-times" />
					Eliminar Empresa
				</button>
			</div>
		</li>
	);
}
export default Empresa;
