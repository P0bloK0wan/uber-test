# Uber — reconstrução web com REA

Aplicação web independente, responsiva que pode ser publicada em qualquer hospedagem estática. A análise com REA/JADX e a pesquisa de referências orientaram a implementação. Viagens, catálogo, pedidos e pagamentos são demonstrações locais; não existe conexão com os serviços da empresa.

- Origem/destino em São Paulo; estimativas por UberX, Comfort e Black.
- Reserva futura, pagamento simulado, solicitação, acompanhamento e cancelamento.
- Histórico, avaliação, locais salvos e persistência local.
- Fontes Uber Move/Text, pulso original, mapa OpenStreetMap e seleção de categoria com expansão animada de 300 ms.

## Executar

```bash
npm start
```

Abra http://localhost:3000. Requer Python 3 para o servidor. Não há dependências npm de execução ou etapa de compilação: `dist/` contém o código-fonte editável e os arquivos servidos. A configuração em `dist/config.js` limita a experiência a Uber. Os dois projetos usam o mesmo motor de interface e modelos; os recursos de mídia específicos da outra aplicação não são incluídos.

## Verificar

```bash
npm run check
npm test
python3 -m pip install -r requirements-test.txt
python3 -m playwright install chromium
# Com npm start rodando em outro terminal:
TEST_OUTPUT=verification-local npm run test:browser
```

`BASE_URL` permite testar outra porta. `CHROMIUM_PATH` seleciona um navegador instalado. Os testes cobrem os fluxos principais, telas de 360/390/1440 px, persistência, erros JavaScript, movimento reduzido e integridade SHA-256 dos JSONs originais. `verification/` guarda os resultados e imagens desta entrega. A rede deste ambiente de desenvolvimento exigiu `ALLOW_TEST_PROXY_CERT=1` para validar tiles externos atrás do proxy; essa opção existe apenas nos testes e não modifica o aplicativo.

## Movimento e fidelidade

Acesse **Perfil/Conta → Animações originais** para revisar os recursos recuperados. O player mantém os arquivos, frames e velocidade 1×. A preferência de movimento reduzido é respeitada. O manifesto em `dist/assets/motion/manifest.json` registra origem, hash, FPS e duração.

As telas completas dos APKs truncados não puderam ser executadas. Campanhas, produtos, ícones não recuperados e transições entre telas continuam sendo adaptações. Não há promessa de identidade pixel a pixel de todas as versões. Consulte [a matriz de fidelidade](docs/fidelity.md), [a pesquisa de Uber](references/uber/research.md) e [os créditos](NOTICE.md).

## Arquivos

- `dist/`: interface, modelos, configurações, imagens, fontes e players locais.
- `tests/`: testes de modelos, integridade de animações e aceitação no navegador.
- `references/uber/`: fontes pesquisadas, inventário de movimento e capturas públicas de referência.
- `evidence/`: evidências estáticas da análise REA. Os APKs originais permanecem fora deste repositório.
- `docs/`: decisões de implementação e limites verificáveis.
- `verification/`: resultados e capturas da aplicação entregue.

REA original: https://github.com/morluto/rea, commit `69324b0f86cc9a209905831b12a18d43afe3657d`; CLI 6.5.0, JADX 0.7.1. O REA foi uma ferramenta de análise; não é uma dependência necessária para abrir o site.

## Captura da aplicação

![uber no celular](verification/uber-390.png)
