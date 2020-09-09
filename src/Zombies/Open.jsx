import React from "react";
import {Alarm} from "./Alarm";
import {Guard} from "./Guard";
import {ZombieStatus} from "./ZombieStatus";

export const Open = ({current, send}) => {
    return <>
        <h2>Door Open {current.context.door_gap}%</h2>
        <button onClick={() => send('CLOSE')}>Close</button>
        <Alarm current={current} send={send} />
        <Guard current={current} />
        <ZombieStatus current={current} />
    </>
}