<script setup lang="ts">
import { object, string, number, boolean, date, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const route = useRoute()
const localePath = useLocalePath()
const { addItem, getItem } = useBreweryYearSpec()
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
  sake: object<Sake>().required("日本酒は必須です"),
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
  sake: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const ref = await addItem({
    makedBY: event.data.makedBY,
    aminoAcidContent:
      event.data.aminoAcidContentMin && event.data.aminoAcidContentMax
        ? [event.data.aminoAcidContentMin, event.data.aminoAcidContentMax]
        : undefined,
    alcoholContent:
      event.data.alcoholContentMin && event.data.alcoholContentMax
        ? [event.data.alcoholContentMin, event.data.alcoholContentMax]
        : undefined,
    sakeMeterValue:
      event.data.sakeMeterValueMin && event.data.sakeMeterValueMax
        ? [event.data.sakeMeterValueMin, event.data.sakeMeterValueMax]
        : undefined,
    acidity:
      event.data.acidityMin && event.data.acidityMax
        ? [event.data.acidityMin, event.data.acidityMax]
        : undefined,
    ricePolishingRate:
      event.data.ricePolishingRateMin && event.data.ricePolishingRateMax
        ? [event.data.ricePolishingRateMin, event.data.ricePolishingRateMax]
        : undefined,
    sakeYeast: event.data.sakeYeast,
    riceForMakingKoji: event.data.riceForMakingKoji,
    sakeRiceExceptForKojiMaking: event.data.sakeRiceExceptForKojiMaking,
    bottledDate: event.data.bottledDate,
    sake: event.data.sake,
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
        <UInput v-model="state.sake" disabled="true" />
      </UFormGroup>
      <UFormGroup :label="$t('breweryYear')" name="breweryYear">
        <UInput v-model="state.makedBY" />
      </UFormGroup>
      <UFormGroup :label="$t('amino')" name="amino">
        <div class="grid grid-cols-12 gap-4">
          <UInput class="gap-4" v-model="state.aminoAcidContentMin" />
          〜
          <UInput class="gap-4" v-model="state.aminoAcidContentMax" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('alcohol')" name="alcohol">
        <div class="grid grid-cols-12 gap-4">
          <UInput class="gap-4" v-model="state.alcoholContentMin" />
          〜
          <UInput class="gap-4" v-model="state.alcoholContentMax" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('nihonshudo')" name="nihonshudo">
        <div class="grid grid-cols-12 gap-4">
          <UInput class="gap-4" v-model="state.sakeMeterValueMin" />
          〜
          <UInput class="gap-4" v-model="state.sakeMeterValueMax" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('acidity')" name="acidity">
        <div class="grid grid-cols-12 gap-4">
          <UInput class="gap-4" v-model="state.acidityMin" />
          〜
          <UInput class="gap-4" v-model="state.acidityMax" />
        </div>
        <small>{{ $t("explainRange") }} </small>
      </UFormGroup>
      <UFormGroup :label="$t('seimaibuai')" name="seimaibuai">
        <div class="grid grid-cols-12 gap-4">
          <UInput class="gap-4" v-model="state.ricePolishingRateMin" />
          〜
          <UInput class="gap-4" v-model="state.ricePolishingRateMax" />
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
      <UButton :to="localePath('/' + state)"> {{ $t("cancel") }}</UButton>
    </UForm>
  </div>
</template>
