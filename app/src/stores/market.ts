import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import type { Market, MarketWithAggregated, AggregatedData } from '@/utils/Types'

export const useMarketStore = defineStore('market', () => {
  const marketsWithAggregates = ref<MarketWithAggregated[]>([])
  const selectedMarket = ref<MarketWithAggregated | null>(null)

  function computeAggregates(singleMarket: Market): MarketWithAggregated {
    const aggregatedMetrics: AggregatedData = {
      totalShares: 0,
      volume: 0,
      option1: { shares: 0, volume: 0 },
      option2: { shares: 0, volume: 0 },
    }

    singleMarket.shares.Option1.forEach((shareRecord) => {
      aggregatedMetrics.option1.volume += shareRecord.BoughtValue
      aggregatedMetrics.option1.shares += 1
      aggregatedMetrics.volume += shareRecord.BoughtValue
      aggregatedMetrics.totalShares += 1
    })

    singleMarket.shares.Option2.forEach((shareRecord) => {
      aggregatedMetrics.option2.volume += shareRecord.BoughtValue
      aggregatedMetrics.option2.shares += 1
      aggregatedMetrics.volume += shareRecord.BoughtValue
      aggregatedMetrics.totalShares += 1
    })

    const nowTimestamp = Date.now()
    const projectedEndTime = new Date(singleMarket.projected_end).getTime()
    const marketStatus: MarketWithAggregated['status'] = projectedEndTime > nowTimestamp ? 'open' : 'closed'

    return { ...singleMarket, aggregated: aggregatedMetrics, status: marketStatus }
  }

  async function fetchMarketById(id: string) {
    const { data, error } = await supabase.from('OpenMarkets').select('*').eq('marketid', id).single()

    if (error) {
      selectedMarket.value = null
      console.log("Hell nah!")
      return { success: false, error: error.message }
    }

    const market = data as Market
    selectedMarket.value = computeAggregates(market)

    console.log(`Fetched market ${id}:`, selectedMarket.value)
    return { success: true, error: '' }
  }

  async function refreshMarkets() {
    const { data: marketRecords, error } = await supabase.from('OpenMarkets').select()

    if (error) {
      return { success: false, error: error.message }
    }

    const rawMarketList = marketRecords as Market[]
    marketsWithAggregates.value = rawMarketList.map(computeAggregates)

    return { success: true, error: '' }
  }

  async function betOnMarket(marketId: string, betAmount: number) {
    console.log(`Placing a bet of $${betAmount} on market ${marketId}`)
  }

  return { marketsWithAggregates, selectedMarket, refreshMarkets, fetchMarketById,betOnMarket }
})
