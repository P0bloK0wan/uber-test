# Uber identity v3 — official-source asset findings

Retrieved and verified 2026-10-18. This bounded task changes no app code and publishes nothing. Source responses, precise image hashes, dimensions and URLs are saved in adjacent JSON files.

## Ready for integration

All four PNGs below are **genuine transparent illustrations**, 414 × 233, downloaded unchanged from Uber's official CDN. Category association is explicit in the official Brazilian [Uber Comfort page](https://www.uber.com/br/pt-br/ride/uber-comfort/) JSON, saved as `comfort.txt`. They are official marketing category art, not asserted to be byte-identical to every current native vehicle thumbnail.

| File | Verified category | CDN URL |
|---|---|---|
| `assets/uberx.png` | UberX, white compact hatchback | https://tb-static.uber.com/prod/udam-assets/434f52fd-e990-49f5-9a20-95a8e8f6312a.png |
| `assets/comfort.png` | Uber Comfort, white car | https://tb-static.uber.com/prod/udam-assets/57d6cbee-df5d-4c9f-b3d3-2f797c009adb.png |
| `assets/black.png` | Uber Black, dark grey sedan | https://tb-static.uber.com/prod/udam-assets/b7f38920-f0d1-4951-be96-580619859fc0.png |
| `assets/reserve.png` | Uber Reserve, 3D calendar/check | https://tb-static.uber.com/prod/udam-assets/c2505121-a320-4d58-b297-ea44909ca5c1.png |

Existing exact home ride artwork remains `web/dist/assets/uber-ride.png` (160 × 160, URL directly recovered from Android home configuration). It need not be redownloaded.

**Genuine logo recovered:** `assets/baseweb-uber-logo.png`, official Uber organization Base Web repository at commit `ed21081e33f7db2770922b4e04d16dcf5bbdfa85`, path `documentation-site/public/images/uber-logo.png`. This is the modern black Uber wordmark on transparent background, 600 × 365 canvas. Actual nontransparent bounding rectangle is x=119..480, y=119..247: 362 × 129 (~2.806:1 mark aspect). Preserve the original; account for its large transparent padding in layout. `logo-preview.jpg` is a white-background inspection preview only.

**No verified official SVG logo was found in this bounded pass.** The official Comfort site's navbar uses actual text “Uber”, with UberMove font and responsive 20/24 px sizing, not an SVG. A PNG logo is not falsely represented as vector artwork. Existing genuine Uber Move fonts from the prior pass remain available.

## Official app-store references: Portuguese and precise limitations

### Google Play Brazil — usable Brazilian visual reference

Source https://play.google.com/store/apps/details?id=com.ubercab&hl=pt_BR&gl=BR, saved `google-play-br.txt`. The developer's listing provides six promotional screenshots, downloaded from the exact srcset URLs. `assets/play-br-1.jpg` through `play-br-6.jpg` are verified JPEG, **333 × 592**. URLs originally requested w1052-h592, but actual delivered dimensions were verified, not assumed. Metadata's bare original links deliver **288 × 512**, saved separately as `play-br-N-original.jpg`; these are smaller, not higher-quality versions.

| File | What is actually visible | Concrete composition to reproduce |
|---|---|---|
| `play-br-1.jpg` | Brazilian product chooser: Black, UberX, Comfort, Black Bag; passenger count, arrival estimate, subtitle and selected border | Vehicle illustrations at left; text/arrival next; compact product rows; black rounded rectangle on selected Black; Comfort “Excelentes ofertas” badge. Native UI is a cropped panel inside a promotional composition; not a full device screenshot. |
| `play-br-2.jpg` | São Paulo route, Shopping Pátio Paulista, “Escolher uma viagem”, UberX fare R$12,44 with old R$14,99 | Full map behind white bottom sheet; thick black route, square endpoint label; circular back arrow upper-left. Chooser title centered, subtle divider, rounded outlined selected card, car left, text center, fare right. |
| `play-br-3.jpg` | “Centro de segurança”, preference/contact/confirm ride rows | Blue shield illustration header; circular close button; black heading, section text, leading monochrome row icons. |
| `play-br-4.jpg` | “Uber Flash”, “Tipos de entrega” | 2 × 2 illustration grid: Enviar itens, Receber itens, Retirada na Loja, Envio Nacional. These are screenshot pixels, not separate verified downloadable art files. |
| `play-br-5.jpg` | Uber One membership | Gold illustration/header and benefit rows. |
| `play-br-6.jpg` | Service marketing cards UberX, Transporte Público, Reservar, Duas Rodas | Large rounded cards with pastel illustration panels; this is advertising composition, **not proof of in-app home layout**. |

Pixel measurements from the delivered `play-br-2.jpg` (333 × 592) are in screenshot coordinates, not CSS/native dp: native panel bounds approximately x30..302 (272 px), y137..591; map to y465; white chooser header y466..503 (~37 px); selected product outline x42..290 (~248 px), y515..574 (~59 px), radius visually about 11 px, dark outline about 2 px. Approximate native panel internal side margins: 12 px, or 4.4% of displayed panel width. Do not scale the entire marketing canvas into a UI.

### Apple Brazil listing — NOT Brazilian localization despite storefront

Source https://itunes.apple.com/lookup?id=368677368&country=br, saved `apple-br.txt`. Listing reports app version **3.743.10001**, release **2026-10-12**. Screenshot capture dates/versions are not supplied and may precede that release. Six PNG images 392 × 696 are `assets/apple-br-1.png` through `apple-br-6.png`.

Visually inspected text is **European Portuguese** (“Introduza o seu destino”, “recolha”, euro fare €8,03), not Brazilian Portuguese. References show destination entry/keyboard; map+UberX chooser; pickup confirmation; safety toolkit; and trip rating. The rating sheet shows heading, driver name/photo/rating, five gold stars and a full-width black Enviar button. These are official marketing composites and cannot establish Brazilian strings or exact current layout.

## Requested gaps that remain unverified

- Home/services/activity/account **navigation SVGs** were not recovered from official sources. Prior official Base Web icons are utility icons (search, arrow, calendar, plus, check), not interchangeable evidence for the four navigation symbols. Do not label arbitrary icon-library replacements as exact Uber originals.
- No official full home, activity list, account, wallet/payment, or live driver-tracking screen in Brazilian Portuguese was obtained. The Google Play map is a route/product-quote screen, not proof of live tracking.
- No separate official airport/package illustration asset was verified. The official Flash screenshot provides composition but no direct art URL. Requested airport/courier/reserve pages returned 406 and were not bypassed or guessed.
- No verified modern official SVG logo was found; real official transparent PNG is available.

## Access evidence / no bypass

Direct official pages home/UberX/Black/newsroom and linked Congonhas-airport/courier/reserve pages returned HTTP 406. Uber Design component/index URLs returned 403. Official developer guideline, mobile root, travel root and help root requests returned 404. Requests were not retried with bypass parameters or alternative authentication. `fetches.json`, `official-secondary-fetches.json`, `service-references.json`, and download manifests record the outcomes.

## Files and verification

- `downloads.json` / `original-downloads.json`: exact URL, response MIME, byte size, SHA-256, source category.
- `image-verification.json`: all downloaded image formats fully parsed with Pillow verify(), actual dimensions/mode, transparency bounds and hashes.
- `asset-contact-sheet.jpg`: convenient inspection grid (labels predate JPEG extension normalization).
- Existing genuine font/Lottie/video research remains one directory up and must be distinguished from these newer official Brazilian store references.
