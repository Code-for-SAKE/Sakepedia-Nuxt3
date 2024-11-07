<script setup lang="ts">
import { object, string, array, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const { t } = useI18n()
const route = useRoute()

const { getItem: getBrewery, getList: getBreweriesList, getBrandList } = useBrewery()
const { getItem: getBrand } = useBrand()
const { getItem, setItem } = useSake()
const localePath = useLocalePath()
const toast = useToast()

const sake = await getItem(
  `/breweries/${route.params.breweryId}/brands/${route.params.brandId}/sakes/${route.params.sakeId}`,
)
const breweryName = ref<string>("")
const brandName = ref<string>("")

const schema = object({
  name: string().required("名前は必須です"),
  brewery: object().required("酒蔵は必須です"),
  brand: object().required("銘柄は必須です"),
  subname: string().nullable(),
  type: array().of(string().required()),
  mariages: array().of(string().required()),
  description: string().nullable(),
  url: string().nullable(),
})

type Schema = InferType<typeof schema>

const state = reactive<Sake>(sake.data)
const newBrewery = ref<string>("")
const newBrand = ref<string>("")

const breweries = await getBreweriesList({
  searchText: "",
  before: undefined,
  limit: 3000,
}).then((breweries) => {
  return breweries.list.map((brewery) => {
    return {
      path: brewery.path,
      label: brewery.data.name,
    }
  })
})

const brands = ref<{ path: string; label: string }[]>([])
async function onChangeBrewery(brewery: string | undefined | null) {
  console.log("brewery", brewery)
  if (!brewery) {
    brands.value = []
    return
  }

  brands.value = await getBrandList({
    breweryId: String(brewery).replace("breweries/", ""),
    searchText: "",
    before: undefined,
    limit: 100,
  }).then((brands) => {
    return brands.list.map((brand) => {
      return {
        path: brand.path,
        label: brand.data.name,
      }
    })
  })
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  await setItem(sake.path, event.data)
  toast.add({ title: t("updated"), timeout: 2000, icon: "i-heroicons-check-circle" })
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

if (!Array.isArray(state.type)) {
  state.type = [state.type]
}

// onChangeBrewery(state.brewery?.path)
</script>

<template>
  <div>
    <h1>{{ $t("sake") }}{{ $t("update") }}</h1>
    <hr />
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup :label="$t('name')" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup :label="$t('brewery')" name="brewery">
        {{ breweryName }}
        <USelectMenu
          v-if="!breweryName"
          v-model="newBrewery"
          :options="breweries"
          option-attribute="label"
          value-attribute="path"
          searchable
          @change="onChangeBrewery(newBrewery)"
        />
      </UFormGroup>
      <UFormGroup :label="$t('brand')" name="brand">
        {{ brandName }}
        <USelectMenu
          v-if="!brandName"
          v-model="newBrand"
          :options="brands"
          option-attribute="label"
          value-attribute="path"
          searchable
        />
      </UFormGroup>
      <UFormGroup :label="$t('type')" name="type">
        <TagSelect
          v-if="Array.isArray(state.type)"
          v-model="state.type"
          :options="sakeTypes"
          placeholder=""
        />
      </UFormGroup>
      <UFormGroup :label="$t('pairing')" name="pairing">
        <TagSelect
          v-if="Array.isArray(state.mariages)"
          v-model="state.mariages"
          :options="appetizers"
          placeholder=""
        />
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
