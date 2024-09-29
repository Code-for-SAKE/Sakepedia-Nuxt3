<script setup lang="ts">
import { object, array, type InferType, type ObjectSchema } from "yup"
import * as yup from "yup"
import type { FormSubmitEvent } from "#ui/types"
import { DocumentReference } from "firebase/firestore"

const route = useRoute()
const localePath = useLocalePath()

const { getItem, setItem } = usePost()
const { getItem: getBrewery, getBrandList } = useBrewery()
const { getItem: getBrand, getSakeList } = useBrand()
const { getItem: getSake } = useSake()

const post = await getItem(`posts/${route.params.postId}`)

let brewery: Data<Brewery> | undefined = undefined
if (typeof post.data.brewery == "string") {
  brewery = await getBrewery(post.data.brewery)
} else {
  brewery = await getBrewery(post.data.brewery.path)
}
let brand: Data<Brand> | undefined = undefined
if (typeof post.data.brand == "string") {
  brand = await getBrand(post.data.brand)
} else if (post.data.brand instanceof DocumentReference) {
  brand = await getBrand(post.data.brand.path)
}
let sake: Data<Sake> | undefined = undefined
if (typeof post.data.sake == "string") {
  sake = await getSake(post.data.sake)
} else if (post.data.sake instanceof DocumentReference) {
  sake = await getSake(post.data.sake.path)
}

const appetizers = ["イカの塩辛", "鯛のお刺身", "おでん"]

const brands = await getBrandList({
  breweryId: String(brewery.id),
  searchText: "",
  before: undefined,
  limit: 100,
}).then((brands) => {
  return brands.list.map((brand) => {
    return {
      path: brand.path,
      label: brand.data.name,
    }
  })
})

const schema: ObjectSchema<Post> = object({
  brewery: yup.string().required(),
  brand: yup.string().default(""),
  sake: yup.string().default(""),
  comment: yup.string().default(""),
  image: array().of(yup.string().required()).required(),
  mariages: array().of(yup.string().required()).required(),
})

type Schema = InferType<typeof schema>

const state = reactive<{
  brewery: string
  brand: string | undefined
  sake: string | undefined
  comment: string | undefined
  image: string[]
  mariages: string[]
}>({
  brewery: brewery.path,
  brand: brand?.path,
  sake: sake?.path,
  comment: post.data.comment ?? "",
  image: post.data.image ?? [],
  mariages: post.data.mariages ?? [],
})

const images: Ref<string[]> = ref(post.data.image ?? [])

const sakes = ref<{ path: string; label: string }[]>([])
async function onChangeBrand(brand: string | undefined) {
  if (!brand) {
    sakes.value = []
    return
  }
  sakes.value = await getSakeList({
    brandPath: String(brand),
    searchText: "",
    before: undefined,
    limit: 100,
  }).then((sakes) => {
    return sakes.list.map((sake) => {
      return {
        path: sake.path,
        label: sake.data.name,
      }
    })
  })
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = event.data
  await setItem(post.path, data)
  await navigateTo(localePath("/" + post.path))
}

onChangeBrand(brand?.path)
</script>
<template>
  <div>
    <h1>{{ $t("post") }}{{ $t("update") }}</h1>
    <hr>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup :label="$t('brewery')" name="brewery">
          {{ brewery.data.name }}
        </UFormGroup>
        <UFormGroup :label="$t('brand')" name="brand">
          <USelectMenu
            v-model="state.brand"
            :options="brands"
            option-attribute="label"
            value-attribute="path"
            searchable
            @change="onChangeBrand(state.brand)"
          />
        </UFormGroup>
        <UFormGroup :label="$t('sake')" name="sake">
          <USelectMenu
            v-model="state.sake"
            :options="sakes"
            option-attribute="label"
            value-attribute="path"
            searchable
          />
        </UFormGroup>
        <UFormGroup :label="$t('comment')" name="comment">
          <UTextarea v-model="state.comment" />
        </UFormGroup>
        <UFormGroup :label="$t('image')" name="image">
          <MultiImage v-model="images" />
        </UFormGroup>
        <UFormGroup :label="$t('pairing')" name="mariages">
          <TagSelect v-model="state.mariages" :options="appetizers" placeholder="" />
        </UFormGroup>
        <UFormGroup>
          <UButton type="submit"> {{ $t("update") }} </UButton>
          <UButton :to="localePath('/' + post.path)"> {{ $t("cancel") }} </UButton>
        </UFormGroup>
      </UForm>
  </div>
</template>
