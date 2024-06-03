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
        <h1>酒蔵一覧</h1>
    </div>
    <UInputMenu v-model="selectedPrefecture" :options="prefectures" />
    <UButton @click="searchVector">検索</UButton>
    <UTable :rows="breweries" :columns="columns" @select="">
        <template #name-data="{ row }">
            <NuxtLink :to="'/breweries/' + row.id">
                <div class="w-full">
                    <span>{{ row.data().name }}</span>
                    <span>{{ prefectures[row.data().prefecture] }}</span>
                </div>
            </NuxtLink>
        </template>
    </UTable>

</template>