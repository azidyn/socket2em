
const MAPSIDE = {
    'Buy': 'buy',
    'Sell': 'sell'
};

class Trade {

    constructor( opts={} ) {

        this.aggregate = opts.aggregate;
        this.exchange = opts.exchange || 'bybit';
        this.sizetoquote = opts.sizetoquote || false;

    }

    handle( trades ) {
        
        if ( this.aggregate )
            return this.agg( trades );

        return trades.map( t => ({
            timestamp: Number( t.trade_time_ms ),
            exchange: this.exchange,
            symbol: t.symbol,
            side: MAPSIDE[ t.side ],
            price: Number( t.price ),
            size: this.sizetoquote ? Mathr.round( Number( t.size ) * Number( t.price ) ) : Number( t.size ),
            sizecoin: Number( t.size )
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
                        exchange: this.exchange,
                        symbol: lsym,
                        side: MAPSIDE[ lside ],
                        price: lprice, 
                        size: this.sizetoquote ? Math.round( lsum * lprice) : lsum,
                        sizecoin: lsum      
                    });
                }

                lt = Number( t.trade_time_ms );
                lsum = Number( t.size );
                lprice = Number( t.price );
                lside = t.side;
                lsym = t.symbol;

            } else {
                lsum += Number( t.size );
            }
        }        

        if ( lsum ) { 
            agg.push({ 
                aggregate: true,
                timestamp: lt,
                exchange: this.exchange,
                symbol: lsym,
                side: MAPSIDE[ lside ],
                price: lprice, 
                size: this.sizetoquote ?  Math.round( lsum * lprice) : lsum,
                sizecoin: lsum      
            });
        }

        return agg;

    }

}

module.exports = Trade