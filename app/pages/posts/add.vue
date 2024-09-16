<script setup lang="ts">
import { object, array, type InferType,type ObjectSchema } from "yup"
import * as yup from "yup"
import type { FormSubmitEvent } from "#ui/types"
import type { ImageFilesData } from "~/components/ImageUploader.vue";
const { getItem, getBrandList } = useBrewery()
const { getSakeList } = useBrand()

const route = useRoute()
const brewery: Data<Brewery> = await getItem(`breweries/${route.query.breweryId}`)
const brands = await getBrandList({
  breweryId: String(route.query.breweryId),
  searchText: "",
  before: undefined,
  limit: 100,
}).then((brands)=>{
  return brands.list.map((brand)=>{
    return {
      path: brand.path,
      label: brand.data.name,
    }
  })
})
  const schema:ObjectSchema<Post> = object({
  brewery: yup.string().required(),
  brand: yup.string().default(""),
  sake: yup.string().default(""),
  comment: yup.string().default(""),
  image: array().of(yup.string().required()).required(),
  mariages: array().of(yup.string().required()).required(),
})

type Schema = InferType<typeof schema>

const localePath = useLocalePath()
const { addItem } = usePost()

const state = reactive<{
    brewery: string;
    brand: string|undefined;
    sake: string|undefined;
    comment: string|undefined;
    image: string[];
    mariages: string[];
}>({
  brewery: brewery.path,
  brand: undefined,
  sake: undefined,
  comment: undefined,
  image: [],
  mariages: [],
})

const images:Ref<ImageFilesData> = ref([]);
const appetizers = [
  "イカの塩辛", "鯛のお刺身", "おでん"
]

const sakes = ref<{path:string, label:string}[]>([])
async function onChangeBrand(brand :string|undefined) {
  console.log(brand)
  if(!brand){
    sakes.value = []
    return
  }
  sakes.value = await getSakeList({
    brandPath: String(brand),
    searchText: "",
    before: undefined,
    limit: 100,
  }).then((sakes)=>{
    return sakes.list.map((sake)=>{
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

  data.image = images.value.map((img)=>{return String(img.img)})

  const res = await addItem(data)
  console.log("res", res)
  await navigateTo(localePath("/" + res.path))
}
</script>
<template>
  <div>
    <h1>{{ $t("addPost") }}</h1>
    <hr >
    <div class="grid gap-4">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup :label="$t('brewery')" name="brewery">
          {{ brewery.data.name }}
        </UFormGroup>
        <UFormGroup :label="$t('brand')" name="brand">
          <USelectMenu v-model="state.brand" :options="brands" option-attribute="label" value-attribute="path" searchable @change="onChangeBrand(state.brand)" />
        </UFormGroup>
        <UFormGroup :label="$t('sake')" name="sake">
          <USelectMenu v-model="state.sake" :options="sakes" option-attribute="label" value-attribute="path" searchable />
        </UFormGroup>
        <UFormGroup :label="$t('comment')" name="comment">
          <UTextarea v-model="state.comment" />
        </UFormGroup>
        <UFormGroup :label="$t('image')" name="image">
          <ImageUploader v-model="images"/>
        </UFormGroup>
        <UFormGroup :label="$t('mariages')" name="mariages">
          <TagSelect v-model="state.mariages" :options="appetizers" placeholder=""/>
        </UFormGroup>

        <UButton type="submit"> {{ $t("add") }} </UButton>
      </UForm>
    </div>
  </div>
</template>
