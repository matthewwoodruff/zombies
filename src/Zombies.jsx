import React from 'react';
import {useMachine} from '@xstate/react';
import {zombieMachine} from "./Zombies.machine";

const Closed = ({send}) => {
    return <>
        <h2>Closed</h2>
        <button onClick={() => send('LOCK')}>Lock</button>
    </>
}

const Locked = ({current, send}) => {
    return <>
        <h2>Locked</h2>

        {current.matches('locked.main') &&
        <>
            <h4>Main</h4>
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

export const Zombies = () => {
    const [current, send] = useMachine(zombieMachine);

    return (
        <div>
            {current.matches('closed') && <Closed send={send}/>}
            {current.matches('locked') && <Locked send={send} current={current}/>}
        </div>);
}