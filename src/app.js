const alunos = [];
let editando = null;

function salvar() {
  const form = document.getElementById("form");
  if (!form.reportValidity()) return;

  const aluno = {
    nome: document.getElementById("nome").value,
    idade: Number(document.getElementById("idade").value),
    curso: document.getElementById("curso").value,
    notaFinal: Number(document.getElementById("nota").value)
  };

  if (editando === null) {
    alunos.push(aluno);
  } else {
    alunos[editando] = aluno;
  }

  limparFormulario();
  renderizar();
}

function editar(indice) {
  const aluno = alunos[indice];
  document.getElementById("nome").value = aluno.nome;
  document.getElementById("idade").value = aluno.idade;
  document.getElementById("curso").value = aluno.curso;
  document.getElementById("nota").value = aluno.notaFinal;
  document.getElementById("salvar").textContent = "Salvar";
  editando = indice;
}

function excluir(indice) {
  alunos.splice(indice, 1);
  limparFormulario();
  renderizar();
}

function limparFormulario() {
  document.getElementById("form").reset();
  document.getElementById("salvar").textContent = "Cadastrar";
  editando = null;
}

function renderizar() {
  const tabela = document.getElementById("tabela");
  tabela.innerHTML = "";

  for (let i = 0; i < alunos.length; i++) {
    const aluno = alunos[i];
    const linha = document.createElement("tr");

    for (const valor of [aluno.nome, aluno.idade, aluno.curso, aluno.notaFinal]) {
      const celula = document.createElement("td");
      celula.textContent = valor;
      linha.appendChild(celula);
    }

    const acoes = document.createElement("td");
    acoes.innerHTML = `<button type="button" onclick="editar(${i})">Editar</button> <button type="button" onclick="excluir(${i})">Excluir</button>`;
    linha.appendChild(acoes);

    tabela.appendChild(linha);
  }
}
