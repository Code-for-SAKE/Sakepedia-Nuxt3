<script setup lang="ts">
import { object, string, number, boolean, date, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const route = useRoute()
const localePath = useLocalePath()
const { addItem } = useSake()
const { getItem: getBrewery } = useBrewery()
const { getItem: getBrand } = useBrand()

const schema = object({
  name: string(),
  brand: object<Brand>().required("銘柄は必須です"),
  brewery: object<Brewery>().required("酒蔵は必須です"),
  subname: string(),
  type: string(),
  mariages: string(),
  description: string(),
  url: string(),
  createdAt: date(),
  updatedAt: date(),
})

const brandName = ref<string>("")
const breweryName = ref<string>("")

type Schema = InferType<typeof schema>

const state = reactive({
  name: undefined,
  brand: undefined,
  brewery: undefined,
  subname: undefined,
  type: undefined,
  mariages: undefined,
  description: undefined,
  url: undefined,
  createdAt: undefined,
  updatedAt: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const ref = await addItem(event.data)
  await navigateTo(localePath("/" + ref.path))
}

if (route.params.breweryId) {
  const brand = await getBrand(
    `/breweries/${route.params.breweryId}/brands/${route.params.brandId}`,
  )
  state.brand = brand.ref
  brandName.value = brand.data.name
}

if (route.params.breweryId) {
  const brewery = await getBrewery(`/breweries/${route.params.breweryId}`)
  state.brewery = brewery.ref
  breweryName.value = brewery.data.name
}
</script>

<template>
  <div>
    <h1>{{ $t("addSake") }}</h1>
    <hr />
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup :label="$t('name')" name="name" required>
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup :label="$t('brewery')" name="brewery">
        <UInput v-model="state.brewery" />
      </UFormGroup>
      <UFormGroup :label="$t('brand')" name="brand">
        <UInput v-model="state.brand" />
      </UFormGroup>
      <UFormGroup :label="$t('type')" name="type">
        <UInput v-model="state.type" />
      </UFormGroup>
      <UFormGroup :label="$t('pairing')" name="pairing">
        <UInput v-model="state.mariages" />
      </UFormGroup>
      <UFormGroup :label="$t('explanation')" name="explanation">
        <UInput v-model="state.description" />
      </UFormGroup>
      <UFormGroup :label="$t('url')" name="url">
        <UInput v-model="state.url" />
      </UFormGroup>
      <UButton type="submit"> {{ $t("add") }} </UButton>
      <UButton :to="localePath('/' + state)"> {{ $t("cancel") }}</UButton>
    </UForm>
  </div>
</template>
