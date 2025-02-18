const botaoAdicionarTarefa = document.querySelector('.app__button--add-task');
const formularioAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const botaoCancelarTarefa = document.querySelector('.app__form-footer__button--cancel');
const paragraDescricaoTarefa = document.querySelector('.app__section-active-task-description');

const botaoRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const botaoRemoverTodasTarefas = document.querySelector('#btn-remover-todas');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');

    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `

    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description');
    paragrafo.textContent = tarefa.descricao;

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        ///debugger
        const novaDesscricao = prompt("Qual é o novo nome da tarefa?");
        //console.log("Nova descrição da tarefa: ", novaDesscricao)
        if (novaDesscricao) {
            paragrafo.textContent = novaDesscricao;
            tarefa.descricao = novaDesscricao;
            atualizarTarefas();
        }
    }

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', '/imagens/edit.png');
    botao.append(imagemBotao);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active').forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active');
            });
            if (tarefaSelecionada == tarefa) {
                paragraDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return
            }
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li;
            paragraDescricaoTarefa.textContent = tarefa.descricao;

            li.classList.add('app__section-task-list-item-active');
        }
    }

    return li;
}


const limparFormulario = () => {
    formularioAdicionarTarefa.classList.toggle('hidden');
    textArea.value = '';
}

botaoAdicionarTarefa.addEventListener('click', () => {
    limparFormulario();
});

botaoCancelarTarefa.addEventListener('click', limparFormulario);

formularioAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    limparFormulario();

});


tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
})


document.addEventListener('focoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
})

const removerTarefas = (somenteCompletas) => {

    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    document.querySelectorAll(seletor).forEach(elemento => {
        //verifica se há algum elemento ativo a ser removido e se verdadeiro limpa a descrição da tarefa ativa
        if(elemento.classList.contains("app__section-task-list-item-active")) {
            elemento.remove();
            paragraDescricaoTarefa.textContent = '';
        }
        else{
            elemento.remove();
        }
    });

    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();
};

botaoRemoverConcluidas.onclick = () => removerTarefas(true);

botaoRemoverTodasTarefas.onclick = () => removerTarefas(false);
