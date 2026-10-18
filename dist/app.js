import { APP_CONFIG } from "./config.js";
import {
  motion,
  mountMotion,
  enter,
  splash,
  gallery,
  easing,
} from "./motion.js";
import { mountMap, zoomMap } from "./map.js";
import {
  money,
  cartTotals,
  rideQuote,
  nextRideState,
  nextOrderState,
  validateAddress,
  cartKey,
  escapeHtml as esc,
  readState,
} from "./model.js";
import {
  places,
  distance,
  rideTypes,
  restaurants,
  extras,
  rideLabels,
  orderLabels,
} from "./data.js";
const paths = {
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4",
  search: "m21 21-5-5 M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  home: "m3 10 9-7 9 7v11h-6v-7H9v7H3Z",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  clock: "M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  user: "M20 21v-2a7 7 0 0 0-14 0v2 M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  arrow: "m9 5 7 7-7 7",
  back: "m15 5-7 7 7 7",
  down: "m6 9 6 6 6-6",
  close: "m6 6 12 12 M6 18 18 6",
  plus: "M12 5v14 M5 12h14",
  minus: "M5 12h14",
  check: "m5 12 4 4L20 5",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  bag: "M5 7h14l2 14H3L5 7Z M8 7V5a4 4 0 0 1 8 0v2",
  wallet: "M3 5h17v15H3z M3 5V3h14v2 M15 10h6v5h-6z",
  card: "M2 5h20v15H2z M2 10h20 M6 16h4",
  calendar: "M3 5h18v17H3z M7 2v6 M17 2v6 M3 11h18 M7 15h3",
  car: "M3 15V9l3-6h12l3 6v6 M3 9h18 M2 15h20v4H2z M5 19v3 M19 19v3 M6 12h1 M17 12h1",
  switch: "M3 7h17l-4-4 M21 17H4l4 4",
  star: "m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",
  receipt: "M5 2l3 2 4-2 4 2 3-2v20l-3-2-4 2-4-2-3 2Z M9 8h6 M9 12h6 M9 16h4",
  info: "M12 11v6 M12 7h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  food: "M4 2v6a3 3 0 0 0 6 0V2 M7 2v20 M18 2c-4 5-4 10 0 10h2 M20 2v20",
  filter: "M4 7h16 M4 17h16 M8 4v6 M16 14v6",
  gift: "M3 8h18v5H3z M5 13v9h14v-9 M12 8v14 M12 8C2 8 6 0 10 4l2 4Zm0 0c10 0 6-8 2-4l-2 4Z",
  location: "m21 3-7 18-4-7-7-4Z",
  phone:
    "M5 3h4l2 5-3 2c2 4 3 5 6 6l2-3 5 2v4c0 3-5 3-9 0S3 10 3 6c0-2 0-3 2-3Z",
  shield: "m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Z m-4 10 3 3 5-6",
  leaf: "M21 3C8 2 2 6 4 15s18 5 17-12Z M4 21 16 9",
};
const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.info}"/></svg>`;
const btn = (label, action, cls = "", attrs = "") =>
  `<button class="btn ${cls}" data-action="${action}" ${attrs}>${label}</button>`;
const state = readState(localStorage);
const ui = {
  from: places[0],
  to: null,
  fromText: places[0].name,
  toText: "",
  placeFocus: null,
  stage: "search",
  rideType: "x",
  payment: "Dinheiro",
  schedule: null,
  mapZoom: 1,
  category: "Todos",
  query: "",
  filter: "all",
  sort: "recommended",
  product: null,
  productQty: 1,
  foodPayment: "Pix de demonstração",
  selectedRating: 5,
};
const app = document.querySelector("#app"),
  modal = document.querySelector("#modal");
let toastTimer,
  modalCloseAnimation,
  lastScreen = "",
  renderVersion = 0;
function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3500);
}
function persist() {
  try {
    localStorage.setItem("rea-web-v1", JSON.stringify(state));
  } catch {
    toast(
      "Não foi possível salvar neste navegador. A sessão continua disponível.",
    );
  }
}
function route() {
  const parts = (location.hash || "#/" + APP_CONFIG.defaultApp)
    .replace(/^#\/?/, "")
    .split("/");
  return APP_CONFIG.app !== "combined" && parts[0] !== APP_CONFIG.app
    ? [APP_CONFIG.app]
    : parts;
}
function go(path) {
  if (location.hash === `#/${path}`) render();
  else location.hash = `#/${path}`;
}
function dateLabel(date) {
  return (
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    }) +
    " · " +
    new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}
function foodImg(name, cls = "") {
  return name
    ? `<img class="${cls}" src="./assets/food-${name}.jpg" alt="${{ burger: "Hambúrguer artesanal", pizza: "Pizza artesanal", sushi: "Sushi", salad: "Salada fresca", dessert: "Bolo de chocolate", brazilian: "Feijoada brasileira" }[name] || "Prato ilustrativo"}" loading="lazy">`
    : `<span class="product-placeholder">${icon("food")}</span>`;
}
function openModal(title, body, cls = "") {
  modalCloseAnimation?.cancel();
  modalCloseAnimation = null;
  const wasOpen = modal.open;
  modal.innerHTML = `<div class="modal-head"><h2 id="modal-title">${title}</h2><button class="icon-btn" data-action="close-modal" aria-label="Fechar">${icon("close")}</button></div>${body}`;
  modal.className = cls;
  modal.dataset.brand = route()[0];
  if (!modal.open) modal.showModal();
  mountMotion(modal);
  if (!wasOpen) enter(modal, { sheet: innerWidth <= 760, duration: 300 });
}
function closeModal(immediate = false) {
  if (!modal.open) return;
  modalCloseAnimation?.cancel();
  if (immediate || matchMedia("(prefers-reduced-motion:reduce)").matches) {
    modal.close();
    return;
  }
  modalCloseAnimation = modal.animate(
    [
      { transform: "translateY(0)", opacity: 1 },
      {
        transform: `translateY(${innerWidth <= 760 ? "100%" : "20px"})`,
        opacity: 0,
      },
    ],
    { duration: 180, easing: "cubic-bezier(.64,0,.78,0)" },
  );
  modalCloseAnimation.finished
    .then(() => {
      modal.close();
      modalCloseAnimation = null;
    })
    .catch(() => {});
}
function empty(title, text, action = "", label = "") {
  return `<div class="empty">${icon("receipt")}<h3>${title}</h3><p>${text}</p>${action ? btn(label, action) : ""}</div>`;
}
function addressText() {
  return `${state.address.street}, ${state.address.number}`;
}
function bottomNav(appName, active) {
  const food = appName === "ifood";
  return `<nav class="bottom-nav" aria-label="Navegação principal">${(food
    ? [
        ["home", "Início", ""],
        ["search", "Busca", "search"],
        ["gift", "Hits", "hits"],
        ["receipt", "Pedidos", "orders"],
        ["user", "Perfil", "profile"],
      ]
    : [
        ["home", "Início", ""],
        ["grid", "Serviços", "services"],
        ["clock", "Atividade", "activity"],
        ["user", "Conta", "profile"],
      ]
  )
    .map(
      ([ic, label, slug]) =>
        `<a class="${active === slug ? "active" : ""}" href="#/${appName}${slug ? "/" + slug : ""}" ${active === slug ? 'aria-current="page"' : ""}>${icon(ic)}${label}</a>`,
    )
    .join("")}</nav>`;
}
function uberHeader(active = "") {
  return `<header class="uber-header"><a class="brand-uber" href="#/uber" aria-label="Uber início">Uber</a><nav class="uber-tabs" aria-label="Navegação Uber">${[
    ["car", "Viajar", ""],
    ["grid", "Serviços", "services"],
    ["clock", "Atividade", "activity"],
  ]
    .map(
      ([ic, l, s]) =>
        `<a class="${active === s ? "active" : ""}" href="#/uber${s ? "/" + s : ""}">${icon(ic)}${l}</a>`,
    )
    .join(
      "",
    )}</nav><span class="grow"></span><span class="demo-badge">Demonstração</span>${APP_CONFIG.app === "combined" ? `<a class="app-switch" href="#/ifood">${icon("switch")}Ir para iFood</a>` : ""}<a class="icon-btn profile-link" href="#/uber/profile" aria-label="Minha conta">${icon("user")}</a></header>`;
}
function mapSVG(ride = null) {
  return `<div class="map-area"><div id="street-map" class="street-map" role="region" aria-label="Mapa de São Paulo"></div><div class="map-fallback">Mapa indisponível sem conexão. Você pode continuar a demonstração.</div><div class="map-controls"><button class="icon-btn white" data-action="map-plus" aria-label="Ampliar mapa">${icon("plus")}</button><button class="icon-btn white" data-action="map-minus" aria-label="Reduzir mapa">${icon("minus")}</button></div><div class="map-caption">Trajeto de demonstração · São Paulo</div></div>`;
}
function placeOptions(query = "", focus = "to") {
  const q = query.toLocaleLowerCase();
  const found = places
    .filter((p) => `${p.name} ${p.address}`.toLocaleLowerCase().includes(q))
    .slice(0, 6);
  return found.length
    ? found
        .map(
          (p) =>
            `<button class="place-option" data-action="choose-place" data-id="${p.id}" data-focus="${focus}"><span>${icon("pin")}</span><span><strong>${p.name}</strong><small>${p.address}</small></span></button>`,
        )
        .join("")
    : `<p class="muted small" style="padding:16px 0">Nenhum local encontrado. Experimente Paulista, Ibirapuera ou Congonhas.</p>`;
}
function uberSearch() {
  return `<h1 class="uber-search-title">Vá a qualquer lugar</h1><div class="uber-home-tabs"><strong>${icon("car")} Viagens</strong><a href="#/uber/services">${icon("bag")} Serviços</a></div><button class="uber-schedule" data-action="schedule">${icon("clock")}${ui.schedule ? esc(dateLabel(ui.schedule)) : "Sair agora"}${icon("down")}</button><div class="location-fields"><label class="location-input" aria-label="Local de partida"><span><i class="location-dot"></i></span><input id="origin" placeholder="Local de partida" value="${esc(ui.fromText)}" autocomplete="off" aria-label="Local de partida">${icon("location")}</label><label class="location-input"><span><i class="location-square"></i></span><input id="destination" placeholder="Para onde?" value="${esc(ui.toText)}" autocomplete="off" aria-label="Destino"></label></div>${btn("Ver preços", "see-prices", "full")}<div class="place-results" id="place-results">${ui.placeFocus ? placeOptions("", ui.placeFocus) : ""}</div><div class="spread section-title"><h2>Sugestões</h2><a class="small" href="#/uber/services">Ver tudo</a></div><div class="suggestion-grid"><button class="suggestion" data-action="focus-destination"><img src="./assets/uber-ride.png" alt="Carro Uber">Viajar</button><button class="suggestion" data-action="schedule"><span class="service-symbol">${icon("calendar")}</span>Reservar</button><button class="suggestion" data-action="airport"><span class="service-symbol">${icon("bag")}</span>Aeroporto</button></div><div class="welcome-card"><h3>Seu próximo destino começa aqui.</h3><p>Escolha um lugar e descubra uma nova forma de chegar.</p><img src="./assets/uber-welcome.png" alt="Ilustração de uma pessoa explorando destinos"></div><p class="demo-note" style="margin-top:16px">Demonstração independente. Não solicita corridas reais.</p>`;
}
function uberSelect() {
  const dist = distance(ui.from, ui.to);
  return `<button class="back" data-action="back-search">${icon("back")}Alterar trajeto</button><h1>Escolha uma viagem</h1><p class="muted small">${esc(ui.to.name)} · ${dist.toFixed(1).replace(".", ",")} km estimados</p><div class="ride-picker">${rideTypes
    .map((r) => {
      const q = rideQuote(dist, r.id);
      return `<button class="ride-card ${ui.rideType === r.id ? "selected" : ""}" data-action="ride-type" data-id="${r.id}" aria-pressed="${ui.rideType === r.id}"><img src="./assets/uber-ride.png" alt=""><span class="grow"><h3>${r.name} <span class="small ride-seats">${icon("user")} ${r.seats}</span></h3><small>${q.minutes} min de distância</small><small class="ride-description">${r.description}</small></span><span class="price">${money(q.price)}</span></button>`;
    })
    .join(
      "",
    )}</div><button class="payment-row" data-action="uber-payment">${icon(ui.payment === "Dinheiro" ? "wallet" : "card")}<strong>${ui.payment}</strong>${icon("arrow")}</button>${ui.schedule ? `<div class="notice" style="margin-bottom:15px">${icon("calendar")} Agendada para ${esc(dateLabel(ui.schedule))}</div>` : ""}${btn("Confirmar " + rideTypes.find((r) => r.id === ui.rideType).name, "request-ride", "full")}<p class="demo-note" style="margin-top:15px">Valores demonstrativos. Nenhuma cobrança será realizada.</p>`;
}
function routeSummary(ride) {
  return `<div class="route-summary"><div class="row">${icon("location")}<span>${esc(ride.origin.name)}</span></div><div class="row">${icon("pin")}<span>${esc(ride.destination.name)}</span></div></div>`;
}
function uberRide(ride) {
  const s = ride.status,
    done = s === "completed",
    cancelled = s === "cancelled";
  const n = ["requested", "arriving", "traveling", "completed"].indexOf(s);
  return `<a class="back" href="#/uber/activity">${icon("back")}Suas viagens</a><span class="badge ${done ? "green" : ""}">${done ? "Finalizada" : cancelled ? "Cancelada" : "Viagem de demonstração"}</span><h1 style="margin-top:18px">${rideLabels[s]}</h1>${!done && !cancelled ? `<div class="ride-progress">${[0, 1, 2, 3].map((i) => `<span class="${i <= n ? "done" : ""}"></span>`).join("")}</div>` : ""}${s === "requested" ? `<div class="row">${motion("uber", "dots", "trip-loader")}<p class="small muted">Procurando uma opção perto de você...</p></div>` : ""}${!cancelled && s !== "requested" ? `<div class="driver"><div class="avatar">RS</div><div class="grow"><h3>Rafael S.</h3><p class="small muted">★ 4,97 · Motorista fictício</p></div><div style="text-align:right"><div class="car-number">DEMO • 01</div><p class="small muted">Sedã prata</p></div></div>` : ""}${routeSummary(ride)}<div class="spread"><span class="muted">${ride.typeName}</span><strong>${money(ride.price)}</strong></div><p class="small muted" style="margin:12px 0 24px">${ride.payment} · ${ride.schedule ? "Reserva: " + esc(dateLabel(ride.schedule)) : dateLabel(ride.created)}</p>${done ? `${motion("uber", "circle_check", "trip-completed", false)}<div class="surface"><h3>${ride.rating ? "Sua avaliação: " + ride.rating + " ★" : "Como foi sua viagem?"}</h3>${ride.rating ? "" : `${btn("Avaliar viagem", "rate-ride", "secondary full", 'data-id="' + ride.id + '"')}`}</div>` : ""}${!done && !cancelled ? `${btn({ requested: "Simular motorista encontrado", arriving: "Iniciar trajeto de demonstração", traveling: "Simular chegada ao destino" }[s], "advance-ride", "full", 'data-id="' + ride.id + '"')}<button class="text-btn" style="color:#666;width:100%;margin-top:8px" data-action="cancel-ride" data-id="${ride.id}">Cancelar viagem</button>` : btn("Fazer outra viagem", "new-ride", "full")}<p class="demo-note" style="margin-top:18px">Esta experiência usa motorista, trajeto e pagamentos simulados.</p>`;
}
function uberActivity() {
  return `<div class="spread"><h1>Atividade</h1>${btn("Nova viagem", "new-ride", "compact")}</div><h2 class="section-title">Suas viagens</h2>${state.rides.length ? state.rides.map((r) => `<a class="history-row" href="#/uber/ride/${r.id}"><span class="history-img"><img src="./assets/uber-ride.png" alt=""></span><span class="grow"><h3>${esc(r.destination.name)}</h3><small>${dateLabel(r.created)}</small><small>${rideLabels[r.status]}</small></span><span class="price">${money(r.price)}</span>${icon("arrow")}</a>`).join("") : empty("Seu próximo destino está esperando", "As viagens que você fizer nesta demonstração aparecerão aqui.", "new-ride", "Começar uma viagem")}`;
}
function uberServices() {
  return `<h1>Serviços</h1><p class="muted" style="margin:12px 0 30px">Vá a qualquer lugar. Do seu jeito.</p><div class="service-grid"><button class="service-tile" data-action="new-ride"><h2>Viajar</h2><p class="small muted">Uma viagem para onde você precisar.</p><span class="btn secondary compact">Começar ${icon("arrow")}</span><img src="./assets/uber-ride.png" alt="Carro"></button><button class="service-tile" data-action="schedule"><h2>Reservar</h2><p class="small muted">Planeje sua próxima viagem com antecedência.</p><span class="btn secondary compact">Agendar ${icon("arrow")}</span>${icon("calendar")}</button><button class="service-tile" data-action="airport"><h2>Aeroporto</h2><p class="small muted">Deixe seu trajeto para Congonhas planejado.</p><span class="btn secondary compact">Planejar ${icon("arrow")}</span>${icon("bag")}</button></div><div class="notice" style="margin-top:28px">${icon("info")} Todos os serviços operam em modo de demonstração.</div>`;
}
function profile(appName) {
  const f = appName === "ifood";
  return `<div class="profile-card"><h1>${f ? "Meu perfil" : "Conta"}</h1><div class="row"><div class="avatar">${esc(state.profile.name.slice(0, 2).toUpperCase())}</div><div class="grow"><h2>${esc(state.profile.name)}</h2><p class="small muted">${esc(state.profile.email) || "Seu espaço, do seu jeito."}</p></div><button class="icon-btn" data-action="edit-profile" aria-label="Editar perfil">${icon("arrow")}</button></div><div>${(f
    ? [
        ["pin", "Meus endereços", "address"],
        ["heart", "Restaurantes favoritos", "favorites"],
        ["gift", "Cupons disponíveis", "coupons"],
        ["receipt", "Meus pedidos", "food-orders"],
      ]
    : [
        ["pin", "Locais salvos", "saved-places"],
        ["wallet", "Carteira", "uber-payment"],
        ["clock", "Minhas viagens", "uber-activity"],
      ]
  )
    .map(
      ([ic, t, a]) =>
        `<button class="menu-row" data-action="${a}">${icon(ic)}<span>${t}</span>${icon("arrow")}</button>`,
    )
    .join(
      "",
    )}<button class="menu-row" data-action="motion-gallery">${icon("grid")}<span>Animações originais</span>${icon("arrow")}</button>${f ? `<button class="menu-row" data-action="replay-splash">${icon("food")}<span>Rever abertura</span>${icon("arrow")}</button>` : ""}<button class="menu-row" data-action="about">${icon("info")}<span>Sobre esta experiência</span>${icon("arrow")}</button></div><div class="notice">Seus dados de demonstração ficam salvos apenas neste navegador. Não use senhas ou dados de pagamento reais.</div>${APP_CONFIG.app === "combined" ? `<a class="text-btn" href="#/${f ? "uber" : "ifood"}">Explorar ${f ? "Uber" : "iFood"} ${icon("arrow")}</a>` : ""}</div>`;
}
function renderUber(parts) {
  const page = parts[1] || "";
  let content;
  if (page === "ride") {
    const ride = state.rides.find((r) => r.id === parts[2]);
    content = ride
      ? `<div class="uber-layout"><section class="uber-panel"><div class="sheet-grip" aria-hidden="true"></div>${uberRide(ride)}</section>${mapSVG(ride)}</div>`
      : `<main class="uber-content">${empty("Viagem não encontrada", "Esta viagem não está salva neste navegador.", "new-ride", "Nova viagem")}</main>`;
  } else if (["services", "activity", "profile"].includes(page)) {
    content = `<main class="uber-content">${page === "services" ? uberServices() : page === "activity" ? uberActivity() : profile("uber")}</main>`;
  } else {
    if (ui.stage === "select" && (!ui.from || !ui.to)) ui.stage = "search";
    content = `<main class="uber-layout"><section class="uber-panel">${ui.stage === "select" ? '<div class="sheet-grip" aria-hidden="true"></div>' : ""}${ui.stage === "select" ? uberSelect() : uberSearch()}</section>${mapSVG()}</main>`;
  }
  app.innerHTML = `<div class="uber ${page === "ride" || ui.stage === "select" ? "booking-screen" : ""}">${uberHeader(page)}${content}${bottomNav("uber", page)}</div>`;
  document.title = "Uber · Demonstração web";
}
function cartRestaurant() {
  return restaurants.find((r) => r.id === state.cartRestaurant);
}
function totals() {
  return cartTotals(state.cart, cartRestaurant()?.delivery || 0, state.coupon);
}
function foodHeader(active = "") {
  const t = totals();
  return `<header class="food-header"><a href="#/ifood" class="brand-ifood" aria-label="iFood início">ifood</a><nav aria-label="Navegação iFood"><a class="${["", "restaurant", "search"].includes(active) ? "active" : ""}" href="#/ifood">Restaurantes</a><a class="${active === "orders" ? "active" : ""}" href="#/ifood/orders">Pedidos</a><a class="${active === "favorites" ? "active" : ""}" href="#/ifood/favorites">Favoritos</a></nav><span class="grow"></span><button class="food-address" data-action="address"><span class="small muted">ENTREGAR EM</span><strong>${esc(addressText())} ${icon("down")}</strong></button><button class="food-notifications icon-btn" data-action="notifications" aria-label="Notificações">${icon("bell")}<i></i></button><span class="demo-badge">Demo</span>${APP_CONFIG.app === "combined" ? `<a class="app-switch" href="#/uber">${icon("switch")}Ir para Uber</a>` : ""}<a class="profile-link" href="#/ifood/profile" aria-label="Meu perfil">${icon("user")}</a><button class="cart-header" data-action="cart" aria-label="Abrir sacola">${icon("bag")}<span><strong>${money(t.total)}</strong><small>${t.count} ${t.count === 1 ? "item" : "itens"}</small></span></button></header>`;
}
function restaurantCard(r) {
  return `<article class="restaurant-card"><a class="restaurant-cover" href="#/ifood/restaurant/${r.id}" aria-label="Abrir ${r.name}">${foodImg(r.img)}<span class="badge">${r.tag}</span></a><button class="icon-btn white fave ${state.favorites.includes(r.id) ? "active" : ""}" data-action="favorite" data-id="${r.id}" aria-label="${state.favorites.includes(r.id) ? "Remover" : "Adicionar"} ${r.name} ${state.favorites.includes(r.id) ? "dos" : "aos"} favoritos" aria-pressed="${state.favorites.includes(r.id)}">${icon("heart")}</button><a class="restaurant-info" href="#/ifood/restaurant/${r.id}"><h3>${r.name}</h3><div class="meta"><span class="rating">★ ${r.rating}</span><span>·</span><span>${r.category}</span><span>·</span><span>1,2 km</span></div><div class="delivery"><span>${r.time} min</span><span class="${r.delivery ? "" : "free"}">${r.delivery ? money(r.delivery) : "Entrega grátis"}</span></div></a></article>`;
}
function filteredRestaurants(favorites = false) {
  let list = restaurants.filter(
    (r) =>
      (!favorites || state.favorites.includes(r.id)) &&
      (ui.category === "Todos" || r.category === ui.category) &&
      (!ui.query ||
        `${r.name} ${r.category} ${r.products.map((p) => p.name).join(" ")}`
          .toLocaleLowerCase()
          .includes(ui.query.toLocaleLowerCase())) &&
      (ui.filter !== "free" || r.delivery === 0) &&
      (ui.filter !== "fast" || parseInt(r.time) <= 25),
  );
  if (ui.sort === "rating")
    list.sort((a, b) => b.rating.localeCompare(a.rating));
  if (ui.sort === "delivery") list.sort((a, b) => a.delivery - b.delivery);
  return list;
}
function restaurantResults(favorites = false) {
  const rs = filteredRestaurants(favorites);
  return rs.length
    ? `<div class="restaurant-grid">${rs.map(restaurantCard).join("")}</div>`
    : `${favorites ? motion("ifood", "favorite-empty-state", "favorites-art") : ""}${empty(favorites ? "Nenhum favorito por aqui" : "Não encontramos restaurantes", favorites ? "Toque no coração de um restaurante para encontrá-lo aqui." : "Tente outra busca ou remova os filtros.", "clear-filters", favorites ? "Explorar restaurantes" : "Limpar filtros")}`;
}
function foodHome(search = false, favorites = false) {
  const home = !search && !favorites && route()[1] !== "hits";
  const hits = route()[1] === "hits";
  return `${
    home
      ? `<div class="club-strip"><div><h1>Olá, ${esc(state.profile.name.split(" ")[0])}</h1><button data-action="coupons">Ver meu Clube ${icon("arrow")}</button></div><button class="club-coupon" data-action="coupons">${icon("gift")} 1 cupom ${icon("arrow")}</button></div><div class="food-services">${[
          ["Restaurantes", "food", "burger"],
          ["Mercados", "bag", "salad"],
          ["Farmácias", "plus", null],
          ["Bebidas", "gift", null],
          ["Hits", "gift", "pizza"],
          ["Turbo", "clock", null],
          ["Shopping", "bag", null],
          ["Clube", "star", null],
        ]
          .map(
            ([label, ic, img]) =>
              `<button data-action="food-service" data-service="${label}"><span class="service-art service-${label.toLowerCase()}">${img ? foodImg(img) : icon(ic)}</span><span>${label}</span></button>`,
          )
          .join(
            "",
          )}</div><section class="offer-carousel" aria-label="Ofertas"><button class="offer-slide" data-action="coupons"><span><small>COMBINA COM SEU DIA</small><strong>Seu próximo<br>pedido com<br><b>10% OFF</b></strong><em>Use BEMVINDO · até R$ 10</em></span>${foodImg("pizza")}<span class="offer-page"><i></i><i></i><i></i></span></button></section><div class="spread recent-heading"><h2>Lojas para você</h2><button class="text-btn" data-action="browse-restaurants">Ver mais</button></div><div class="recent-stores">${restaurants.map((r) => `<a href="#/ifood/restaurant/${r.id}">${foodImg(r.img)}<span>${r.name}</span></a>`).join("")}</div>`
      : ""
  }<div class="food-topline"><div class="grow"><h1>${favorites ? "Seus favoritos" : hits ? "Hits do dia" : search ? "O que você está procurando?" : "Restaurantes"}</h1>${home ? "" : `<p>${favorites ? "Seus sabores preferidos, sempre por perto." : hits ? "Os mais pedidos no catálogo de demonstração." : "Encontre seu próximo pedido."}</p>`}</div><label class="search-box">${icon("search")}<input id="food-search" type="search" placeholder="Busque por restaurante ou comida" aria-label="Buscar restaurantes ou comida" value="${esc(ui.query)}"></label></div>${favorites ? "" : `<div class="food-categories">${restaurants.map((r) => `<button class="food-category ${ui.category === r.category ? "active" : ""}" data-action="category" data-id="${r.category}" aria-pressed="${ui.category === r.category}"><span class="category-img" style="background:${r.color}">${foodImg(r.img)}</span>${r.category}</button>`).join("")}</div>`}<div class="spread food-section-heading"><h2>${favorites ? "Restaurantes salvos" : ui.category === "Todos" ? "Restaurantes para você" : ui.category}</h2><button class="text-btn small" data-action="sort">Ordenar ${icon("down")}</button></div><div class="chips"><button class="pill ${ui.filter === "all" && ui.category === "Todos" ? "active" : ""}" data-action="clear-filters">${icon("filter")}Todos</button><button class="pill ${ui.filter === "free" ? "active" : ""}" data-action="filter" data-id="free">Entrega grátis</button><button class="pill ${ui.filter === "fast" ? "active" : ""}" data-action="filter" data-id="fast">Até 30 min</button><button class="pill ${ui.sort === "rating" ? "active" : ""}" data-action="sort-rating">${icon("star")}Melhor avaliação</button></div><div id="restaurant-results">${restaurantResults(favorites)}</div>`;
}
function foodRestaurant(r) {
  return `<a class="back" href="#/ifood">${icon("back")}Restaurantes</a><div class="restaurant-banner">${foodImg(r.img)}<span class="badge">${r.tag}</span></div><div class="restaurant-heading"><div class="spread"><h1>${r.name}</h1><button class="icon-btn fave ${state.favorites.includes(r.id) ? "active" : ""}" data-action="favorite" data-id="${r.id}" aria-label="Favoritar restaurante">${icon("heart")}</button></div><p>${r.description}</p><div class="restaurant-details"><span class="rating">★ ${r.rating} <span class="muted">(avaliação ilustrativa)</span></span><span>${r.category}</span><span>${r.time} min</span><span class="${r.delivery ? "" : "free"}">${r.delivery ? money(r.delivery) + " de entrega" : "Entrega grátis"}</span><span>Mínimo ${money(r.min)}</span></div></div><div class="notice" style="margin-bottom:25px">${icon("gift")} Use <strong>BEMVINDO</strong> e ganhe 10% de desconto, até R$ 10, no seu pedido de demonstração.</div><h2 style="margin:26px 0 18px">Feito para dar vontade</h2><div class="menu-grid">${r.products.map((p) => `<button class="product-card" data-action="product" data-restaurant="${r.id}" data-id="${p.id}"><span class="grow">${p.popular ? '<span class="badge">MAIS PEDIDO</span>' : ""}<h3>${p.name}</h3><p>${p.description}</p><span class="price">${money(p.price)}</span></span>${foodImg(p.img)}</button>`).join("")}</div>`;
}
function cartLines() {
  return state.cart
    .map(
      (i, index) =>
        `<div class="cart-line">${foodImg(i.img)}<div class="grow"><h3>${esc(i.name)}</h3><p>${i.extras.map((e) => esc(e.name)).join(", ")}${i.note ? "<br>" + esc(i.note) : ""}</p><div class="spread"><div class="qty"><button data-action="cart-minus" data-index="${index}" aria-label="Diminuir ${esc(i.name)}">${icon("minus")}</button><span>${i.qty}</span><button data-action="cart-plus" data-index="${index}" aria-label="Aumentar ${esc(i.name)}">${icon("plus")}</button></div><span class="price small">${money((i.price + i.extras.reduce((s, e) => s + e.price, 0)) * i.qty)}</span></div></div></div>`,
    )
    .join("");
}
function totalsHTML(t) {
  return `<div class="cart-totals"><div class="spread"><span>Subtotal</span><span>${money(t.subtotal)}</span></div><div class="spread"><span>Taxa de entrega</span><span class="${t.delivery ? "" : "free"}">${t.delivery ? money(t.delivery) : "Grátis"}</span></div>${t.discount ? `<div class="spread"><span>Desconto BEMVINDO</span><span class="free">− ${money(t.discount)}</span></div>` : ""}<div class="spread total"><span>Total</span><span>${money(t.total)}</span></div></div>`;
}
function openCart() {
  const r = cartRestaurant();
  if (!state.cart.length || !r) {
    openModal(
      "Sua sacola",
      empty(
        "Sua sacola está vazia",
        "Escolha um restaurante e adicione seus favoritos.",
        "explore-food",
        "Ver restaurantes",
      ),
    );
    return;
  }
  const t = totals();
  openModal(
    "Sua sacola",
    `<p class="small muted">Seu pedido em <strong>${r.name}</strong></p>${cartLines()}<form id="coupon-form" class="coupon"><input class="field" name="coupon" aria-label="Código do cupom" placeholder="Cupom de desconto" value="${esc(state.coupon)}" maxlength="30"><button class="btn secondary compact" type="submit">Aplicar</button></form><p class="small muted" style="margin-top:8px">Experimente BEMVINDO: 10% até R$ 10.</p>${state.coupon ? motion("ifood", "outline_cupom_aplicado", "coupon-motion", false) : ""}${totalsHTML(t)}${t.subtotal < r.min ? `<p class="error">Faltam ${money(r.min - t.subtotal)} para o pedido mínimo.</p>` : ""}${btn("Escolher entrega e pagamento", "checkout", "red full", t.subtotal < r.min ? "disabled" : "")}<p class="demo-note" style="margin-top:12px">Catálogo fictício. Nenhuma compra real.</p>`,
  );
}
function foodCheckout() {
  const r = cartRestaurant();
  if (!r || !state.cart.length)
    return empty(
      "Sua sacola está vazia",
      "Adicione um produto para continuar.",
      "explore-food",
      "Ver restaurantes",
    );
  return `<a class="back" href="#/ifood/restaurant/${r.id}">${icon("back")}Continuar comprando</a><h1 style="margin-bottom:28px">Falta pouco para pedir</h1><div class="checkout-grid"><section class="stack"><div class="surface"><div class="spread"><h2>Endereço de entrega</h2><button class="text-btn small" data-action="address">Alterar</button></div><div class="row" style="margin:22px 0 10px">${icon("pin")}<div><h3>${esc(addressText())}</h3><p class="small muted">${esc(state.address.detail) || "Bela Vista, São Paulo — SP"}</p></div></div><span class="badge green">${r.time} min · Entrega padrão</span></div><div class="surface"><h2 style="margin-bottom:20px">Pagamento</h2><div class="stack">${["Pix de demonstração", "Cartão de demonstração", "Dinheiro na entrega"].map((p, i) => `<label class="payment-option"><input type="radio" name="food-payment" value="${p}" ${ui.foodPayment === p ? "checked" : ""}>${icon(i === 2 ? "wallet" : "card")}<span>${p}</span></label>`).join("")}</div><p class="demo-note" style="margin-top:18px">Não é necessário informar dados bancários. Nenhum valor será cobrado.</p></div></section><aside class="surface"><p class="small muted">SEU PEDIDO EM</p><h3 style="margin-top:8px">${r.name}</h3>${cartLines()}${totalsHTML(totals())}${btn("Fazer pedido de demonstração", "place-order", "red full", totals().subtotal < r.min ? "disabled" : "")}<button class="text-btn small" data-action="cart">Editar sacola ou cupom</button></aside></div>`;
}
function foodOrders() {
  return `<h1>Meus pedidos</h1><p class="muted small" style="margin:12px 0 25px">Seus bons momentos, todos por aqui.</p>${state.orders.length ? state.orders.map((o) => `<a class="order-item" href="#/ifood/order/${o.id}">${foodImg(o.img)}<span class="grow"><span class="badge ${o.status === "completed" ? "green" : o.status === "cancelled" ? "" : "red"}">${orderLabels[o.status]}</span><h3 style="margin-top:8px">${esc(o.restaurant)}</h3><p>${dateLabel(o.created)} · ${o.items.reduce((s, i) => s + i.qty, 0)} itens</p></span><strong class="small">${money(o.total)}</strong>${icon("arrow")}</a>`).join("") : empty("Bateu a fome?", "Quando você fizer um pedido, ele vai aparecer aqui.", "explore-food", "Explorar restaurantes")}`;
}
function foodOrder(o) {
  const statuses = ["confirmed", "preparing", "delivering", "completed"];
  const n = statuses.indexOf(o.status),
    terminal = ["completed", "cancelled"].includes(o.status);
  return `<div class="order-track"><a class="back" href="#/ifood/orders">${icon("back")}Meus pedidos</a><div class="spread"><span class="badge red">Pedido #${o.id.slice(-5).toUpperCase()}</span><span class="small muted">${dateLabel(o.created)}</span></div><h1 style="margin:20px 0 10px">${orderLabels[o.status]}</h1><p class="muted small">${terminal ? "Obrigada por experimentar esta demonstração." : "Acompanhe cada etapa até chegar até você."}</p><div class="row" style="margin:25px 0">${foodImg(o.img)}<h3>${esc(o.restaurant)}</h3></div>${!terminal ? motion("ifood", "loading", "order-loader") : ""}${o.status !== "cancelled" ? `<div class="timeline">${statuses.map((s, i) => `<div class="timeline-row ${i <= n ? "done" : ""}"><span class="timeline-dot">${i <= n ? icon("check") : ""}</span><div><h3>${orderLabels[s]}</h3><p>${["O restaurante recebeu o pedido.", "Tudo sendo feito com cuidado.", "Seu pedido está a caminho.", "Agora é só aproveitar!"][i]}</p></div></div>`).join("")}</div>` : ""}<div class="surface"><div class="row">${icon("pin")}<div><h3 class="small">${esc(o.address)}</h3><p class="small muted">${esc(o.payment)}</p></div></div><div class="divider"></div>${o.items.map((i) => `<div class="spread small" style="margin:12px 0"><span>${i.qty}× ${esc(i.name)}</span><strong>${money((i.price + i.extras.reduce((s, e) => s + e.price, 0)) * i.qty)}</strong></div>`).join("")}<div class="divider"></div><div class="spread"><strong>Total pago na demonstração</strong><strong>${money(o.total)}</strong></div></div><div class="stack" style="margin-top:24px">${!terminal ? `${btn({ confirmed: "Simular início do preparo", preparing: "Simular saída para entrega", delivering: "Simular entrega concluída" }[o.status], "advance-order", "red full", 'data-id="' + o.id + '"')}<button class="text-btn" data-action="cancel-order" data-id="${o.id}">Cancelar pedido</button>` : btn("Pedir novamente", "reorder", "red full", 'data-id="' + o.id + '"')}</div><p class="demo-note" style="margin-top:18px">Este acompanhamento é simulado. Não há entrega ou cobrança real.</p></div>`;
}
function renderFood(parts) {
  const page = parts[1] || "";
  let content;
  if (page === "restaurant") {
    const r = restaurants.find((r) => r.id === parts[2]);
    content = r
      ? foodRestaurant(r)
      : empty(
          "Restaurante não encontrado",
          "Explore outras opções no catálogo.",
          "explore-food",
          "Ver restaurantes",
        );
  } else if (page === "checkout") content = foodCheckout();
  else if (page === "orders") content = foodOrders();
  else if (page === "order") {
    const o = state.orders.find((o) => o.id === parts[2]);
    content = o
      ? foodOrder(o)
      : empty(
          "Pedido não encontrado",
          "Este pedido não está salvo neste navegador.",
          "food-orders",
          "Meus pedidos",
        );
  } else if (page === "profile") content = profile("ifood");
  else content = foodHome(page === "search", page === "favorites");
  const t = totals();
  app.innerHTML = `<div class="ifood">${foodHeader(page)}<main class="food-main ${t.count ? "has-cart" : ""}">${content}<footer class="food-footer"><span>Experiência de demonstração · Catálogo fictício · Não realiza pedidos reais</span><a href="./assets/PHOTO-CREDITS.txt" target="_blank" rel="noopener">Créditos das fotos</a></footer></main>${bottomNav("ifood", page)}${t.count && page !== "checkout" ? `<button class="mobile-cart" data-action="cart"><span>${t.count}</span><strong>Ver sacola</strong><span>${money(t.total)}</span></button>` : ""}</div>`;
  document.title = "iFood · Demonstração web";
}
function render() {
  const p = route(),
    screen = p.join("/") + (p[0] === "uber" ? "/" + ui.stage : "");
  const changed = lastScreen !== screen;
  lastScreen = screen;
  const version = ++renderVersion;
  if (p[0] === "ifood") renderFood(p);
  else renderUber(p);
  document.body.dataset.app = p[0];
  requestAnimationFrame(() => {
    if (version !== renderVersion) return;
    if (p[0] === "uber") {
      const ride =
        p[1] === "ride" ? state.rides.find((r) => r.id === p[2]) : null;
      mountMap(
        ride?.origin || ui.from || places[0],
        ride?.destination || ui.to,
        ride,
      );
    }
    mountMotion();
    if (changed)
      enter(
        document.querySelector(".booking-screen .uber-panel") ||
          document.querySelector("main"),
        {
          sheet: p[0] === "uber" && ui.stage === "select" && innerWidth <= 760,
        },
      );
    if (p[0] === "ifood" && !p[1]) splash();
  });
}
function openProduct(restaurantId, productId) {
  const r = restaurants.find((r) => r.id === restaurantId),
    p = r?.products.find((p) => p.id === productId);
  if (!p) return;
  ui.product = { restaurant: r, product: p };
  ui.productQty = 1;
  const opts = r.id === "burger" && p.id !== "soda" ? extras : [];
  openModal(
    p.name,
    `${p.img ? foodImg(p.img, "product-photo") : ""}<p class="modal-description">${p.description}</p><strong>${money(p.price)}</strong>${opts.length ? `<h3 style="margin-top:25px">Do seu jeito</h3><p class="small muted">Adicionais opcionais</p>${opts.map((e) => `<label class="option-row"><input type="checkbox" name="extra" value="${e.id}"><span>${e.name}</span><span class="price">+ ${money(e.price)}</span></label>`).join("")}` : ""}<label style="margin-top:22px">Alguma observação?<textarea id="product-note" class="field" rows="2" placeholder="Ex.: retirar cebola, enviar talheres..." maxlength="200"></textarea></label><div class="modal-actions"><div class="qty"><button data-action="product-minus" aria-label="Diminuir quantidade">${icon("minus")}</button><span id="product-qty">1</span><button data-action="product-plus" aria-label="Aumentar quantidade">${icon("plus")}</button></div>${btn("Adicionar · " + money(p.price), "add-cart", "red grow", 'id="add-product-button"')}</div>`,
  );
}
function chosenExtras() {
  return [...modal.querySelectorAll('input[name="extra"]:checked')]
    .map((e) => extras.find((x) => x.id === e.value))
    .filter(Boolean);
}
function updateProductPrice() {
  const p = ui.product?.product;
  if (!p) return;
  document.querySelector("#product-qty").textContent = ui.productQty;
  document.querySelector("#add-product-button").textContent =
    "Adicionar · " +
    money(
      (p.price + chosenExtras().reduce((s, e) => s + e.price, 0)) *
        ui.productQty,
    );
}
function addCartItem(item, restaurant) {
  state.cartRestaurant = restaurant;
  const found = state.cart.find((i) => i.key === item.key);
  if (found) found.qty = Math.min(20, found.qty + item.qty);
  else state.cart.push(item);
  persist();
  closeModal();
  render();
  toast("Adicionado à sacola");
}
function scheduleModal() {
  const local = new Date(Date.now() + 3600000);
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  openModal(
    "Planeje sua viagem",
    `<p class="modal-description">Escolha quando você quer sair. A reserva também é uma demonstração.</p><form id="schedule-form" class="stack"><label>Data e hora<input type="datetime-local" class="field" name="when" required value="${ui.schedule || local.toISOString().slice(0, 16)}"></label><p class="error" id="form-error"></p><button class="btn full" type="submit">Confirmar horário</button><button class="btn secondary" type="button" data-action="clear-schedule">Prefiro sair agora</button></form>`,
  );
}
function addressModal() {
  openModal(
    "Onde você quer receber?",
    `<p class="modal-description">Salve um endereço para seus pedidos de demonstração.</p><form id="address-form" class="stack"><label>Rua ou avenida<input class="field" name="street" value="${esc(state.address.street)}" required minlength="4" maxlength="100" autocomplete="street-address"></label><div class="row"><label class="grow">Número<input class="field" name="number" value="${esc(state.address.number)}" required maxlength="12"></label><label class="grow">Identificação<select class="field" name="label"><option ${state.address.label === "Casa" ? "selected" : ""}>Casa</option><option ${state.address.label === "Trabalho" ? "selected" : ""}>Trabalho</option><option ${state.address.label === "Outro" ? "selected" : ""}>Outro</option></select></label></div><label>Complemento (opcional)<input class="field" name="detail" value="${esc(state.address.detail)}" placeholder="Apartamento, bloco ou referência" maxlength="100"></label><p id="form-error" class="error"></p><button class="btn red full" type="submit">Salvar endereço</button></form>`,
  );
}
function confirmCancel(kind, id) {
  openModal(
    kind === "ride" ? "Cancelar esta viagem?" : "Cancelar este pedido?",
    `<p class="modal-description">Você pode começar ${kind === "ride" ? "uma nova viagem" : "outro pedido"} depois. Nenhuma taxa será cobrada nesta demonstração.</p><div class="stack">${btn("Sim, cancelar", "confirm-cancel", "full", `data-kind="${kind}" data-id="${id}"`)}${btn("Continuar acompanhando", "close-modal", "secondary full")}</div>`,
  );
}
document.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el || el.disabled) return;
  const a = el.dataset.action;
  const id = el.dataset.id;
  switch (a) {
    case "close-modal":
      closeModal();
      break;
    case "map-plus":
      zoomMap(1);
      break;
    case "map-minus":
      zoomMap(-1);
      break;
    case "focus-destination":
      document.querySelector("#destination")?.focus();
      break;
    case "choose-place": {
      const p = places.find((p) => p.id === id);
      if (!p) break;
      if (el.dataset.focus === "from") {
        ui.from = p;
        ui.fromText = p.name;
      } else {
        ui.to = p;
        ui.toText = p.name;
      }
      ui.placeFocus = null;
      render();
      break;
    }
    case "see-prices":
      if (!ui.from || !ui.to) {
        toast("Selecione a partida e um destino da lista.");
        document.querySelector(!ui.from ? "#origin" : "#destination")?.focus();
        break;
      }
      if (
        ui.from.id === ui.to.id ||
        (distance(ui.from, ui.to) <= 0.8 && ui.from.lat === ui.to.lat)
      ) {
        toast("Escolha um destino diferente da partida.");
        break;
      }
      ui.stage = "select";
      ui.placeFocus = null;
      render();
      break;
    case "back-search":
      ui.stage = "search";
      render();
      break;
    case "ride-type":
      if (rideTypes.some((r) => r.id === id)) {
        ui.rideType = id;
        document.querySelectorAll(".ride-card").forEach((b) => {
          const selected = b.dataset.id === id;
          b.classList.toggle("selected", selected);
          b.setAttribute("aria-pressed", String(selected));
        });
        document.querySelector('[data-action="request-ride"]').textContent =
          "Confirmar " + rideTypes.find((r) => r.id === id).name;
      }
      break;
    case "schedule":
      scheduleModal();
      break;
    case "clear-schedule":
      ui.schedule = null;
      closeModal();
      ui.stage = "search";
      go("uber");
      break;
    case "airport":
      ui.to = places.find((p) => p.id === "congonhas");
      ui.toText = ui.to.name;
      ui.stage = "search";
      go("uber");
      break;
    case "new-ride":
      ui.stage = "search";
      ui.to = null;
      ui.toText = "";
      ui.placeFocus = null;
      ui.schedule = null;
      closeModal();
      go("uber");
      break;
    case "uber-payment":
      openModal(
        "Forma de pagamento",
        `<p class="modal-description">Escolha uma opção para a demonstração. Não há cobrança nem necessidade de dados bancários.</p><div class="stack">${["Dinheiro", "Pix de demonstração", "Cartão de demonstração"].map((p) => btn(icon(p === "Dinheiro" ? "wallet" : "card") + p, "select-uber-payment", "secondary full", `data-payment="${p}"`)).join("")}</div>`,
      );
      break;
    case "select-uber-payment":
      ui.payment = el.dataset.payment;
      closeModal();
      render();
      break;
    case "request-ride": {
      if (!ui.from || !ui.to) break;
      const active = state.rides.find(
        (r) => !["completed", "cancelled"].includes(r.status),
      );
      if (active) {
        toast("Você já tem uma viagem em andamento.");
        go("uber/ride/" + active.id);
        break;
      }
      if (ui.schedule && new Date(ui.schedule) <= new Date()) {
        toast("O horário da reserva já passou. Escolha outro horário.");
        scheduleModal();
        break;
      }
      const q = rideQuote(distance(ui.from, ui.to), ui.rideType),
        ride = {
          id: crypto.randomUUID(),
          origin: ui.from,
          destination: ui.to,
          price: q.price,
          type: ui.rideType,
          typeName: rideTypes.find((r) => r.id === ui.rideType).name,
          payment: ui.payment,
          status: "requested",
          schedule: ui.schedule,
          created: new Date().toISOString(),
          rating: null,
        };
      state.rides.unshift(ride);
      persist();
      go("uber/ride/" + ride.id);
      break;
    }
    case "advance-ride": {
      const r = state.rides.find((r) => r.id === id);
      if (r) {
        r.status = nextRideState(r.status);
        persist();
        render();
      }
      break;
    }
    case "cancel-ride":
      confirmCancel("ride", id);
      break;
    case "cancel-order":
      confirmCancel("order", id);
      break;
    case "confirm-cancel": {
      const obj = (
        el.dataset.kind === "ride" ? state.rides : state.orders
      ).find((r) => r.id === id);
      if (obj && !["completed", "cancelled"].includes(obj.status)) {
        obj.status = "cancelled";
        persist();
      }
      closeModal();
      render();
      toast("Cancelamento confirmado.");
      break;
    }
    case "rate-ride":
      ui.selectedRating = 5;
      openModal(
        "Como foi sua viagem?",
        `<p class="modal-description">Sua avaliação ficará salva apenas neste navegador.</p><div class="stars" role="group" aria-label="Avaliação de 1 a 5 estrelas">${[1, 2, 3, 4, 5].map((n) => `<button class="chosen" data-action="rating-star" data-value="${n}" aria-label="${n} estrelas" aria-pressed="${n === 5}">★</button>`).join("")}</div>${btn("Enviar avaliação", "save-rating", "full", `data-id="${id}"`)}`,
      );
      break;
    case "rating-star":
      ui.selectedRating = Number(el.dataset.value);
      modal.querySelectorAll(".stars button").forEach((b) => {
        b.classList.toggle(
          "chosen",
          Number(b.dataset.value) <= ui.selectedRating,
        );
        b.setAttribute(
          "aria-pressed",
          String(Number(b.dataset.value) === ui.selectedRating),
        );
      });
      break;
    case "save-rating": {
      const r = state.rides.find((r) => r.id === id);
      if (r && r.status === "completed") {
        r.rating = ui.selectedRating;
        persist();
        closeModal();
        render();
        toast("Avaliação salva. Obrigado!");
      }
      break;
    }
    case "uber-activity":
      go("uber/activity");
      break;
    case "saved-places":
      openModal(
        "Locais salvos",
        `<p class="modal-description">Escolha um local para usar como destino.</p>${state.savedPlaces.length ? state.savedPlaces.map((p) => `<button class="place-option" data-action="saved-destination" data-id="${p.id}"><span>${icon("pin")}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.address)}</small></span></button>`).join("") : '<p class="small muted">Você ainda não tem locais salvos.</p>'}<div class="divider"></div><h3>Adicionar um lugar</h3>${places
          .slice(1, 7)
          .map(
            (p) =>
              `<button class="place-option" data-action="save-place" data-id="${p.id}"><span>${icon("plus")}</span><strong>${p.name}</strong></button>`,
          )
          .join("")}`,
      );
      break;
    case "save-place": {
      const p = places.find((p) => p.id === id);
      if (p && !state.savedPlaces.some((x) => x.id === id)) {
        state.savedPlaces.push(p);
        persist();
        toast("Local salvo.");
      } else toast("Este local já está salvo.");
      break;
    }
    case "saved-destination": {
      const p = places.find((p) => p.id === id);
      if (p) {
        ui.to = p;
        ui.toText = p.name;
        ui.stage = "search";
        closeModal();
        go("uber");
      }
      break;
    }
    case "category":
      ui.category = ui.category === id ? "Todos" : id;
      ui.query = "";
      render();
      break;
    case "clear-filters":
      ui.category = "Todos";
      ui.query = "";
      ui.filter = "all";
      ui.sort = "recommended";
      if (route()[1] === "favorites") go("ifood");
      else render();
      break;
    case "filter":
      ui.filter = ui.filter === id ? "all" : id;
      render();
      break;
    case "sort-rating":
      ui.sort = ui.sort === "rating" ? "recommended" : "rating";
      render();
      break;
    case "sort":
      openModal(
        "Ordenar restaurantes",
        `<div class="stack">${[
          ["recommended", "Recomendados"],
          ["rating", "Melhor avaliação"],
          ["delivery", "Menor taxa de entrega"],
        ]
          .map(([id, l]) =>
            btn(l, "set-sort", "secondary full", `data-id="${id}"`),
          )
          .join("")}</div>`,
      );
      break;
    case "set-sort":
      ui.sort = id;
      closeModal();
      render();
      break;
    case "browse-restaurants":
      document
        .querySelector("#restaurant-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      break;
    case "favorite": {
      const on = !state.favorites.includes(id);
      if (on) state.favorites.push(id);
      else state.favorites = state.favorites.filter((x) => x !== id);
      persist();
      el.classList.toggle("active", on);
      el.setAttribute("aria-pressed", String(on));
      const name = restaurants.find((r) => r.id === id)?.name || "restaurante";
      el.setAttribute(
        "aria-label",
        `${on ? "Remover" : "Adicionar"} ${name} ${on ? "dos" : "aos"} favoritos`,
      );
      if (route()[1] === "favorites") {
        render();
      }
      break;
    }
    case "favorites":
      ui.category = "Todos";
      ui.query = "";
      ui.filter = "all";
      go("ifood/favorites");
      break;
    case "food-orders":
      go("ifood/orders");
      break;
    case "product":
      openProduct(el.dataset.restaurant, id);
      break;
    case "product-minus":
      ui.productQty = Math.max(1, ui.productQty - 1);
      updateProductPrice();
      break;
    case "product-plus":
      ui.productQty = Math.min(20, ui.productQty + 1);
      updateProductPrice();
      break;
    case "add-cart": {
      const { restaurant: r, product: p } = ui.product || {};
      if (!r || !p) break;
      const opts = chosenExtras(),
        note = document.querySelector("#product-note").value.trim();
      const item = {
        key: cartKey(
          p.id,
          opts.map((e) => e.id),
          note,
        ),
        id: p.id,
        name: p.name,
        price: p.price,
        img: p.img,
        qty: ui.productQty,
        extras: opts,
        note,
      };
      if (state.cart.length && state.cartRestaurant !== r.id) {
        ui.pendingItem = { item, restaurant: r.id };
        openModal(
          "Começar uma nova sacola?",
          `<p class="modal-description">Você tem itens de ${esc(cartRestaurant()?.name)}. Para pedir em ${r.name}, os itens atuais serão removidos.</p><div class="stack">${btn("Trocar restaurante e adicionar", "replace-cart", "red full")}${btn("Manter minha sacola", "close-modal", "secondary full")}</div>`,
        );
      } else addCartItem(item, r.id);
      break;
    }
    case "replace-cart":
      if (ui.pendingItem) {
        state.cart = [];
        state.coupon = "";
        addCartItem(ui.pendingItem.item, ui.pendingItem.restaurant);
        ui.pendingItem = null;
      }
      break;
    case "cart":
      openCart();
      break;
    case "cart-minus":
    case "cart-plus": {
      const index = Number(el.dataset.index),
        item = state.cart[index];
      if (!item) break;
      item.qty += a === "cart-plus" ? 1 : -1;
      item.qty = Math.min(20, item.qty);
      if (item.qty === 0) state.cart.splice(index, 1);
      if (!state.cart.length) {
        state.cartRestaurant = null;
        state.coupon = "";
      }
      persist();
      render();
      if (modal.open) openCart();
      break;
    }
    case "checkout":
      closeModal();
      go("ifood/checkout");
      break;
    case "explore-food":
      closeModal();
      ui.category = "Todos";
      ui.query = "";
      ui.filter = "all";
      go("ifood");
      break;
    case "address":
      addressModal();
      break;
    case "coupons":
      openModal(
        "Um presente para você",
        `<div class="notice">${icon("gift")} <strong>BEMVINDO</strong><p>10% de desconto, limitado a R$ 10, no subtotal da sacola. Válido apenas nesta demonstração.</p></div>${btn("Usar cupom", "use-coupon", "red full", 'style="margin-top:20px"')}`,
      );
      break;
    case "use-coupon":
      state.coupon = "BEMVINDO";
      persist();
      closeModal();
      toast("Cupom BEMVINDO aplicado à sua próxima sacola.");
      break;
    case "place-order": {
      const r = cartRestaurant(),
        t = totals();
      if (!r || !state.cart.length) break;
      if (t.subtotal < r.min) {
        toast("O pedido está abaixo do valor mínimo.");
        break;
      }
      if (!validateAddress(state.address.street, state.address.number)) {
        addressModal();
        break;
      }
      const o = {
        id: crypto.randomUUID(),
        restaurantId: r.id,
        restaurant: r.name,
        img: r.img,
        items: structuredClone(state.cart),
        ...t,
        payment: ui.foodPayment,
        address: addressText(),
        status: "confirmed",
        created: new Date().toISOString(),
      };
      state.orders.unshift(o);
      state.cart = [];
      state.cartRestaurant = null;
      state.coupon = "";
      persist();
      go("ifood/order/" + o.id);
      break;
    }
    case "advance-order": {
      const o = state.orders.find((o) => o.id === id);
      if (o) {
        o.status = nextOrderState(o.status);
        persist();
        render();
      }
      break;
    }
    case "reorder": {
      const o = state.orders.find((o) => o.id === id);
      if (!o) break;
      if (state.cart.length) {
        ui.pendingReorder = o;
        openModal(
          "Substituir a sacola atual?",
          `<p class="modal-description">Os itens da sua sacola serão substituídos pelos itens deste pedido.</p><div class="stack">${btn("Substituir sacola", "confirm-reorder", "red full")}${btn("Manter sacola", "close-modal", "secondary full")}</div>`,
        );
      } else {
        state.cart = structuredClone(o.items);
        state.cartRestaurant = o.restaurantId;
        state.coupon = "";
        persist();
        openCart();
        render();
      }
      break;
    }
    case "confirm-reorder":
      if (ui.pendingReorder) {
        state.cart = structuredClone(ui.pendingReorder.items);
        state.cartRestaurant = ui.pendingReorder.restaurantId;
        state.coupon = "";
        ui.pendingReorder = null;
        persist();
        openCart();
        render();
      }
      break;
    case "edit-profile":
      openModal(
        "Seu perfil",
        `<form id="profile-form" class="stack"><label>Nome<input class="field" name="name" value="${esc(state.profile.name)}" required maxlength="60" autocomplete="name"></label><label>E-mail (opcional)<input class="field" type="email" name="email" value="${esc(state.profile.email)}" maxlength="120" autocomplete="email"></label><p class="demo-note">Estas informações ficam apenas no seu navegador. Não há criação de conta nas empresas.</p><button class="btn full" type="submit">Salvar perfil</button></form>`,
      );
      break;
    case "motion-gallery":
      gallery(route()[0], openModal);
      break;
    case "replay-splash":
      splash(true);
      break;
    case "notifications":
      openModal(
        "Notificações",
        empty(
          "Tudo em dia",
          "Você ainda não tem notificações nesta demonstração.",
        ),
      );
      break;
    case "food-service": {
      const service = el.dataset.service;
      if (service === "Restaurantes")
        document
          .querySelector(".food-topline")
          ?.scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
              ? "instant"
              : "smooth",
          });
      else if (service === "Hits") go("ifood/hits");
      else if (service === "Clube")
        document.querySelector(".club-coupon")?.click();
      else if (service === "Turbo") {
        ui.filter = "fast";
        go("ifood/search");
      } else
        openModal(
          service,
          `<p class="modal-description">Esta demonstração possui um catálogo de restaurantes. O serviço de ${esc(service.toLowerCase())} não está conectado.</p>${btn("Ver restaurantes", "explore-food", "red full")}`,
        );
      break;
    }
    case "about":
      openModal(
        "Sobre esta experiência",
        `<div class="stack"><p class="modal-description">Duas aplicações web independentes de demonstração, construídas a partir de referências parciais de APKs analisadas com REA 6.5.0 e JADX 0.7.1.</p><div class="notice">Uber 4.652.10004 · iFood 10.144.0<br>Os arquivos fornecidos estavam truncados. As animações recuperadas preservam seus keyframes. Telas e transições web ainda são adaptações; os fluxos são simulados. Não há vínculo com as empresas nem acesso aos seus serviços.</div><p class="small muted">Pedidos, viagens e preferências ficam neste navegador. As fotos dos pratos são ilustrativas; podem diferir dos produtos descritos.</p><a class="text-btn" href="./assets/PHOTO-CREDITS.txt" target="_blank" rel="noopener">Créditos das fotos</a></div>`,
      );
      break;
  }
});
document.addEventListener("focusin", (e) => {
  if (e.target.id === "origin" || e.target.id === "destination") {
    document.querySelector(".uber-panel")?.classList.add("editing-destination");
    const from = e.target.id === "origin";
    ui.placeFocus = from ? "from" : "to";
    const box = document.querySelector("#place-results");
    if (box) box.innerHTML = placeOptions("", ui.placeFocus);
  }
});
document.addEventListener("input", (e) => {
  const el = e.target;
  if (el.name === "name") el.setCustomValidity("");
  if (el.id === "origin" || el.id === "destination") {
    const from = el.id === "origin";
    ui.placeFocus = from ? "from" : "to";
    if (from) {
      ui.from = null;
      ui.fromText = el.value;
    } else {
      ui.to = null;
      ui.toText = el.value;
    }
    document.querySelector("#place-results").innerHTML = placeOptions(
      el.value,
      ui.placeFocus,
    );
  }
  if (el.id === "food-search") {
    ui.query = el.value;
    document.querySelector("#restaurant-results").innerHTML = restaurantResults(
      route()[1] === "favorites",
    );
  }
});
document.addEventListener("change", (e) => {
  if (e.target.name === "extra") updateProductPrice();
  if (e.target.name === "food-payment") ui.foodPayment = e.target.value;
});
document.addEventListener("submit", (e) => {
  const form = e.target;
  if (
    !["schedule-form", "address-form", "profile-form", "coupon-form"].includes(
      form.id,
    )
  )
    return;
  e.preventDefault();
  const data = new FormData(form);
  if (form.id === "schedule-form") {
    const when = data.get("when");
    if (!when || new Date(when).getTime() < Date.now() + 60000) {
      document.querySelector("#form-error").textContent =
        "Escolha um horário futuro, pelo menos 1 minuto à frente.";
      return;
    }
    ui.schedule = when;
    ui.stage = "search";
    closeModal();
    go("uber");
    toast("Horário de demonstração reservado. Escolha o destino.");
  }
  if (form.id === "address-form") {
    const street = data.get("street").trim(),
      number = data.get("number").trim();
    if (!validateAddress(street, number)) {
      document.querySelector("#form-error").textContent =
        "Informe uma rua e um número válidos.";
      return;
    }
    state.address = {
      street,
      number,
      detail: data.get("detail").trim(),
      label: data.get("label"),
    };
    persist();
    closeModal();
    render();
    toast("Endereço salvo.");
  }
  if (form.id === "profile-form") {
    const name = data.get("name").trim();
    if (!name) {
      form.elements.name.setCustomValidity("Informe seu nome.");
      form.elements.name.reportValidity();
      return;
    }
    form.elements.name.setCustomValidity("");
    state.profile = { name, email: data.get("email").trim() };
    persist();
    closeModal();
    render();
    toast("Perfil atualizado.");
  }
  if (form.id === "coupon-form") {
    const code = data.get("coupon").trim().toUpperCase();
    if (code !== "BEMVINDO") {
      toast("Cupom não encontrado. Use BEMVINDO.");
      return;
    }
    state.coupon = code;
    persist();
    openCart();
    render();
    toast("Cupom aplicado!");
  }
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    const r = modal.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      closeModal();
  }
});
modal.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeModal();
});
window.addEventListener("hashchange", () => {
  closeModal(true);
  if (route()[0] === "uber" && !route()[1]) ui.stage = "search";
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
});
window.addEventListener("storage", (e) => {
  if (e.key === "rea-web-v1") {
    Object.assign(state, readState(localStorage));
    render();
  }
});
render();
