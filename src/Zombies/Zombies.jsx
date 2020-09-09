import React from 'react';
import {useMachine} from '@xstate/react';
import {zombieMachine} from "./Zombies.machine";
import {Open} from "./Open";
import {Locked} from "./Locked";
import {Closed} from "./Closed";

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