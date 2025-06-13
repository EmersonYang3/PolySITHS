// Store for basic user data and authentication
// DOES NOT STORE predictions OR history, only user data like username, and profile url, etc.

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

import type { User } from '@supabase/supabase-js'
import type { UserData } from '@/utils/Types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const userData = ref<UserData | null>(null)

  const viewedUserData = ref<UserData | null>(null)
  let userDataChannel: RealtimeChannel | null = null

  async function signUpUser(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) return { success: false, error: error.message }
    return { success: true, error: '' }
  }

  async function logInUser(email: string, password: string) {
    const { data: logInData, error: logInError } =
      await supabase.auth.signInWithPassword({ email, password })

    if (logInError || !logInData.user) {
      return { success: false, error: logInError?.message || 'Login failed' }
    }

    user.value = logInData.user
    isLoggedIn.value = true

    const { success, data, error } = await getUserDataById(user.value.id)
    if (!success) return { success: false, error }

    userData.value = data

    userDataChannel = supabase
      .channel(`public:user_data:user_id=eq.${user.value.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_data',
          filter: `user_id=eq.${user.value.id}`,
        },
        (payload) => {
          userData.value = payload.new as UserData
        }
      )
      .subscribe()

    return { success: true, error: '' }
  }

  async function logOutUser() {
    if (userDataChannel) {
      await supabase.removeChannel(userDataChannel)
      userDataChannel = null
    }

    const { error } = await supabase.auth.signOut()

    if (error) return { success: false, error: error.message }

    user.value = null
    userData.value = null
    viewedUserData.value = null
    isLoggedIn.value = false

    return { success: true, error: '' }
  }

  async function viewUserDataById(userId: string) {
    const { success, data, error } = await getUserDataById(userId)

    if (success) {
      viewedUserData.value = data
    }

    return { success, error }
  }

  async function getUserDataById(userId: string): Promise<{success: boolean; data: UserData | null; error: string}> {
    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) return { success: false, data: null, error: error.message }

    return { success: true, data: data as UserData, error: '' }
  }

  async function updateUserProfile(newDisplayName: string, newProfileUrl: string) {
    const { error } = await supabase.rpc('update_user_profile', {
      p_display_name: newDisplayName,
      p_profile_url: newProfileUrl,
    })

    if (error) return { success: false, error: error.message }

    if (userData.value && userData.value.user_id) {
      await viewUserDataById(userData.value.user_id)

      userData.value = {
        ...(userData.value as UserData),
        display_name: newDisplayName,
        profile_url: newProfileUrl,
      }
    }

    return { success: true, error: '' }
  }

  function flushViewUser() {
    viewedUserData.value = null
  }

  return { user, userData, viewedUserData, isLoggedIn, signUpUser, logInUser, logOutUser, viewUserDataById, updateUserProfile, flushViewUser }
})