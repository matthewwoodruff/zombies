import React from "react";

export const Alarm = ({current, send}) => {
    return <p>
        {current.matches('open.alarm.on') && <button onClick={() => send('DEACTIVATE')}>Deactivate Alarm</button>}
        {current.matches('open.alarm.off') && <button onClick={() => send('REACTIVATE')}>Reactivate Alarm</button>}
    </p>
}