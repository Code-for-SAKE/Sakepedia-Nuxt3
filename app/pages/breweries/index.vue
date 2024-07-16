<script setup lang="ts">

const route = useRoute();
const { getList } = useFirestore()

const searchText = route.query.name != null ? route.query.name : '';
const limit = route.query.limit != null ? route.query.limit : 2;
console.log('limit', limit)

const res = await getList('breweries', {
    searchText: searchText,
    before: null,
    limit: limit,
});
const breweries = res.list
const count = res.listCount

const columns = [{
    key: 'name',
    label: '',
    sortable: false
}]

const selectedPrefecture = ref(prefectures[0])

</script>

<template>
    <div>
        <div class="mb-4">
            <h1>酒蔵一覧</h1>
            <UButton class="success" to="/breweries/add">追加</UButton>
        </div>
        <hr class="mb-4" />
        <div class="flex flex-wrap gap-4">
            <div class="flex flex-wrap items-stretch w-fit mb-4 relative">
                <div class="flex">
                    <span
                        class="flex items-center bg-gray-200 rounded rounded-r-none border border-r-0 px-3 text-sm">都道府県</span>
                </div>
                <UInputMenu id="prefecture" v-model="prefecture" :options="prefectures" by="id"
                    option-attribute="nameJa" class="rounded-l-none" />
            </div>
            <div class="flex-auto">
                <UInput v-model="searchText" name="q" placeholder="Search..."
                    icon="i-heroicons-magnifying-glass-20-solid" class="w-full" autocomplete="off"
                    :ui="{ icon: { trailing: { pointer: '' } } }">
                    <template #trailing>
                        <!-- <UButton v-show="q !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false"
            @click="searchText = ''" /> -->
                        <UButton @click="setHistories(); searchVector();">検索</UButton>
                    </template>
                </UInput>
            </div>
        </div>
        <div class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            {{ cnt }} / {{ count }}件
        </div>
        <UTable :rows="breweries" :columns="columns" @select="" class="border border-t-0" :ui="{ thead: 'hidden' }">
            <template #name-data="{ row }">
                <NuxtLink :to="'/breweries/' + row.id">
                    <div class="w-full">
                        <span>{{ row.name }}</span>
                        <span>{{ row.prefecture ? prefectures.find(e => e.id == row.prefecture)?.nameJa : "" }}</span>
                    </div>
                </NuxtLink>
            </template>
        </UTable>
        <UButton v-show="cnt < count" @click="getMoreData">MORE</UButton>
    </div>

</template>