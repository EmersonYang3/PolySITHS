<template>
  <button
    class="bg-transparent border border-border-light hover:bg-soft-black hover:border-purple text-text-secondary px-3 py-1 rounded-md text-sm flex items-center cursor-pointer"
    @click="openDialog = true"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="mr-1"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
    </svg>
    Edit
  </button>

  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="openDialog"
      class="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
      @click.self="openDialog = false"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="openDialog"
          class="bg-pure-black border border-border rounded-xl w-full max-w-md p-6 relative"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-text-primary">Edit Profile</h2>
            <button
              class="text-text-secondary hover:text-text-primary cursor-pointer"
              @click="openDialog = false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="onSubmit" class="space-y-4">
            <div class="space-y-2">
              <label class="text-text-secondary" for="profile-url">Profile Image URL</label>
              <div class="flex flex-col space-y-4">
                <div
                  class="relative w-24 h-24 rounded-full overflow-hidden border-2 border-purple bg-off-black mx-auto"
                >
                  <img
                    :src="profileUrl || '/placeholder.svg?height=96&width=96'"
                    alt="Profile preview"
                    class="w-full h-full object-cover"
                    @error="profileUrl = ''"
                  />
                </div>
                <input
                  id="profile-url"
                  v-model="profileUrl"
                  type="url"
                  placeholder="https://example.com/your-image.jpg"
                  class="bg-off-black border-border text-text-primary focus:border-purple focus:ring focus:ring-purple w-full rounded px-3 py-2 focus:outline-none"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-text-secondary" for="display-name">Display Name</label>
              <input
                id="display-name"
                v-model="displayName"
                type="text"
                placeholder="Enter your display name"
                class="bg-off-black border-border text-text-primary focus:border-purple focus:ring focus:ring-purple w-full rounded px-3 py-2 focus:outline-none"
              />
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button
                type="button"
                class="bg-transparent border border-border-light hover:bg-soft-black text-text-secondary px-3 py-1 rounded-md text-sm flex items-center cursor-pointer"
                @click="openDialog = false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mr-1"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                Cancel
              </button>

              <button
                type="submit"
                class="bg-purple hover:bg-purple-dark text-pure-white px-3 py-1 rounded-md text-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps<{ userId: string }>()

const openDialog = ref(false)
const displayName = ref('')
const profileUrl = ref('')

const userStore = useUserStore()

onMounted(() => {
  watch(openDialog, (isOpen) => {
    if (isOpen) {
      const me = userStore.userData
      if (me && me.user_id === props.userId) {
        displayName.value = me.display_name || ''
        profileUrl.value = me.profile_url || ''
      }
    }
  })
})

async function onSubmit() {
  const { success } = await userStore.updateUserProfile(displayName.value, profileUrl.value)
  if (success) {
    openDialog.value = false
  }
}
</script>
