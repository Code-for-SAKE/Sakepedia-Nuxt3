<script setup lang="ts">
import type { Data } from "~/composables/useFirestore"

const route = useRoute()
const { getItem, deleteItem } = useSake()
const { defaultLocale } = useI18n()
const localePath = useLocalePath()
const dataPath = localePath(route.path, defaultLocale)

const item = await getItem(dataPath)
const sake: Data<Sake> = item!

console.log("Sakeitem", item)

const confirmDelete = ref(false)
const deleteSake = async function () {
  deleteItem(item.path)
}
</script>

<template>
  <div>
    <h1>日本酒 詳細</h1>
    {{ sake?.data.name }}<
    <UButton class="info" :to="route.path + '/update'">編集</UButton>
    <UButton class="danger" @click="confirmDelete = true">削除</UButton>
    <UModal v-model="confirmDelete">
      <UCard>
        <Alert>本当に削除しますか？</Alert>
        <template #footer>
          <UButton class="secondary" @click="confirmDelete = false">キャンセル</UButton>
          <UButton class="danger" @click="deleteSake">はい</UButton>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
