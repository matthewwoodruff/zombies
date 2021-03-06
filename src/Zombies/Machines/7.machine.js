
const zombieMachine = Machine({
        id: 'Armoured Door',
        initial: 'closed',
        context: {
            zombies: 1000,
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
                type: 'parallel',
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
                    zombies: {
                        initial: 'escaping',
                        states: {
                            escaping: {
                                invoke: {
                                    id: 'escapeInterval',
                                    src: (context, event) => (callback, onReceive) => {

                                        const id = setInterval(() => {
                                            callback('ZOMBIE_ESCAPED')
                                        }, 1000);

                                        return () => clearInterval(id);
                                    }
                                },
                                on: {
                                    ZOMBIE_ESCAPED: [
                                        {
                                            cond: context => context.zombies > 0,
                                            actions: [
                                                assign({zombies: context => Math.max(Math.floor(context.zombies - (context.door_gap / 2)), 0)})
                                            ]
                                        },
                                    ],
                                    '': [
                                        {
                                            target: 'escaped',
                                            cond: context => context.zombies === 0
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
                                            callback({type: 'CLOSE', amount: 10})
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
                const interval = setInterval(() => console.log('Beep'), 1000);
                return () => clearInterval(interval);
            }
        }
    });