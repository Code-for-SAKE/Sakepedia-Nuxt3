<script setup lang="ts">
import { useBreweryYearSpec } from "~/composables/useBreweryYearSpec"

interface Props {
  sake: Data<Sake>
}
const props = defineProps<Props>()

// const { getBreweryYearSpecList } = useSake()
const { getList } = useBreweryYearSpec()
const localePath = useLocalePath()

const limit = 1

const res = await getList({
  sake: props.sake,
  searchText: "",
  before: undefined,
  limit: limit,
})
const breweryYearSpec: Ref = ref(res.list[0])

async function deleteRecord() {}
</script>

<template>
  <div class="bydata">
    <div v-if="breweryYearSpec">
      <h4>{{ breweryYearSpec.data.makedBY }}年</h4>
      <h6>By {{ "author" }} {{ breweryYearSpec.data.modifiedAt }}</h6>
      <dl>
        <dt>アミノ酸度</dt>
        {{ breweryYearSpec.data.aminoAcidContentMin }}
        <dd><range-value :values="breweryYearSpec.data.aminoAcidContentMin" /></dd>
        <dt>アルコール度</dt>
        <dd><range-value :values="breweryYearSpec.data.alcoholContent" /></dd>
        <dt>日本酒度</dt>
        <dd><range-value :values="breweryYearSpec.data.sakeMeterValue" /></dd>
        <dt>酸度</dt>
        <dd><range-value :values="breweryYearSpec.data.acidity" /></dd>
        <dt>精米歩合</dt>
        <dd><range-value :values="breweryYearSpec.data.ricePolishingRate" /></dd>
        <dt>酵母</dt>
        <dd>{{ breweryYearSpec.data.sakeYeast }}</dd>
        <dt>麹米</dt>
        <dd>{{ breweryYearSpec.data.riceForMakingKoji }}</dd>
        <dt>掛米</dt>
        <dd>{{ breweryYearSpec.data.sakeRiceExceptForKojiMaking }}</dd>
        <dt>製造年月(日)</dt>
        <dd>{{ breweryYearSpec.data.bottledDate }}</dd>
      </dl>
      <hr />
      <div class="d-flex justify-content-between">
        <div>
          <UButton class="info" :to="localePath(breweryYearSpec.path + '/update')">{{
            $t("edit")
          }}</UButton>

          <UButton class="danger" @click="deleteRecord()">{{ $t("delete") }}</UButton>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-warning">データがありません</div>
  </div>
</template>
