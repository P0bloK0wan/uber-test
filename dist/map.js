import { motion, mountMotion } from "./motion.js";
let current;
export function mountMap(from, to, ride) {
  const el = document.querySelector("#street-map");
  if (!el || !window.L || !el.offsetWidth || !el.offsetHeight) return;
  const key = `${from.id}/${to?.id || ""}`;
  // Keep the mounted map and tiles across product choices and trip updates.
  if (current && current.key === key) {
    el.replaceWith(current.el);
    current.map.invalidateSize({ animate: false });
    if (to)
      current.map.fitBounds(
        [
          [from.lat, from.lng],
          [to.lat, to.lng],
        ],
        { padding: [65, 65], maxZoom: 15, animate: false },
      );
    updateCar(ride);
    mountMotion(current.el);
    return;
  }
  current?.map.remove();
  const L = window.L;
  const map = L.map(el, {
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: true,
  }).setView([from.lat, from.lng], 14);
  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);
  let failedTiles = 0;
  tiles.on("tileerror", () => {
    if (++failedTiles >= 4 && el.isConnected)
      el.closest(".map-area")?.classList.add("map-unavailable");
  });
  tiles.on("tileload", () =>
    el.closest(".map-area")?.classList.remove("map-unavailable"),
  );
  L.marker([from.lat, from.lng], {
    icon: L.divIcon({
      className: "origin-marker",
      html: motion("uber", "location_pulsing_dot"),
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    }),
  }).addTo(map);
  current = {
    key,
    map,
    el,
    from,
    to,
    points: [[from.lat, from.lng], ...(to ? [[to.lat, to.lng]] : [])],
    car: null,
  };
  if (to) {
    L.marker([to.lat, to.lng], {
      icon: L.divIcon({
        className: "destination-marker",
        html: "<span></span>",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    }).addTo(map);
    map.fitBounds(
      [
        [from.lat, from.lng],
        [to.lat, to.lng],
      ],
      { padding: [65, 65], maxZoom: 15, animate: false },
    );
    const record = current;
    fetch("./assets/routes.json")
      .then((r) => r.json())
      .then((routes) => {
        if (current !== record) return;
        const points = routes[`${from.id}/${to.id}`];
        if (!points) return; // Never present a straight line as a road route.
        record.points = points;
        L.polyline(points, { color: "#fff", weight: 9 }).addTo(map);
        L.polyline(points, {
          color: "#111",
          weight: 4,
          lineJoin: "round",
        }).addTo(map);
        updateCar(ride);
      })
      .catch(() => {});
  }
  updateCar(ride);
  mountMotion(el);
}
function updateCar(ride) {
  if (
    !current ||
    !ride ||
    ["completed", "cancelled", "requested"].includes(ride.status)
  ) {
    if (current?.car) {
      current.car.remove();
      current.car = null;
    }
    return;
  }
  const points = current.points;
  const pos =
    points[
      Math.floor(
        (points.length - 1) * (ride.status === "traveling" ? 0.6 : 0.1),
      )
    ];
  if (current.car) current.car.setLatLng(pos);
  else
    current.car = window.L.marker(pos, {
      icon: window.L.divIcon({
        className: "car-marker",
        html: "<span></span>",
        iconSize: [20, 38],
        iconAnchor: [10, 19],
      }),
    }).addTo(current.map);
}
export function zoomMap(delta) {
  if (current?.el.isConnected)
    current.map.setZoom(current.map.getZoom() + delta, {
      animate: !matchMedia("(prefers-reduced-motion:reduce)").matches,
    });
}
