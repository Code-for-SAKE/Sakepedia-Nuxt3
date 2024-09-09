<script setup lang="ts">
import type { BreweryYearSpec } from "~/composables/useBreweryYearSpec"
import type { Data } from "~/composables/useFirestore"

const route = useRoute()
const { getItem, deleteItem } = useBreweryYearSpec()
const { defaultLocale } = useI18n()
const localePath = useLocalePath()
const dataPath = localePath(route.path, defaultLocale)

const item = await getItem(dataPath)
const breweryYearSpec: Data<BreweryYearSpec> = item!
const confirmDelete = ref(false)
</script>

<template>
  <div>
    <h1>{{ $t("breweryData") }}</h1>
    <hr />
    <h2>
      <NuxtLink :to="localePath('/' + breweryYearSpec?.data.sake?.path)">
        <div class="w-full">{{ breweryYearSpec?.data.sake?.id }}</div>
      </NuxtLink>
    </h2>

    <h4 v-if="breweryYearSpec">{{ breweryYearSpec?.data.makedBY }}</h4>
    <dl>
      <dt>{{ $t("amino") }}</dt>
      <dd>
        <div class="grid grid-cols-12 gap-4">
          {{ breweryYearSpec?.data.aminoAcidContentMin }}
          〜
          {{ breweryYearSpec?.data.aminoAcidContentMax }}
        </div>
      </dd>
    </dl>

    <hr />
    <UButton class="info" :to="localePath(route.path + '/update')">{{ $t("edit") }}</UButton>
    <UButton class="danger" @click="confirmDelete = true">{{ $t("delete") }}</UButton>
    <UButton :to="localePath('/' + breweryYearSpec.path)"> {{ $t("back") }}</UButton>
  </div>
</template>
