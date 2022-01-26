<template>
  <header class="shadow w-screen">
    <nav>
      <nav class="flex items-center justify-between flex-wrap bg-green-400 p-6">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
          <px-icon class="mr-2" />
          <router-link to="/" class="font-semibold text-xl tracking-tight">
            Coin Exchange
          </router-link>
        </div>
        <div
          class="hidden sm:flex block flex-grow lg:flex lg:items-center lg:w-auto justify-start"
        >
          <div class="text-sm">
            <router-link
              v-for="l in links"
              :key="l.title"
              :to="l.to"
              class="mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
              {{ l.title }}
            </router-link>
          </div>
        </div>
      </nav>
    </nav>
  </header>
</template>

<script>
import PxIcon from './PxIcon.vue'

export default {
  name: 'PxHeader',

  components: { PxIcon },

  props: {
    links: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
