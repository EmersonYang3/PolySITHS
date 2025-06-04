<template>
  <div class="p-4 text-white">
    <h2 class="text-xl font-bold mb-4">User Details</h2>

    <div v-if="loading">Loading user...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="user">
      <p><strong>ID:</strong> {{ user.user_id }}</p>
      <p><strong>Profile Url:</strong> {{ user.profile_url }}</p>
      <p><strong>Display Name:</strong> {{ user.display_name }}</p>
      <p><strong>Balance:</strong> ${{ user.balance }}</p>

      <br />

      <p><strong>Awaiting Market Approval:</strong> {{ user.awaiting_market_approval }}</p>
      <p><strong>User Created At:</strong> {{ new Date(user.created_at).toString() }}</p>
    </div>
    <div v-else>No user found.</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

const loading = ref(true)
const error = ref('')
const user = computed(() => userStore.viewedUserData)

onMounted(async () => {
  const id = route.params.id as string

  const { success, error: fetchError } = await userStore.viewUserDataById(id)

  if (!success) error.value = fetchError
  loading.value = false
})
</script>
