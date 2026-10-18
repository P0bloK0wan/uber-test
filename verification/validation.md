# Verificação — 18/10/2026

- `npm run check`: passou.
- `npm test`: 6 testes passaram (5 de modelo, 1 de integridade dos arquivos de animação).
- `tests/app_browser.py`: 6 grupos de aceitação passaram, incluindo nove combinações de página e largura.
- Erros JavaScript: 0.
- Browser: Chromium, Playwright 1.62.0.
- Configuração da rede de testes: `ALLOW_TEST_PROXY_CERT=1` para a CA do proxy deste ambiente. Nenhuma desativação de verificação TLS existe no código servido.

Resultados em `browser-results.json`. Capturas mostram a aplicação reconstruída, não o app nativo. Identidade visual total não foi validada por comparação pixel a pixel.
