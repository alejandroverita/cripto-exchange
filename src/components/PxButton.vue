<template>
  <button
    @click="buttonClick"
    class="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-2 border border-green-500 hover:border-transparent rounded"
  >
    <beat-loader class="my-10" :loading="loading" :color="'#68d391'">
    </beat-loader>
    <p v-show="!loading">
      <slot></slot>
    </p>
  </button>
</template>

<script>
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'

export default {
  name: 'PxButton',

  components: {
    BeatLoader,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    buttonClick() {
      this.$emit('click')
    },
  },
}
</script>
