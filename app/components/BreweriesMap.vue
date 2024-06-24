<template>
  <div id="map" style="height:100%; width:100%">
    <LMap ref="map" :zoom="zoom" :max-zoom="18" :center="[35.999887, 138.75]" @ready="mapInitialized">
      <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base" name="OpenStreetMap" />
    </LMap>
  </div>
</template>

<script setup>
import * as L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster.js";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import iconUrl from '~/assets/icons/sake.svg';

const { getList } = useBrewery()

const zoom = ref(4)
const map = ref(null)

const mapInitialized = async () => {
  //アイコンデザイン調整
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.imagePath = '';
  L.Icon.Default.mergeOptions({
    iconUrl,
    iconRetinaUrl: iconUrl,
    iconSize: [20, 20],
    iconAnchor: [12, 18],
    popupAnchor: [-3, -24],
    shadowSize: [30, 20],
    shadowAnchor: [12, 18],
  });

  const datas = await getList({
    searchText: "",
    before: undefined,
    prefecture: 0,
    limit: 2000,
  });
  // 酒蔵情報から都道府県ごとのマーカーリストを作成
  const markers = {};

  for (const data of datas.list) {
    const brewery = data
    const marker = L.marker(
      L.latLng(brewery.location.latitude, brewery.location.longitude)
    );
    const link = '<a href="/breweries/' + data.id + '">' + brewery.name + '</a>'

    marker.bindPopup(link);
    if (!markers[brewery.prefecture])
      markers[brewery.prefecture] = [];
    markers[brewery.prefecture].push(marker);
  }
  // マーカーリストからクラスターグループを作成
  for (const pref in markers) {
    const markerCluster = L.markerClusterGroup({
      removeOutsideVisibleBounds: true,
      chunkedLoading: true,
      maxClusterRadius: 80,
      iconCreateFunction: function (cluster) {
        const childCount = cluster.getChildCount();

        let c = ' marker-cluster-';
        if (childCount < 20) {
          c += 'small';
        } else if (childCount < 50) {
          c += 'medium';
        } else {
          c += 'large';
        }

        return new L.DivIcon({
          html: '<div><span>' + childCount + '</span></div>',
          className: 'marker-cluster' + c,
        });
      },
    }).addTo(map.value.leafletObject);

    markerCluster.addLayers(markers[pref]);
  }

}
</script>

<style>
body {
  margin: 0;
}
</style>

<style lang="scss" scoped>
#map {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
#map .marker-cluster {
  width: 20px !important;
  height: 20px !important;
  margin-top: −10px !important;
  margin-left: -10px !important;
  border-radius: 20px;

  div {
    width: 16px !important;
    height: 16px !important;
    margin-top: 2px;
    margin-left: 2px;

    border-radius: 16px;
    font-size: 12px;
  }

  span {
    line-height: 16px;
  }

  &.marker-cluster-small {
    background-color: var(--cluster-small);

    div {
      background-color: var(--cluster-small);
    }
  }

  &.marker-cluster-medium {
    background-color: var(--cluster-medium);

    div {
      background-color: var(--cluster-medium);
    }
  }

  &.marker-cluster-large {
    background-color: var(--cluster-large);

    div {
      background-color: var(--cluster-large);
    }
  }
}

/* IE 6-8 fallback colors */
#map .leaflet-oldie {
  .marker-cluster-small {
    background-color: var(--success);

    div {
      background-color: var(--success);
    }
  }

  .marker-cluster-medium {
    background-color: var(--warning);

    div {
      background-color: var(--warning);
    }
  }

  .marker-cluster-large {
    background-color: var(--danger);

    div {
      background-color: var(--danger);
    }
  }
}

#map .control-btn {
  display: block;
}
</style>