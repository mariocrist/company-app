import React, { useContext } from 'react';

import {Link} from 'react-router-dom'
import { Context } from '../../context/Context';

const Navbar = () => {
  const [auth, guardarAuth] = useContext(Context);

  if(!auth.auth) return null;

  return (  
      <aside className="sidebar col-3">
        <h2>Administración</h2>
          <nav className="navegacion">
            <Link to={"/"} className="empresas">Empresas</Link>
            <Link to={"/productos"} className="productos">Inventario</Link>
          </nav>
      </aside>
  );
}
 
export default Navbar;
