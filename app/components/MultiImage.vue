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
</script>
<template>
  <div class="flex">
    <div class="w-full h-auto relative">
      <div grid="~ gap-2">
        <div
          ref="imageDropZoneRef"
          class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6 rounded"
        >
          <div class="flex flex-wrap justify-center items-center">
            <UCarousel v-slot="{ item }" :items="images" indicators>
              <img :src="item" width="300" height="400" draggable="false" />
            </UCarousel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
