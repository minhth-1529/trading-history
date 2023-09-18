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

export const ORDER_VALUE = {
    'sell':{
        label: 'SELL',
        value: 'sell'
    },
    'buy':{
        label: 'BUY',
        value: 'buy'
    }
}
