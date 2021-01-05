
const bugger = buggerit( true );


class Orderbook {

    constructor() {

        // Map `id` to price. I kinda hate this, BitMEX. Shouldn't really
        // enforce a client-side structure down the wire.

        this.id = new Map();

    }

}


class OrderbookManager {

    constructor() { 
        this.library = { };
    }

    handle( msg ) {

        this[ msg.action ]( msg );

    }

    partial( msg ) {

        // Full book reset on partial

        bugger(`created new book ${msg.filter.symbol}`);

        this.library[ msg.filter.symbol ] = new Orderbook();

    }

    update( msg ) {

        if ( !msg.data ) return;
        
        let d, checked = false;

        // Iterate each data update
        for ( d of msg.data ) {

            if ( !checked ) {

                if ( !this.library[ d.symbol ] ) // check once, fast abort if not initialized
                    return;

                checked = true;
            }
            
        }

    }

    insert( msg ) {

       
    }

    delete( msg ) {


    }

}



module.exports = OrderbookManager;