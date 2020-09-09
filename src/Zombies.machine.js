import {Machine} from "xstate";

const zombieMachine = Machine({

        id: 'Cell Door',
        initial: 'closed',
        context: {
            criminals: 1000,
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
                            actions: assign({door_gap: (context, event) => context.door_gap + (event.amount ?? 100)}),
                            target: 'open'
                        }
                    ],
                    LOCK: 'locked'
                }
            },
            open: {
                type: 'parallel',
                on: {
                    CLOSE: [
                        {
                            cond: (context, event) => {
                                const thing = context.door_gap - (event.amount ?? context.door_gap) > 0
                                return thing
                            },
                            actions: assign({door_gap: (context, event) => context.door_gap - (event.amount ?? context.door_gap)}),
                        },
                        {
                            target: 'closed',
                            actions: assign({door_gap: () => 0}),
                        }
                    ]
                },

                states: {
                    alarm: {
                        initial: 'on',
                        states: {
                            on: {
                                after: {
                                    2000: {
                                        actions: send('NOTIFY_GUARD')
                                    }
                                },
                                activities: ['beeping'],
                                on: {
                                    DEACTIVATE: 'off',
                                }
                            },
                            off: {
                                on: {
                                    REACTIVATE: 'on'
                                }
                            }
                        }
                    },
                    criminals: {
                        initial: 'escaping',
                        states: {
                            escaping: {
                                invoke: {
                                    id: 'escapeInterval',
                                    src: (context, event) => (callback, onReceive) => {

                                        const id = setInterval(() => {
                                            callback('CRIMINAL_ESCAPED')
                                        }, 1000);

                                        return () => clearInterval(id);
                                    }
                                },
                                on: {
                                    CRIMINAL_ESCAPED: [
                                        {
                                            cond: context => context.criminals > 0,
                                            actions: [
                                                assign({criminals: context => Math.max(context.criminals - context.door_gap, 0)})
                                            ]
                                        },
                                    ],
                                    '': [
                                        {
                                            target: 'escaped',
                                            cond: context => context.criminals === 0
                                        }
                                    ]
                                }
                            },
                            escaped: {
                                type: 'final'
                            }
                        }
                    },
                    guard: {
                        initial: 'idle',
                        states: {
                            idle: {
                                on: {
                                    NOTIFY_GUARD: 'closingDoor'
                                }
                            },
                            closingDoor: {
                                invoke: {
                                    id: 'closeDoor',
                                    src: (context, event) => (callback, onReceive) => {

                                        const id = setInterval(() => {
                                            callback({type: 'CLOSE', amount: 25})
                                        }, 1000);

                                        return () => clearInterval(id);
                                    }
                                }
                            }
                        }
                    }
                }
            },
        }
    },
    {
        activities: {
            beeping: () => {

                const interval = setInterval(() => console.log('Beep'), 500);

                return () => clearInterval(interval);
            }
        }
    });