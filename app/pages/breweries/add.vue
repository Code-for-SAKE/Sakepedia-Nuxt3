<script setup lang="ts">
import { object, string, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const schema = object({
  breweryId: string().max(13, "13桁以内で入力してください"),
  name: string().required("名前は必須です"),
  kana: string(),
  address: string(),
  prefecture: string(),
  location: string(),
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
  createdAt: string(),
  updatedAt: string(),
})

type Schema = InferType<typeof schema>

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
  createdAt: undefined,
  updatedAt: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
  const res = await addItem(event.data)
  console.log("res", res)
}
</script>
<template>
  <div>
    <h1>酒蔵 追加</h1>
    <hr />
    <div class="grid grid-cols-6 gap-4">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="法人番号" name="breweryId">
          <UInput v-model="state.breweryId" placeholder="国税庁が指定する13桁の識別番号" />
        </UFormGroup>

        <UFormGroup label="名前" name="name" required>
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="ふりがな" name="kana" required>
          <UInput v-model="state.kana" />
        </UFormGroup>

        <UFormGroup label="住所" name="address">
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
          <UInput v-model="state.latitude" />
        </UFormGroup>
        <UFormGroup label="経度" name="longtitude">
          <UInput v-model="state.longitude" />
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

        <UButton type="submit"> 追加 </UButton>
      </UForm>
    </div>
  </div>
</template>
