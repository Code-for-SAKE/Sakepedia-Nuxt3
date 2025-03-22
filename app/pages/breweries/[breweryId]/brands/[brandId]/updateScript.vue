<script setup lang="ts">
import { object, string, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const { t } = useI18n()
const route = useRoute()

const brandPath = route.query.brandPath
const breweryPath = route.query.breweryPath

const { getItem, moveItem } = useBrand()

const brand = await getItem(`/breweries/${route.params.breweryId}/brands/${route.params.brandId}`)  // Do something with event.data
const res = await moveItem(brandPath, breweryPath, brand.data)
const newBrandPath = res.path

</script>

<template>
  <div>
    {{ newBrandPath }}
  </div>
</template>