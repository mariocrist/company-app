import React, { useState } from 'react';

const Context = React.createContext([ {}, () => {} ]);

const Provider = props => {

    // definir el state inicial
    const [auth, guardarAuth ] = useState({
        token: '',
        auth: false
    });

    return (
        <Context.Provider value={[auth, guardarAuth]}>
            {props.children}
        </Context.Provider> 
    );
}

export { Context, Provider };