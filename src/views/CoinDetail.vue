<template>
  <div class="flex-col">
    <div class="flex justify-center">
      <ring-loader class="my-10" v-show="loading" :color="'#68d391'">
      </ring-loader>
    </div>
    <template v-if="!loading">
      <div class="flex flex-col lg:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ dollarFilter(asset.priceUsd) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ dollarFilter(min) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ dollarFilter(max) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ dollarFilter(avg) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ percentFilter(asset.changePercent24Hr) }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="toggleConverter"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ fromUsd ? `USD to ${asset.symbol}` : `${asset.symbol} to USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                v-model="convertValue"
                id="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
              />
            </label>
          </div>

          <span class="text-xl">
            {{ convertResult }} {{ fromUsd ? asset.symbol : 'USD' }}</span
          >
        </div>
      </div>
      <line-chart
        class="my-10"
        :colors="['orange']"
        :min="min"
        :max="max"
        :data="history.map((h) => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
      />

      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table>
        <tr
          v-for="m in markets"
          :key="`${m.exchangeid}-${m.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>{{ dollarFilter(m.priceUsd) }}</td>
          <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
          <td>
            <px-button
              :loading="m.loading || false"
              v-if="!m.url"
              v-on:click="getWebSite(m)"
            >
              <slot>Obtener link</slot>
            </px-button>
            <a v-else class="hover:underline text-green-600" target="_blanck">
              {{ m.url }}
            </a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import PxButton from '../components/PxButton.vue'
import api from '../api'
import { dollarFilter, percentFilter } from '../filter'
import RingLoader from 'vue-spinner/src/RingLoader.vue'

export default {
  name: 'CoinDetail',

  components: {
    RingLoader,
    PxButton,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isLoading: false,
      asset: {},
      history: [],
      markets: [],
      fromUsd: true,
      convertValue: null,
    }
  },

  setup() {
    return {
      dollarFilter,
      percentFilter,
    }
  },

  computed: {
    convertResult() {
      if (!this.convertValue) {
        return 0
      }

      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd

      return result.toFixed(2)
    },

    min() {
      return Math.min(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      )
    },

    max() {
      return Math.max(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      )
    },

    avg() {
      return (
        this.history.reduce((a, b) => a + parseFloat(b.priceUsd), 0) /
        this.history.length
      )
    },
  },

  watch: {
    $route() {
      this.getCoin()
    },
  },

  created() {
    this.getCoin()
    // this.$watch(
    //   () => this.$route.params,
    //   (toParams, previousParams) => {
    //     this.getCoin();
    //   }
    // )
  },

  methods: {
    toggleConverter() {
      this.fromUsd = !this.fromUsd
    },

    getWebSite(exchange) {
      exchange.isLoading = true
      return api
        .getExchanges(exchange.exchangeId)
        .then((res) => {
          exchange.url = res.exchangeUrl
        })
        .finally(() => {
          exchange.isLoading = false
        })
    },

    getCoin() {
      const id = this.$route.params.id

      // this.isLoading = true

      Promise.all([
        api.getAsset(id),
        api.getAssetHistory(id),
        api.getMarkets(id),
      ]).then(([asset, history, markets]) => {
        this.asset = asset
        this.history = history
        this.markets = markets
      }) //.finally(()=> (this.props.loading = false))
    },
  },
}
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
