<template>
  <div>
    <h1>インポート</h1>
    <UButton class="success" @click="fetch_brewery">酒蔵</UButton><br />
    <UButton class="success" @click="fetch_brand">銘柄</UButton><br />
    <UButton class="success" @click="fetch_sake">日本酒</UButton><br />
    <UButton class="success" @click="fetch_bydata">醸造データ</UButton><br />
    <UButton class="success" @click="fetch_post">投稿</UButton><br />
  </div>
</template>

<script setup>
import { GeoPoint } from "firebase/firestore"
import dayjs from "dayjs"

const { setItem, getReference, getFromReference } = useFirestore()
const { getList } = useSake()
const { upload, unique } = useStorage()

const BASE_URL = "/data/"

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time)) //timeはミリ秒

const fetch_brewery = async () => {
  const url = BASE_URL + `breweries.json`
  const brewery = await $fetch(url)
  const breweries = brewery.split(/\n/)
  console.log(breweries.length)
  for (const text of breweries) {
    try {
      if (text.length == 0) break
      const data = JSON.parse(text)
      data.location = new GeoPoint(data.latitude, data.longitude)
      const id = data._id["$oid"]
      delete data._id

      if (data.createdAt) {
        const createdAt = data.createdAt["$date"]
        data.createdAt = dayjs(createdAt).toDate()
      }
      if (data.updatedAt) {
        const updatedAt = data.updatedAt["$date"]
        data.updatedAt = dayjs(updatedAt).toDate()
      }
      if (data.author) {
        if (data.userId) {
          data.createdUser = {displayName: data.author, uid: data.userId["$oid"]}
        }
      }

      console.log(id)
      const path = `breweries/${id}`
      if((await getFromReference(await getReference(path))).exists()){
        console.log("skip")
      }else{
        await setItem(path, data, true)
        await sleep(100)
      }
    } catch (e) {
      console.log(text, e)
    }
  }
  console.log("done")
}

const fetch_brand = async () => {
  const url = BASE_URL + `brands.json`
  const brand = await $fetch(url)
  const brands = brand.split(/\n/)
  console.log(brands.length)
  for (const text of brands) {
    try {
      if (text.length == 0) break
      const data = JSON.parse(text)
      const id = data._id["$oid"]
      delete data._id
      let breweryId = 'unknown'
      if(data.brewery){
        breweryId = data.brewery["$oid"]
        data.brewery = await getReference("breweries/"+breweryId)
      }

      if (data.createdAt) {
        const createdAt = data.createdAt["$date"]
        data.createdAt = dayjs(createdAt).toDate()
      }
      if (data.updatedAt) {
        const updatedAt = data.updatedAt["$date"]
        data.updatedAt = dayjs(updatedAt).toDate()
      }
      if (data.author) {
        if (data.userId) {
          data.createdUser = {displayName: data.author, uid: data.userId["$oid"]}
        }
      }

      console.log(id)
      const path = `breweries/${breweryId}/brands/${id}`
      if((await getFromReference(await getReference(path))).exists()){
        console.log("skip")
      }else{
        await setItem(path, data, true)
        await sleep(100)
      }
    } catch (e) {
      console.log(text, e)
    }
  }
  console.log("done")
}

const fetch_sake = async () => {
  const url = BASE_URL + `sakes.json`
  const sake = await $fetch(url)
  const sakes = sake.split(/\n/)
  console.log(sakes.length)
  for (const text of sakes) {
    try {
      if (text.length == 0) break
      const data = JSON.parse(text)

      const id = data._id["$oid"]
      delete data._id

      let breweryId = 'unknown'
      if(data.brewery){
        breweryId = data.brewery["$oid"]
        data.brewery = await getReference("breweries/"+breweryId)
      }

      let brandId = 'unknown'
      if(data.brand){
        brandId = data.brand["$oid"]
        data.brand = await getReference("breweries/" + breweryId + "/brands/"+brandId)
      }
      if (data.createdAt) {
        const createdAt = data.createdAt["$date"]
        data.createdAt = dayjs(createdAt).toDate()
      }
      if (data.updatedAt) {
        const updatedAt = data.updatedAt["$date"]
        data.updatedAt = dayjs(updatedAt).toDate()
      }
      if (data.author) {
        if (data.userId) {
          data.createdUser = {displayName: data.author, uid: data.userId["$oid"]}
        }
      }

      console.log(id)
      const path = `breweries/${breweryId}/brands/${brandId}/sakes/${id}`
      if((await getFromReference(await getReference(path))).exists()){
        console.log("skip")
      }else{
        await setItem(path, data, true)
        await sleep(100)
      }
    } catch (e) {
      console.log(text, e)
    }
  }
  console.log("done")
}



const fetch_bydata = async () => {
  const url = BASE_URL + `breweryyeardatas.json`
  const breweryyeardata = await $fetch(url)
  const breweryyeardatas = breweryyeardata.split(/\n/)
  console.log(breweryyeardatas.length)

  const sakeUrl = BASE_URL + `sakes.json`
  const sake = await $fetch(sakeUrl)
  const sakes = sake.split(/\n/)

  for (const text of breweryyeardatas) {
    try {
      if (text.length == 0) break
      const data = JSON.parse(text)
      const id = data._id["$oid"]
      delete data._id

      let sakePath = 'sakes/unknown'
      if(data.sake){
        const sakeId = data.sake["$oid"]
        let sakeName = ""
        for(const sakeText of sakes){
          const data = JSON.parse(sakeText)
          if(data._id["$oid"] == sakeId) {
            sakeName = data.name
            break
          }
        }
        console.log(sakeId, sakeName)
        const list = await getList({searchText: sakeName, limit:1})
        data.sake = list.list[0].ref
        data.brand = data.sake.parent.parent
        data.brewery = data.brand.parent.parent
        sakePath = data.sake.path
      }

      if (data.createdAt) {
        const createdAt = data.createdAt["$date"]
        data.createdAt = dayjs(createdAt).toDate()
      }
      if (data.updatedAt) {
        const updatedAt = data.updatedAt["$date"]
        data.updatedAt = dayjs(updatedAt).toDate()
      }
      if (data.author) {
        if (data.userId) {
          data.createdUser = {displayName: data.author, uid: data.userId["$oid"]}
        }
      }

      console.log(id)
      const path = `${sakePath}/breweryYearSpecs/${id}`
      if((await getFromReference(await getReference(path))).exists()){
        console.log("skip")
      }else{
        await setItem(path, data, true)
        await sleep(100)
      }
    } catch (e) {
      console.log(text, e)
    }
  }
  console.log("done")
}

const fetch_post = async () => {
  const url = BASE_URL + `comments.json`
  const comment = await $fetch(url)
  const comments = comment.split(/\n/)
  console.log(comments.length)
  for (const text of comments) {
    try {
      if (text.length == 0) break
      const data = JSON.parse(text)
      const id = data._id["$oid"]
      delete data._id
      if(data.brewery) {
        const breweryId = data.brewery["$oid"]
        data.brewery = await getReference("breweries/"+breweryId)
        if(data.brand) {
          const brandId = data.brand["$oid"]
          data.brand = await getReference(`breweries/${breweryId}/brands/${brandId}`)
          if(data.sake) {
            const sakeId = data.sake["$oid"]
            data.sake = await getReference(`breweries/${breweryId}/brands/${brandId}/sakes/${sakeId}`)
          }
        }
      }

      if (data.image) {
        //画像をアップロード
        const path = `images/${id}/${unique()}.jpeg`
        const result = await upload(path, data.image)
        //結果からフルパスを取得
        const imagePaths = [result.metadata.fullPath]
        console.log(imagePaths)
        data.image = imagePaths
      }

      if (data.createdAt) {
        const createdAt = data.createdAt["$date"]
        data.createdAt = dayjs(createdAt).toDate()
      }
      if (data.updatedAt) {
        const updatedAt = data.updatedAt["$date"]
        data.updatedAt = dayjs(updatedAt).toDate()
      }
      if (data.author) {
        if (data.userId) {
          data.createdUser = {displayName: data.author, uid: data.userId["$oid"]}
        }
      }

      console.log(id)
      const path = `posts/${id}`
      if((await getFromReference(await getReference(path))).exists()){
        console.log("skip")
      }else{
        await setItem(path, data, true)
        await sleep(100)
      }
    } catch (e) {
      console.log(text, e)
    }
  }
  console.log("done")
}
</script>
