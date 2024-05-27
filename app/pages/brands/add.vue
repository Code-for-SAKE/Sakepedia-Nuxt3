<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const route = useRoute();
const { addItem, getList, getReference, getItem } = useFirestore();

const schema = object({
    name: string().required('名前は必須です'),
    brewery: object().required('酒蔵は必須です'),
    description: string()
})

type Schema = InferType<typeof schema>

const state = reactive({
    name: undefined,
    description: undefined,
    brewery: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    const ref = await addItem("brands", event.data)
    await navigateTo('/brands/' + ref.id)
}

async function onChange() {
    state.brewery = await getReference("breweries", selected.value.id)
}

let searchText = ""
if(route.query.brewery){
    const brewery = await getItem("breweries", route.query.brewery)
    state.brewery = await getReference("breweries", brewery.id)
    searchText = brewery.data().name
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
                option-attribute="name" trailing @change="onChange" by="id" />
        </UFormGroup>
        <UFormGroup label="説明" name="description">
            <UTextarea v-model="state.description" />
        </UFormGroup>

        <UButton type="submit">
            Submit
        </UButton>
    </UForm>
</template>
