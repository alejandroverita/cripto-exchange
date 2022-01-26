<template>
  <div>
    <ring-loader v-show="loading" :color="'#68d391'"></ring-loader>
    <px-assets-table v-if="!loading" :assets="assets" />
  </div>
</template>

<script>
import PxAssetsTable from '../components/PxAssetsTable.vue'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import api from '../api'

export default {
  name: 'Home',
  components: { PxAssetsTable, RingLoader },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      assets: [],
    }
  },

  created() {
    api.getAssets().then((res) => (this.assets = res))
    // .finally( () => this.isLoading = false)
  },
}
</script>
