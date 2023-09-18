export enum PAIR_ENUM {
    'EUR/USD' = 'eur/usd',
    'USD/CHF' = 'usd/chf'
}

export enum ORDER_ENUM {
    'SELL' = 'sell',
    'BUY' = 'buy',
    'SELL_LIMIT' = 'sell_limit',
    'BUY_LIMIT' = 'buy_limit'
}

export const orderColor = {
    [ORDER_ENUM.SELL]: 'bg-red-100 text-red-700',
    [ORDER_ENUM.BUY]: 'bg-green-100 text-green-700',
    [ORDER_ENUM.BUY_LIMIT]: 'bg-cyan-100 text-cyan-700',
    [ORDER_ENUM.SELL_LIMIT]: 'bg-fuchsia-100 text-fuchsia-700'
}
