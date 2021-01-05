
const MAPSIDE = {
    'Buy': 'buy',
    'Sell': 'sell'
};

class Trade {

    constructor( opts={} ) {

        this.aggregate = opts.aggregate;
        this.exchange = 'ftx',
        this.sizetoquote = opts.sizetoquote || false;

    }

    handle( instrument, trades ) {
        
        if ( this.aggregate )
            return this.agg( instrument, trades );

        return trades.map( t => ({
            timestamp: Date.parse( t.time ),
            exchange: this.exchange,
            symbol: instrument,
            side: t.side,
            price: Number( t.price ),
            size: this.sizetoquote ? Mathr.round( Number( t.size ) * Number( t.price ) ) : Number( t.size ),
            sizecoin: Number( t.size )
        }));

    }

    agg( instrument, trades ){

        // Use execution timestamp, side, symbol to aggregate trades

        let agg = [], lt = '';
        let lprice=0, lsum = 0, lside ='';

        for ( let t of trades ) {
        
            if ( t.time != lt || t.side != lside ) {
                
                if ( lsum ) { 
                    agg.push({ 
                        aggregate: true,
                        timestamp: lt,
                        exchange: this.exchange,
                        symbol: instrument,
                        side: lside,
                        price: lprice, 
                        size: this.sizetoquote ? Math.round( lsum * lprice) : lsum,
                        sizecoin: lsum      
                    });
                }

                lt = Date.parse( t.time );
                lsum = Number( t.size );
                lprice = Number( t.price );
                lside = t.side;

            } else {
                lsum += Number( t.size );
            }
        }        

        if ( lsum ) { 
            agg.push({ 
                aggregate: true,
                timestamp: lt,
                exchange: this.exchange,
                symbol: instrument,
                side: lside,
                price: lprice, 
                size: this.sizetoquote ?  Math.round( lsum * lprice) : lsum,
                sizecoin: lsum      
            });
        }

        return agg;

    }

}

module.exports = Trade