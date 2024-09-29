<script setup lang="ts">
const { download } = useStorage()
const props = defineProps<{ modelValue: string[] | null }>()
const images = ref<string[]>([])
const paths = await props.modelValue?.map(async (path) => {
  return await download(path)
})
if (paths) {
  images.value = await Promise.all(paths)
}

const showImage = ref(undefined)
const isShow = ref(false)
</script>
<template>
  <div class="">
    <div class="w-full h-auto relative">
      <div grid="~ gap-2">
        <div
          class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6 rounded"
        >
          <div class="flex flex-wrap justify-center items-center">
            <UCarousel v-slot="{ item }" :items="images" indicators >
              <img :src="item" draggable="false" class="h-48 object-cover" @click="showImage = item; isShow = true;" >
            </UCarousel>
          </div>
        </div>
      </div>
    </div>
    <UModal v-model="isShow" fullscreen>
      <div class="h-screen w-auto flex items-center" @click="isShow = false">
        <img :src="showImage">
      </div>
    </UModal>
</div>
</template>
