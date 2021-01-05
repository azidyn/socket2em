
const fs                = require('fs');
const WebSocketClient   = require('../../ws/WebsocketClient');
const OrderbookManager  = require('./orderbook/OrderbookManager');;
const Simulate          = require('../../util/simulate');
const EventEmitter      = require('../../util/EventEmitter');
const Trade             = require('./trade/Trade');


const URI       = 'wss://stream.bybit.com/realtime_public';
const CAPTURE   = null;// './btcusdt-linear-l2-replay.json';

let messages = [],  json, topic;

// Record l2 stream for replay debugging
if ( CAPTURE != null ) {

    setTimeout( ()=> {

        fs.writeFileSync( CAPTURE, JSON.stringify( messages ));
        process.exit();

    }, 10 * 1000 )

}

class ByBit extends EventEmitter {

    constructor( opts={} ) {

        super();

        this.opts = opts;
        this.connected = false;

        this.library = new OrderbookManager();
        this.trade = new Trade({ exchange:'bybit', sizetoquote: true, aggregate: true });

        if ( this.opts.simulate ) {
            
            console.log('Running simulation')
            Simulate.run( `${__dirname}/btcusdt-linear-l2-replay.json`, this.opts.simulate, (this.delegate).bind(this) );

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

    orderbook( instrument ) {

        this.subscribe( instrument, 'orderBook_200.100ms' );
    }

    trades( instrument ) {

        this.subscribe( instrument, 'trade' );
    }    

    stop( instrument, topic ) {
        // unsubscribe from stream
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
            args: [ `${channel}.${instrument}` ]
        };
    }

    delegate( data ) {
      
        if ( CAPTURE != null )
            return;

        json = JSON.parse( data );

        if ( !json.topic )
            return;
       
        // "orderBook_200.100ms.BTCUSD"
        try {
            topic = json.topic.split('.');
        } catch( e ) {
            console.log(e )
            process.exit();
        }

        switch( topic[0] ) {

            case "orderBook_200": 
                this.fire('orderbook', this.library.handle( json, topic[2] ) );
                break;

            case "trade": 
                // console.log( json.data )
                this.fire('trades', this.trade.handle( json.data ));
                break;

        }

    }

}

module.exports = ByBit;
