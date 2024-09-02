<script setup lang="ts">
import { object, string, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"
import type { BreweryYearSpec } from "~/composables/useBreweryYearSpec"

const route = useRoute()

const { getItem: getSake } = useSake()
const { getItem, setItem } = useBreweryYearSpec()
const localePath = useLocalePath()

const breweryYearSpec = await getItem(
  `/breweries/${route.params.breweryId}/brands/${route.params.brandId}/sakes/${route.params.sakeId}/breweryYearSpecs/${route.params.breweryYearSpecId}`,
)
const sakeName = ref<string>("")

const schema = object({
  name: string().required("名前は必須です"),
  brand: object().required("銘柄は必須です"),
  brewery: object().required("酒蔵は必須です"),
  description: string(),
})

type Schema = InferType<typeof schema>

const state = reactive<BreweryYearSpec>(breweryYearSpec.data)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
  await setItem(breweryYearSpec.path, event.data)
  await navigateTo(localePath("/" + breweryYearSpec.path))
}

if (route.params.breweryId) {
  const sake = await getSake(
    `breweries/${route.params.breweryId}/brands/${route.params.brandId}/sakes/${route.params.sakeId}`,
  )
  state.sake = sake.ref
  sakeName.value = sake.data.name
}
</script>

<template>
  <div>
    <h1>{{ $t("breweryData") }}{{ $t("update") }}</h1>
    <hr />

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <h3>{{ sakeName }}</h3>

      <UFormGroup :label="$t('breweryYear')" name="breweryYear">
        <UInput v-model="state.makedBY" />
      </UFormGroup>
      <UFormGroup :label="$t('amino')" name="amino">
        <UInput v-model="state.aminoAcidContentMin" />
      </UFormGroup>

      <UButton type="submit"> {{ $t("update") }} </UButton>
      <UButton :to="localePath('/' + breweryYearSpec.path)"> {{ $t("cancel") }}</UButton>
    </UForm>
  </div>
</template>
