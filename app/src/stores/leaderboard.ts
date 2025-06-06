import { supabase } from "@/lib/supabaseClient";
import { defineStore } from "pinia";
import { ref } from "vue";

import type { UserData, Prediction } from "@/utils/Types";

export const useLeaderBoardStore = defineStore("leaderboard", () => {
  const wagerLeaderboard = ref<Array<Prediction & {user_data: Pick<UserData, "user_id" | "display_name" | "profile_url">;}>>([]);
  const winLeaderboard = ref<Array<Prediction & {user_data: Pick<UserData, "user_id" | "display_name" | "profile_url">;}>>([]);
  const lossLeaderboard = ref<Array<Prediction & {user_data: Pick<UserData, "user_id" | "display_name" | "profile_url">;}>>([]);

  async function loadWagerLeaderboard() {
    const { data, error } = await supabase
      .from("prediction")
      .select(`
        *,
        user_data:user_data (
          user_id,
          display_name,
          profile_url
        )
      `)
      .order("wager", { ascending: false })
      .limit(50);

    wagerLeaderboard.value = data as typeof wagerLeaderboard.value;
    console.log(wagerLeaderboard.value)
  }

  async function loadWinLeaderboard() {
    const { data, error } = await supabase
      .from("prediction")
      .select(`
        *,
        user_data:user_data (
          user_id,
          display_name,
          profile_url
        )
      `)
      .not("win", "is", null)
      .order("win", { ascending: false })
      .limit(50);

    winLeaderboard.value = data as typeof winLeaderboard.value;
  }

  async function loadLossLeaderboard() {
    const { data, error } = await supabase
      .from("prediction")
      .select(`
        *,
        user_data:user_data (
          user_id,
          display_name,
          profile_url
        )
      `)
      .not("win", "is", null)
      .order("win", { ascending: true })
      .limit(50);

    lossLeaderboard.value = data as typeof lossLeaderboard.value;
  }

  return { wagerLeaderboard, winLeaderboard, lossLeaderboard, loadWagerLeaderboard, loadWinLeaderboard, loadLossLeaderboard };
});
