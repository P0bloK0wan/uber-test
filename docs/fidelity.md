# Fidelidade e limites verificáveis — 18/10/2026

O REA foi usado para analisar os APKs fornecidos, recuperar entradas completas e identificar versões e recursos. Os dois arquivos estavam truncados: não permitem executar todos os fluxos do aplicativo Android nem observar suas telas completas. A reconstrução web mantém viagens, pedidos, pagamentos e motoristas como simulações locais, sem acesso aos serviços das empresas.

## O que está preservado

- Os JSONs em `dist/assets/motion/` são cópias byte a byte dos recursos completos recuperados. O manifesto registra SHA-256, FPS, intervalo de frames, dimensões e duração. Os testes comparam os arquivos com esse registro.
- O player Lottie 5.13.0 usa os keyframes originais, velocidade padrão 1× e `setSubframe(false)`. Não há recoloração ou mudança de velocidade. O navegador pode perder frames conforme o dispositivo; o APK poderia escolher segmentos ou velocidades diferentes, algo que não foi observado em execução.
- iFood: abertura com 90 frames a 30 fps (3 segundos); indicador de carregamento; cupom; favoritos; feed e barra de progresso. Os dois últimos também estão disponíveis na galeria do perfil.
- Uber: pulso de localização, indicadores, confirmação, relógio, escudo, PIN e rastreador. Todos estão disponíveis na galeria; somente recursos pertinentes são usados nos fluxos. A posição contextual na web é uma decisão de implementação, não uma prova de que o Android os utiliza na mesma tela.
- Uber Move e Uber Move Text vieram do site oficial Uber Design. URLs e metadados estão no relatório de pesquisa. A licença do código da aplicação não se estende a marcas, fontes ou mídia de terceiros.

## O que foi reconstruído a partir de referências

| Área | Evidência | Aplicação web | Limite |
| --- | --- | --- | --- |
| iFood home | Screenshots promocionais oficiais da Play Store | Endereço central, Clube roxo, grade 2×4 e cinco abas | Campanhas, fotos, catálogo e ilustrações não são idênticos; a fonte nativa não foi recuperada |
| Uber categoria | Gravação pública do app iOS no 60fps | Cartão expande/recolhe em 300 ms e mantém mapa/DOM | Medida observada de 250–350 ms; não é uma especificação Android |
| Uber fontes/movimento | Uber Design e código oficial Base Web | Fontes originais e easing `cubic-bezier(.22,1,.36,1)` | Tokens de web não comprovam todas as curvas nativas |
| Painéis e navegação | Referências visuais e comportamento web | Painéis inferiores, entrada de 300 ms e saída de 180 ms | Tempos escolhidos para a adaptação, sem medida nativa correspondente |
| Mapa | OpenStreetMap e OSRM | Ruas reais, pontos locais e oito trajetos pré-calculados saindo da Paulista | Não é o mapa proprietário da Uber; outras combinações mostram pontos sem inventar um trajeto viário |

A galeria “Animações originais”, no perfil, permite revisar os arquivos e suas durações. A preferência do sistema por movimento reduzido tem prioridade: animações mostram um frame estático e transições são desativadas. A abertura do iFood roda uma vez por sessão e pode ser pulada ou revista pelo perfil.

Não há evidência suficiente para afirmar identidade pixel a pixel de todas as telas, gestos e transições. Para essa validação seriam necessárias capturas/gravações da mesma versão, plataforma, região e estados do app original. Os relatórios de pesquisa distinguem fonte oficial, gravação de terceiros, metadados originais e decisões de implementação.

## Fontes principais

- [REA](https://github.com/morluto/rea), commit `69324b0f86cc9a209905831b12a18d43afe3657d` e CLI 6.5.0, JADX 0.7.1.
- [Uber Design](https://www.uber.design/).
- [Base Web — animation.ts](https://github.com/uber/baseweb/blob/ed21081e33f7db2770922b4e04d16dcf5bbdfa85/src/themes/shared/animation.ts).
- [Gravações públicas do Uber no 60fps](https://60fps.design/apps/uber), iOS/Índia, data e versão desconhecidas.
- [iFood na Google Play](https://play.google.com/store/apps/details?hl=pt_BR&id=br.com.brainweb.ifood), screenshots promocionais consultados em 18/10/2026.
- [IFDS — engenharia e arquitetura](https://tech.ifood.com.br/en/front-end/ifds-por-dentro-dos-padroes-de-engenharia-e-arquitetura-de-componentes-do-ifood-design-system/), sem tempos numéricos de transição confirmados.
