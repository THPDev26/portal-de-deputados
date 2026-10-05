const BASE_URL = "https://dadosabertos.camara.leg.br/api/v2";
const DEFAULT_AVATAR = "https://www.camara.leg.br/tema/assets/images/foto-deputado-sem-foto.png";

let paginaAtual = 1;

// Elementos DOM
const grid = document.getElementById("gridDeputados");
const inputNome = document.getElementById("inputNome");
const selectUf = document.getElementById("selectUf");
const btnBuscar = document.getElementById("btnBuscar");
const btnAnterior = document.getElementById("btnAnterior");
const btnProxima = document.getElementById("btnProxima");
const pageIndicator = document.getElementById("pageIndicator");

const modalOverlay = document.getElementById("modalOverlay");
const modalConteudo = document.getElementById("modalConteudo");
const btnFecharModal = document.getElementById("btnFecharModal");

// Buscar Deputados na API
async function carregarDeputados() {
  grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Carregando parlamentares...</p>";
  
  const nome = inputNome.value;
  const uf = selectUf.value;
  
  let url = `${BASE_URL}/deputados?pagina=${paginaAtual}&itens=12&ordem=ASC&ordenarPor=nome`;
  if (nome) url += `&nome=${encodeURIComponent(nome)}`;
  if (uf) url += `&siglaUf=${uf}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    renderizarGrid(data.dados);
  } catch (err) {
    grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: red;'>Erro ao carregar dados.</p>";
  }
}

// Renderizar os Cards
function renderizarGrid(deputados) {
  if (deputados.length === 0) {
    grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Nenhum deputado encontrado.</p>";
    return;
  }

  grid.innerHTML = deputados.map(dep => `
    <div class="card" onclick="carregarDetalhes(${dep.id})">
      <div class="card-bar"></div>
      <img src="${dep.urlFoto || DEFAULT_AVATAR}" class="avatar" alt="${dep.nome}" onerror="this.src='${DEFAULT_AVATAR}'">
      <h3 class="card-title">${dep.nome}</h3>
      <span class="party-tag">${dep.siglaPartido} - ${dep.siglaUf}</span>
      <button class="btn-card">Ver Detalhes</button>
    </div>
  `).join("");

  pageIndicator.innerText = `Página ${paginaAtual}`;
  btnAnterior.disabled = paginaAtual === 1;
  btnProxima.disabled = deputados.length < 12;
}

// Buscar Detalhes e Despesas
async function carregarDetalhes(id) {
  modalOverlay.classList.remove("hidden");
  modalConteudo.innerHTML = "<p>Carregando perfil...</p>";

  try {
    const [resDet, resDesp] = await Promise.all([
      fetch(`${BASE_URL}/deputados/${id}`).then(r => r.json()),
      fetch(`${BASE_URL}/deputados/${id}/despesas?itens=5&ordem=DESC&ordenarPor=dataDocumento`).then(r => r.json())
    ]);

    const dep = resDet.dados;
    const despesas = resDesp.dados;

    modalConteudo.innerHTML = `
      <div style="text-align: center;">
        <img src="${dep.ultimoStatus.urlFoto || DEFAULT_AVATAR}" class="avatar" style="width: 100px; height: 133px;">
        <h2 style="margin: 8px 0 4px;">${dep.ultimoStatus.nome}</h2>
        <p style="margin: 0; color: #64748b; font-size: 0.9rem;">${dep.nomeCivil}</p>
        <p><strong>Partido/UF:</strong> ${dep.ultimoStatus.siglaPartido} - ${dep.ultimoStatus.siglaUf}</p>
        <p><strong>E-mail:</strong> ${dep.ultimoStatus.email || 'Não informado'}</p>
      </div>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;">
      <h4>💸 Últimas Despesas Declaradas</h4>
      <ul style="list-style: none; padding: 0; font-size: 0.85rem;">
        ${despesas.map(d => `
          <li style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 6px 0;">
            <span>${d.tipoDespesa}</span>
            <strong style="color: #dc2626;">R$ ${d.valorDocumento.toFixed(2)}</strong>
          </li>
        `).join("")}
      </ul>
    `;
  } catch (err) {
    modalConteudo.innerHTML = "<p>Erro ao carregar detalhes.</p>";
  }
}

// Eventos
btnBuscar.addEventListener("click", () => { paginaAtual = 1; carregarDeputados(); });
btnAnterior.addEventListener("click", () => { if (paginaAtual > 1) { paginaAtual--; carregarDeputados(); } });
btnProxima.addEventListener("click", () => { paginaAtual++; carregarDeputados(); });
btnFecharModal.addEventListener("click", () => modalOverlay.classList.add("hidden"));

// Inicializar
carregarDeputados();