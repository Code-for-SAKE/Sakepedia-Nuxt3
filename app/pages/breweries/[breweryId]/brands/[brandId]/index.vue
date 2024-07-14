<script setup lang="ts">

const route = useRoute();
const { getItemFromPath, deleteItem }  = useBrand();
const { getFromReference }  = useBrewery();

const item = await getItemFromPath(route.path)
const brand = item.data()

console.log(item)
let brewery = {}
if (brand?.brewery) {
    brewery = await getFromReference(brand.brewery)
}

const confirmDelete = ref(false)
const deleteBrand = async function(){
    await deleteItem("brands", item.id)
    await navigateTo("/brands")
}
</script>

<template>
    <div>
        <h1>銘柄 詳細</h1>
        <dl>
            <dt>ID</dt><dd>{{ item.id }}</dd>
            <dt>名前</dt><dd>{{ brand?.name }}</dd>
            <dt>酒蔵</dt><dd>
                <NuxtLink v-if="brand?.brewery" :to="'/breweries/' + brewery?.id">
                    <div class="w-full">{{ brewery?.data().name }}</div>
                </NuxtLink>
            </dd>
            <dt>説明</dt><dd>{{ brand?.description }}</dd>
        </dl>
        <UButton class="info" :to="route.path + '/update'">編集</UButton>
        <UButton class="danger" @click="confirmDelete = true">削除</UButton>
        <UModal v-model="confirmDelete">
            <UCard>
                <Alert>本当に削除しますか？</Alert>
                <template #footer>
                    <UButton class="secondary" @click="confirmDelete = false">キャンセル</UButton>
                    <UButton class="danger" @click="deleteBrand">はい</UButton>
                </template>
            </UCard>
        </UModal>
    </div>
</template>