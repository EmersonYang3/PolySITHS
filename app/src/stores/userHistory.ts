import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "@/lib/supabaseClient";

import type { UserBalanceHistory } from "@/utils/Types";

export const useUserHistoryStore = defineStore("userHistory", () => {
    const balanceHistory = ref<UserBalanceHistory[]>([]);

    async function loadUserBalanceHistory(userId: string) {
        balanceHistory.value = [];

        const { data, error } = await supabase.from("user_balance_history")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        balanceHistory.value = data ?? [] as UserBalanceHistory[];
    }

    return { balanceHistory, loadUserBalanceHistory }
})