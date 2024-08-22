<script setup lang="ts">
import { object, string, array, type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"

const schema = object({
  brewery: object(),
  brand: object(),
  sake: object(),
  comment: string(),
  image: string(),
  mariages: array().of(string()),
})

type Schema = InferType<typeof schema>

const localePath = useLocalePath()
const { addItem } = usePost()
const { getList } = useSake()

const state = reactive({
  brewery: undefined,
  brand: undefined,
  sake: undefined,
  comment: undefined,
  image: undefined,
  mariages: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = event.data

  const res = await addItem(data)
  console.log("res", res)
  await navigateTo(localePath("/" + res.path))
}
</script>
<template>
  <div>
    <h1>{{ $t("addBrewery") }}</h1>
    <hr />
    <div class="grid grid-cols-6 gap-4">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup :label="$t('brewery')" name="brewery">
          <UInput v-model="state.brewery" />
        </UFormGroup>
        <UFormGroup :label="$t('brand')" name="brand">
          <UInput v-model="state.brand" />
        </UFormGroup>
        <UFormGroup :label="$t('sake')" name="sake">
          <UInput v-model="state.sake" />
        </UFormGroup>
        <UFormGroup :label="$t('comment')" name="comment" required>
          <UInput v-model="state.comment" />
        </UFormGroup>
        <UFormGroup :label="$t('image')" name="image" required>
          <UInput v-model="state.image" />
        </UFormGroup>
        <UFormGroup :label="$t('mariages')" name="mariages" required>
          <UInput v-model="state.mariages" />
        </UFormGroup>

        <UButton type="submit"> {{ $t("add") }} </UButton>
      </UForm>
    </div>
  </div>
</template>
