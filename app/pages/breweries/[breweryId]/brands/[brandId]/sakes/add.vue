<script setup lang="ts">
import { object, string, array, date, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const route = useRoute()
const localePath = useLocalePath()
const { getItem: getBrewery } = useBrewery()
const { getItem: getBrand } = useBrand()
const { addItem } = useSake()

const schema = object({
  name: string().required("名前は必須です"),
  subname: string(),
  type: array().of(string().required()).required(),
  mariages: array().of(string().required()).required(),
  description: string(),
  url: string(),
  createdAt: date(),
  updatedAt: date(),
})

const breweryName = ref<string>("")
const brandName = ref<string>("")

type Schema = InferType<typeof schema>

const state = reactive<Sake>({
  name: "",
  subname: "",
  type: [],
  mariages: [],
  description: "",
  url: "",
  createdAt: undefined,
  updatedAt: undefined,
  brewery: null,
  brand: null,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = event.data
  data.brand = state.brand
  data.brewery = state.brewery
  const ref = await addItem(data)
  await navigateTo(localePath("/" + ref.path))
}
if (route.params.breweryId) {
  if (route.params.brandId) {
    const brewery = await getBrewery(`breweries/${route.params.breweryId}`)
    state.brewery = brewery.ref
    breweryName.value = brewery.data.name
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
    <h1>{{ $t("addSake") }}</h1>
    <hr>

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
    <UButton type="submit"> {{ $t("add") }} </UButton>
    <UButton :to="localePath('/' + state.brand?.path)"> {{ $t("cancel") }}</UButton>
  </UForm>
</div>
</template>
