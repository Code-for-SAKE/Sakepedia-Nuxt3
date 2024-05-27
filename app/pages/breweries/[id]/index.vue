<script setup lang="ts">
const route = useRoute();
const { getItem } = useFirestore();

const item = await getItem("breweries", route.params.id)
const brewery = item.data()

const add = async function () {
    await navigateTo({ path: "/brands/add", query: { brewery: item.id } })
}

</script>

<template>
    <div>
        <h1>銘柄 詳細</h1>
        <dl>
            <dt>ID</dt>
            <dd>{{ item.id }}</dd>
            <dt>名前</dt>
            <dd>{{ brewery.name }}</dd>
            <dt>説明</dt>
            <dd>{{ brewery.description }}</dd>
        </dl>
        <UButton @click="add">銘柄追加</UButton>
    </div>
</template>