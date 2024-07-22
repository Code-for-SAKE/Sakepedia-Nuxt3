<script setup lang="ts">
import { object, string, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const route = useRoute()
const { getList } = useBrewery()
const { addItem, getReference, getItem } = useBrand()

const schema = object({
  name: string().required("名前は必須です"),
  brewery: object().required("酒蔵は必須です"),
  description: string(),
})

type Schema = InferType<typeof schema>

const state = reactive({
  name: undefined,
  description: undefined,
  brewery: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const ref = await addItem(event.data)
  await navigateTo(ref.path)
}

async function onChange() {
  state.brewery = selected.value
}

let searchText = ""
if (route.query.breweryId) {
  const brewery = await getItem(`breweries/${route.query.breweryId}`)
  state.brewery = await getReference(brewery!.path)
  searchText = brewery!.name
}

const loading = ref(false)
const selected = ref(searchText)

async function search(q: string) {
  loading.value = true

  const res = await getList({
    searchText: q,
    before: undefined,
    limit: 10,
    prefecture: "0",
  })
  const list = res.list.map((data) => {
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
      <USelectMenu
        v-model="selected"
        :loading="loading"
        :searchable="search"
        placeholder="酒蔵検索..."
        option-attribute="name"
        trailing
        by="path"
        @change="onChange"
      />
    </UFormGroup>
    <UFormGroup label="説明" name="description">
      <UTextarea v-model="state.description" />
    </UFormGroup>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>
