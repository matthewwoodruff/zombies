import React from "react";

export const Locked = ({current, send}) => {
    return <>
        <h2>Locked</h2>

        {current.matches('locked.main') &&
        <>
            <h4>Main Lock</h4>
            <button onClick={() => send('UNLOCK')}>Unlock</button>
            <button onClick={() => send('LOCK_DEADBOLT')}>Lock Deadbolt</button>
        </>}
        {current.matches('locked.deadbolt') &&
        <>
            <h4>Deadbolt</h4>
            <button onClick={() => send('UNLOCK_DEADBOLT')}>Unlock Deadbolt</button>
        </>
        }
    </>
}