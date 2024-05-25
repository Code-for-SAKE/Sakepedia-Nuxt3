<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import type { Brand } from '~/components/Brand';

const route = useRoute();
const { getItem, getReference, setItem, getList } = useFirestore();

const item = await getItem("brands", route.params.id)
const brand : Brand = item.data()
if (brand.brewery) {
    const ref = await getReference(brand.brewery)
    const breweryId = ref.id
    const brewery = ref.data()
}

const schema = object({
    name: string().required('名前は必須です'),
    brewery: string(),
    description: string()
})

type Schema = InferType<typeof schema>

const state = reactive(brand)

async function onSubmit (event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
  const res = await setItem("brands", item.id, event.data)
  await navigateTo('/brands/' + item.id)
}

const loading = ref(false)
const selected = ref([])

async function search (q: string) {
  loading.value = true

  const res = await getList('breweries', {
    searchText: q,
    before: null,
    limit: 10,
  });

  loading.value = false

  return res
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="名前" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>
    <USelectMenu
      v-model="state.brewery"
      :loading="loading"
      :searchable="search"
      placeholder="Search for a user..."
      option-attribute="name"
      multiple
      trailing
      by="id"
      :search-attributes="['name']"
    />
    <UFormGroup label="説明" name="description">
      <UTextarea v-model="state.description" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>

