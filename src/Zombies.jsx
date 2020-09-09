import React from 'react';
import {useMachine} from '@xstate/react';
import {zombieMachine} from "./Zombies.machine";

const Closed = ({send}) => {
    return <>
        <h2>Closed</h2>
        <button onClick={() => send('LOCK')}>Lock</button>
        <button onClick={() => send('OPEN')}>Open</button>
    </>
}

const Locked = ({current, send}) => {
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

const Guard = ({current}) => {
    return <p>
        <span>Guard: </span>
        <b>
            {current.matches('open.guard.idle') && 'Idle'}
            {current.matches('open.guard.closingDoor') && 'Closing Door...'}
        </b>
    </p>
}

const ZombieStatus = ({current}) => {
    return <p>
        <span>Zombies: </span>
        <b>
            {current.matches('open.zombies.escaping') && 'Escaping'}
            {current.matches('open.zombies.escaped') && 'Escaped'}
        </b>
    </p>
}

const Alarm = ({current, send}) => {
    return <p>
        {current.matches('open.alarm.on') && <button onClick={() => send('DEACTIVATE')}>Deactivate Alarm</button>}
        {current.matches('open.alarm.off') && <button onClick={() => send('REACTIVATE')}>Reactivate Alarm</button>}
    </p>
}

const Open = ({current, send}) => {
return <>
    <h2>Open</h2>
    <p>
        <span>Door Open: </span>
        <b>{current.context.door_gap}%</b>
    </p>
    <button onClick={() => send('CLOSE')}>Close</button>
    <Alarm current={current} send={send} />
    <Guard current={current} />
    <ZombieStatus current={current} />
</>
}

export const Zombies = () => {
    const [current, send] = useMachine(zombieMachine);

    return (
        <div>
            {current.matches('closed') && <Closed send={send}/>}
            {current.matches('locked') && <Locked send={send} current={current}/>}
            {current.matches('open') && <Open send={send} current={current}/>}
            <p>
                <span>Zombie Count: </span>
                <b>{current.context.zombies}</b>
            </p>
        </div>);
}