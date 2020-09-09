import React from "react";

export const ZombieStatus = ({current}) => {
    return <p>
        <span>Zombies: </span>
        <b>
            {current.matches('open.zombies.escaping') && 'Escaping'}
            {current.matches('open.zombies.escaped') && 'Escaped'}
        </b>
    </p>
}