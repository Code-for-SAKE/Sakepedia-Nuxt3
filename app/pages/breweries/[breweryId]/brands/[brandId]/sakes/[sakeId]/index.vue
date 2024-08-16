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
    <hr />
    <h2 v-if="sake">{{ sake?.data.name }}</h2>
    <dl>
      <dt>酒蔵</dt>
      <dd>
        <NuxtLink :to="'/' + sake?.data.brewery?.path">
          <div class="w-full">{{ sake?.data.brewery?.id }}</div>
        </NuxtLink>
      </dd>
      <dt>銘柄</dt>
      <dd>
        <NuxtLink :to="'/' + sake?.data.brand?.path">
          <div class="w-full">{{ sake?.data.brand?.id }}</div>
        </NuxtLink>
      </dd>
      <dt>分類</dt>
      <dd></dd>
      <dt>合うおつまみ</dt>
      <dd></dd>
      <dt>説明</dt>
      <dd>{{ sake?.data.description }}</dd>
      <dt>URL</dt>
      <dd></dd>
      <dt>更新日</dt>
      <dd></dd>
    </dl>
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
