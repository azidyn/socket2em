<template>
  <div id="app">
  <!-- <div> -->
    <div class="row">
      <div class="col m-3">
        <h3>socket2em | realtime demo</h3>
        <a href="https://github.com/azidyn/socket2em">https://github.com/azidyn/socket2em</a>
      </div>
    </div>

  <!--
      { bid: [ [ 1019.4, 467 ], [ 1019, 150 ], [ 1018.95, 50 ] ],
        ask: [ [ 1019.75, 500 ], [ 1019.8, 12053 ], [ 1019.85, 12050 ] ] }  
    -->

    <div class="row m-1">

      <div class="col">
          <table>
            <tr v-for="row in this.lob.bitmex.eth.asks" :key = "row[0]" style='background-color:#fdd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>

            <tr >
              <td style="padding: 5px; font-weight:bold" colspan="2">BitMEX:ETHUSD</td>
            </tr>

            <tr v-for="row in this.lob.bitmex.eth.bids" :key = "row[0]" style='background-color:#dfd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>
          </table>        

      </div>

    <div class="col">
          <table>
            <tr v-for="row in this.lob.ftx.btc.asks" :key = "row[0]" style='background-color:#fdd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>

            <tr >
              <td style="padding: 5px; font-weight:bold" colspan="2">FTX:ETH-PERP</td>
            </tr>

            <tr v-for="row in this.lob.ftx.btc.bids" :key = "row[0]" style='background-color:#dfd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>
          </table>        

      </div>         


      <div class="col">
          <table>
            <tr v-for="row in this.lob.bitmex.xbt.asks" :key = "row[0]" style='background-color:#fdd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>

            <tr >
              <td style="padding: 5px; font-weight:bold" colspan="2">BitMEX:XBTUSD</td>
            </tr>

            <tr v-for="row in this.lob.bitmex.xbt.bids" :key = "row[0]" style='background-color:#dfd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>
          </table>        

      </div>

    <div class="col">
          <table>
            <tr v-for="row in this.lob.bybit.btc.asks" :key = "row[0]" style='background-color:#fdd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>

            <tr >
              <td style="padding: 5px; font-weight:bold" colspan="2">ByBit-Linear:BTCUSDT</td>
            </tr>

            <tr v-for="row in this.lob.bybit.btc.bids" :key = "row[0]" style='background-color:#dfd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>
          </table>        

      </div>      

    <div class="col">
          <table>
            <tr v-for="row in this.lob.ibybit.btc.asks" :key = "row[0]" style='background-color:#fdd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>

            <tr >
              <td style="padding: 5px; font-weight:bold" colspan="2">ByBit-Inverse:BTCUSD</td>
            </tr>

            <tr v-for="row in this.lob.ibybit.btc.bids" :key = "row[0]" style='background-color:#dfd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>
          </table>        

      </div>         

        

      <div class="col">
        <table class="table">
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th>Price</th>
            <th>Size</th>
          </tr>
          <tr v-for="row in this.trades" :key=" row.id " :style=" row.side == 'sell' ? 'background-color: #fdd' : 'background-color: #dfd' ">
            <td>{{ row.side == 'sell' ? '🍅' : '🥒'}}</td>
            <td>{{ row.exchange }}</td>
            <td>{{ row.symbol }}</td>
            <td>{{ row.price }}</td>
            <td>{{ row.size }}</td>
          </tr>
        </table>

      </div>

      <!-- <div class="col">

        <table>
          <caption>BitMEX:XBTUSD</caption>
          <tr v-for="row in this.xbt.ask.reverse()" :key = "row[0]" style='background-color:#fdd' >
            <td>{{ row[0] }}</td>
            <td>{{ row[1] }} </td>
          </tr>

          <tr v-for="row in this.xbt.bid" :key = "row[0]" style='background-color:#dfd' >
            <td>{{ row[0] }}</td>
            <td>{{ row[1] }} </td>
          </tr>
        </table>  

      </div> -->

    </div>


  

  </div>


</template>

<script>

require('../../util/debug');

const BitMEX = require('../../exchange/bitmex');
const ByBit = require('../../exchange/bybit/linear');
const iByBit = require('../../exchange/bybit/inverse');
const FTX = require('../../exchange/ftx');


export default {
  name: 'App',
  components: {
    
  },

  methods: {
    dotrades: function( trades ) {
      
      for ( let t of trades ) {
        if ( t.size >= this.minsizetrade ) {
          t.id = this.id++;
          this.trades2.push( t );
        }
      }

      this.trades = (this.trades2.slice( -20 )).reverse();
      this.trades2 = this.trades2.slice( -20 );

    }
  },

  data() {
    return {

      minsizetrade: 5000,

      id: 0,

      trades: [],

      trades2: [],

      bitmex: null,
      bybit: null,
      ftx: null,

      lob: {
        bitmex: {
          eth: { 
            bids: [],
            asks: []
          },
          xbt: { 
            bids: [],
            asks: []
          }      
        },

        bybit: {
          btc: { 
            bids: [],
            asks: []
          }
        },

        ibybit: {
          btc: { 
            bids: [],
            asks: []
          }
        },

        ftx: {
          btc: { 
            bids: [],
            asks: []
          }
        }        



      }

      // xbt: { bid: [], ask: [] }

    }
  },

  mounted() {



    this.bitmex = new BitMEX();
    this.bybit = new ByBit();
    this.ibybit = new iByBit();
    this.ftx = new FTX();

    // subscribe orderbooks
    this.bitmex.orderbook('ETHUSD');
    this.bitmex.orderbook('XBTUSD');
    this.bybit.orderbook('BTCUSDT')
    this.ibybit.orderbook('BTCUSD')
    this.ftx.orderbook('ETH-PERP');

    //subscribe trades
    this.bitmex.trades('XBTUSD');
    this.bybit.trades('BTCUSDT');
    this.ibybit.trades('BTCUSD');
    this.ftx.trades('BTC-PERP');

    this.bitmex.connect();
    this.bybit.connect();
    this.ibybit.connect();
    this.ftx.connect();


    this.bitmex.on('trades', this.dotrades );
    this.bybit.on('trades', this.dotrades );
    this.ibybit.on('trades', this.dotrades );
    this.ftx.on('trades', this.dotrades );

    // this.bitmex.on('orderbook', state => {
    //   if ( state.instrument != 'XBTUSD') return;

    //   let xbt = this.bitmex.library.snapshot( 'XBTUSD', 10 );

    //     if ( xbt ) {

    //       this.lob.bitmex.xbt.bids = xbt.bid;
    //       this.lob.bitmex.xbt.asks = xbt.ask.reverse();
        
    //     }

    // })
      
    setInterval( ()=> {

        let eth = this.bitmex.library.snapshot( 'ETHUSD', 10 );
        let xbt = this.bitmex.library.snapshot( 'XBTUSD', 10 );
        let bybit_btc = this.bybit.library.snapshot('BTCUSDT', 10 );
        let ibybit_btc = this.ibybit.library.snapshot('BTCUSD', 10 );
        let ftx = this.ftx.library.snapshot('ETH-PERP', 10 );

        if ( eth ) {

          this.lob.bitmex.eth.bids = eth.bid;
          this.lob.bitmex.eth.asks = eth.ask.reverse();
        
        }

        if ( xbt ) {

          this.lob.bitmex.xbt.bids = xbt.bid;
          this.lob.bitmex.xbt.asks = xbt.ask.reverse();
        
        }

        if ( bybit_btc ) {

          this.lob.bybit.btc.bids = bybit_btc.bid;
          this.lob.bybit.btc.asks = bybit_btc.ask.reverse();

        }


        if ( ibybit_btc ) {

          this.lob.ibybit.btc.bids = ibybit_btc.bid;
          this.lob.ibybit.btc.asks = ibybit_btc.ask.reverse();

        }  
        

        if ( ftx ) {

          this.lob.ftx.btc.bids = ftx.bid;
          this.lob.ftx.btc.asks = ftx.ask.reverse();

        }        


    }, 200 );

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 0.8rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 20px;
  margin: 10
}
</style>
