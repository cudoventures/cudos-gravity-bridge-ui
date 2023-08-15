import BigNumber from 'bignumber.js';

const options = {
    style: 'currency',
    useGrouping: 'always',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
};

function baseFormat(amount: string, showCurrency = true, decimals = 2): string {
    options.maximumFractionDigits = decimals;
    options.minimumFractionDigits = decimals;
    options.style = showCurrency === true ? 'currency' : 'decimal';
    const numberFormat = new Intl.NumberFormat('en-US', options);
    return numberFormat.format(amount);
}

export function formatUsd(amount: number, showCurrency = true, decimals = 2): string {
    return baseFormat(amount.toString(), showCurrency, decimals);
}

export function formatBtc(amount: BigNumber | number, showCurrency = false, decimals = 6): string {
    return `${baseFormat(amount.toString(), false, decimals)}${showCurrency ? ' BTC' : ''}`;
}

export function formatEth(amount: BigNumber | number, showCurrency = false, decimals = 6): string {
    return `${baseFormat(amount.toString(), false, decimals)}${showCurrency ? ' ETH' : ''}`;
}

export function formatCudos(amount: BigNumber | number, showCurrency = false, decimals = 2): string {
    return `${baseFormat(amount.toString(), false, decimals)}${showCurrency ? ' CUDOS' : ''}`;
}

export function formatTHs(amount: number, showCurrency = false, decimals = 2): string {
    return `${baseFormat(amount.toString(), false, decimals)}${showCurrency ? ' TH/s' : ''}`;
}

export function formatPercent(amount: number, showCurrency = false, decimals = 2): string {
    return `${baseFormat(amount.toString(), false, decimals)}${showCurrency ? ' %' : ''}`;
}
