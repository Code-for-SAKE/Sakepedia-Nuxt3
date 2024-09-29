<script setup lang="ts">
import { object, string, number, boolean, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"
const { t } = useI18n()

const schema = object({
  breweryId: string().max(13, "13桁以内で入力してください"),
  name: string().required(t('name')+t('require')),
  kana: string(),
  address: string(),
  prefecture: string(),
  location: string(),
  latitude: number(),
  longitude: number(),
  email: string(),
  tel: string(),
  fax: string(),
  url: string(),
  ecurl: string(),
  facebook: string(),
  twitter: string(),
  instagram: string(),
  othersns: string(),
  hasVisit: boolean(),
  visit: string(),
  hasTasting: boolean(),
  tasting: string(),
  hasCafe: boolean(),
  cafe: string(),
  hasShop: boolean(),
  shop: string(),
  hasOtherBrewing: boolean(),
  otherBrewing: string(),
  startYear: number(),
  endYear: number(),
})

type Schema = InferType<typeof schema>

const localePath = useLocalePath()
const { addItem } = useBrewery()

const state = reactive({
  breweryId: undefined,
  name: undefined,
  kana: undefined,
  address: undefined,
  prefecture: undefined,
  location: undefined,
  latitude: undefined,
  longitude: undefined,
  email: undefined,
  tel: undefined,
  fax: undefined,
  url: undefined,
  ecurl: undefined,
  facebook: undefined,
  twitter: undefined,
  instagram: undefined,
  othersns: undefined,
  hasVisit: undefined,
  visit: undefined,
  hasTasting: undefined,
  tasting: undefined,
  hasCafe: undefined,
  cafe: undefined,
  hasShop: undefined,
  shop: undefined,
  hasOtherBrewing: undefined,
  otherBrewing: undefined,
  startYear: undefined,
  endYear: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = event.data
  if ((event.data.latitude != undefined, event.data.longitude != undefined)) {
    data.location = {
      latitude: event.data.latitude,
      longitude: event.data.longitude,
    }
    delete event.data.latitude
    delete event.data.longitude
  }

  const res = await addItem(data)
  console.log("res", res)
  await navigateTo(localePath("/" + res.path))
}
</script>
<template>
  <div>
    <h1>{{ $t("addBrewery") }}</h1>
    <hr />
    <div class="flex gap-4">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup :label="$t('coporateNumber')" name="breweryId">
          <UInput v-model="state.breweryId" :placeholder="$t('nationalTaxAgencyIdNumber')" />
        </UFormGroup>

        <UFormGroup :label="$t('name')" name="name" required>
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup :label="$t('kana')" name="kana" required>
          <UInput v-model="state.kana" />
        </UFormGroup>

        <UFormGroup :label="$t('address')" name="address">
          <UInput v-model="state.address" />
          <small
            >{{ $t('explainLocationLiblary') }}
            <a href="https://github.com/geolonia/normalize-japanese-addresses"
              >https://github.com/geolonia/normalize-japanese-addresses</a
            >
          </small>
        </UFormGroup>
        <UFormGroup :label="$t('prefecture')" name="prefecture">
          <UInputMenu
            id="prefecture"
            v-model="state.prefecture"
            :options="prefectures"
            value-attribute="id"
            option-attribute="nameJa"
            class="rounded-l-none"
          />
        </UFormGroup>
        <UFormGroup :label="$t('latitude')" name="latitude">
          <UInput v-model="state.latitude" />
        </UFormGroup>
        <UFormGroup :label="$t('longitude')" name="longitude">
          <UInput v-model="state.longitude" />
        </UFormGroup>
        <UFormGroup :label="$t('email')" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>
        <UFormGroup :label="$t('tel')" name="tel">
          <UInput v-model="state.tel" />
        </UFormGroup>
        <UFormGroup :label="$t('fax')" name="fax">
          <UInput v-model="state.fax" />
        </UFormGroup>
        <UFormGroup :label="$t('url')" name="url">
          <UInput v-model="state.url" />
        </UFormGroup>
        <UFormGroup :label="$t('ecurl')" name="ecurl">
          <UInput v-model="state.ecurl" />
        </UFormGroup>
        <UFormGroup :label="$t('facebook')" name="facebook">
          <UInput v-model="state.facebook" />
        </UFormGroup>
        <UFormGroup :label="$t('twitter')" name="twitter">
          <UInput v-model="state.twitter" />
        </UFormGroup>
        <UFormGroup :label="$t('instagram')" name="instagram">
          <UInput v-model="state.instagram" />
        </UFormGroup>
        <UFormGroup :label="$t('otherSNS')" name="othersns">
          <UInput v-model="state.othersns" />
        </UFormGroup>
        <UFormGroup :label="$t('visit')" name="hasVisit">
          <UCheckbox v-model="state.hasVisit" :label="$t('exist')" />
          <div v-if="state.hasVisit">
            <UInput v-model="state.visit" />
            <small>{{ $t('howParticipate') }}</small>
          </div>
        </UFormGroup>
        <UFormGroup :label="$t('tasting')" name="hasTasting">
          <UCheckbox v-model="state.hasTasting" :label="$t('exist')" />
          <div v-if="state.hasTasting">
            <UInput v-model="state.tasting" />
            <small>{{ $t('opentime') }}</small>
          </div>
        </UFormGroup>
        <UFormGroup :label="$t('cafe')" name="hasCafe">
          <UCheckbox v-model="state.hasCafe" :label="$t('exist')" />
          <div v-if="state.hasCafe">
            <UInput v-model="state.cafe" />
            <small>{{ $t('opentime') }}</small>
          </div>
        </UFormGroup>
        <UFormGroup :label="$t('shop')" name="hasShop">
          <UCheckbox v-model="state.hasShop" :label="$t('exist')" />
          <div v-if="state.hasShop">
            <UInput v-model="state.shop" />
            <small>{{ $t('opentime') }}</small>
          </div>
        </UFormGroup>
        <UFormGroup :label="$t('otherBrewery')" name="hasOtherBrewing">
          <UCheckbox v-model="state.hasOtherBrewing" :label="$t('exist')" />
          <div v-if="state.hasOtherBrewing">
            <UInput v-model="state.otherBrewing" />
            <small>{{ $t('explainOtherBrewery') }}</small>
          </div>
        </UFormGroup>
        <UFormGroup :label="$t('startYear')" name="startYear">
          <UInput v-model="state.startYear" />
        </UFormGroup>
        <UFormGroup :label="$t('endYear')" name="endYear">
          <UInput v-model="state.endYear" />
        </UFormGroup>

        <UButton type="submit"> {{ $t("add") }} </UButton>
        <UButton :to="localePath('/breweries')"> {{ $t("cancel") }}</UButton>
      </UForm>
    </div>
  </div>
</template>
