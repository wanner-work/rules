const logFlag = {
    flag: '-l, --log',
    description: 'Show logs after action'
}

const logNumberFlag = {
    flag: '-n, --number',
    description: 'The number of lines to show in the logs'
}

const stopFlag = {
    flag: '-s, --stop',
    description: 'Stop the current environment before executing the action'
}

const startFlag = {
    flag: '-r, --start',
    description: 'Starts the current environment after executing the action'
}

const ACTIONS = {
    tasks: [
        logFlag,
        logNumberFlag,
        stopFlag,
        startFlag
    ]
}

export default ACTIONS