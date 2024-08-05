<script setup lang="ts">
import { object, string, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"
import type { Data } from "~/composables/useFirestore"

import type { Brewery } from "~/composables/useBrewery"

const route = useRoute()
const { getItem, setItem } = useBrewery()

const brewery: Data<Brewery> = await getItem(`breweries/${route.params.breweryId}`)

const schema = object({
  breweryId: string().max(13, "13桁以内で入力してください"),
  name: string().required("名前は必須です"),
  address: string(),
  prefecture: string(),
  latitude: string(),
  longitude: string(),
  email: string(),
  tel: string(),
  fax: string(),
  url: string(),
  ecurl: string(),
  facebook: string(),
  twitter: string(),
  instagram: string(),
  othersns: string(),
  hasVisit: string(),
  visit: string(),
  hasTasting: string(),
  tasting: string(),
  hasCafe: string(),
  cafe: string(),
  hasShop: string(),
  shop: string(),
  hasOtherBrewing: string(),
  otherBrewing: string(),
  startYear: string(),
  endYear: string(),
})

type Schema = InferType<typeof schema>

const state = reactive(brewery.data)
console.log("state.twitter", state.twitter)
const entries = Object.entries(state)
for (const [key, value] of entries) {
  if (value === null) {
    delete state[key]
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log("event.data", event.data)
  await setItem(brewery.path, event.data)
}
</script>

<template>
  <div>
    <h1>酒蔵 更新</h1>
    <hr />
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="法人番号" name="breweryId">
        <UInput placeholder="国税庁が指定する13桁の識別番号" v-model="state.breweryId" />
      </UFormGroup>

      <UFormGroup label="名前" name="name" required="true">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="ふりがな" name="kana" required="true">
        <UInput v-model="state.kana" />
      </UFormGroup>

      <UFormGroup label="住所" name="address" required="true">
        <UInput v-model="state.address" />
        <small
          >都道府県、緯度経度は住所から自動的に登録されます。
          <a href="https://geolonia.com/">Geolonia</a>の<a
            href="https://github.com/geolonia/normalize-japanese-addresses"
            >住所正規化ライブラリ</a
          >を利用しています。<br />
          正確な緯度経度がわかる場合は入力してください。
        </small>
      </UFormGroup>
      <UFormGroup label="都道府県" name="prefecture">
        <UInputMenu
          id="prefecture"
          v-model="state.prefecture"
          :options="prefectures"
          value-attribute="id"
          option-attribute="nameJa"
          class="rounded-l-none"
        />
      </UFormGroup>
      <UFormGroup label="緯度" name="latitude">
        <UInput v-model="state.location.latitude" />
      </UFormGroup>
      <UFormGroup label="経度" name="longtitude">
        <UInput v-model="state.location.longitude" />
      </UFormGroup>
      <UFormGroup label="Eメール" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="電話番号" name="tel">
        <UInput v-model="state.tel" />
      </UFormGroup>
      <UFormGroup label="FAX番号" name="fax">
        <UInput v-model="state.fax" />
      </UFormGroup>
      <UFormGroup label="URL" name="url">
        <UInput v-model="state.url" />
      </UFormGroup>
      <UFormGroup label="購入URL" name="ecurl">
        <UInput v-model="state.ecurl" />
      </UFormGroup>
      <UFormGroup label="Facebook" name="facebook">
        <UInput v-model="state.facebook" />
      </UFormGroup>
      <UFormGroup label="Twitter" name="twitter">
        <UInput v-model="state.twitter" />
      </UFormGroup>
      <UFormGroup label="Instagram" name="instagram">
        <UInput v-model="state.instagram" />
      </UFormGroup>
      <UFormGroup label="その他SNS" name="othersns">
        <UInput v-model="state.othersns" />
      </UFormGroup>
      <UFormGroup label="見学" name="hasVisit">
        <UCheckbox v-model="state.hasVisit" label="あり" />
        <div v-if="state.hasVisit">
          <UInput v-model="state.visit" />
          <small>参加方法など</small>
        </div>
      </UFormGroup>
      <UFormGroup label="試飲" name="hasTasting">
        <UCheckbox v-model="state.hasTasting" label="あり" />
        <div v-if="state.hasTasting">
          <UInput v-model="state.tasting" />
          <small>営業時間や定休日など</small>
        </div>
      </UFormGroup>
      <UFormGroup label="併設カフェ" name="hasCafe">
        <UCheckbox v-model="state.hasCafe" label="あり" />
        <div v-if="state.hasCafe">
          <UInput v-model="state.cafe" />
          <small>営業時間や定休日など</small>
        </div>
      </UFormGroup>
      <UFormGroup label="併設ショップ" name="hasShop">
        <UCheckbox v-model="state.hasShop" label="あり" />
        <div v-if="state.hasShop">
          <UInput v-model="state.shop" />
          <small>営業時間や定休日など</small>
        </div>
      </UFormGroup>
      <UFormGroup label="日本酒以外の醸造・蒸留" name="hasOtherBrewing">
        <UCheckbox v-model="state.hasOtherBrewing" label="あり" />
        <div v-if="state.hasOtherBrewing">
          <UInput v-model="state.otherBrewing" />
          <small>種類など</small>
        </div>
      </UFormGroup>
      <UFormGroup label="創業年" name="startYear">
        <UInput v-model="state.startYear" />
      </UFormGroup>
      <UFormGroup label="廃業年" name="endYear">
        <UInput v-model="state.endYear" />
      </UFormGroup>

      <UButton type="submit"> 更新 </UButton>
      <UButton :to="'/breweries/' + brewery.id"> キャンセル </UButton>
    </UForm>
  </div>
</template>
