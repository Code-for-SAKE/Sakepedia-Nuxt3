<script setup lang="ts">
const route = useRoute();
const { getItem } = useFirestore();

const item = await getItem("breweries", route.params.id)
const brewery = item.data()

const add = async function () {
    await navigateTo({ path: "/brands/add", query: { brewery: item.id } })
}

function deleteRecord() {

}

</script>

<template>
    <div>
        <h1>酒蔵 詳細</h1>
        <hr />
        <small v-if="brewery">{{ brewery.breweryId }}</small>
        <h2 v-if="brewery">{{ brewery.name }}</h2>
        <h6 v-if="brewery">{{ brewery.kana }}</h6>

        <dl>
            <dt>都道府県</dt>
            <dd>
                <p v-if="brewery">{{ brewery.prefecture ? prefectures.find(e => e.id === brewery.prefecture).nameJa : "" }}</p>
            </dd>
            <dt>住所</dt>
            <dd>
                <p v-if="brewery">{{ brewery.address }}</p>
                <p v-if="brewery">{{ brewery.latitude }}</p>
                <p v-if="brewery">{{ brewery.longitude }}</p>
                <div v-if="brewery && brewery.latitude && brewery.longitude" class="map-wrap col-12 col-lg-6 m-3">
                    <!-- <brewery-map :brewery="brewery" /> -->
                </div>
                <p v-else>位置情報がありません</p>
            </dd>
            <dt>Eメール</dt>
            <dd>
                <p><a v-if="brewery" v-bind:href="'mailto:' + brewery.email" target="_blank">{{ brewery.email }}</a></p>
            </dd>
            <dt>電話番号</dt>
            <dd>
                <p v-if="brewery">{{ brewery.tel }}</p>
            </dd>
            <dt>FAX番号</dt>
            <dd>
                <p v-if="brewery">{{ brewery.fax }}</p>
            </dd>
            <dt>URL</dt>
            <dd>
                <p><a v-if="brewery" v-bind:href="brewery.url">{{ brewery.url }}</a></p>
            </dd>
            <dt>購入URL</dt>
            <dd>
                <p><a v-if="brewery" v-bind:href="brewery.ecurl">{{ brewery.ecurl }}</a></p>
            </dd>
            <dt>Facebook</dt>
            <dd>
                <p><a v-if="brewery" v-bind:href="brewery.facebook">{{ brewery.facebook }}</a></p>
            </dd>
            <dt>Twitter</dt>
            <dd>
                <p><a v-if="brewery" v-bind:href="brewery.twitter">{{ brewery.twitter }}</a></p>
            </dd>
            <dt>Instagram</dt>
            <dd>
                <p><a v-if="brewery" v-bind:href="brewery.instagram">{{ brewery.instagram }}</a></p>
            </dd>
            <dt>その他SNS</dt>
            <dd>
                <p><a v-if="brewery" v-bind:href="brewery.othersns">{{ brewery.othersns }}</a></p>
            </dd>
            <dt>見学</dt>
            <dd>
                <p v-if="brewery">{{ brewery.visit }}</p>
            </dd>
            <dt>試飲</dt>
            <dd>
                <p v-if="brewery">{{ brewery.tasting }}</p>
            </dd>
            <dt>併設カフェ</dt>
            <dd>
                <p v-if="brewery">{{ brewery.cafe }}</p>
            </dd>
            <dt>併設ショップ</dt>
            <dd>
                <p v-if="brewery">{{ brewery.shop }}</p>
            </dd>
            <dt>日本酒以外の醸造・蒸留</dt>
            <dd>
                <p v-if="brewery">{{ brewery.otherBrewing }}</p>
            </dd>
            <dt>創業年</dt>
            <dd>
                <p v-if="brewery.startYear">{{ brewery.startYear }}年</p>
            </dd>
            <dt v-if="brewery.endYear">廃業年</dt>
            <dd>
                <p v-if="brewery.endYear">{{ brewery.endYear }}年</p>
            </dd>
            <dt>更新日</dt>
            <dd>{{ brewery.updatedAt | datetime }}</dd>

        </dl>

        <div class="d-flex justify-content-between">
            <div>
                <UButton variant="light" :to="'/breweries/' + brewery._id + '/update'" class="mr-3">編集</UButton>
                <UButton variant="danger" @click="deleteRecord()">削除</UButton>
            </div>
            <UButton variant="secondary" to="/breweries">一覧に戻る</UButton>
        </div>
        <hr />
        <div class="my-4">
            <div class="d-flex justify-content-between align-items-center">
                <h3>銘柄</h3>
                <UButton @click="add">銘柄追加</UButton>
            </div>
            <BreweryBrandList :breweryId="route.params.id" />
        </div>
        <div class="my-4">
            <div class="d-flex justify-content-between align-items-center">
                <h3>投稿一覧</h3>
            </div>
            <!-- <comment-list :brewery="brewery._id" /> -->
        </div>
    </div>
</template>