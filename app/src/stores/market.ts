import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

import type { Market } from '@/utils/Types'

export const useMarketStore = defineStore('market', () => {
    const availableMarkets = ref<Market[]>([])

    async function refreshMarkets() {
        const { data: marketsData, error: marketsError } = await supabase.from('OpenMarkets').select()

        if (marketsError) { return { success: false, error: marketsError.message } }

        availableMarkets.value = marketsData as Market[]

        return { success: true, error: "" }
    }
    
    async function betOnMarket(marketId: string, betAmount: number) {
        console.log("Betting on market:", marketId, "with amount:", betAmount)
    }

    return { availableMarkets, refreshMarkets, betOnMarket}
})