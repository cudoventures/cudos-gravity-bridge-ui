import fs from 'fs';
import os from 'os';
import cluster from 'cluster';

import Logger from './backend/utilities/Logger';
import DatabasePool from './backend/utilities/database/DatabasePool';

const Config = require('../config/config');

const SERVER_WORKER_NAME = 'SERVER_WORKER';

const NUM_CPUS = Config.Build.DEV === true ? 1 : os.cpus().length;

class ServerCluster {

    // master
    masterExiting: boolean = false;
    workerExiting: boolean = false;

    // worker
    dbPool: DatabasePool | null = null;

    async start() {
        if (cluster.isMaster) {
            this.initMasterListeners();
            this.initErrorListeners();
            this.initFiles();

            for (let i = 0; i < NUM_CPUS; i++) {
                this.forkServerWorker();
            }

            cluster.on('exit', this.clusterOnWorkerExit);
            process.on('SIGINT', () => {}); // Just to wait for all works to finish;
            process.on('SIGTERM', () => {}); // Just to wait for all works to finish;

            if (Config.Build.DEV === true) {
                process.send('SERVER_MSG::STARTED');
            }
        } else {
            this.initErrorListeners();
            this.initWorkerListeners();

            switch (process.env.PROCESS_NAME) {
                case SERVER_WORKER_NAME:
                    const ServerWorker = require('./ServerWorker'); /* it should be here to avoid creating of dummy objects (QueueDispatcher) */
                    // this.dbPool = new DatabasePool();
                    new ServerWorker(Config.Server.BACKEND_PORT, Config.Server.SESSION_UNIQUE_KEY, this.dbPool).start();
                    break;
                default:
            }
        }
    }

    // init
    initMasterListeners() {
        process.on('message', this.onClusterMessage.bind(this));
    }

    initErrorListeners() {
        if (Config.Build.DEV === true) {
            process.on('unhandledRejection', async (reason, p) => {
                Logger.error('Promise error', reason);
                if (cluster.isMaster) {
                    process.exit(0);
                } else {
                    await this.workerExit();
                }
            });
        }
    }

    initFiles() {
        if (fs.existsSync(Config.Path.Root.DATA) === false) {
            fs.mkdirSync(Config.Path.Root.DATA);
            return;
        }

        if (fs.existsSync(Config.Path.Root.LOGS) === false) {
            fs.mkdirSync(Config.Path.Root.LOGS);
            return;
        }

        fs.mkdirSync(Config.Path.Root.Data.SESSIONS, { 'recursive': true });
    }

    initWorkerListeners() {
        cluster.worker.process.on('exit', this.workerExit);
        cluster.worker.on('exit', this.workerExit);
        cluster.worker.process.on('disconnect', this.workerExit);
        cluster.worker.on('disconnect', this.workerExit);
        cluster.worker.process.on('SIGINT', async () => {
            await this.workerExit();
        });
        cluster.worker.process.on('SIGTERM', async () => {
            await this.workerExit();
        });
    }

    // listeners
    onClusterMessage(data) {
        switch (data) {
            case 'SERVER_MSG::EXIT':
                if (Config.Build.DEV === true) {
                    this.masterExiting = true;
                    Object.keys(cluster.workers).forEach((key) => {
                        const worker = cluster.workers[key];
                        worker.disconnect();
                        const interval = setInterval(() => {
                            if (worker.isConnected() === false) {
                                worker.kill();
                                clearInterval(interval);
                            }
                        }, 25);
                    });
                }
                break;
            default:
        }
    }

    workerExit = async () => {
        if (this.workerExiting === true) {
            return;
        }

        this.workerExiting = true;
        try {
            if (this.dbPool !== null) {
                await this.dbPool.close();
            }
        } catch (e) {
            Logger.error(e);
        }
        this.dbPool = null;
        process.exit(0);
    }

    clusterOnWorkerExit = async (worker, code, signal) => {
        if (code === null) {
            Logger.log(`Worker ${worker.process.pid} restarted with code: ${code} and signal: ${signal} (${worker.process.env.PROCESS_NAME})`);
        } else {
            Logger.error(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal} (${worker.process.env.PROCESS_NAME})`);
        }

        if (worker.exitedAfterDisconnect !== true && Config.Build.PRODUCTION === true) {
            switch (worker.process.env.PROCESS_NAME) {
                case SERVER_WORKER_NAME:
                    this.forkServerWorker();
                    break;
                default:
            }
        }

        if (Object.keys(cluster.workers).length === 0) {
            process.exit(0);
        }
    }

    // utilities
    forkServerWorker() {
        const env = new Env(SERVER_WORKER_NAME);
        return this.fork(env);
    }

    fork(env: Env) {
        const worker = cluster.fork(env);
        worker.process.env = env;
        return worker;
    }

}

class Env {

    PROCESS_NAME: string;

    constructor(PROCESS_NAME) {
        this.PROCESS_NAME = PROCESS_NAME;
    }

}

new ServerCluster().start();
