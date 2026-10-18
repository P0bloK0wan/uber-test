"""Capture the implemented identity on mobile/desktop with reproducible local data."""
from pathlib import Path
import json, os, shutil
from playwright.sync_api import sync_playwright
from browser_support import trust_system_ca

BASE = os.environ.get('BASE_URL', 'http://127.0.0.1:3000/')
OUT = Path(os.environ.get('TEST_OUTPUT', 'verification-local/identity'))
OUT.mkdir(parents=True, exist_ok=True)
APP = os.environ.get('APP', 'combined')
checks, errors = [], []

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'), args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':390,'height':844})
    trust_system_ca(page)
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(BASE)
    page.evaluate("sessionStorage.setItem('ifood-splash-seen','1')")
    fixture = page.evaluate('''async () => {
      const {readState,cartTotals,cartKey}=await import('./model.js');
      const {places,restaurants}=await import('./data.js');
      const state=readState({getItem:()=>null});
      state.profile={name:'Ana Silva',email:'ana@example.test'};
      state.favorites=['burger','pizza'];
      const restaurant=restaurants[0], product=restaurant.products[0];
      const item={...product,key:cartKey(product.id,[],''),qty:1,extras:[],note:''};
      state.cart=[item];state.cartRestaurant=restaurant.id;
      state.rides=['requested','arriving','traveling','completed','cancelled'].map((status,i)=>({
        id:'ride-'+status,origin:places[0],destination:places[i%2+1],
        price:2470,type:'x',typeName:'UberX',payment:'Dinheiro',status,
        schedule:null,created:'2026-10-18T14:30:00Z',rating:status==='completed'?5:null
      }));
      state.orders=['confirmed','preparing','delivering','completed','cancelled'].map(status=>({
        id:'order-'+status,restaurantId:restaurant.id,restaurant:restaurant.name,img:restaurant.img,
        items:[item],...cartTotals([item],restaurant.delivery),payment:'Pix de demonstração',
        address:'Av. Paulista, 1578',status,created:'2026-10-18T14:30:00Z'
      }));
      return state;
    }''')
    page.evaluate('(s)=>localStorage.setItem("rea-web-v1",JSON.stringify(s))', fixture)
    page.reload()

    def capture(name):
        page.wait_for_timeout(380)
        page.evaluate('document.fonts.ready')
        page.locator('img').evaluate_all('(imgs)=>Promise.all(imgs.map(i=>i.decode().catch(()=>{})))')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), (name,'horizontal overflow')
        bad=page.locator('img').evaluate_all('(imgs)=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)')
        assert not bad,(name,bad)
        page.screenshot(path=str(OUT/(name+'.png')),full_page=True)
        checks.append(name)
        print('PASS',name,flush=True)

    routes={
      'uber':['','services','activity','profile']+['ride/'+s for s in ['requested','arriving','traveling','completed','cancelled']],
      'ifood':['','search','hits','favorites','restaurant/burger','checkout','orders','profile']+['order/'+s for s in ['confirmed','preparing','delivering','completed','cancelled']]
    }
    for width in [390,1440,360]:
        page.set_viewport_size({'width':width,'height':844 if width<760 else 1000})
        for app,routes_for_app in routes.items():
            if APP not in ['combined',app]:continue
            for route in routes_for_app:
                # Route IDs are intentionally explicit fixtures, not real users.
                url_route=route.replace('ride/','ride/ride-').replace('order/','order/order-')
                page.goto(BASE+'#/'+app+'/'+url_route)
                capture(app+'-'+(route.replace('/','-') or 'home')+'-'+str(width))
        if width != 390:continue
        modals=[('uber','uber/profile','uber-payment','wallet'),('uber','uber/profile','schedule','schedule'),
          ('uber','uber/profile','safety','safety'),('ifood','ifood/restaurant/burger','product','product'),
          ('ifood','ifood/restaurant/burger','cart','bag'),('ifood','ifood/profile','coupons','coupon'),
          ('ifood','ifood/profile','address','address'),('ifood','ifood/profile','edit-profile','edit-profile')]
        for app,route,action,label in modals:
            if APP not in ['combined',app]:continue
            page.goto(BASE+'#/'+route)
            page.locator('[data-action="'+action+'"]:visible').first.click()
            capture(app+'-'+label+'-390')
            page.keyboard.press('Escape')
            page.wait_for_timeout(250)
    assert not errors, errors
    (OUT/'visual-results.json').write_text(json.dumps({'passed':checks,'runtime_errors':errors},ensure_ascii=False,indent=2))
    browser.close()
