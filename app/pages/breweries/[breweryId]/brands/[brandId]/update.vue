<script setup lang="ts">
import { object, string, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const { t } = useI18n()
const route = useRoute()

const { getItem: getBrewery } = useBrewery()
const { getItem, setItem } = useBrand()
const localePath = useLocalePath()
const toast = useToast()

const brand = await getItem(`/breweries/${route.params.breweryId}/brands/${route.params.brandId}`)
const breweryName = ref<string>("")

const schema = object({
  name: string().required("名前は必須です"),
  brewery: object().required("酒蔵は必須です"),
  description: string().nullable(),
})

type Schema = InferType<typeof schema>

const state = reactive<Brand>(brand.data)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
  await setItem(brand.path, event.data)
  toast.add({ title: t("updated"), timeout: 2000, icon: "i-heroicons-check-circle" })
  await navigateTo(localePath("/" + brand.path))
}

if (route.params.breweryId) {
  const brewery = await getBrewery(`breweries/${route.params.breweryId}`)
  state.brewery = brewery.ref
  breweryName.value = brewery.data.name
}
</script>

<template>
  <div>
    <h1>{{ $t("brand") }}{{ $t("update") }}</h1>
    <hr />
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup :label="$t('name')" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup :label="$t('brewery')" name="brewery">
        {{ breweryName }}
      </UFormGroup>
      <UFormGroup :label="$t('logo')" name="logo">
        <UInput v-model="state.logo" />
      </UFormGroup>
      <UFormGroup :label="$t('speciality')" name="description">
        <UTextarea v-model="state.description" />
      </UFormGroup>
      <UButton type="submit"> {{ $t("update") }} </UButton>
      <UButton :to="localePath('/' + brand.path)"> {{ $t("cancel") }}</UButton>
    </UForm>
  </div>
</template>
