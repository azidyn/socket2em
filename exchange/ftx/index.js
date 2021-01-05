
const Simulate          = require('../../util/simulate');
const fs                = require('fs');
const WebSocketClient   = require('../../ws/WebsocketClient');
const OrderbookManager  = require('./orderbook/OrderbookManager');;
const EventEmitter      = require('../../util/EventEmitter');
const Trade             = require('./trade/Trade');

const URI       = 'wss://ftx.com/ws/';
const CAPTURE   =  null;//'./btcperp-l2-stream.json';

let json, messages = [];

// Record l2 stream for replay debugging
if ( CAPTURE != null ) {

    setTimeout( ()=> {

        fs.writeFileSync( CAPTURE, JSON.stringify( messages ));
        console.log('Captured!');
        process.exit();

    }, 10 * 1000 )

}

class ftx extends EventEmitter {

    constructor( opts={} ) {

        super();

        this.opts = opts;
        this.connected = false;

        this.library = new OrderbookManager();
        this.trade = new Trade({ aggregate: false });

        if ( this.opts.simulate ) {
            
            console.log('Running simulation')
            Simulate.run(`${__dirname}/btcperp-l2-stream.json`, this.opts.simulate, (this.delegate).bind(this) );

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

    trades( instrument ) {
        // this.subscribe( instrument, 'trade' );
    }

    orderbook( instrument ) {

        // this.subscribe( instrument, 'orderBookL2' );

    }

    stop( instrument, topic ) {
        
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
            channel,
            market: instrument
        };
    }

    delegate( data ) {

        if ( CAPTURE != null )
            return;

        json = JSON.parse( data );

        switch( json.channel ) {

            case "orderbook": 

                this.library.handle( json )
                // this.fire('orderbook',  )
                break;

            case "trade":

                this.fire( 'trades', this.trade.handle( json.data ) )
                break;


        }

    }

}

module.exports = ftx;
