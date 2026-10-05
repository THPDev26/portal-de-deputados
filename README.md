# Portal de Deputados Federais — Alternativa B

Aplicação web desenvolvida para consulta, filtragem e detalhamento de dados dos Deputados Federais em exercício, consumindo a API de Dados Abertos da Câmara dos Deputados.

## 🛠️ Tecnologias Utilizadas e Justificativa
- **HTML5 & CSS3:** Interface estruturada e responsiva, com estilização moderna baseada em variáveis CSS e flexbox.
- **JavaScript (ES6+):** Utilizado para consumo assíncrono via `fetch`, manipulação do DOM e gestão do estado dos filtros e paginação.

## 🌐 Endereços e Fontes de Dados Consumidas
- **Listagem de Deputados:** `https://dadosabertos.camara.leg.br/api/v2/deputados`
- **Detalhes do Parlamentar:** `https://dadosabertos.camara.leg.br/api/v2/deputados/{id}`
- **Despesas do Parlamentar:** `https://dadosabertos.camara.leg.br/api/v2/deputados/{id}/despesas`

## 🔑 Campos Utilizados
- `id`, `nome`, `siglaPartido`, `siglaUf`, `urlFoto`: Exibidos nos cards de listagem geral.
- `nomeCivil`, `email`, `gabinete`: Exibidos na visualização detalhada do modal.
- `tipoDespesa`, `dataDocumento`, `valorDocumento`: Utilizados para renderizar o histórico recente de gastos.

## ⚠️ Limitações Conhecidas e Avisos
- A consulta retorna apenas os deputados federais cadastrados na legislatura atual da API.
- **Nota de Isenção:** Esta aplicação **não apresenta nem declara parlamentares como eleitos em 2026**, limitando-se a exibir a composição em exercício consultada em tempo real.