<script setup lang="ts">

const route = useRoute();
const { getList } = useBrewery()

const searchText = ref(route.query.name != null ? route.query.name : '');
const prefecture = ref({});
const prefectureId = route.query.prefecture != null ? route.query.prefecture : '';
const limit = route.query.limit ? route.query.limit : 2;

const res = await getList({
        searchText: searchText.value,
        prefecture: prefectureId,
        before: null,
        limit: parseInt(limit),
    });

const breweries : Ref = ref(res.list)
const cnt = computed(() => breweries.value.length)

const columns = [{
    key: 'name',
    label: '',
    sortable: false
}]

async function searchVector() {
    const res = await getList({
        searchText: searchText.value,
        prefecture: prefecture.value.id,
        before: null,
        limit: parseInt(limit),
    });
    breweries.value = res.list;
}
function setHistories() {
    const url = window.location.href.replace(/\?.*$/, '');
    console.log('prefecture', prefecture)
    console.log('prefecture id', prefecture.value.id)
    const queries = `?name=${searchText.value}&prefecture=${prefecture.value.id}&limit=${limit}`;
    window.history.pushState(null, '', `${url}${queries}`);
}
</script>

<template>
    <div>
        <div class="mb-4">
            <h1>酒蔵一覧</h1>
        </div>
        <hr class="mb-4" />
        <div class="flex flex-wrap gap-4">
            <div class="flex flex-wrap items-stretch w-fit mb-4 relative">
                <div class="flex">
                    <span
                        class="flex items-center bg-gray-200 rounded rounded-r-none border border-r-0 px-3 text-sm">都道府県</span>
                </div>
                <UInputMenu id="prefecture" v-model="prefecture" :options="prefectures"
                    by="id"
                    option-attribute="nameJa"
                    class="rounded-l-none" />
            </div>
            <div class="flex-auto">
                <UInput v-model="searchText" name="q" placeholder="Search..."
                    icon="i-heroicons-magnifying-glass-20-solid" class="w-full" autocomplete="off"
                    :ui="{ icon: { trailing: { pointer: '' } } }">
                    <template #trailing>
                        <!-- <UButton v-show="q !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false"
            @click="searchText = ''" /> -->
                        <UButton @click="setHistories();searchVector();">検索</UButton>
                    </template>
                </UInput>
            </div>
        </div>
        <hr class="mb-4" />
        <UTable :rows="breweries" :columns="columns" @select="" class="border border-t-0" :ui="{ thead: 'hidden' }">
            <template #name-data="{ row }">
                <NuxtLink :to="'/breweries/' + row.id">
                    <div class="w-full">
                        <span>{{ row.data().name }}</span>
                        <span>{{ row.data().prefecture ? prefectures.find(e => e.id === row.data().prefecture).nameJa : "" }}</span>
                    </div>
                </NuxtLink>
            </template>
        </UTable>
    </div>

</template>