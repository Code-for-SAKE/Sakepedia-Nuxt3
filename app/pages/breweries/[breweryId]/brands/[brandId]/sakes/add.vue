<script setup lang="ts">
import { object, string, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const route = useRoute()
const localePath = useLocalePath()
const { getItem: getBrewery } = useBrewery()
const { getItem: getBrand } = useBrand()
const { addItem } = useSake()

const schema = object({
  name: string().required("名前は必須です"),
  description: string(),
})

const breweryName = ref<string>("")
const brandName = ref<string>("")

type Schema = InferType<typeof schema>

const state = reactive<Sake>({
  name: "",
  description: "",
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
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup :label="$t('name')" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>
    <UFormGroup label="酒蔵" name="brewery">
      {{ breweryName }}
    </UFormGroup>
    <UFormGroup label="銘柄" name="brand">
      {{ brandName }}
    </UFormGroup>
    <UFormGroup label="説明" name="description">
      <UTextarea v-model="state.description" />
    </UFormGroup>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>
