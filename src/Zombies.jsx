import React from 'react';
import { useMachine } from '@xstate/react';
import {zombieMachine} from "./Zombies.machine";

export const Zombies = () => {
    const [current, send] = useMachine(zombieMachine);

    return (<div>Hello</div>);
}