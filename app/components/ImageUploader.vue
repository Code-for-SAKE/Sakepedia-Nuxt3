<script setup lang="ts">
import { ref } from "vue"
import { useDropZone } from "@vueuse/core"
const props = defineProps<{ modelValue: ImageFilesData | undefined }>()
const emits = defineEmits<{ (e: "update:modelValue", files: ImageFilesData | undefined): void }>()
export type ImageFilesData = {
  name: string
  size: number
  width?: number
  height?: number
  type: string
  lastModified: number
  img: string | ArrayBuffer | null
  file: File
}[]

const imageFilesData = ref<ImageFilesData>(props.modelValue ?? [])

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

async function convert_image(fileData: ImageFilesData, maxPixels: number, quality: number) {
  for (let i = 0; i < fileData.length; i++) {
    // canvasと読み込む画像の生成
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.createElement('img');
    // 変換前の画像読み込み後の処理
    const loaded = new Promise<string>((resolve)=>{
      img.addEventListener('load', function(_e) {
        const isVertical = img.naturalHeight > img.naturalWidth;
        const ratio = isVertical ? Math.max(img.naturalHeight/maxPixels, 1.0): Math.max(img.naturalWidth/maxPixels, 1.0)
        // 画像の実サイズ取得してcanvas内に描画
        fileData[i].width = img.naturalWidth/ratio;
        fileData[i].height = img.naturalHeight/ratio;
        canvas.width = img.naturalWidth/ratio;
        canvas.height = img.naturalHeight/ratio;
        console.log(fileData[i], ratio, canvas)
        ctx!.drawImage(img, 0, 0, fileData[i].width!, fileData[i].height!);
        // canvasの内容をwebp形式で保存
        const data = canvas.toDataURL('image/webp', quality);
        fileData[i].type = 'image/webp'
        resolve(data)
      });
      img.src = String(fileData[i].img);
    })
    fileData[i].img = await loaded
  }
  return fileData
}

async function setImages(files: File[] | null) {
  imageFilesData.value = []
  if (files) {
    Promise.all(
      files.map(async (file) => {
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          img: await getBase64(file),
          file,
        }
      }),
    ).then((v) => {
      return convert_image(v, 1024, 0.5)
    }).then((v) => {
        imageFilesData.value = v
      emits("update:modelValue", imageFilesData.value)
    })
  }
}

async function onImageDrop(files: File[] | null): Promise<void> {
  onLeave()
  return setImages(files)
}

async function onFileChange(files: FileList): Promise<void> {
  return setImages(Array.from(files))
}

async function deleteImage(index: number) {
  imageFilesData.value.splice(index, 1)
}

const imageDropZoneRef = ref<HTMLElement>()
const fileInputRef = ref<HTMLInputElement>()

const onOver = () => {
  imageDropZoneRef.value?.classList.add("bg-gray-900")
  imageDropZoneRef.value?.classList.remove("bg-gray-400/10")
}
const onLeave = () => {
  imageDropZoneRef.value?.classList.remove("bg-gray-900")
  imageDropZoneRef.value?.classList.add("bg-gray-400/10")
}

useDropZone(imageDropZoneRef, {
  dataTypes: ["image/jpg", "image/jpeg", "image/png", "image/webp"],
  onDrop: onImageDrop,
  onOver: onOver,
  onLeave: onLeave,
})
</script>

<template>
  <div class="flex">
    <div class="w-full h-auto relative">
      <div grid="~ gap-2">
        <div
          ref="imageDropZoneRef"
          class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6 rounded"
        >
          <div font-bold class="m-6">
            <p>Drop files on to drop zones or select files</p>
            <UInput
              ref="fileInputRef"
              type="file"
              size="lg"
              icon="i-heroicons-folder"
              multiple
              accept=".jpg,.jpeg,.png,.webp"
              @change="onFileChange"
            />
          </div>
          <div class="flex flex-wrap justify-center items-center">
            <UCarousel v-slot="{ item, index }" :items="imageFilesData" indicators>
              <div class="relative">
                <UButton
                  class="absolute top-2.5 right-2.5"
                  icon="i-heroicons-trash"
                  size="sm"
                  color="primary"
                  square
                  variant="solid"
                  @click="() => deleteImage(index)"
                />
                <img :src="item.img" width="300" height="400" draggable="false" >
              </div>
            </UCarousel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
