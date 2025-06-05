import { ref } from "vue";
import type { Market } from "@/utils/Types";
import { defineStore } from "pinia";

export const useMarketStore = defineStore("market", () => {
    const markets = ref<Market[]>([]);
})


