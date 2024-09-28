<script setup lang="ts">
import { object, string, array, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const route = useRoute()

const { getItem: getBrewery } = useBrewery()
const { getItem: getBrand } = useBrand()
const { getItem, setItem } = useSake()
const localePath = useLocalePath()

const sake = await getItem(
  `/breweries/${route.params.breweryId}/brands/${route.params.brandId}/sakes/${route.params.sakeId}`,
)
const breweryName = ref<string>("")
const brandName = ref<string>("")

const schema = object({
  name: string().required("名前は必須です"),
  brewery: object().required("酒蔵は必須です"),
  brand: object().required("銘柄は必須です"),
  subname: string(),
  type: array().of(string().required()),
  mariages: array().of(string().required()),
  description: string(),
  url: string(),
})

type Schema = InferType<typeof schema>

const state = reactive<Sake>(sake.data)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  await setItem(sake.path, event.data)
  await navigateTo(localePath("/" + sake.path))
}

if (route.params.breweryId) {
  const brewery = await getBrewery(`breweries/${route.params.breweryId}`)
  state.brewery = brewery.ref
  breweryName.value = brewery.data.name
  if (route.params.brandId) {
    const brand = await getBrand(
      `breweries/${route.params.breweryId}/brands/${route.params.brandId}`,
    )
    state.brand = brand.ref
    brandName.value = brand.data.name
  }
}
</script>

<template>
  <div>
    <h1>{{ $t("sake") }}{{ $t("update") }}</h1>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup :label="$t('name')" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup :label="$t('brewery')" name="brewery">
        {{ breweryName }}
      </UFormGroup>
      <UFormGroup :label="$t('brand')" name="brand">
        {{ brandName }}
      </UFormGroup>
      <UFormGroup :label="$t('type')" name="type">
        <TagSelect v-model="state.type" :options="sakeTypes" placeholder="" />
      </UFormGroup>
      <UFormGroup :label="$t('pairing')" name="pairing">
        <TagSelect v-model="state.mariages" :options="appetizers" placeholder="" />
      </UFormGroup>
      <UFormGroup :label="$t('explanation')" name="explanation">
        <UInput v-model="state.description" />
      </UFormGroup>
      <UFormGroup :label="$t('url')" name="url">
        <UInput v-model="state.url" />
      </UFormGroup>
      <UButton type="submit"> {{ $t("update") }} </UButton>
      <UButton :to="localePath('/' + sake.path)"> {{ $t("cancel") }}</UButton>
    </UForm>
  </div>
</template>
