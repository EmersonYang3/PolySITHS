// Store for individual user prediction extremes data 
// DOES NOT STORE user data like username and profile url, history, OR GLOBAL predictions leaderboards
// Only individual user prediction extremes data to be loaded on demand

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import type { Prediction } from '@/utils/Types'

export const usePredictionStore = defineStore('prediction', () => {
  const biggest_wager = ref<Prediction | null>(null)
  const biggest_win   = ref<Prediction | null>(null)
  const biggest_loss  = ref<Prediction | null>(null)

    async function loadPredictionExtremes(userId: string) {
        const { data: wagerData, error: wagerErr } = await supabase
            .from('prediction')
            .select('*')
            .eq('predictor_id', userId)
            .order('wager', { ascending: false })
            .limit(1)
            .maybeSingle()

        biggest_wager.value = wagerData ?? null

        const { data: winData, error: winErr } = await supabase
            .from('prediction')
            .select('*')
            .eq('predictor_id', userId)
            .not('win', 'is', null)
            .order('win', { ascending: false })
            .limit(1)
            .maybeSingle()

        biggest_win.value = winData ?? null

        const { data: lossData, error: lossErr } = await supabase
            .from('prediction')
            .select('*')
            .eq('predictor_id', userId)
            .lt('win', 0)
            .order('win', { ascending: true })
            .limit(1)
            .maybeSingle()

        biggest_loss.value = lossData ?? null

        if (wagerErr || winErr || lossErr) {
            console.error('Error loading prediction extremes:', wagerErr, winErr, lossErr)
            return { success: false, error: wagerErr?.message || winErr?.message || lossErr?.message || 'Failed to load prediction extremes' }
        }

        return { success: true, error: '' }
    }

    async function placePrediction(market_id: string, option_id: string, wager: number) {
        const { data: predictionData, error: predictionError} = await supabase.rpc('place_prediction', {p_market_id: market_id, p_option_id: option_id, p_wager: wager})

        console.log(predictionData, predictionError)
    }

    return { biggest_wager, biggest_win, biggest_loss, loadPredictionExtremes, placePrediction }
})
