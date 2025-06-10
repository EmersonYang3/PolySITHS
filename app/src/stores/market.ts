import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import type { MarketWithStats } from '@/utils/Types'

export const useMarketStore = defineStore('market', () => {
  const marketList = ref<MarketWithStats[]>([])

  async function fetchMarketsWithStats(): Promise<MarketWithStats[]> {
    const rpcResult = await supabase.rpc('get_markets_with_stats', {})
    if (rpcResult.error) throw rpcResult.error
    const rows = rpcResult.data as any[]
    const formatted = rows.map(record => ({
      market_id: record.market_id,
      title: record.title,
      question: record.question,
      creator_id: record.creator_id,
      resolver_id: record.resolver_id,
      end_time: record.end_time,
      created_at: record.created_at,
      total_volume: Number(record.total_volume),
      total_shares: record.total_shares,
      options: record.options.map((opt: any) => ({
        id: opt.id,
        name: opt.name,
        volume: Number(opt.volume),
        shares: opt.shares,
        percentage: opt.percentage
      }))
    }))
    marketList.value = formatted
    return formatted
  }

  async function fetchMarketById(marketId: string): Promise<MarketWithStats | null> {
    const { data, error } = await supabase.rpc('get_market_with_stat', { p_market_id: marketId })
    if (error) return null
    const record = (data as any[])[0]
    return {
      market_id: record.market_id,
      title: record.title,
      question: record.question,
      creator_id: record.creator_id,
      resolver_id: record.resolver_id,
      end_time: record.end_time,
      created_at: record.created_at,
      total_volume: Number(record.total_volume),
      total_shares: record.total_shares,
      options: record.options.map((opt: any) => ({
        id: opt.id,
        name: opt.name,
        volume: Number(opt.volume),
        shares: opt.shares,
        percentage: opt.percentage
      }))
    }
  }

  return { marketList, fetchMarketsWithStats, fetchMarketById }
})