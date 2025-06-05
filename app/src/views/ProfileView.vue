<template>
  <div class="p-4 text-white">
    <h2 class="text-xl font-bold mb-4">User Details</h2>

    <div v-if="loading">Loading user...</div>
    <div v-else-if="user">
      <p><strong>ID:</strong> {{ user.user_id }}</p>
      <p><strong>Profile Url:</strong> {{ user.profile_url }}</p>
      <p><strong>Display Name:</strong> {{ user.display_name }}</p>
      <p><strong>Balance:</strong> ${{ user.balance }}</p>

      <br />

      <p><strong>Awaiting Market Approval:</strong> {{ user.awaiting_market_approval }}</p>
      <p><strong>User Created At:</strong> {{ new Date(user.created_at).toString() }}</p>

      <p v-for="prediction in predictions">{{ prediction }}</p>
    </div>
    <div v-else>No user found.</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import { useUserStore } from '@/stores/user'
import { usePredictionStore } from '@/stores/prediction'

const route = useRoute()

const userStore = useUserStore()
const predictionStore = usePredictionStore()

const loading = ref(true)

const user = computed(() => userStore.viewedUserData)
const predictions = computed(() => predictionStore.userPredictions)

onMounted(async () => {
  const id = route.params.id as string

  const { success: userProfileSuccess, error: userProfileError } =
    await userStore.viewUserDataById(id)

  const { success: userPredictionSuccess, error: userPredictionError } =
    await predictionStore.fetchPredictionsByUserId(id)

  loading.value = false
})
</script>
