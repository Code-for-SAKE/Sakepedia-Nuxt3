<script setup lang="ts">
import { object, string, number, date, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const route = useRoute()

const { getItem: getSake } = useSake()
const { getItem, setItem } = useBreweryYearSpec()
const localePath = useLocalePath()

const breweryYearSpec = await getItem(
  `/breweries/${route.params.breweryId}/brands/${route.params.brandId}/sakes/${route.params.sakeId}/breweryYearSpecs/${route.params.breweryYearSpecId}`,
)
const sakeName = ref<string>("")

const schema = object({
  makedBY: number(),
  aminoAcidContentMin: number(),
  aminoAcidContentMax: number(),
  alcoholContentMin: number(),
  alcoholContentMax: number(),
  sakeMeterValueMin: number(),
  sakeMeterValueMax: number(),
  acidityMin: number(),
  acidityMax: number(),
  ricePolishingRateMin: number(),
  ricePolishingRateMax: number(),
  sakeYeast: string(),
  riceForMakingKoji: string(),
  sakeRiceExceptForKojiMaking: string(),
  bottledDate: date(),
  sake: object<Sake>().required("日本酒は必須です"),
})

type Schema = InferType<typeof schema>

const state = reactive({
  makedBY: breweryYearSpec.data.makedBY,
  aminoAcidContentMin: breweryYearSpec.data.aminoAcidContent
    ? breweryYearSpec.data.aminoAcidContent[0]
    : undefined,
  aminoAcidContentMax: breweryYearSpec.data.aminoAcidContent
    ? breweryYearSpec.data.aminoAcidContent[1]
    : undefined,
  alcoholContentMin: breweryYearSpec.data.alcoholContent
    ? breweryYearSpec.data.alcoholContent[0]
    : undefined,
  alcoholContentMax: breweryYearSpec.data.alcoholContent
    ? breweryYearSpec.data.alcoholContent[1]
    : undefined,
  sakeMeterValueMin: breweryYearSpec.data.sakeMeterValue
    ? breweryYearSpec.data.sakeMeterValue[0]
    : undefined,
  sakeMeterValueMax: breweryYearSpec.data.sakeMeterValue
    ? breweryYearSpec.data.sakeMeterValue[1]
    : undefined,
  acidityMin: breweryYearSpec.data.acidity ? breweryYearSpec.data.acidity[0] : undefined,
  acidityMax: breweryYearSpec.data.acidity ? breweryYearSpec.data.acidity[1] : undefined,
  ricePolishingRateMin: breweryYearSpec.data.ricePolishingRate
    ? breweryYearSpec.data.ricePolishingRate[0]
    : undefined,
  ricePolishingRateMax: breweryYearSpec.data.ricePolishingRate
    ? breweryYearSpec.data.ricePolishingRate[1]
    : undefined,
  sakeYeast: breweryYearSpec.data.sakeYeast,
  riceForMakingKoji: breweryYearSpec.data.riceForMakingKoji,
  sakeRiceExceptForKojiMaking: breweryYearSpec.data.sakeRiceExceptForKojiMaking,
  bottledDate: breweryYearSpec.data.bottledDate,
  sake: breweryYearSpec.data.sake,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
  await setItem(breweryYearSpec.path, {
    makedBY: event.data.makedBY,
    aminoAcidContent:
      event.data.aminoAcidContentMin && event.data.aminoAcidContentMax
        ? [event.data.aminoAcidContentMin, event.data.aminoAcidContentMax]
        : event.data.aminoAcidContentMin
          ? [event.data.aminoAcidContentMin]
          : undefined,
    alcoholContent:
      event.data.alcoholContentMin && event.data.alcoholContentMax
        ? [event.data.alcoholContentMin, event.data.alcoholContentMax]
        : event.data.alcoholContentMin
          ? [event.data.alcoholContentMin]
          : undefined,
    sakeMeterValue:
      event.data.sakeMeterValueMin && event.data.sakeMeterValueMax
        ? [event.data.sakeMeterValueMin, event.data.sakeMeterValueMax]
        : event.data.sakeMeterValueMin
          ? [event.data.sakeMeterValueMin]
          : undefined,
    acidity:
      event.data.acidityMin && event.data.acidityMax
        ? [event.data.acidityMin, event.data.acidityMax]
        : event.data.acidityMin
          ? [event.data.acidityMin]
          : undefined,
    ricePolishingRate:
      event.data.ricePolishingRateMin && event.data.ricePolishingRateMax
        ? [event.data.ricePolishingRateMin, event.data.ricePolishingRateMax]
        : event.data.ricePolishingRateMin
          ? [event.data.ricePolishingRateMin]
          : undefined,
    sakeYeast: event.data.sakeYeast,
    riceForMakingKoji: event.data.riceForMakingKoji,
    sakeRiceExceptForKojiMaking: event.data.sakeRiceExceptForKojiMaking,
    bottledDate: event.data.bottledDate,
    sake: state.sake,
  })
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
    <hr>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <h3>{{ sakeName }}</h3>
      <UFormGroup :label="$t('breweryYear')" name="breweryYear">
        <UInput v-model="state.makedBY" />
      </UFormGroup>
      <UFormGroup :label="$t('amino')" name="amino">
        <div class="flex gap-4">
          <UInput v-model="state.aminoAcidContentMin" class="gap-4" />
          〜
          <UInput v-model="state.aminoAcidContentMax" class="gap-4" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('alcohol')" name="alcohol">
        <div class="flex gap-4">
          <UInput v-model="state.alcoholContentMin" class="gap-4" />
          〜
          <UInput v-model="state.alcoholContentMax" class="gap-4" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('nihonshudo')" name="nihonshudo">
        <div class="flex gap-4">
          <UInput v-model="state.sakeMeterValueMin" class="gap-4" />
          〜
          <UInput v-model="state.sakeMeterValueMax" class="gap-4" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('acidity')" name="acidity">
        <div class="flex gap-4">
          <UInput v-model="state.acidityMin" class="gap-4" />
          〜
          <UInput v-model="state.acidityMax" class="gap-4" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('seimaibuai')" name="seimaibuai">
        <div class="flex gap-4">
          <UInput v-model="state.ricePolishingRateMin" class="gap-4" />
          〜
          <UInput v-model="state.ricePolishingRateMax" class="gap-4" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('yeast')" name="yeast">
        <UInput v-model="state.sakeYeast" />
      </UFormGroup>
      <UFormGroup :label="$t('koujimai')" name="koujimai">
        <UInput v-model="state.riceForMakingKoji" />
      </UFormGroup>
      <UFormGroup :label="$t('kakemai')" name="kakemai">
        <UInput v-model="state.sakeRiceExceptForKojiMaking" />
      </UFormGroup>
      <UFormGroup :label="$t('manufacturedAt')" name="manufacturedAt">
        <UInput v-model="state.bottledDate" />
      </UFormGroup>
      <UButton type="submit"> {{ $t("update") }} </UButton>
      <UButton :to="localePath('/' + breweryYearSpec.path)"> {{ $t("cancel") }}</UButton>
    </UForm>
  </div>
</template>
