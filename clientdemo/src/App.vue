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

      <div class="col-3">
          <table>
            <tr v-for="row in this.eth.asks" :key = "row[0]" style='background-color:#fdd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>

            <tr >
              <td style="padding: 5px; font-weight:bold" colspan="2">BitMEX:ETHUSD</td>
            </tr>

            <tr v-for="row in this.eth.bids" :key = "row[0]" style='background-color:#dfd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>
          </table>        

      </div>


      <div class="col-3">
          <table>
            <tr v-for="row in this.xbt.asks" :key = "row[0]" style='background-color:#fdd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
            </tr>

            <tr >
              <td style="padding: 5px; font-weight:bold" colspan="2">BitMEX:XBTUSD</td>
            </tr>

            <tr v-for="row in this.xbt.bids" :key = "row[0]" style='background-color:#dfd' >
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }} </td>
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


export default {
  name: 'App',
  components: {
    
  },

  data() {
    return {

      bitmex: null,

      eth: { 
        bids: [],
        asks: []
      },

      xbt: { 
        bids: [],
        asks: []
      }      

      // xbt: { bid: [], ask: [] }

    }
  },

  mounted() {

    this.bitmex = new BitMEX();

    this.bitmex.connect();

    this.bitmex.subscribe('ETHUSD', 'orderBookL2');
    this.bitmex.subscribe('XBTUSD', 'orderBookL2');

    setInterval( ()=> {

        let eth = this.bitmex.library.snapshot( 'ETHUSD', 10 );
        let xbt = this.bitmex.library.snapshot( 'XBTUSD', 10 );

        if ( eth ) {

          this.eth.bids = eth.bid;
          this.eth.asks = eth.ask.reverse();
        
        }

        if ( xbt ) {

          this.xbt.bids = xbt.bid;
          this.xbt.asks = xbt.ask.reverse();
        
        }

    }, 50 );

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
