import BigNumber from 'bignumber.js';

export default class CosmosNetworkH {

    static CURRENCY_DISPLAY_NAME = 'CUDOS';
    static CURRENCY_DENOM = 'acudos';
    static CURRENCY_DECIMALS = 18;
    static CURRENCY_COINGECKO_ID = 'cudos';
    static CURRENCY_1_CUDO = new BigNumber(`1${'0'.repeat(CosmosNetworkH.CURRENCY_DECIMALS)}`);

    static LEDGER_COIN_TYPE = 118;
    static BECH32_PREFIX_ACC_ADDR = 'cudos';
    static BECH32_PREFIX_ACC_PUB = 'cudospub';
    static BECH32_PREFIX_VAL_ADDR = 'cudosvaloper';
    static BECH32_PREFIX_VAL_PUB = 'cudosvaloperpub';
    static BECH32_PREFIX_CONS_ADDR = 'cudosvalcons';
    static BECH32_PREFIX_CONS_PUB = 'cudosvalconspub';
    static BECH32_ACC_ADDR_LENGTH = 44;

    static MESSAGE_TYPE_URL = '/gravity.v1.MsgSendToEth';
}
