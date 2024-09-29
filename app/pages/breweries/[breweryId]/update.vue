<script setup lang="ts">
import { object, string, number, type InferType, boolean } from "yup"
import type { FormSubmitEvent } from "#ui/types"
import type { Data } from "~/composables/useFirestore"

import type { Brewery } from "~/composables/useBrewery"

const { t } = useI18n()

const route = useRoute()
const { getItem, setItem } = useBrewery()
const localePath = useLocalePath()

const brewery: Data<Brewery> = await getItem(`breweries/${route.params.breweryId}`)

const schema = object({
  breweryId: string().max(13, "13桁以内で入力してください"),
  name: string().required(t('name')+t('require')),
  kana: string().required(t('kana')+t('require')),
  address: string(),
  prefecture: string(),
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

const input: Schema = brewery.data
input.latitude = brewery.data.location?.latitude
input.longitude = brewery.data.location?.longitude
const state = reactive(input)
console.log("state.twitter", state.twitter)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log("event.data", event.data)
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

  await setItem(brewery.path, event.data)
  await navigateTo(localePath("/" + brewery.path))
}
</script>

<template>
  <div>
    <h1>{{ $t("brewery") }}{{ $t("update") }}</h1>
    <hr>
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

      <UFormGroup :label="$t('address')" name="address" required>
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
        <UCheckbox v-model="state.hasOtherBrewing" label="あり" />
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

      <UButton type="submit"> {{ $t("update") }} </UButton>
      <UButton :to="localePath('/breweries/' + brewery.id)"> {{ $t("cancel") }}</UButton>
    </UForm>
  </div>
</template>
