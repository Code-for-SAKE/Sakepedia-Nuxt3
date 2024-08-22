<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { getList } = usePost()
const localePath = useLocalePath()

const searchText = ref(route.query.comment != null ? String(route.query.comment) : "")
const limit = route.query.limit ? Number(route.query.limit) : 2

const res = await getList({
  searchText: searchText.value,
  before: undefined,
  limit: limit,
})

const posts: Ref<Data<Post>[]> = ref(res.list)
const cnt = computed(() => posts.value.length)
const count: Ref<number> = ref<number>(res.listCount)

const columns = [
  {
    key: "image",
    label: t("image"),
    sortable: false,
  },
  {
    key: "comment",
    label: t("comment"),
    sortable: false,
  },
]

async function searchVector() {
  const res = await getList({
    searchText: searchText.value,
    before: undefined,
    limit: limit,
  })
  posts.value = res.list
  count.value = res.listCount
}
function setHistories() {
  const url = window.location.href.replace(/\?.*$/, "")
  const queries = `?comment=${searchText.value}&limit=${limit}`
  window.history.pushState(null, "", `${url}${queries}`)
}
const getMoreData = async () => {
  const res = await getList({
    searchText: searchText.value,
    before: posts.value[posts.value.length - 1].data.comment,
    limit: limit,
  })

  posts.value.splice(posts.value.length, 0, ...res.list)
  count.value = res.listCount
}
</script>

<template>
  <div>
    <div class="mb-4">
      <h1>{{ $t("postList") }}</h1>
      <UButton class="success" :to="localePath('/posts/add')">{{ $t("add") }}</UButton>
    </div>
    <hr class="mb-4" />
    <div class="flex flex-wrap gap-4">
      <div class="flex flex-wrap items-stretch w-fit mb-4 relative" />
      <div class="flex-auto">
        <UInput
          v-model="searchText"
          name="q"
          placeholder="Search..."
          icon="i-heroicons-magnifying-glass-20-solid"
          class="w-full"
          autocomplete="off"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <!-- <UButton v-show="q !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false"
            @click="searchText = ''" /> -->
            <UButton @click="setHistories(), searchVector()">{{ $t("search") }}</UButton>
          </template>
        </UInput>
      </div>
    </div>
    <div class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      {{ cnt }} / {{ count }}
    </div>
    <UTable :rows="posts" :columns="columns" class="border border-t-0" :ui="{ thead: 'hidden' }">
      <template #name-data="{ row }">
        <NuxtLink :to="localePath('/' + row.path)">
          <div class="w-full">
            <image :src="row.data.image" />
          </div>
        </NuxtLink>
      </template>
    </UTable>
    <UButton v-show="cnt < count" @click="getMoreData">{{ $t("more") }}</UButton>
  </div>
</template>
