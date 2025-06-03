import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

import type { User } from '@supabase/supabase-js'
import type { UserData } from '@/utils/Types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const userData = ref<UserData | null>(null)
  const isLoggedIn = ref(false)

  let userDataChannel: RealtimeChannel | null = null

  const router = useRouter()

  async function signUpUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true, error: '' }
  }

  async function logInUser(email: string, password: string) {
    const { data: logInData, error: logInError } =
      await supabase.auth.signInWithPassword({ email, password })

    if (logInError) {
      return { success: false, error: logInError.message }
    }

    user.value = logInData.user
    isLoggedIn.value = true

    const { data: userDataReturn, error: userDataError } = await supabase
      .from('UsersData')
      .select('*')
      .eq('userid', user.value!.id)
      .single()

    if (!user.value) {
      return { success: false, error: 'User not found' }
    }
    if (userDataError) {
      return { success: false, error: userDataError.message }
    }

    userData.value = userDataReturn as UserData

    userDataChannel = supabase
      .channel(`public:UsersData:userid=eq.${user.value.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'UsersData',
          filter: `userid=eq.${user.value.id}`,
        },
        (payload) => {
          userData.value = payload.new as UserData
        }
      )
      .subscribe()

    router.push('/markets')
    return { success: true, error: '' }
  }

  async function logOutUser() {
    if (userDataChannel) {
      await supabase.removeChannel(userDataChannel)
      userDataChannel = null
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      return { success: false, error: error.message }
    }

    user.value = null
    userData.value = null
    isLoggedIn.value = false

    router.push('/login')
    return { success: true, error: '' }
  }

  return { user, userData, isLoggedIn, signUpUser, logInUser, logOutUser }
})
