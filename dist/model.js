export const money = (value) =>
  (value / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export function cartTotals(items, delivery = 590, coupon = "") {
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce(
    (s, i) =>
      s + (i.price + (i.extras || []).reduce((a, e) => a + e.price, 0)) * i.qty,
    0,
  );
  const discount =
    coupon.toUpperCase() === "BEMVINDO"
      ? Math.min(1000, Math.round(subtotal * 0.1))
      : 0;
  return {
    subtotal,
    delivery: count ? delivery : 0,
    discount,
    total: subtotal + (count ? delivery : 0) - discount,
    count,
  };
}
const categories = {
  x: { base: 600, km: 220, minutes: 4 },
  comfort: { base: 900, km: 290, minutes: 5 },
  black: { base: 1400, km: 410, minutes: 7 },
};
export function rideQuote(distance, category) {
  if (!Number.isFinite(distance) || distance < 0 || !categories[category])
    throw new Error("Trajeto ou categoria inválida");
  const c = categories[category];
  return {
    price: Math.round((c.base + distance * c.km) / 10) * 10,
    minutes: c.minutes,
    duration: Math.max(5, Math.round(distance * 3)),
  };
}
export const nextRideState = (s) =>
  ({ requested: "arriving", arriving: "traveling", traveling: "completed" })[
    s
  ] || s;
export const nextOrderState = (s) =>
  ({
    confirmed: "preparing",
    preparing: "delivering",
    delivering: "completed",
  })[s] || s;
export const validateAddress = (street, number) =>
  street.trim().length >= 4 && number.trim().length > 0;
export const cartKey = (id, extras, note) =>
  JSON.stringify([id, [...extras].sort(), note.trim()]);
export const escapeHtml = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function readState(storage) {
  const initial = {
    version: 1,
    profile: { name: "Visitante", email: "" },
    address: {
      street: "Av. Paulista",
      number: "1578",
      detail: "",
      label: "Casa",
    },
    favorites: [],
    cart: [],
    cartRestaurant: null,
    coupon: "",
    orders: [],
    rides: [],
    savedPlaces: [],
  };
  try {
    const raw = JSON.parse(storage.getItem("rea-web-v1"));
    if (!raw || raw.version !== 1) return initial;
    return {
      ...initial,
      profile:
        typeof raw.profile?.name === "string" ? raw.profile : initial.profile,
      address:
        typeof raw.address?.street === "string" &&
        typeof raw.address?.number === "string"
          ? raw.address
          : initial.address,
      favorites: Array.isArray(raw.favorites)
        ? raw.favorites.filter((x) => typeof x === "string")
        : [],
      cart: Array.isArray(raw.cart)
        ? raw.cart.filter(
            (x) =>
              typeof x.key === "string" &&
              typeof x.name === "string" &&
              Number.isInteger(x.price) &&
              x.price >= 0 &&
              Number.isInteger(x.qty) &&
              x.qty > 0 &&
              x.qty <= 20 &&
              Array.isArray(x.extras) &&
              x.extras.every((e) => Number.isInteger(e.price) && e.price >= 0),
          )
        : [],
      cartRestaurant:
        typeof raw.cartRestaurant === "string" ? raw.cartRestaurant : null,
      coupon: raw.coupon === "BEMVINDO" ? "BEMVINDO" : "",
      orders: Array.isArray(raw.orders)
        ? raw.orders.filter(
            (x) =>
              typeof x.id === "string" &&
              Number.isFinite(x.total) &&
              Array.isArray(x.items) &&
              typeof x.restaurant === "string",
          )
        : [],
      rides: Array.isArray(raw.rides)
        ? raw.rides.filter(
            (x) =>
              typeof x.id === "string" &&
              Number.isFinite(x.price) &&
              typeof x.destination?.name === "string",
          )
        : [],
      savedPlaces: Array.isArray(raw.savedPlaces)
        ? raw.savedPlaces.filter((x) => typeof x.id === "string")
        : [],
    };
  } catch {
    return initial;
  }
}
