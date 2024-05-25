<script setup lang="ts">
import type { Brand } from '~/components/Brand';

const route = useRoute();
const { getItem, getReference } = useFirestore();

const brand:Brand = await getItem("brands", route.params.id)
const brewery = await getReference(brand.brewery)
</script>

<template>
    <div>
        <h1>銘柄 詳細</h1>
        <dl>
            <dt>ID</dt><dd>{{ route.params.id }}</dd>
            <dt>名前</dt><dd>{{ brand.name }}</dd>
            <dt>酒蔵</dt><dd>
                <NuxtLink :to="'/breweries/' + brewery._id">
                    <div class="w-full">{{ brewery.name }}</div>
                </NuxtLink>
            </dd>
            <dt>説明</dt><dd>{{ brand.description }}</dd>
        </dl>
    </div>
</template>