
const zombieMachine = Machine({
        id: 'Armoured Door',
        initial: 'closed',
        context: {
            door_gap: 0,
        },
        states: {
            locked: {
                initial: 'main',
                states: {
                    main: {
                        on: {
                            LOCK_DEADBOLT: 'deadbolt',
                            UNLOCK: '#closed'
                        }
                    },
                    deadbolt: {
                        on: {
                            UNLOCK_DEADBOLT: 'main'
                        }
                    }
                }
            },
            closed: {
                id: 'closed',
                on: {
                    OPEN: [
                        {
                            actions: assign({door_gap: () => 100}),
                            target: 'open'
                        }
                    ],
                    LOCK: 'locked'
                }
            },
            open: {
                on: {
                    CLOSE: [
                        {
                            cond: (context, event) => context.door_gap - (event.amount ?? context.door_gap) > 0,
                            actions: assign({door_gap: (context, event) => context.door_gap - (event.amount ?? context.door_gap)}),
                        },
                        {
                            target: 'closed',
                            actions: assign({door_gap: () => 0}),
                        }
                    ]
                },
            },
        }
    }
);