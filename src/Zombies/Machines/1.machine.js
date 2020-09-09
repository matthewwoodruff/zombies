
const zombieMachine = Machine({
        id: 'Armoured Door',
        initial: 'closed',
        context: {},
        states: {
            locked: {
                on: {
                    UNLOCK: 'closed'
                }
            },
            closed: {
                id: 'closed',
                on: {
                    OPEN: 'open',
                    LOCK: 'locked'
                }
            },
            open: {
                on: {
                    CLOSE: 'closed'
                },
            },
        }
    }
);