<template>
  <div class="pt-5">
    <div class="max-w-4xl mx-auto space-y-5">
      <ProfileHeader :user-id="viewingUserId" />
      <PredictionStats :user-id="viewingUserId" />
      <BalanceChart :user-id="viewingUserId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import ProfileHeader from '@/components/Profile/ProfileHeader.vue'
import PredictionStats from '@/components/Profile/PredictionStats.vue'
import BalanceChart from '@/components/Profile/BalanceChart.vue'

const viewingUserId = useRoute().params.id as string
</script>
