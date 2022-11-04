import fs from 'fs';

import CudosBridgeH from './CudosBridge.h';
import SV from '../../../../utilities/SV';
import Context from '../../../../utilities/network/Context';

const Config = require('../../../../../../config/config');

const TEMPLATE = require(CudosBridgeH.TEMPLATE_PATH);

const CSS_PAGE_LOADING = fs.readFileSync(`${Config.Path.Root.Frontend.RESOURCES}/common/css/inline/page-loading.css`);

export default class CudosBridge extends CudosBridgeH {

    async onRequest(context: Context): Promise < boolean > {
        context.payload.ctx.type = 'html';
        context.payload.ctx.body = TEMPLATE.stream({
            META: {
                TITLE: 'CUDOS Bridge | Migrate tokens between Blockchains',
                DESC: 'A tool for migrating your tokens between the Ethereum and the CUDOS blockchain. Allows ERC-20 holders to migrate to the native CUDOS token & stake.',
                KEYWORDS: SV.KEYWORDS,
                ROBOTS: 'all',
                PAGE_URL: `${Config.URL.GENERAL}${CudosBridge.URL}`,
            },
            CSS: {
                PAGE_LOADING: CSS_PAGE_LOADING,
            },
            TR: context.payload.ctx.TR,
            TR_STRING: context.payload.ctx.TR_STRING,
            Config,
        });

        return true;
    }

}
