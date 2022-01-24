import axios from 'axios';

const url = `https://api.etherscan.io/api
?module=gastracker
&action=gasoracle
&apikey=${process.env.ETHEREUM_GAS_ESTIMATE}`

export const api = () => {
    axios.get(url).then((res) => {
        /* Gas Fee temporarily disabled */
        // console.log('response', res);
    })
}
