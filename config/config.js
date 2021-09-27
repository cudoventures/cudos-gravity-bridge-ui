const dotenv = require('dotenv');
const path = require('path');

let envPath = path.join(__dirname, '.env');
if (process.env.ENV_FILENAME) {
    envPath = path.join(__dirname, process.env.ENV_FILENAME);
}

const result = dotenv.config({ path: envPath });
const NODE_DIR = process.cwd();

if (result.error) {
    console.error(__dirname);
    throw result.error;
}

// required environment variables
const envVariables = [
    'NODE_ENV',
    'BACKEND_PORT',
    'FRONTEND_PORT',
    'URL',
    'SESSION_UNIQUE_KEY',
    'CHAIN_NAME',
    'CHAIN_ID',
    'RPC',
    'API',
    'GAS_PRICE',
    'GAS',
    'FEE',
    'ERC20_CONTRACT_ADDRESS',
    'BRIDGE_CONTRACT_ADDRESS',
    'BRIDGE_FEE',
    'ETHEREUM_GAS_PRICE',
    'ETHEREUM_GAS'
];

if (process.env.NODE_ENV === 'production') {
    // envVariables.concat([
    //     'SESSION_STORE_TCP_ADDR',
    //     'SESSION_STORE_PORT',
    // ])
}

envVariables.forEach((envVariable) => {
    if (!process.env[envVariable]) {
        throw new Error(`Environment variable ${envVariable} is missing`);
    }
});

const URL_ROOT = process.env.URL + ((process.env.FRONTEND_PORT.trim() !== '') ? `:${process.env.FRONTEND_PORT}` : '')

const Config = {
    Build: {
        NAME: process.env.NODE_ENV,
        DEV: process.env.NODE_ENV === 'dev',
        PRODUCTION: process.env.NODE_ENV === 'production',
    },
    Database: {
        HOST: process.env.DATABASE_HOST,
        PORT: process.env.DATABASE_PORT,
        USER: process.env.DATABASE_USER,
        PASSWORD: process.env.DATABASE_PASS,
        NAME: process.env.DATABASE_NAME,
        LIMIT: process.env.DATABASE_CONNECTION_LIMIT,
    },
    Logger: {
        LEVEL: process.env.LOG_LEVEL || 'info',
        ENABLED: process.env.BOOLEAN ? process.env.BOOLEAN.toLowerCase() === 'true' : false,
    },
    Server: {
        BACKEND_PORT: Number(process.env.BACKEND_PORT),
        FRONTEND_PORT: Number(process.env.FRONTEND_PORT),
        SESSION_UNIQUE_KEY: process.env.SESSION_UNIQUE_KEY,
        SESSION_STORE_TCP_ADDR: process.env.SESSION_STORE_TCP_ADDR,
        SESSION_STORE_PORT: process.env.SESSION_STORE_PORT,
    },
    Path: {
        ROOT: path.join(__dirname, '..'),
        Root: {
            SRC: path.join(__dirname, '../src'),

            LOGS: path.join(__dirname, '../logs'),
            Logs: {
                ERROR: path.join(__dirname, '../logs/error.log'),
                REQUESTS: path.join(__dirname, '../logs/requests.log'),
                INFO: path.join(__dirname, '../logs/info.log'),
                DB: path.join(__dirname, '../logs/db.log'),
            },

            DATA: path.join(__dirname, '../data'),
            Data: {
                SESSIONS: path.join(__dirname, '../data/sessions'),
            },

            BACKEND: path.join(__dirname, '../src/backend'),
            Backend: {
                API: path.join(__dirname, '../src/backend/requests/api'),
                PAGES: path.join(__dirname, '../src/backend/requests/pages'),
                UTILITIES: path.join(__dirname, '../src/backend/utilities'),
                MODULES: path.join(__dirname, '../src/backend/modules'),
            },

            FRONTEND: path.join(__dirname, '../src/frontend'),
            Frontend: {
                RESOURCES: path.join(__dirname, '../src/frontend/resources'),

                PAGES: path.join(__dirname, '../src/frontend/pages'),
                Pages: {
                    GENERAL: path.join(__dirname, '../src/frontend/pages/general'),
                    CADMIN: path.join(__dirname, '../src/frontend/pages/cadmin'),
                },
            },
        },

        Builds: {
            DEV_GENERATED: path.join(__dirname, '../builds/dev-generated'),
            TEMP: path.join(__dirname, '../builds/temp'),
            Temp: {
                TEMP: path.join(__dirname, '../builds/temp/temp'),
                CACHE: path.join(__dirname, '../builds/temp/cache'),
                DEPLOYS: path.join(__dirname, '../builds/temp/deploys'),
            },
        },

        DEV: path.join(NODE_DIR, '/builds/dev'),
        Dev: {
            SRC: path.join(NODE_DIR, '/builds/dev/src'),
            LOGS: path.join(NODE_DIR, '/builds/dev/logs'),
            DATA: path.join(NODE_DIR, '/builds/dev/data'),

            BACKEND: path.join(NODE_DIR, '/builds/dev/src/backend'),
            Backend: {
                API: path.join(NODE_DIR, '/builds/dev/src/backend/requests/api'),
                PAGES: path.join(NODE_DIR, '/builds/dev/src/backend/requests/pages'),
                UTILITIES: path.join(NODE_DIR, '/builds/dev/src/backend/utilities'),
                MODULES: path.join(NODE_DIR, '/builds/dev/src/backend/modules'),
            },

            FRONTEND: path.join(NODE_DIR, '/builds/dev/src/frontend'),
            Frontend: {
                RESOURCES: path.join(NODE_DIR, '/builds/dev/src/frontend/resources'),

                PAGES: path.join(NODE_DIR, '/builds/dev/src/frontend/pages'),
                Pages: {
                    GENERAL: path.join(NODE_DIR, '/builds/dev/src/frontend/pages/general'),
                    CADMIN: path.join(NODE_DIR, '/builds/dev/src/frontend/pages/cadmin'),
                },
            },
        },

        PROD: path.join(NODE_DIR, '/builds/prod'),
        Prod: {
            SRC: path.join(NODE_DIR, '/builds/prod/src'),
            LOGS: path.join(NODE_DIR, '/builds/prod/logs'),
            DATA: path.join(NODE_DIR, '/builds/prod/data'),

            BACKEND: path.join(NODE_DIR, '/builds/prod/src/backend'),
            Backend: {
                API: path.join(NODE_DIR, '/builds/prod/src/backend/requests/api'),
                PAGES: path.join(NODE_DIR, '/builds/prod/src/backend/requests/pages'),
                UTILITIES: path.join(NODE_DIR, '/builds/prod/src/backend/utilities'),
                MODULES: path.join(NODE_DIR, '/builds/prod/src/backend/modules'),
            },

            FRONTEND: path.join(NODE_DIR, '/builds/prod/src/frontend'),
            Frontend: {
                RESOURCES: path.join(NODE_DIR, '/builds/prod/src/frontend/resources'),

                PAGES: path.join(NODE_DIR, '/builds/prod/src/frontend/pages'),
                Pages: {
                    GENERAL: path.join(NODE_DIR, '/builds/prod/src/frontend/pages/general'),
                    CADMIN: path.join(NODE_DIR, '/builds/prod/src/frontend/pages/cadmin'),
                },
            },
        },

        LANG: path.join(NODE_DIR, '/tools/lang'),
    },
    URL: {
        ROOT: URL_ROOT,

        RESOURCES: `${URL_ROOT}/resources`,
        Resources: {
            COMMON: `${URL_ROOT}/resources/common`,
            Common: {
                IMG: `${URL_ROOT}/resources/common/img`,
                FONTS: `${URL_ROOT}/resources/common/fonts`,
            },
            General: {
                VIEW: `${URL_ROOT}/resources/general/view`,
            },
            CAdmin: {
                VIEW: `${URL_ROOT}/resources/cadmin/view`,
            },
        },
        GENERAL: `${URL_ROOT}`,
        CADMIN: `${URL_ROOT}/cadmin`,
        API: `${URL_ROOT}/api`,
    },
    CUDOS_NETWORK: {
        CHAIN_NAME: process.env.CHAIN_NAME,
        CHAIN_ID: process.env.CHAIN_ID,
        RPC: process.env.RPC,
        API: process.env.API,
        GAS_PRICE: process.env.GAS_PRICE,
        FEE: process.env.FEE,
        GAS: process.env.GAS,
    },
    ORCHESTRATOR: {
        ERC20_CONTRACT_ADDRESS: process.env.ERC20_CONTRACT_ADDRESS,
        BRIDGE_CONTRACT_ADDRESS: process.env.BRIDGE_CONTRACT_ADDRESS,
        BRIDGE_FEE: process.env.BRIDGE_FEE,
    },
    ETHEREUM: {
        ETHEREUM_GAS_PRICE: process.env.ETHEREUM_GAS_PRICE,
        ETHEREUM_GAS: process.env.ETHEREUM_GAS,
        ETHEREUM_RPC: process.env.ETHEREUM_RPC,
    },
};

module.exports = Config;
