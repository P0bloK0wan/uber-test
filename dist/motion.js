// Original animation data is never retimed, recolored, or rewritten.
// Screen transitions are web adaptations; see docs/fidelity.md.
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const active = new Map();
const cache = new Map();
export const easing = "cubic-bezier(.22,1,.36,1)";
export function motion(app, name, cls = "", loop = true) {
  return `<span class="native-motion ${cls}" data-motion="./assets/motion/${app}/${name}.json" data-loop="${loop}" aria-hidden="true"></span>`;
}
function playback(record) {
  if (!record.player.isLoaded) return;
  if (reduced.matches)
    record.player.goToAndStop(
      Math.max(0, Math.floor(record.player.totalFrames - 1)),
      true,
    );
  else if (document.hidden) record.player.pause();
  else record.player.play();
}
export function mountMotion(root = document) {
  for (const el of root.querySelectorAll("[data-motion]")) {
    if (active.has(el) || !window.lottie) continue;
    const record = { player: null };
    active.set(el, record);
    const path = el.dataset.motion;
    if (!cache.has(path))
      cache.set(
        path,
        fetch(path).then((r) => {
          if (!r.ok) throw new Error(`Animation unavailable: ${path}`);
          return r.json();
        }),
      );
    cache
      .get(path)
      .then((data) => {
        if (!el.isConnected || active.get(el) !== record) return;
        const player = window.lottie.loadAnimation({
          container: el,
          renderer: "svg",
          loop: el.dataset.loop !== "false",
          autoplay: false,
          animationData: structuredClone(data),
          rendererSettings: {
            progressiveLoad: false,
            preserveAspectRatio: "xMidYMid meet",
          },
        });
        record.player = player;
        player.setSubframe(false);
        el.dataset.fps = String(data.fr);
        el.dataset.frames = String(data.op - data.ip);
        el.dataset.duration = String((data.op - data.ip) / data.fr);
        player.addEventListener("DOMLoaded", () => {
          el.dataset.ready = "true";
          playback(record);
          el.dispatchEvent(new CustomEvent("motion-ready"));
        });
        player.addEventListener("complete", () =>
          el.dispatchEvent(new CustomEvent("motion-complete")),
        );
      })
      .catch(() => {
        el.dataset.failed = "true";
        el.dispatchEvent(new CustomEvent("motion-failed"));
      });
  }
}
new MutationObserver(() => {
  for (const [el, record] of active)
    if (!el.isConnected) {
      record.player?.destroy();
      active.delete(el);
    }
}).observe(document.documentElement, { childList: true, subtree: true });
function syncPlayback() {
  for (const record of active.values()) if (record.player) playback(record);
}
reduced.addEventListener("change", syncPlayback);
document.addEventListener("visibilitychange", syncPlayback);
export function enter(el, { sheet = false, duration = 300 } = {}) {
  if (!el || reduced.matches) return;
  el.animate(
    [
      {
        transform: `translateY(${sheet ? "100%" : "18px"})`,
        opacity: sheet ? 1 : 0,
      },
      { transform: "translateY(0)", opacity: 1 },
    ],
    { duration, easing },
  );
}
export function splash(force = false) {
  if (
    reduced.matches ||
    (!force && sessionStorage.getItem("ifood-splash-seen"))
  )
    return;
  if (document.querySelector(".launch-screen")) return;
  const el = document.createElement("div");
  el.className = "launch-screen";
  el.setAttribute("aria-label", "Abertura iFood");
  el.innerHTML =
    motion("ifood", "splash", "splash-art", false) +
    '<button class="skip-splash">Pular abertura</button>';
  document.body.append(el);
  const finish = () => {
    sessionStorage.setItem("ifood-splash-seen", "1");
    clearTimeout(timeout);
    if (reduced.matches) el.remove();
    else
      el.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
      }).finished.then(() => el.remove());
  };
  const timeout = setTimeout(finish, 6500);
  el.querySelector(".skip-splash").onclick = finish;
  el.querySelector("[data-motion]").addEventListener(
    "motion-complete",
    finish,
    { once: true },
  );
  el.querySelector("[data-motion]").addEventListener("motion-failed", finish, {
    once: true,
  });
  mountMotion(el);
}
export async function gallery(appName, openModal) {
  const rows = await fetch("./assets/motion/manifest.json").then((r) =>
    r.json(),
  );
  openModal(
    "Animações originais",
    `<p class="modal-description">Arquivos recuperados do APK, reproduzidos a 1×. A posição de uso e as transições da versão web são adaptações.</p><div class="motion-gallery">${rows
      .filter((r) => r.app === appName)
      .map(
        (r) =>
          `<article><div class="motion-preview">${motion(appName, r.name.replace(".json", ""))}</div><h3>${r.name}</h3><p>${r.fps.toFixed(2)} fps · ${r.duration.toFixed(3)} s · ${r.width} × ${r.height}</p><a href="${r.path}" target="_blank" rel="noopener">JSON original</a></article>`,
      )
      .join("")}</div>`,
  );
}
