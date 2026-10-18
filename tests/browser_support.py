"""Use the environment's trusted CA bundle for public map tiles in browser QA.

Chromium does not inherit Python's SSL_CERT_FILE in this environment. This
adapter keeps HTTPS certificate verification enabled and only forwards requests
to the public tile host. No application credentials are attached.
"""
import os, urllib.request

def trust_system_ca(page):
    if os.environ.get('USE_SYSTEM_CA_PROXY') != '1':
        return
    cache = {}
    def tile(route):
        try:
            url = route.request.url
            if url in cache:
                status, content_type, body = cache[url]
                route.fulfill(status=status, content_type=content_type, body=body)
                return
            req=urllib.request.Request(route.request.url,headers={
                'User-Agent':route.request.headers.get('user-agent','Mozilla/5.0'),
                'Referer':route.request.headers.get('referer','http://localhost/')})
            with urllib.request.urlopen(req,timeout=15) as res:
                status, content_type, body = res.status, res.headers.get('Content-Type','image/png'), res.read()
                cache[url] = (status, content_type, body)
                route.fulfill(status=status,content_type=content_type,body=body)
        except Exception:
            route.abort()
    page.route('https://tile.openstreetmap.org/**',tile)
