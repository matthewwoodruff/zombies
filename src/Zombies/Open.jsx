import React from "react";
import {Alarm} from "./Alarm";
import {Guard} from "./Guard";
import {ZombieStatus} from "./ZombieStatus";

export const Open = ({current, send}) => {
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