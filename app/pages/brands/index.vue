<script setup lang="ts">
const route = useRoute();

const { getList } = useFirestore()

const searchText = route.query.name != null ? route.query.name : '';
const limit = route.query.limit != null ? route.query.limit : 2;
console.log('limit', limit)
const page = ref(1)
const pageCount = 2

const res = await getList('brands', {
  searchText: searchText,
  page: page.value,
  limit: limit,
},
);
const brands = res.list
const count = res.listCount

const columns = [{
  key: 'name',
  label: '',
  sortable: false
}]
</script>

<template>
  <div>
    <div class="flex justify-between">
      <h1>銘柄一覧</h1>
      <UButton to="/brands/add">追加</UButton>
    </div>
    <hr />
    <div class="grid grid-cols-3">
      <div class="col-span-2">
        <UInput v-model="searchText" name="q" placeholder="Search..." icon="i-heroicons-magnifying-glass-20-solid"
          autocomplete="off" :ui="{ icon: { trailing: { pointer: '' } } }">
          <template #trailing>
            <!-- <UButton v-show="q !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false"
            @click="searchText = ''" /> -->
          </template>
        </UInput>
      </div>
    </div>
    <div class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="pageCount" :total="count" :prev-button="{ label: 'Prev' }"
        :next-button="{ trailing: true, label: 'Next' }" />
    </div>
    <UTable :rows="brands" :columns="columns" @select="">
      <template #name-data="{ row }">
        <NuxtLink :to="'/brands/' + row._id">
          <div class="w-full">{{ row.name }}</div>
        </NuxtLink>
      </template>
    </UTable>

  </div>
</template>