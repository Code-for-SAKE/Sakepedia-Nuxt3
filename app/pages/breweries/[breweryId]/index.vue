<script setup lang="ts">
import type { Brewery } from "~/composables/useBrewery"
import type { Data } from "~/composables/useFirestore"

const route = useRoute()
const localePath = useLocalePath()
const { getItem, deleteItem } = useBrewery()

const brewery: Data<Brewery> = await getItem(`breweries/${route.params.breweryId}`)

const confirmDelete = ref(false)
async function deleteRecord() {
  await deleteItem(brewery.path)
  await navigateTo(localePath("/breweries"))
}
</script>

<template>
  <div>
    <h1>{{ $t("brewery") }} {{ $t("details") }}</h1>
    <hr />
    <small v-if="brewery">{{ brewery.id }}</small>
    <h2 v-if="brewery">{{ brewery.data.name }}</h2>
    <h6 v-if="brewery">{{ brewery.data.kana }}</h6>
    <dl>
      <dt>{{ $t("prefecture") }}</dt>
      <dd>
        <p v-if="brewery">
          {{
            brewery.data.prefecture
              ? prefectures.find((e) => e.id === brewery?.data.prefecture)?.nameJa
              : ""
          }}
        </p>
      </dd>
      <dt>住所</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.address }}</p>
        <p v-if="brewery.data.location">{{ brewery.data.location.latitude }}</p>
        <p v-if="brewery.data.location">{{ brewery.data.location.longitude }}</p>
        <div
          v-if="
            brewery.data.location &&
            brewery.data.location.latitude &&
            brewery.data.location.longitude
          "
          class="map-wrap col-12 col-lg-6 m-3"
        >
          <BreweryMap :brewery="brewery.data" />
        </div>
        <p v-else>位置情報がありません</p>
      </dd>
      <dt>Eメール</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="'mailto:' + brewery.data.email" target="_blank">{{
            brewery.data.email
          }}</a>
        </p>
      </dd>
      <dt>電話番号</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.tel }}</p>
      </dd>
      <dt>FAX番号</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.fax }}</p>
      </dd>
      <dt>URL</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="brewery.data.url">{{ brewery.data.url }}</a>
        </p>
      </dd>
      <dt>購入URL</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="brewery.data.ecurl">{{ brewery.data.ecurl }}</a>
        </p>
      </dd>
      <dt>Facebook</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="brewery.data.facebook">{{ brewery.data.facebook }}</a>
        </p>
      </dd>
      <dt>Twitter</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="brewery.data.twitter">{{ brewery.data.twitter }}</a>
        </p>
      </dd>
      <dt>Instagram</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="brewery.data.instagram">{{ brewery.data.instagram }}</a>
        </p>
      </dd>
      <dt>その他SNS</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="brewery.data.othersns">{{ brewery.data.othersns }}</a>
        </p>
      </dd>
      <dt>見学</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.visit }}</p>
      </dd>
      <dt>試飲</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.tasting }}</p>
      </dd>
      <dt>併設カフェ</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.cafe }}</p>
      </dd>
      <dt>併設ショップ</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.shop }}</p>
      </dd>
      <dt>日本酒以外の醸造・蒸留</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.otherBrewing }}</p>
      </dd>
      <dt>創業年</dt>
      <dd>
        <p v-if="brewery.data.startYear">{{ brewery.data.startYear }}年</p>
      </dd>
      <dt v-if="brewery.data.endYear">廃業年</dt>
      <dd>
        <p v-if="brewery.data.endYear">{{ brewery.data.endYear }}年</p>
      </dd>
      <dt>更新日</dt>
      <dd>{{ datetime(brewery.data.updatedAt) }}</dd>
    </dl>

    <div class="d-flex justify-content-between">
      <div>
        <UButton :to="'/breweries/' + brewery.id + '/update'" class="mr-3"
          >{{ $t("edit") }}</UButton
        >
        <UButton @click="confirmDelete = true">{{ $t("delete") }}</UButton>
        <UModal v-model="confirmDelete">
          <UCard>
            <Alert>本当に削除しますか？</Alert>
            <template #footer>
              <UButton class="secondary" @click="confirmDelete = false">{{ $t("cancel") }}</UButton>
              <UButton class="danger" @click="deleteRecord">はい</UButton>
            </template>
          </UCard>
        </UModal>

      </div>
      <UButton variant="secondary" to="/breweries">一覧に戻る</UButton>
    </div>
    <hr />
    <div class="my-4">
      <div class="d-flex justify-content-between align-items-center">
        <h3>銘柄</h3>
        <UButton class="success" :to="localePath(`${route.path}/brands/add`)">{{
          $t("add")
        }}</UButton>
      </div>
      <BreweryBrandList :brewery-id="String(route.params.breweryId)" />
    </div>
    <div class="my-4">
      <div class="d-flex justify-content-between align-items-center">
        <h3>{{ $t("postList") }}</h3>
      </div>
      <!-- <comment-list :brewery="brewery._id" /> -->
    </div>
  </div>
</template>
