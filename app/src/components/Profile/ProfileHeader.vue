<template>
  <div
    class="max-w-full mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-black rounded-xl border border-border"
  >
    <div class="relative">
      <img
        :src="viewingUserData?.profile_url"
        :alt="viewingUserData?.display_name"
        class="w-24 h-24 rounded-full border-2 border-purple object-cover"
      />
    </div>

    <div class="flex-1 text-center md:text-left">
      <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <h1 class="text-2xl md:text-3xl font-bold text-text-primary">
          {{ viewingUserData?.display_name }}
        </h1>
        <EditProfileButton v-if="isOwnProfile" :user-id="props.userId" />
      </div>

      <p class="text-text-secondary mt-1">ID: {{ viewingUserData?.user_id }}</p>

      <div class="mt-4 flex flex-col md:flex-row gap-4 md:gap-8">
        <div>
          <p class="text-text-secondary text-sm">Balance</p>
          <p class="text-xl font-bold text-text-primary">
            ${{ formatBalance(viewingUserData?.balance || 0) }}
          </p>
        </div>

        <div>
          <p class="text-text-secondary text-sm">Member Since</p>
          <p class="text-xl font-bold text-text-primary">
            {{ formatDate(viewingUserData?.created_at) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EditProfileButton from './EditProfileButton.vue'

import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { formatDate, formatBalance } from '@/utils/formatters'

const props = defineProps<{ userId: string }>()

const userStore = useUserStore()
const viewingUserData = computed(() => userStore.viewedUserData)

const isOwnProfile = computed(() => userStore.userData?.user_id === props.userId)

onMounted(() => {
  userStore.viewUserDataById(props.userId)
})
</script>
