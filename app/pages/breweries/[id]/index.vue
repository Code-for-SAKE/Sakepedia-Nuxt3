<script setup lang="ts">
const route = useRoute();
const { getItem } = useFirestore();

const brewery = await getItem("breweries", route.params.id)

</script>

<template>
    <div>
        <h1>銘柄 詳細</h1>
        <dl>
            <dt>ID</dt><dd>{{ route.params.id }}</dd>
            <dt>名前</dt><dd>{{ brewery.name }}</dd>
            <dt>説明</dt><dd>{{ brewery.description }}</dd>
        </dl>
    </div>
</template>