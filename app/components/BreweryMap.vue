<template>
  <div id="map" style="height: 100%; width: 100%">
    <LMap
      ref="map"
      :zoom="zoom"
      :max-zoom="18"
      :center="[props.brewery.latitude, props.brewery.longitude]"
      @ready="mapInitialized"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        layer-type="base"
        name="OpenStreetMap"
      />
    </LMap>
  </div>
</template>

<script setup lang="ts">
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import iconUrl from "~/assets/icons/sake.svg"
interface Props {
  brewery: {
    latitude: number
    longitude: number
  }
}
const props = defineProps<Props>()

const zoom = ref(10)
const map = ref(null)

const mapInitialized = async () => {
  //アイコンデザイン調整
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.imagePath = ""
  L.Icon.Default.mergeOptions({
    iconUrl,
    iconRetinaUrl: iconUrl,
    iconSize: [20, 20],
    iconAnchor: [12, 18],
    popupAnchor: [-3, -24],
    shadowSize: [30, 20],
    shadowAnchor: [12, 18],
  })

  const marker = L.marker(
    L.latLng(props.brewery.location.latitude, props.brewery.location.longitude),
  )
  const link = '<a href="/breweries/' + props.brewery.id + '">' + props.brewery.name + "</a>"

  marker.bindPopup(link)
  marker.addTo(map.value.leafletObject)
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
