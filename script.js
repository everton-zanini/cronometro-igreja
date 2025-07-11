let etapas = [];
let etapaAtualIndex = 0;
let tempoRestante = 0;
let intervalo = null;
let pausado = false;

function adicionarEtapa() {
  const nome = document.getElementById('nomeEtapa').value.trim();
  const duracao = parseInt(document.getElementById('duracaoEtapa').value);

  if (nome && duracao > 0) {
    etapas.push({ nome, duracao });
    document.getElementById('nomeEtapa').value = '';
    document.getElementById('duracaoEtapa').value = '';
    atualizarDisplay();
    atualizarListaFixa();
  }
}

function iniciarCronometro() {
  if (etapas.length === 0 || etapaAtualIndex >= etapas.length) return;

  pausado = false;
  tempoRestante = etapas[etapaAtualIndex].duracao * 60;
  atualizarDisplay();

  if (intervalo) clearInterval(intervalo);
  intervalo = setInterval(() => {
    if (!pausado) {
      tempoRestante--;
      atualizarDisplay();
      if (tempoRestante <= 0) {
        etapaAtualIndex++;
        if (etapaAtualIndex < etapas.length) {
          tempoRestante = etapas[etapaAtualIndex].duracao * 60;
        } else {
          clearInterval(intervalo);
          document.getElementById('etapaAtual').innerText = "Fim das etapas";
          document.getElementById('tempoRestante').innerText = "00:00";
        }
      }
    }
  }, 1000);
}

function pausarOuRetomar() {
  pausado = !pausado;
  atualizarDisplay();
}

function reiniciarCronometro() {
  clearInterval(intervalo);
  etapaAtualIndex = 0;
  tempoRestante = 0;
  pausado = false;
  atualizarDisplay();
}

function limparLista() {
  clearInterval(intervalo);
  etapas = [];
  etapaAtualIndex = 0;
  tempoRestante = 0;
  pausado = false;
  document.getElementById('listaFixa').innerHTML = "";
  atualizarDisplay();
}

function atualizarDisplay() {
  const minutos = Math.floor(tempoRestante / 60).toString().padStart(2, '0');
  const segundos = (tempoRestante % 60).toString().padStart(2, '0');
  document.getElementById('tempoRestante').innerText = `${minutos}:${segundos}`;

  if (etapas[etapaAtualIndex]) {
    document.getElementById('etapaAtual').innerText =
      pausado ? `${etapas[etapaAtualIndex].nome} (Pausado)` : etapas[etapaAtualIndex].nome;
  } else {
    document.getElementById('etapaAtual').innerText = "Aguardando etapas...";
  }

  atualizarListasLaterais();
  atualizarListaFixa();
}

function atualizarListasLaterais() {
  const concluidasDiv = document.getElementById('etapasConcluidas');
  const proximasDiv = document.getElementById('proximasEtapas');

  concluidasDiv.innerHTML = "<strong>Concluídas:</strong>";
  for (let i = 0; i < etapaAtualIndex; i++) {
    concluidasDiv.innerHTML += `<span>✔️ ${etapas[i].nome}</span>`;
  }

  proximasDiv.innerHTML = "<strong>Próximas:</strong>";
  for (let i = etapaAtualIndex + 1; i < etapas.length; i++) {
    proximasDiv.innerHTML += `<span>🔜 ${etapas[i].nome}</span>`;
  }
}

function atualizarListaFixa() {
  const listaDiv = document.getElementById('listaFixa');
  if (etapas.length === 0) {
    listaDiv.innerHTML = "<em>Nenhuma etapa adicionada</em>";
    return;
  }
  listaDiv.innerHTML = "<strong>Sequência atual:</strong><br>";
  etapas.forEach((etapa, i) => {
    listaDiv.innerHTML += `<span>${i + 1}. ${etapa.nome} - ${etapa.duracao} min</span><br>`;
  });
}

function toggleMenu() {
  document.getElementById('sidebar').classList.toggle('ativo');
}
