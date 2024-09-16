<script setup lang="ts">
const props = defineProps<{ modelValue: string[] | undefined, options: string[] | undefined, placeholder: string | "" }>()
const emits = defineEmits<{ (e: 'update:modelValue', props: string[] | undefined): void }>()
type Tag = { label: string }

const tags: Ref<Tag[]> = ref(props.modelValue?.map(tag => { return { label: tag } }) ?? []);
const options = props.options?.map(tag => { return { label: tag } }) ?? [];
async function addTag(option: Tag) {
    option.label = "";
}

async function onDeleteTag(event: PointerEvent, tag: Tag) {
    tags.value = tags.value.filter((a) => a != tag)
    event.stopPropagation();
}

async function onChange() {
    emits('update:modelValue', tags.value.map(tag => { return tag.label }))
}

</script>
<template>
    <USelectMenu v-model="tags" :options="options" multiple searchable clear-search-on-close creatable
        :placeholder="placeholder" @change="onChange">
        <template #label>
            <UBadge v-for="tag in tags" :key="tag.label">{{ tag.label }}
                <UButton icon="i-heroicons-trash" @click="onDeleteTag($event, tag)" />
            </UBadge>
        </template>
        <template #option-create="{ option }">
            <div @click="addTag(option)">
                <UBadge :key="option.label">{{ option.label }}</UBadge>
            </div>
        </template>
    </USelectMenu>
</template>
