
const MAPSIDE = {
    'Buy': 'buy',
    'Sell': 'sell'
};

class Trade {

    constructor( opts={} ) {

        this.aggregate = opts.aggregate;
    }

    handle( trades ) {
        
        if ( this.aggregate )
            return this.agg( trades );

        return trades.map( t => ({
            timestamp: t.trade_time_ms,
            exchange: 'ibybit',
            symbol: t.symbol,
            side: MAPSIDE[ t.side ],
            price: t.price,
            size: t.size
        }));

    }

    agg( trades ){

        // Use execution timestamp, side, symbol to aggregate trades

        let agg = [], lt = '';
        let lprice=0, lsum = 0, lside ='', lsym = '';
        for ( let t of trades ) {
        
            if ( t.trade_time_ms != lt || t.side != lside || t.symbol != lsym ) {
                
                if ( lsum ) { 
                    agg.push({ 
                        aggregate: true,
                        timestamp: lt,
                        exchange: 'ibybit',
                        symbol: lsym,
                        side: MAPSIDE[ lside ],
                        price: lprice, 
                        size: lsum, 
                    });
                }

                lt = t.trade_time_ms;
                lsum = t.size;
                lprice = t.price;
                lside = t.side;
                lsym = t.symbol;

            } else {
                lsum += t.size;
            }
        }        

        if ( lsum ) { 
            agg.push({ 
                aggregate: true,
                timestamp: lt,
                exchange: 'ibybit',
                symbol: lsym,
                side: MAPSIDE[ lside ],
                price: lprice, 
                size: lsum, 
            });
        }

        return agg;

    }

}

module.exports = Trade