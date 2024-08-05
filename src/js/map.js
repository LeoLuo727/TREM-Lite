/* eslint-disable no-undef */
variable.map = L.map("map", {
  maxBounds: [
    [60, 50],
    [10, 180],
  ],
  preferCanvas: true,
  attributionControl: false,
  zoomSnap: 0.25,
  zoomDelta: 0.25,
  doubleClickZoom: false,
  zoomControl: false,
  minZoom: 5.5,
  maxZoom: 10,
});

variable.map.createPane("circlePane");
variable.map.getPane("circlePane").style.zIndex = 10;

variable.map.createPane("detection");
variable.map.getPane("detection").style.zIndex = 2000;

for (const map_name of constant.MAP_LIST)
  L.geoJson
    .vt(require(path.join(__dirname, "../resource/map", `${map_name}.json`)), {
      edgeBufferTiles: 2,
      minZoom: 5.5,
      maxZoom: 10,
      style: {
        weight: 0.6,
        color: map_name == "TW" ? "white" : "gray",
        fillColor: "#3F4045",
        fillOpacity: 0.5,
      },
    })
    .addTo(variable.map);

variable.map.setView([23.6, 120.4], 7.8);

// L.marker([24.38, 121.93], {
//   icon: L.icon({
//     iconUrl   : "../resource/image/cross.png",
//     iconSize  : [40, 40 ],
//     className : "flash",
//   }), zIndexOffset: 2000,
// })
//   .addTo(variable.map);

// L.marker([24.39, 121.93], {
//   icon: L.divIcon({
//     className : "dot pga_-3",
//     html      : "<span></span>",
//     iconSize  : [40, 40],
//   }), zIndexOffset: 2000,
// })
//   .addTo(variable.map);

variable.icon_size = (Number(variable.map.getZoom().toFixed(1)) - 7.8) * 2;

function updateIconSize() {
  variable.icon_size = (Number(variable.map.getZoom().toFixed(1)) - 7.8) * 2;

  for (const key in variable.eew_list) {
    const oldMarker = variable.eew_list[key].layer.epicenterIcon;
    const newIconSize = [
      40 + variable.icon_size * 3,
      40 + variable.icon_size * 3,
    ];

    const icon = variable.eew_list[key].layer.epicenterIcon.options.icon;
    icon.options.iconSize = [
      40 + variable.icon_size * 3,
      40 + variable.icon_size * 3,
    ];
    oldMarker.setIcon(icon);

    if (oldMarker.getTooltip())
      oldMarker.bindTooltip(oldMarker.getTooltip()._content, {
        opacity: 1,
        permanent: true,
        direction: "right",
        offset: [newIconSize[0] / 2, 0],
        className: "progress-tooltip",
      });

    if (variable.eew_list[key].cancel) {
      const iconElement = oldMarker.getElement();
      if (iconElement) {
        iconElement.style.opacity = "0.5";
        iconElement.className = "cancel";
        iconElement.style.visibility = "visible";
      }
    }
  }
}

variable.map.on("zoomend", updateIconSize);

variable.focus.bounds = {
  report: L.latLngBounds(),
  intensity: L.latLngBounds(),
  tsunami: L.latLngBounds(),
  eew: L.latLngBounds(),
  rts: L.latLngBounds(),
};

let intensity_focus = 0;
let map_focus = 0;
let lastZoomUpdate = 0;

setInterval(() => {
  try {
    if (
      variable.intensity_time &&
      Date.now() - variable.intensity_time > 300000
    ) {
      variable.intensity_time = 0;
      if (variable.intensity_geojson) variable.intensity_geojson.remove();
    }
    if (
      map_focus &&
      !variable.focus.status.intensity &&
      !variable.focus.status.rts &&
      !variable.focus.status.eew
    ) {
      map_focus = 0;
      resize();
      return;
    }
    if (variable.focus.status.intensity) {
      if (Date.now() - variable.focus.status.intensity > 5000) {
        variable.focus.status.intensity = 0;
        intensity_focus = 0;
        variable.last_map_update = 0;
      } else if (!intensity_focus) {
        intensity_focus = 1;
        const zoom_now = variable.map.getZoom();
        const center_now = variable.map.getCenter();
        const center = variable.focus.bounds.intensity.getCenter();
        let zoom =
          variable.map.getBoundsZoom(variable.focus.bounds.intensity) - ㄅ;
        if (Math.abs(zoom - zoom_now) < 0.2) zoom = zoom_now;
        const set_center = Math.sqrt(
          Math.pow((center.lat - center_now.lat) * 111, 2) +
            Math.pow((center.lng - center_now.lng) * 101, 2)
        );
        if (checkbox("graphics-block-auto-zoom") != 1) {
          const now = Date.now();
          if (now - lastZoomUpdate >= 10000) {
            resize();
            // variable.map.setView(set_center > 10 ? center : center_now, zoom);
            lastZoomUpdate = now;
          }
        }
        map_focus = 1;
      }
    } else {
      if (variable.focus.status.rts) {
        variable.focus.status.rts = 0;
        const zoom_now = variable.map.getZoom();
        const center_now = variable.map.getCenter();
        const center = variable.focus.bounds.rts.getCenter();
        let zoom = variable.map.getBoundsZoom(variable.focus.bounds.rts) - 2;
        if (Math.abs(zoom - zoom_now) < 0.2) zoom = zoom_now;
        const set_center = Math.sqrt(
          Math.pow((center.lat - center_now.lat) * 111, 2) +
            Math.pow((center.lng - center_now.lng) * 101, 2)
        );
        if (checkbox("graphics-block-auto-zoom") != 1) {
          const now = Date.now();
          if (now - lastZoomUpdate >= 10000) {
            resize();
            // variable.map.setView(set_center > 10 ? center : center_now, zoom);
            lastZoomUpdate = now;
          }
        }
        map_focus = 1;
      }
      if (variable.focus.status.eew) {
        if (Object.keys(variable.focus.bounds.eew).length == 0) return;

        variable.focus.status.eew = 0;
        const zoom_now = variable.map.getZoom();
        const center_now = variable.map.getCenter();
        const center = variable.focus.bounds.eew.getCenter();
        let zoom = variable.map.getBoundsZoom(variable.focus.bounds.eew) - 2;
        if (Math.abs(zoom - zoom_now) < 0.2) zoom = zoom_now;
        if (zoom < 6.5) zoom = 6.5;
        const set_center = Math.sqrt(
          Math.pow((center.lat - center_now.lat) * 111, 2) +
            Math.pow((center.lng - center_now.lng) * 101, 2)
        );
        if (checkbox("graphics-block-auto-zoom") != 1) {
          const now = Date.now();
          if (now - lastZoomUpdate >= 10000) {
            resize();
            // variable.map.setView(set_center > 10 ? center : center_now, zoom);
            lastZoomUpdate = now;
          }
        }
        map_focus = 1;
      }
    }
  } catch (err) {
    console.log(err);
  }
}, 100);

function fault() {
  if (variable.fault) {
    variable.map.removeLayer(variable.fault);
  }

  if (checkbox("graphics-show-fault") !== 1) return;

  variable.fault = L.geoJson
    .vt(require(path.join(__dirname, "../resource/map/fault.json")), {
      edgeBufferTiles: 2,
      minZoom: 5.5,
      maxZoom: 10,
      tolerance: 20,
      buffer: 256,
      debug: 0,
      style: {
        weight: 1,
        color: "red",
      },
    })
    .addTo(variable.map);

  if (variable.fault) variable.fault.bringToFront();
}

function usr_location() {
  const flashElements = document.querySelectorAll(".usr_loc");
  flashElements.forEach((element) => element.remove());
  const usr_ico = L.icon({
    iconUrl: "../resource/image/here.png",
    iconSize: [25, 25],
    className: "usr_loc",
  });
  const location = config.setting["location"];
  L.marker([location.lat, location.lon], { icon: usr_ico }).addTo(variable.map);
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  updateMapView(width, height);

  ipcRenderer.on("window-resized", (event, { width, height }) => {
    updateMapView(width, height);
  });
}

function updateMapView(width, height) {
  const minZoom = 7.3;
  const maxZoom = 9;
  const zoom = Math.max(minZoom, Math.min(maxZoom, (width + height) / 350));
  const center = [23.6, 120.4];

  variable.map.invalidateSize();
  variable.map.setView(center, zoom);
}

resize();
