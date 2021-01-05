
const bugger = buggerit( true );


class Orderbook {

    constructor() {

        // Map `id` to price. I kinda hate this, BitMEX. Shouldn't really
        // enforce a client-side structure down the wire.

        this.id = new Map();

    }

    partial( delta ) {

        bugger( delta )

    }

    insert( delta ) {

    }

    update( delta ) {

        // bugger( delta )

    }

    delete( delta ) {
        
        // -+bugger( delta )

    }

}


class OrderbookManager {

    constructor() { 
        
        // Multiple orderbooks here, e.g. library['ETHUSD'], library['XBTUSD']
        this.library = { };

    }

    handle( msg ) {

        let action = msg.action;

        if ( msg.action == 'partial' )
            this.partial( msg );
        else
            this.delta( msg, action );

    }

    partial( msg ) {

        // Full book reset on partial

        const lob = new Orderbook();
        this.library[ msg.filter.symbol ] = lob;

        this.delta( msg, 'partial' );

    }

    delta( msg, action ) {

        if ( !msg.data ) return;
        
        let d, L = this.library;

        // Iterate each data update
        for ( d of msg.data ) {

            if ( L[ d.symbol ] )
                L[ d.symbol ][ action ]( d );
            
        }

    }


}



module.exports = OrderbookManager;