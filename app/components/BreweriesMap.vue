<template>
  <div style="height:100%; width:100%">
    <LMap
      ref="map"
      :zoom="zoom"
      :max-zoom="18"
      :center="[35.999887, 138.75]"
      @ready="mapInitialized"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
      />
    </LMap>
  </div>
</template>

<script setup>
import * as L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster.js";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const zoom = ref(4)
const map = ref(null)

const mapInitialized = () => {
  //TODO クラスター　デモデータ表示
  const markerCluster = L.markerClusterGroup({
    removeOutsideVisibleBounds: true,
    chunkedLoading: true,
  }).addTo(map.value.leafletObject);

  function r(min, max) {
    return Math.random() * (max - min) + min;
  }
  let markers = [];
  for (let i = 0; i < 1500; i++) {
    const marker = L.marker(
      L.latLng(r(30, 45), r(130, 145))
    );
    marker.bindPopup("Number " + i);
    markers.push(marker);
  }

  markerCluster.addLayers(markers);

}
</script>

<style>
body {
  margin: 0;
}
</style>
