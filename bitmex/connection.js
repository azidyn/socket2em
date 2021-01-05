
const WebSocketClient = require('../ws/WebsocketClient');
const OrderbookManager = require('./orderbook');

const URI = 'wss://www.bitmex.com/realtime';

const fs = require('fs');

const CAPTURE =  null;//'./ethusd-l2-stream.json';

let messages = [];

let json;

// Record l2 stream for replay debugging
if ( CAPTURE != null ) {

    setTimeout( ()=> {

        fs.writeFileSync( CAPTURE, JSON.stringify( messages ));
        process.exit();

    }, 10 * 1000 )

}

class bitmex {

    constructor( opts={} ) {

        this.opts = opts;
        this.connected = false;

        this.library = new OrderbookManager();

        if ( this.opts.simulate ) {
            
            console.log('Running simulation')

            const Simulate = require('./simulate');
            Simulate.run( this.opts.simulate, (this.delegate).bind(this) );

            return;
        }

        this.subs = { };

        this.ws = new WebSocketClient();

        this.ws.onopen = () => { 
           
            this.connected = true;

            for ( const i in this.subs ) {

                const args = this.subs[ i ];
                
                for ( const a of args )
                    this.listen( this.fmt( i, a ) );

            }

        };

        this.ws.onclose = () => {

            this.connected = false;

        }

        this.ws.onmessage = data => {
            
            if ( CAPTURE != null )
                messages.push( data );

            this.delegate( data );

        }


    }

    subscribe( instrument, channel ) {

        if ( this.opts.simulate )
            return;

        this.subs[ instrument ] = this.subs[ instrument ] || [];

        let args = this.subs[ instrument ];

        if ( args.includes( channel ) )
            return;
        
        this.subs[ instrument ].push( channel );
     
        this.listen( this.fmt( instrument, channel ) );
        
    }

    listen( m ) {

        if ( this.opts.simulate )
            return;

        if ( !this.connected )
            return;

        this.ws.send( JSON.stringify( m ) );

    }

    connect( ) {

        if ( this.opts.simulate )
            return;

        this.ws.open( URI );

    }


    fmt( instrument, channel ) {

        return {
            op: "subscribe",
            args: [ `${channel}:${instrument}` ]
        };
    }

    delegate( data ) {

        if ( CAPTURE != null )
            return;

        json = JSON.parse( data );

        switch( json.table ) {
            case "orderBookL2_25": 
                this.library.handle( json );
                break;


        }

    }



}

module.exports = bitmex;