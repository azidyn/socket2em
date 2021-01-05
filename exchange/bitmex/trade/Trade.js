
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
            timestamp: Date.parse( t.timestamp ),
            exchange: 'bitmex',
            symbol: t.symbol,
            side: MAPSIDE[ t.side ],
            price: t.price,
            size: t.size
        }));

    }

    agg( trades ){

        let agg = [], lt = '';
        let lprice=0, lsum = 0, lside ='', lsym = '';
        for ( let t of trades ) {
        
            if ( t.timestamp != lt || t.side != lside || t.symbol != lsym ) {
                
                if ( lsum ) { 
                    agg.push({ 
                        aggregate: true,
                        timestamp: Date.parse( lt ),
                        exchange: 'bitmex',
                        symbol: lsym,
                        side: MAPSIDE[ lside ],
                        price: lprice, 
                        size: lsum, 
                    });
                }

                lt = t.timestamp;
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
                timestamp: Date.parse( lt ),
                exchange: 'bitmex',
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