<script setup lang="ts">
import { object, string, number, date, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const route = useRoute()
const localePath = useLocalePath()
const { addItem } = useBreweryYearSpec()
const { getItem: getSake } = useSake()

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
})

const sakeName = ref<string>("")

type Schema = InferType<typeof schema>

const state = reactive({
  makedBY: undefined,
  aminoAcidContentMin: undefined,
  aminoAcidContentMax: undefined,
  alcoholContentMin: undefined,
  alcoholContentMax: undefined,
  sakeMeterValueMin: undefined,
  sakeMeterValueMax: undefined,
  acidityMin: undefined,
  acidityMax: undefined,
  ricePolishingRateMin: undefined,
  ricePolishingRateMax: undefined,
  sakeYeast: undefined,
  riceForMakingKoji: undefined,
  sakeRiceExceptForKojiMaking: undefined,
  bottledDate: undefined,
  sake: null,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const ref = await addItem({
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
  await navigateTo(localePath("/" + ref.path))
}

if (route.params.breweryId) {
  const sake = await getSake(
    `/breweries/${route.params.breweryId}/brands/${route.params.brandId}/sakes/${route.params.sakeId}`,
  )
  state.sake = sake.ref
  sakeName.value = sake.data.name
}
</script>

<template>
  <div>
    <h1>{{ $t("addBreweryData") }}</h1>
    <hr />
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup :label="$t('sake')" name="sake">
        {{ sakeName }}
      </UFormGroup>
      <UFormGroup :label="$t('breweryYear')" name="breweryYear">
        <UInput v-model="state.makedBY" />
      </UFormGroup>
      <UFormGroup :label="$t('amino')" name="amino">
        <div class="grid grid-cols-12 gap-4">
          <UInput v-model="state.aminoAcidContentMin" class="gap-4" />
          〜
          <UInput v-model="state.aminoAcidContentMax" class="gap-4" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('alcohol')" name="alcohol">
        <div class="grid grid-cols-12 gap-4">
          <UInput v-model="state.alcoholContentMin" class="gap-4" />
          〜
          <UInput v-model="state.alcoholContentMax" class="gap-4" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('nihonshudo')" name="nihonshudo">
        <div class="grid grid-cols-12 gap-4">
          <UInput v-model="state.sakeMeterValueMin" class="gap-4" />
          〜
          <UInput v-model="state.sakeMeterValueMax" class="gap-4" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('acidity')" name="acidity">
        <div class="grid grid-cols-12 gap-4">
          <UInput v-model="state.acidityMin" class="gap-4" />
          〜
          <UInput v-model="state.acidityMax" class="gap-4" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('seimaibuai')" name="seimaibuai">
        <div class="grid grid-cols-12 gap-4">
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
      <UButton type="submit"> {{ $t("add") }} </UButton>
      <UButton :to="localePath('/breweryYearSpecs')"> {{ $t("cancel") }}</UButton>
    </UForm>
  </div>
</template>
