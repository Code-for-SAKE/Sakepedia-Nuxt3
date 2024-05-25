<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const { addItem } = useFirestore();

const schema = object({
    name: string().required('名前は必須です'),
    description: string()
})

type Schema = InferType<typeof schema>

const state = reactive({
    name: undefined,
    description: undefined
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
  const ref = await addItem("brands", event.data)
  await navigateTo('/brands/' + ref.id)
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="名前" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup label="説明" name="description">
      <UTextarea v-model="state.description" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>

