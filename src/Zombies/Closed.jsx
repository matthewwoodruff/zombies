import React from "react";

export const Closed = ({send}) => {
    return <>
        <h2>Door Closed</h2>
        <button onClick={() => send('LOCK')}>Lock</button>
        <button onClick={() => send('OPEN')}>Open</button>
    </>
}