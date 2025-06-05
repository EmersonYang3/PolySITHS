import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { defineStore } from 'pinia'

import type { Prediction } from '@/utils/Types'

export const usePredictionStore = defineStore('prediction', () => {
  const userPredictions = ref<Prediction[]>([])
  const optionPredictions = ref<Prediction[]>([])

  async function fetchPredictionsByUserId(userId: string) {
    userPredictions.value = []   
    const { data, error } = await supabase.from('prediction').select('*').eq('predictor_id', userId) 
    
    if (error) {
      return { success: false, error: error.message }
    }

    userPredictions.value = data as Prediction[]
    return { success: true, error: '' }
  }

  async function fetchPredictionsByOptionId(optionId: string) {
    optionPredictions.value = []
    const { data, error } = await supabase.from('prediction').select('*').eq('option_id', optionId)
    
    if (error) {
      return { success: false, error: error.message }
    }

    optionPredictions.value = data as Prediction[]
    return { success: true, error: '' }
  }

  return { userPredictions, optionPredictions, fetchPredictionsByUserId, fetchPredictionsByOptionId }
})
