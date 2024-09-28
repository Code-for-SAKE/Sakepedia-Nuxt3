<script setup lang="ts">
import CommentList from "~/components/CommentList.vue"
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

useHead({
    title: brewery?.data.name || t('brewery'),
})


</script>

<template>
  <div>
    <h1>{{ $t("breweryDetails") }}</h1>
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
      <dt>{{ $t("address") }}</dt>
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
        <p v-else>{{ $t("noLocation") }}</p>
      </dd>
      <dt>{{ $t("email") }}</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="'mailto:' + brewery.data.email" target="_blank">{{
            brewery.data.email
          }}</a>
        </p>
      </dd>
      <dt>{{ $t("tel") }}</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.tel }}</p>
      </dd>
      <dt>{{ $t("fax") }}</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.fax }}</p>
      </dd>
      <dt>{{ $t("url") }}</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="brewery.data.url">{{ brewery.data.url }}</a>
        </p>
      </dd>
      <dt>{{ $t("ecurl") }}</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="brewery.data.ecurl">{{ brewery.data.ecurl }}</a>
        </p>
      </dd>
      <dt>{{ $t("facebook") }}</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="brewery.data.facebook">{{ brewery.data.facebook }}</a>
        </p>
      </dd>
      <dt>{{ $t("twitter") }}</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="brewery.data.twitter">{{ brewery.data.twitter }}</a>
        </p>
      </dd>
      <dt>{{ $t("instagram") }}</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="brewery.data.instagram">{{ brewery.data.instagram }}</a>
        </p>
      </dd>
      <dt>{{ $t("otherSNS") }}</dt>
      <dd>
        <p>
          <a v-if="brewery" :href="brewery.data.othersns">{{ brewery.data.othersns }}</a>
        </p>
      </dd>
      <dt>{{ $t("visit") }}</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.visit }}</p>
      </dd>
      <dt>{{ $t("tasting") }}</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.tasting }}</p>
      </dd>
      <dt>{{ $t("cafe") }}</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.cafe }}</p>
      </dd>
      <dt>{{ $t("shop") }}</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.shop }}</p>
      </dd>
      <dt>{{ $t("otherBrewery") }}</dt>
      <dd>
        <p v-if="brewery">{{ brewery.data.otherBrewing }}</p>
      </dd>
      <dt>{{ $t("startYear") }}</dt>
      <dd>
        <p v-if="brewery.data.startYear">{{ brewery.data.startYear }}年</p>
      </dd>
      <dt v-if="brewery.data.endYear">{{ $t("endYear") }}</dt>
      <dd>
        <p v-if="brewery.data.endYear">{{ brewery.data.endYear }}年</p>
      </dd>
      <dt>{{ $t("createdAt") }}</dt>
      <dd>{{ datetime(brewery.createdAt) }} by {{ brewery.createdUser?.displayName }}</dd>
      <dt>{{ $t("updatedAt") }}</dt>
      <dd>{{ datetime(brewery.updatedAt) }} by {{ brewery.updatedUser?.displayName }}</dd>
    </dl>

    <div class="d-flex justify-content-between">
      <div>
        <UButton :to="localePath('/breweries/' + brewery.id + '/update')" class="mr-3">{{
          $t("edit")
        }}</UButton>
        <UButton @click="confirmDelete = true">{{ $t("delete") }}</UButton>
        <UModal v-model="confirmDelete">
          <UCard>
            <Alert>{{ $t("confirmDelete") }}</Alert>
            <template #footer>
              <UButton class="secondary" @click="confirmDelete = false">{{ $t("cancel") }}</UButton>
              <UButton class="danger" @click="deleteRecord">{{ $t("yes") }}</UButton>
            </template>
          </UCard>
        </UModal>
      </div>
      <UButton :to="localePath('/breweries')">{{ $t("back") }}</UButton>
    </div>
    <hr />
    <div class="my-4">
      <div class="d-flex justify-content-between align-items-center">
        <h3>{{ $t("brand") }}</h3>
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
      <UButton
        :to="localePath({ path: '/posts/add', query: { breweryId: route.params.breweryId } })"
        >{{ $t("add") }}</UButton
      >
      <CommentList :brewery-id="String(route.params.breweryId)" />
    </div>
  </div>
</template>
