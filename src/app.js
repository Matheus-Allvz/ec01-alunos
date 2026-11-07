const alunos = [];
let editando = null;
let relatorioAtual = null;

const $ = id => document.getElementById(id);

const lerFormulario = () => new Aluno($("nome").value, Number($("idade").value), $("curso").value, Number($("nota").value));

const preencherFormulario = aluno => {
  $("nome").value = aluno.nome;
  $("idade").value = aluno.idade;
  $("curso").value = aluno.curso;
  $("nota").value = aluno.notaFinal;
};

const limparFormulario = () => {
  $("form").reset();
  $("salvar").textContent = "Cadastrar";
  editando = null;
};

const adicionar = aluno => alunos.push(aluno);
const atualizar = (indice, aluno) => alunos.splice(indice, 1, aluno);
const remover = indice => alunos.splice(indice, 1)[0];

const media = valores => valores.length ? (valores.reduce((soma, valor) => soma + valor, 0) / valores.length).toFixed(2) : "0";

const relatorios = {
  aprovados: () => alunos.filter(aluno => aluno.isAprovado()).map(aluno => aluno.toString()),
  mediaNotas: () => [`Média das notas finais: ${media(alunos.map(aluno => aluno.notaFinal))}`],
  mediaIdades: () => [`Média das idades: ${media(alunos.map(aluno => aluno.idade))}`],
  nomes: () => alunos.map(aluno => aluno.nome).sort((a, b) => a.localeCompare(b)),
  porCurso: () => [...$("curso").options].map(opcao => `${opcao.value}: ${alunos.filter(aluno => aluno.curso === opcao.value).length}`)
};

const exibirRelatorio = () => {
  if (!relatorioAtual) return;
  const linhas = relatorios[relatorioAtual]();
  $("relatorio").textContent = linhas.length ? linhas.join("\n") : "Nenhum aluno encontrado.";
};

const criarBotao =(texto, aoClicar) => {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = texto;
  botao.addEventListener("click", aoClicar);
  return botao;
};

const renderizar = () => {
  const tabela = $("tabela");
  tabela.innerHTML = "";

  alunos.forEach((aluno, indice) => {
    const linha = document.createElement("tr");

    [aluno.nome, aluno.idade, aluno.curso, aluno.notaFinal, aluno.isAprovado() ? "Aprovado" : "Reprovado"].forEach(valor => {
      const celula = document.createElement("td");
      celula.textContent = valor;
      linha.appendChild(celula);
    });

    const editar = criarBotao("Editar", function () {
      preencherFormulario(aluno);
      $("salvar").textContent = "Salvar";
      editando = indice;
    });

    const excluir = criarBotao("Excluir", function () {
      const removido = remover(indice);
      limparFormulario();
      renderizar();
      alert(`Aluno excluído: ${removido}`);
    });

    const acoes = document.createElement("td");
    acoes.append(editar, " ", excluir);
    linha.appendChild(acoes);

    tabela.appendChild(linha);
  });

  exibirRelatorio();
};

document.querySelectorAll("[data-relatorio]").forEach(botao => {
  botao.addEventListener("click", function () {
    relatorioAtual = this.dataset.relatorio;
    exibirRelatorio();
  });
});

$("salvar").addEventListener("click", function () {
  if (!$("form").reportValidity()) return;
  const aluno = lerFormulario();
  const mensagem = editando === null ? "Aluno cadastrado" : "Aluno editado";

  if (editando === null) {
    adicionar(aluno);
  } else {
    atualizar(editando, aluno);
  }

  limparFormulario();
  renderizar();
  alert(`${mensagem}: ${aluno}`);
});
