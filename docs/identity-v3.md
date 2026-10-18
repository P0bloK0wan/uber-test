# Identidade visual aplicada — versão 3

A revisão alcança todas as telas dos fluxos implementados, além dos diálogos de produto, sacola, pagamento, reserva, endereço, perfil, ajuda e segurança. A interface foi conferida em 360, 390 e 1440 px. As capturas do motor compartilhado em `verification/identity/` usam perfil, viagens e pedidos fictícios para tornar os estados reproduzíveis.

## Uber

- Wordmark original do repositório oficial Uber/Base Web, com o arquivo preservado e seu espaço transparente ajustado por CSS.
- Uber Move e Uber Move Text, paleta preta/branca/cinza, títulos, navegação inferior, campos e botões próprios da marca.
- Artes distintas de UberX, Comfort, Black e Reserve, obtidas no CDN oficial, sem filtros que transformem um carro em outra categoria.
- Início com busca em cápsula, horário, destinos recentes, sugestões e reserva. Serviços com cartões ilustrados; atividade com miniaturas, histórico e repetição de destino.
- Seleção de categoria com cartão expansível, veículo, estimativa, preço, pagamento e botão de confirmação. Mapa e elementos preservados durante a transição.
- Acompanhamento em cinco estados, cartão de motorista fictício, placa de demonstração, progresso, resumo, contato informativo, segurança e avaliação.
- Conta com avatar, nota ilustrativa, atalhos, carteira, segurança, locais e gerenciamento do perfil.

## iFood

- Wordmark vetorial e família iFood RC Textos/Títulos. As fontes foram identificadas pelos metadados internos, conferidas com FontTools e preservadas; sua origem é um espelho público, não o APK ou o CDN oficial. Versão interna 0.900, com acentos em português.
- Vermelho `#ea1d2c`, cinzas, branco e roxo do Clube; tipografia aplicada também aos diálogos.
- Início com endereço, Clube, oito categorias, artes de restaurantes/mercados/farmácias/bebidas do CDN oficial, oferta, lojas e filtros. Busca, Hits e favoritos têm composições próprias.
- Restaurante com capa, identidade, avaliação, informações, entrega, cupom e cardápio ancorado. Produto com foto ampla, descrição, adicionais, observação, quantidade e barra fixa de inclusão.
- Sacola com loja, itens, cupom, totais e continuação; finalização com endereço, entrega, opções de pagamento e resumo.
- Pedidos com cartões de histórico; acompanhamento em cinco estados, previsão ilustrativa, progresso, loja, endereço e detalhes.
- Perfil com Clube, notificações, cupons, favoritos, pedidos, pagamento, endereço e dados pessoais.

## Movimento

Os 17 recursos Lottie recuperados permanecem intactos, em velocidade 1×, com FPS e keyframes originais. A seleção Uber mantém expansão de 300 ms; os diálogos móveis entram em 300 ms e saem em 180 ms. Esses tempos da interface web são adaptações fundamentadas nas referências, não uma medição de todas as transições Android. A preferência por movimento reduzido desliga as transições e pausa os players.

## Fontes e verificação

`dist/assets/identity/manifest.json` identifica cada recurso servido, URL de origem, classificação, tamanho e SHA-256. `tests/identity.test.mjs` verifica a integridade. A pesquisa detalhada de cada pacote está em `references/<aplicação>/identity-v3/`; a de fontes e logo do iFood está em `mirrors/` dentro desse diretório.

As composições usam screenshots promocionais oficiais, páginas das marcas e referências públicas. As artes de categorias são das páginas web oficiais; isso não as torna idênticas a todas as versões Android. O catálogo, fotos de restaurantes, campanhas, avatar e motorista são demonstrativos. Os símbolos de navegação sem recurso recuperado e as artes Hits/Turbo/Shopping/Clube são adaptações. Não há validação pixel a pixel de todas as telas ou transições, pois os APKs fornecidos estavam truncados.

Para reproduzir a auditoria: `BASE_URL=http://localhost:3000/ TEST_OUTPUT=verification-local/identity python3 tests/visual_audit.py`. Nos pacotes individuais, acrescente `APP=uber` ou `APP=ifood`. As capturas verificam dimensões, imagens carregadas e erros JavaScript; não são uma comparação automática com o app nativo.
