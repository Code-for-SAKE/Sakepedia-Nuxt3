<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import type { Brand } from '~/components/Brand';

const route = useRoute();
const { getItem } = useBrand();

const item = await getItem("brands", route.params.brandId)
const brand: Brand = item.data()
let searchText: string = "";
if (brand.brewery) {
    const ref = await getFromReference(brand.brewery)
    const breweryId = ref.id
    const brewery = ref.data()
    searchText = brewery.name;
}

const schema = object({
    name: string().required('名前は必須です'),
    brewery: object().required('酒蔵は必須です'),
    description: string()
})

type Schema = InferType<typeof schema>

const state = reactive(brand)

async function onSubmit(event: FormSubmitEvent<Schema>) {
    // Do something with event.data
    console.log(event.data)
    event.data.brewery = await getReference("breweries", selected.value.id)
    const res = await setItem("brands", item.id, event.data)
    await navigateTo('/brands/' + item.id)
}

const loading = ref(false)
const selected = ref(searchText)


async function search(q: string) {
    loading.value = true

    const res = await getList('breweries', {
        searchText: q,
        before: null,
        limit: 10,
    });
    const list = res.list.map((doc: any) => {
        let data = doc.data()
        data['id'] = doc.id
        return data
    })
    loading.value = false
    console.log(list)
    return list
}
</script>

<template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="名前" name="name">
            <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="酒蔵" name="brewery">
            <USelectMenu v-model="selected" :loading="loading" :searchable="search" placeholder="酒蔵検索..."
                option-attribute="name" trailing by="id" />
        </UFormGroup>
        <UFormGroup label="説明" name="description">
            <UTextarea v-model="state.description" />
        </UFormGroup>

        <UButton type="submit">
            Submit
        </UButton>
    </UForm>
</template>
