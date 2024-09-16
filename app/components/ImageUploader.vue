<script setup lang="ts">
import { ref } from 'vue'
import { useDropZone } from '@vueuse/core'
const props = defineProps<{ modelValue: ImageFilesData | undefined }>()
const emits = defineEmits<{ (e: 'update:modelValue', files: ImageFilesData | undefined): void }>()
export type ImageFilesData = { name: string, size: number, type: string, lastModified: number, img: string | ArrayBuffer | null }[]


const imageFilesData = ref<ImageFilesData>(props.modelValue ?? [])

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

async function setImages(files: File[] | null) {
  imageFilesData.value = []
  if (files) {
    Promise.all(files.map(async (file) => {
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        img: await getBase64(file)
      };
    })).then((v) => {
      imageFilesData.value = v;
      emits('update:modelValue', imageFilesData.value)
    })
  }
}

async function onImageDrop(files: File[] | null): Promise<void> {
  onLeave();
  return setImages(files);
}

async function onFileChange(files: FileList): Promise<void> {
  return setImages(Array.from(files));
}

async function deleteImage(index: number) {
  imageFilesData.value.splice(index, 1);
}

const imageDropZoneRef = ref<HTMLElement>();
const fileInputRef = ref<HTMLInputElement>();

const onOver = () => {
  imageDropZoneRef.value?.classList.add("bg-gray-900")
  imageDropZoneRef.value?.classList.remove("bg-gray-400/10")
};
const onLeave = () => {
  imageDropZoneRef.value?.classList.remove("bg-gray-900")
  imageDropZoneRef.value?.classList.add("bg-gray-400/10")
};

useDropZone(imageDropZoneRef, { dataTypes: ['image/png'], onDrop: onImageDrop, onOver: onOver, onLeave: onLeave })
</script>

<template>
  <div class="flex">
    <div class="w-full h-auto relative">
      <div grid="~ gap-2">
        <div ref="imageDropZoneRef"
          class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6 rounded">
          <div font-bold class="m-6">
            <p>Drop files on to drop zones or select files</p>
            <UInput ref="fileInputRef" type="file" size="lg" icon="i-heroicons-folder" multiple
              @change="onFileChange" />
          </div>
          <div class="flex flex-wrap justify-center items-center">
            <UCarousel v-slot="{ item, index }" :items="imageFilesData" indicators>
              <div class="relative">
                <UButton
                  class="absolute top-2.5 right-2.5" icon="i-heroicons-trash" size="sm" color="primary" square
                  variant="solid" @click="() => deleteImage(index)" />
                <img :src="item.img" width="300" height="400" draggable="false">
              </div>
            </UCarousel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>