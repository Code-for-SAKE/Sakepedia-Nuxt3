<template>
  <div>
    <h1>インポート</h1>
    <UButton class="success" @click="fixTag">タグ修正</UButton>
    <p>{{ size }}</p>
  </div>
</template>

<script setup>
const route = useRoute()
const { setItem, getList } = useSake()
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time)) //timeはミリ秒

const before = ref(undefined)
const size = ref("")
const limit = route.query.limit != null ? Number(route.query.limit) : 10

const fixTag = async () => {
  const res = await getList({
    searchText: "",
    before: before.value,
    limit: limit,
  })

  const sakes = res.list
  size.value = `${sakes.length} / ${res.listCount} ${res.endCursor?.id}`

  for (const sake of sakes) {
    try {
      if (sake.length == 0) break
      const type = sake.data.type
      console.log(type)
      //タグが全て1文字ならまとめる
      if (type.length == type.join("").length) {
        console.log("join")
        sake.data.type = [type.join("")]
        await setItem(sake.path, sake.data)
        await sleep(1000)
      }
      before.value = res.endCursor
    } catch (e) {
      console.log(text, e)
    }
  }
  console.log("done")
}
</script>
