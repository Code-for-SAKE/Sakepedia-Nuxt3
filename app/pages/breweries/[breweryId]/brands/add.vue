<script setup lang="ts">
import { object, string, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

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
  description: "",
  brewery: null,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const ref = await addItem(event.data)
  await navigateTo(localePath("/" + ref.path))
}

if (route.params.breweryId) {
  const brewery = await getItem(`breweries/${route.params.breweryId}`)
  state.brewery = brewery.ref
  breweryName.value = brewery.data.name
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup :label="$t('name')" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>
    <UFormGroup label="酒蔵" name="brewery">
      {{ breweryName }}
    </UFormGroup>
    <UFormGroup label="説明" name="description">
      <UTextarea v-model="state.description" />
    </UFormGroup>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>
