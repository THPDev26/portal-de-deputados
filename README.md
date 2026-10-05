# Portal de Deputados Federais — Alternativa B

Aplicação web desenvolvida em Java (Backend HTTP Server) e Front-end moderno para consulta, filtragem e detalhamento de dados dos Deputados Federais em exercício, consumindo a API de Dados Abertos da Câmara dos Deputados.

## 🛠️ Tecnologias Utilizadas e Justificativa
- **Java (Java SE 11+ / HTTP Server & HttpClient):** Utilizado para construir um servidor HTTP leve de arquivos estáticos e atuar como intermediário (Proxy HTTP) na consulta aos endpoints REST da Câmara dos Deputados.
- **HTML5, CSS3 & JavaScript (ES6+):** Utilizados para criar uma interface de usuário responsiva, modular e interativa com buscas dinâmicas, filtros por partido/UF e visualização detalhada em modal.

## 🌐 Endereços e Fontes de Dados Consumidas
- **Listagem de Deputados:** `https://dadosabertos.camara.leg.br/api/v2/deputados`
- **Detalhes do Parlamentar:** `https://dadosabertos.camara.leg.br/api/v2/deputados/{id}`
- **Despesas do Parlamentar:** `https://dadosabertos.camara.leg.br/api/v2/deputados/{id}/despesas`

## 🔑 Campos Utilizados
- `id`, `nome`, `siglaPartido`, `siglaUf`, `urlFoto`: Exibidos nos cards de listagem geral.
- `nomeCivil`, `email`, `gabinete`: Exibidos na visualização detalhada do modal.
- `tipoDespesa`, `dataDocumento`, `valorDocumento`: Utilizados para renderizar o histórico recente de gastos.

## 🚀 Como Executar a Aplicação em Java
1. Compile a aplicação Java:
   ```bash
   javac Main.java