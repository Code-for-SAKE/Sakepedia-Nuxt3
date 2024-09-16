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
      <dt>{{ $t("brewery") }}</dt>
      <dd>
        <NuxtLink :to="localePath('/' + sake?.data.brewery?.path)">
          <div class="w-full">{{ sake?.data.brewery?.id }}</div>
        </NuxtLink>
      </dd>
      <dt>{{ $t("brand") }}</dt>
      <dd>
        <NuxtLink :to="localePath('/' + sake?.data.brand?.path)">
          <div class="w-full">{{ sake?.data.brand?.id }}</div>
        </NuxtLink>
      </dd>
      <dt>{{ $t("type") }}</dt>
      <dd />
      <dt>{{ $t("pairing") }}</dt>
      <dd />
      <dt>{{ $t("explanation") }}</dt>
      <dd>{{ sake?.data.description }}</dd>
      <dt>{{ $t("url") }}</dt>
      <dd />
      <dt>{{ $t("updatedAt") }}</dt>
      <dd />
    </dl>
    <UButton class="info" :to="localePath(route.path + '/update')">{{ $t("update") }}</UButton>
    <UButton class="danger" @click="confirmDelete = true">{{ $t("delete") }}</UButton>
    <UModal v-model="confirmDelete">
      <UCard>
        <Alert>{{ $t("confirmDelete") }}</Alert>
        <template #footer>
          <UButton class="secondary" @click="confirmDelete = false">{{ $t("cancel") }}</UButton>
          <UButton class="danger" @click="deleteSake">{{ $t("yes") }}</UButton>
        </template>
      </UCard>
    </UModal>
    <div>
      <div class="d-flex justify-content-between align-items-center">
        <h3>{{ $t("postList") }}</h3>
      </div>
      <UButton
        :to="
          localePath({
            path: '/posts/add',
            query: {
              breweryId: route.params.breweryId,
              brandId: route.params.brandId,
              sakeId: route.params.sakeId,
            },
          })
        "
      >
        {{ $t("add") }}
      </UButton>
      <CommentList
        :brewery-id="String(route.params.breweryId)"
        :brand-id="String(route.params.brandId)"
        :sake-id="String(route.params.sakeId)"
      />
    </div>
  </div>
</template>
