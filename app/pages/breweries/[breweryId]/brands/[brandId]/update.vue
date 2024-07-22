<script setup lang="ts">
import { object, string, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"
import type { Data } from "~/composables/useFirestore"

const route = useRoute()
const { getList, getItem: getBrewery, getReference } = useBrewery()
const { getItem, setItem } = useBrand()

const item = await getItem(`breweries/${route.params.breweryId}/brands/${route.params.brandId}`)
const brand: Data<Brand> = item!
let searchText: string = ""
if (brand.data.brewery) {
  console.log(brand.data.brewery)
  const brewery = await getBrewery(brand.data.brewery.path)
  searchText = brewery?.data.name
}
console.log(brand)

const schema = object({
  name: string().required("名前は必須です"),
  brewery: object().required("酒蔵は必須です"),
  description: string(),
})

type Schema = InferType<typeof schema>

const state = reactive(brand)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
  event.data.brewery = await getReference(selected.value)
  await setItem(brand.path, event.data)
  await navigateTo(brand.path)
}

const loading = ref(false)
const selected = ref(searchText)

async function search(q: string) {
  loading.value = true

  const res = await getList({
    searchText: q,
    before: undefined,
    limit: 10,
    prefecture: undefined,
  })
  loading.value = false
  console.log(res.list)
  return res.list
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="名前" name="name">
      <UInput v-model="state.data.name" />
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
      />
    </UFormGroup>
    <UFormGroup label="説明" name="description">
      <UTextarea v-model="state.data.description" />
    </UFormGroup>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>
