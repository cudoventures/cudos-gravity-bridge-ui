const cp = require('child_process');
const ArgvHelper = require('./ArgvHelper');
const Config = require('./../../../config/config');

class ServerHelper {

    constructor() {
        this.server = null;
        this.status = ServerHelper.STATUS_STOPPED;
    }

    restart() {
        if (this.status === ServerHelper.STATUS_STARTING || this.status === ServerHelper.STATUS_STOPPING) {
            return;
        }

        if (this.status === ServerHelper.STATUS_STOPPED) {
            this.start();
            return;
        }

        this.server.send('SERVER_MSG::EXIT');
        this.server.on('exit', () => {
            this.status = ServerHelper.STATUS_STOPPED;
            this.start();
        });
        this.server = null;

        this.status = ServerHelper.STATUS_STOPPING;
    }

    start() {
        if (this.status !== ServerHelper.STATUS_STOPPED) {
            return;
        }

        let execArgv = [];
        if (ArgvHelper.SERVER_DEBUG) {
            execArgv = ['--inspect=9228'];
        }
        this.server = cp.fork(`${Config.Path.DEV}/src/ServerCluster.js`, [], { silent: true, execArgv });
        this.server.stdout.on('data', this.onStdOut.bind(this));
        this.server.stderr.on('data', this.onError.bind(this));
        this.server.on('message', (data) => {
            if (data === 'SERVER_MSG::STARTED') {
                this.status = ServerHelper.STATUS_STARTED;
            }
        });
        this.server.on('exit', () => {
            this.status = ServerHelper.STATUS_STOPPED;
        });
        this.status = ServerHelper.STATUS_STARTING;
    }

    onStdOut(data) {
        console.log(data.toString().trim());
    }

    onError(data) {
        console.error(data.toString().trim());
    }

}

ServerHelper.STATUS_STOPPED = 1;
ServerHelper.STATUS_STARTING = 2;
ServerHelper.STATUS_STARTED = 3;
ServerHelper.STATUS_STOPPING = 4;

module.exports = ServerHelper;
