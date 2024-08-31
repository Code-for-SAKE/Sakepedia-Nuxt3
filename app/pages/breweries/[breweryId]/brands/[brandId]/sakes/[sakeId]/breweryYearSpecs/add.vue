<script setup lang="ts">
import { object, string, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const route = useRoute()
const localePath = useLocalePath()
const { addItem, getItem } = useBrew()

const schema = object({
  name: string().required("名前は必須です"),
  brewery: object<Brewery>().required("酒蔵は必須です"),
  brand: object<Brand>().required("銘柄は必須です"),
  sake: object<Sake>().required("日本酒は必須です"),
  description: string(),
})

const breweryYearSpecName = ref<string>("")

type Schema = InferType<typeof schema>

const state = reactive<BreweryYearSpec>({
  name: "",
  sake: null,
  makedBY: null,
  aminoAcidContentMin: null,
  aminoAcidContentMax: null,
  alcoholContentMin: null,
  alcoholContentMax: null,
  sakeMeterValueMin: null,
  sakeMeterValueMax: null,
  acidityMin: null,
  acidityMax: null,
  ricePolishingRateMin: null,
  ricePolishingRateMax: null,
  sakeYeast: null,
  riceForMakingKoji: null,
  sakeRiceExceptForKojiMaking: null,
  bottledDate: null,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const ref = await addItem(event.data)
  await navigateTo(localePath("/" + ref.path))
}

if (route.params.breweryId) {
  const brewery = await getItem(`breweries/${route.params.breweryId}`)
  state.brewery = brewery.ref
  breweryYearSpecName.value = brewery.data.name
}
</script>

<template>
  <div>
    <h1>{{ $t("addBreweryData") }}</h1>
    <hr />
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup :label="$t('sake')" name="sake">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup :label="$t('breweryYear')" name="breweryYear">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup :label="$t('amino')" name="amino">
        <div class="grid grid-cols-12 gap-4">
          <UInput class="gap-4" v-model="state.name" />
          〜
          <UInput class="gap-4" v-model="state.name" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('alcohol')" name="alcohol">
        <div class="grid grid-cols-12 gap-4">
          <UInput class="gap-4" v-model="state.name" />
          〜
          <UInput class="gap-4" v-model="state.name" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('nihonshudo')" name="nihonshudo">
        <div class="grid grid-cols-12 gap-4">
          <UInput class="gap-4" v-model="state.name" />
          〜
          <UInput class="gap-4" v-model="state.name" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('acidity')" name="acidity">
        <div class="grid grid-cols-12 gap-4">
          <UInput class="gap-4" v-model="state.name" />
          〜
          <UInput class="gap-4" v-model="state.name" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('seimaibuai')" name="seimaibuai">
        <div class="grid grid-cols-12 gap-4">
          <UInput class="gap-4" v-model="state.name" />
          〜
          <UInput class="gap-4" v-model="state.name" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('yeast')" name="yeast">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup :label="$t('koujimai')" name="koujimai">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup :label="$t('kakemai')" name="kakemai">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup :label="$t('manufacturedAt')" name="manufacturedAt">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UButton type="submit"> {{ $t("add") }} </UButton>
      <UButton :to="localePath('/' + state.path)"> {{ $t("cancel") }}</UButton>
    </UForm>
  </div>
</template>
