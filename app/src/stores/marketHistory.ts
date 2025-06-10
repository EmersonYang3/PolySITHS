import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { defineStore } from 'pinia';
import type { MarketOptionVolumeHistory } from '@/utils/Types';

export const useMarketHistoryStore = defineStore('marketHistory', () => {
  const history = ref<MarketOptionVolumeHistory[]>([]);
  const options = ref<Record<string, string>>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadMarketOptionsHistory(market_id: string) {
    loading.value = true;
    error.value = null;
    try {
      const { data: opts } = await supabase
        .from('option')
        .select('option_id, text')
        .eq('market_id', market_id);
      options.value = opts?.reduce((acc, o) => ({ ...acc, [o.option_id]: o.text }), {}) || {};

      const { data } = await supabase
        .from('market_history')
        .select('option_id, total_volume, created_at')
        .eq('market_id', market_id)
        .order('created_at', { ascending: true });
      history.value = data as MarketOptionVolumeHistory[] || [];
    } catch (e: any) {
      error.value = e.message;
      history.value = [];
    } finally {
      loading.value = false;
    }
  }

  const byOption = computed(() => {
    const dict: Record<string, { text: string; history: { volume: number; date: Date }[] }> = {};
    Object.entries(options.value).forEach(([id, text]) => {
      dict[id] = { text, history: [] };
    });
    history.value.forEach(item => {
      const entry = dict[item.option_id] || { text: '', history: [] };
      entry.history.push({ volume: item.total_volume, date: new Date(item.created_at) });
      dict[item.option_id] = entry;
    });
    return dict;
  });

  return {
    history,
    options,
    loading,
    error,
    loadMarketOptionsHistory,
    byOption,
  };
});
