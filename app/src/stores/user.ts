import { ref } from 'vue'
import type { User } from '@/utils/Types'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)
    const isLoggedIn = ref(false)

    function setUser(newUser: User) {
        user.value = newUser
        isLoggedIn.value = true
    }

    function clearUser() {
        user.value = null
        isLoggedIn.value = false
    }

    return { user, isLoggedIn, setUser, clearUser }
})