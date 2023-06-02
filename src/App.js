import React, {Fragment, useContext } from 'react';

// Routing
import {BrowserRouter as Router, Route,  Routes} from 'react-router-dom';

/*** Layout */
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';

// Components
import Empresas from './components/empresas/Empresas';
import NuevaEmpresa from './components/empresas/NuevaEmpresa';
import EditarEmpresa from './components/empresas/EditarEmpresa';

import Productos from './components/productos/Productos';
import NuevoProducto from './components/productos/NuevoProducto';
import EditarProducto from './components/productos/EditarProducto';

import Login from './components/auth/Login';

import { Context, Provider } from './context/Context';

function App() {

  const [auth, guardarAuth] = useContext(Context);



  return (
    <Router>
      <Fragment>
        <Provider value={[ auth, guardarAuth ]}>
          <Header />
          <div className="grid contenedor contenido-principal">
            <Navbar/>
            <main className="caja-contenido col-9">
              <Routes>

                <Route exact path="/productos" Component={Productos} />
                <Route exact path="/productos/nuevo" Component={NuevoProducto} />
                <Route exact path="/productos/editar/:id" Component={EditarProducto} />

                <Route exact path='/' Component={Empresas}/>
                <Route exact path="/empresas/nueva" Component={NuevaEmpresa} />
                <Route exact path="/empresas/editar/:id" Component={EditarEmpresa} />

                <Route exact path="/iniciar-sesion" Component={Login} />

              </Routes>
            </main>
          </div>
        </Provider>
      </Fragment>
    </Router>
  );
}

export default App;
