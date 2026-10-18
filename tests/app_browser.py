from browser_support import trust_system_ca
"""Portable acceptance checks for either standalone repository.

Start npm start first. Install requirements-test.txt and Playwright Chromium.
BASE_URL, TEST_OUTPUT, CHROMIUM_PATH and APP may override local defaults.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
import json, os, re, shutil

config = (Path(__file__).resolve().parents[1]/'dist/config.js').read_text()
match = re.search(r'"app"\s*:\s*"(uber|ifood)"', config)
APP = os.environ.get('APP',match.group(1) if match else 'uber')
BASE = os.environ.get('BASE_URL','http://127.0.0.1:3000/')
OUT = Path(os.environ.get('TEST_OUTPUT','verification'))
OUT.mkdir(parents=True,exist_ok=True)
checks = []
def passed(text):
    checks.append(text)
    print('PASS:',text,flush=True)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':1440,'height':1000})
    trust_system_ca(page)
    page.set_default_timeout(15000)
    errors = []
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(BASE+'#/'+APP)
    if APP=='uber':
        page.locator('[data-action="see-prices"]').click()
        expect(page.locator('#toast')).to_contain_text('Selecione')
        page.locator('#destination').fill('Ibirapuera')
        page.locator('[data-action="choose-place"][data-id="ibirapuera"]').click()
        page.locator('[data-action="see-prices"]').click()
        page.locator('[data-action="ride-type"][data-id="comfort"]').click()
        expect(page.locator('[data-action="request-ride"]')).to_have_text('Confirmar Comfort')
        page.locator('[data-action="request-ride"]').click()
        for title in ['Seu motorista está a caminho','Você está a caminho','Você chegou!']:
            page.locator('[data-action="advance-ride"]').click()
            expect(page.get_by_role('heading',name=title,exact=True)).to_be_visible()
        page.locator('[data-action="rate-ride"]').click()
        page.get_by_role('button',name='4 estrelas',exact=True).click()
        page.locator('[data-action="save-rating"]').click()
        page.reload()
        expect(page.get_by_role('heading',name='Sua avaliação: 4 ★')).to_be_visible()
        passed('Validated destination, Comfort selection, full ride, rating and reload persistence')
        page.locator('[data-action="new-ride"]').click()
        page.locator('#destination').fill('Congonhas')
        page.locator('[data-action="choose-place"][data-id="congonhas"]').click()
        page.locator('[data-action="see-prices"]').click()
        page.locator('[data-action="request-ride"]').click()
        page.locator('[data-action="cancel-ride"]').click()
        page.locator('[data-action="confirm-cancel"]').click()
        expect(page.get_by_role('heading',name='Viagem cancelada')).to_be_visible()
        passed('Cancellation requires confirmation and reaches a terminal state')
    else:
        expect(page.locator('.launch-screen')).to_have_count(0,timeout=10000)
        page.locator('#food-search').fill('inexistente-123')
        expect(page.get_by_role('heading',name='Não encontramos restaurantes')).to_be_visible()
        page.get_by_role('button',name='Limpar filtros',exact=True).click()
        page.locator('[data-action="favorite"][data-id="burger"]').click()
        page.reload()
        expect(page.locator('[data-action="favorite"][data-id="burger"]')).to_have_attribute('aria-pressed','true')
        page.goto(BASE+'#/ifood/restaurant/burger')
        page.locator('[data-action="product"][data-id="classic"]').click()
        page.locator('input[name="extra"][value="cheese"]').check()
        page.locator('[data-action="product-plus"]').click()
        page.locator('#product-note').fill('Sem cebola')
        page.locator('[data-action="add-cart"]').click()
        page.locator('[data-action="cart"]').first.click()
        page.locator('input[name="coupon"]').fill('BEMVINDO')
        page.get_by_role('button',name='Aplicar',exact=True).click()
        expect(page.locator('.cart-totals .total')).to_contain_text('66,92')
        expect(page.locator('.coupon-motion')).to_have_attribute('data-ready','true')
        page.locator('[data-action="checkout"]').click()
        page.locator('[data-action="place-order"]').click()
        for title in ['Preparando seu pedido','Seu pedido saiu para entrega','Pedido entregue']:
            page.locator('[data-action="advance-order"]').click()
            expect(page.locator('.order-track h1')).to_have_text(title)
        page.reload()
        expect(page.locator('.order-track h1')).to_have_text('Pedido entregue')
        passed('Search, favorites, extras, quantity, notes, original coupon animation, totals and full order')
        page.locator('[data-action="reorder"]').click()
        page.locator('[data-action="checkout"]').click()
        page.locator('[data-action="place-order"]').click()
        page.locator('[data-action="cancel-order"]').click()
        page.locator('[data-action="confirm-cancel"]').click()
        expect(page.locator('.order-track h1')).to_have_text('Pedido cancelado')
        passed('Reorder, cancellation and reload persistence')
    for width in [1440,390,360]:
        page.set_viewport_size({'width':width,'height':900})
        for suffix in ['', '/profile', '/services' if APP=='uber' else '/restaurant/burger']:
            page.goto(BASE+'#/'+APP+suffix)
            page.wait_for_timeout(400)
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,suffix)
            local_images=page.locator('img:not(.leaflet-tile)')
            local_images.evaluate_all('(imgs)=>Promise.all(imgs.map(i=>i.decode().catch(()=>{})))')
            assert not local_images.evaluate_all('(imgs)=>imgs.filter(i=>!i.naturalWidth).map(i=>i.src)')
        page.goto(BASE+'#/'+APP)
        page.wait_for_timeout(450)
        page.screenshot(path=str(OUT/f'{APP}-{width}.png'),full_page=True)
    passed('Nine page/viewport combinations: no horizontal overflow or missing bundled images')
    if APP=='uber':
        page.locator('#destination').fill('Ibirapuera')
        page.locator('[data-action="choose-place"][data-id="ibirapuera"]').click()
        page.locator('[data-action="see-prices"]').click()
        page.wait_for_timeout(500)
        page.evaluate('window.pickerMap=document.querySelector("#street-map");window.pickerCard=document.querySelector(".ride-card")')
        page.locator('[data-action="ride-type"][data-id="black"]').click()
        page.wait_for_timeout(350)
        assert page.evaluate('window.pickerMap===document.querySelector("#street-map") && window.pickerCard===document.querySelector(".ride-card")')
        expect(page.locator('.origin-marker [data-motion]')).to_have_attribute('data-frames','91')
        page.screenshot(path=str(OUT/'uber-picker-mobile.png'),full_page=True)
        passed('Mobile booking sheet, original location pulse and category morph without remounting')
    else:
        assert page.locator('.bottom-nav a').count()==5
        assert page.locator('.food-services>button').count()==8
        page.goto(BASE+'#/ifood/restaurant/burger')
        page.locator('[data-action="product"][data-id="classic"]').click()
        page.wait_for_timeout(350)
        box=page.locator('dialog').bounding_box()
        assert abs(box['y']+box['height']-900)<2
        page.screenshot(path=str(OUT/'ifood-product-mobile.png'))
        page.locator('[data-action="add-cart"]').click()
        page.locator('.mobile-cart').click()
        page.locator('[data-action="checkout"]').click()
        page.locator('[data-action="place-order"]').click()
        expect(page.locator('.order-track h1')).to_have_text('Pedido confirmado')
        passed('Five tabs, eight services, mobile product sheet, cart and checkout at 360px')
    page.goto(BASE+'#/'+APP+'/profile')
    page.locator('[data-action="motion-gallery"]').click()
    expect(page.locator('.motion-gallery article')).to_have_count(11 if APP=='uber' else 6)
    page.wait_for_function('Array.from(document.querySelectorAll(".motion-gallery [data-motion]")).every(el=>el.dataset.ready==="true")')
    page.emulate_media(reduced_motion='reduce')
    page.wait_for_timeout(100)
    assert page.evaluate('lottie.getRegisteredAnimations().every(a=>a.isPaused)')
    page.keyboard.press('Escape')
    expect(page.locator('dialog')).not_to_be_visible()
    passed('All recovered animations load, reduced motion pauses playback and Escape closes the sheet')
    if match:
        page.goto(BASE+'#/'+('ifood' if APP=='uber' else 'uber'))
        expect(page.locator('body')).to_have_attribute('data-app',APP)
        assert page.locator('.app-switch').count()==0
        passed('Standalone route scope and default app')
    assert not errors,errors
    (OUT/'browser-results.json').write_text(json.dumps({'app':APP,'passed':checks,'runtime_errors':errors},indent=2,ensure_ascii=False))
    browser.close()
