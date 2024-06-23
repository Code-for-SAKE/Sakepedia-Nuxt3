<template>
    <div>
        <h1>インポート</h1>
        <UButton class="success" @click="fetch_brewery">酒蔵</UButton><br>
        <UButton class="success" @click="fetch_brand">銘柄</UButton><br>
        <UButton class="success" @click="fetch_sake">日本酒</UButton><br>
    </div>
</template>


<script setup>
import { GeoPoint, getDoc, collection } from 'firebase/firestore';

const { setItem } = useFirestore()

const BASE_URL = "/data/";
const HEADERS = {
    "Content-Type" : "application/json"
};

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));//timeはミリ秒


const fetch_brewery = async () => {
    const url = BASE_URL + `breweries.json`;
    const brewery = await $fetch(url);
    const breweries = brewery.split(/\n/)
    console.log(breweries.length);
    for(const text of breweries){
        try{
            if(text.length==0) break;
            const bre = JSON.parse(text);
            const b = bre;
            b.location = new GeoPoint(b.latitude, b.longitude)
            const id = bre._id["$oid"]
            delete b._id
            setItem("breweries", b, id);
            await sleep(100);
        }catch(e){
            console.log(text, e)
        }
    }
    console.log("done")
};

const fetch_brand = async () => {
    const url = BASE_URL + `brands.json`;
    const brand = await $fetch(url);
    const brands = brand.split(/\n/)
    console.log(brands.length);
    for(const text of brands){
        try{
            if(text.length==0) break;
            const data = JSON.parse(text)
            const id = data._id["$oid"]
            delete data._id

            addItem("breweries/"+data.brewery["$oid"]+"/brands", data, id)
            await sleep(100);
        }catch(e){
            console.log(text, e)
        }
    }
    console.log("done")
};



const fetch_sake = async () => {
    const url = BASE_URL + `sakes.json`;
    const sake = await $fetch(url);
    const sakes = sake.split(/\n/)
    console.log(sakes.length);
    for(const text of sakes){
        try{
            if(text.length==0) break;
            const data = JSON.parse(text)

            const id = data._id["$oid"]
            delete data._id

            addItem("breweries/"+data.brewery["$oid"]+"/brands/"+data.brand["$oid"]+"/sakes", data, id)
            await sleep(100);
        }catch(e){
            console.log(text, e)
        }
    }
    console.log("done")
};
</script>