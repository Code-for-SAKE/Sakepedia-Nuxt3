<script setup lang="ts">
import { object, string, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const localePath = useLocalePath()
const { addItem, getItem } = useBrand()

const schema = object({
  name: string().required("名前は必須です"),
  brewery: object<Brewery>().required("酒蔵は必須です"),
  description: string(),
})

const breweryName = ref<string>("")

type Schema = InferType<typeof schema>

const state = reactive<Brand>({
  name: "",
  logo: "",
  description: "",
  brewery: null,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const ref = await addItem(event.data)
  toast.add({ title: t("added"), timeout: 2000, icon: "i-heroicons-check-circle" })
  await navigateTo(localePath("/" + ref.path))
}

if (route.params.breweryId) {
  const brewery = await getItem(`breweries/${route.params.breweryId}`)
  state.brewery = brewery.ref
  breweryName.value = brewery.data.name
}
</script>

<template>
  <div>
    <h1>{{ $t("addBrand") }}</h1>
    <hr />
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup :label="$t('name')" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup :label="$t('brewery')" name="brewery">
        {{ breweryName }}
      </UFormGroup>
      <UFormGroup :label="$t('logo')" name="logo">
        <UInput v-model="state.logo" />
      </UFormGroup>
      <UFormGroup :label="$t('speciality')" name="description">
        <UTextarea v-model="state.description" />
      </UFormGroup>
      <UButton type="submit"> {{ $t("add") }} </UButton>
      <UButton :to="localePath('/' + state.brewery?.path)"> {{ $t("cancel") }}</UButton>
    </UForm>
  </div>
</template>
