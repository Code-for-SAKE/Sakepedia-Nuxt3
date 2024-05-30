<script setup lang="ts">
import type { Brand } from '~/components/Brand';

const route = useRoute();
const { getList } = useFirestore();

const searchText = ref<string>(route.query.name != null ? route.query.name : '')
const limit = route.query.limit != null ? route.query.limit : 3;
const brands : Ref = ref([])
const count : Ref<number> = ref<number>(0)
const cnt = computed(() => brands.value.length)

const search = async () => {
  console.log(searchText)
  const res = await getList('brands', {
    searchText: searchText.value,
    before: null,
    limit: limit,
  });
  brands.value = res.list
  count.value = res.listCount
  return res
}

search()

const columns = [{
  key: 'name',
  label: '名前',
  sortable: true
}]

const getMoreData = async () => {
  const res = await getList('brands', {
    searchText: searchText.value,
    before: brands.value[brands.value.length - 1].data().name,
    limit: limit,
  });
  brands.value.splice(brands.value.length, 0, ...res.list);
}
</script>

<template>
  <div>
    <div class="flex justify-between">
      <h1>銘柄一覧</h1>
      <UButton class="success" to="/brands/add">追加</UButton>
    </div>
    <hr />
    <div class="grid grid-cols-3">
      <div class="col-span-2">
        <UInput v-model="searchText" name="q" placeholder="Search..." icon="i-heroicons-magnifying-glass-20-solid"
          autocomplete="off" :ui="{ icon: { trailing: { pointer: '' } } }">
          <template #trailing>
            <UButton color="gray" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false"
            @click="searchText = ''" />
          </template>
        </UInput>
        <UButton @click="search">検索</UButton>
      </div>
    </div>
    <div class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      {{ cnt }} / {{ count }}件
    </div>
    <UTable :rows="brands" :columns="columns" @select="">
      <template #name-data="{ row }">
        <NuxtLink :to="'/brands/' + row.id">
          <div class="w-full">{{ row.data().name }}</div>
        </NuxtLink>
      </template>
    </UTable>
    <UButton v-show="cnt < count" @click="getMoreData">MORE</UButton>

  </div>
</template>