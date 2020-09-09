import React from "react";

export const Guard = ({current}) => {
    return <p>
        <span>Guard: </span>
        <b>
            {current.matches('open.guard.idle') && 'Zzzzz'}
            {current.matches('open.guard.closingDoor') && 'Closing Door...'}
        </b>
    </p>
}