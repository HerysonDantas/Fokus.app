const html = document.querySelector('html');
const botaoFoco = document.querySelector('.app__card-button--foco');
const botaoDescansoCurto = document.querySelector('.app__card-button--curto');
const botaoDescansoLongo = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const botaoStartPause = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica');
const textoBotaoStartPause = document.querySelector('#start-pause span');
const iconeIniciarPausar = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector("#timer");

const musica = new Audio('sons/luna-rise-part-one.mp3');
const somBotaoIniciarContagem = new Audio('sons/play.wav');
const somBotaoPausarContagem = new Audio('sons/pause.mp3');
const somFimDaContagem = new Audio('sons/beep.mp3');



let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;

musica.loop = true;
somBotaoIniciarContagem.loop, somBotaoPausarContagem.loop, somFimDaContagem.loop = false;

musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    }
    else {
        musica.pause();
    }
});



const displayTempo = document.querySelector('#timer');


const duracaoFoco = 1500;
const duracaoDescansoCurto = 300;
const duracaoDescansoLongo = 900;

botaoFoco.addEventListener('click', () => {
    tempoDecorridoEmSegundos = duracaoFoco;
    alterarContexto('foco');
    botaoFoco.classList.add('active');
})

botaoDescansoCurto.addEventListener('click', () => {
    tempoDecorridoEmSegundos = duracaoDescansoCurto;
    alterarContexto('descanso-curto');
    botaoDescansoCurto.classList.add('active');
})

botaoDescansoLongo.addEventListener('click', () => {
    tempoDecorridoEmSegundos = duracaoDescansoLongo;
    alterarContexto('descanso-longo');
    botaoDescansoLongo.classList.add('active');
})

function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    });
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`;
            break;

        case "descanso-curto":
            titulo.innerHTML = `Que tal dar uma respirada?<br>
                    <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            break;

        case "descanso-longo":
            titulo.innerHTML = `Hora de voltar à superfície.<br>
                    <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        somFimDaContagem.play();
        // alert('Tempo esgotado');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo){
            const evento = new CustomEvent('focoFinalizado');
            document.dispatchEvent(evento);
        }


        zerarIntervalo();
        textoBotaoStartPause.textContent = "Reiniciar";
        switch (html.getAttribute('data-contexto')) {
            case "foco":
                tempoDecorridoEmSegundos = duracaoFoco;
                mostrarTempo();
                break;
    
            case "descanso-curto":
                tempoDecorridoEmSegundos = duracaoDescansoCurto;
                mostrarTempo();
                break;
    
            case "descanso-longo":
                tempoDecorridoEmSegundos = duracaoDescansoLongo;
                mostrarTempo();
                break;
            default:
                break;
        }
        return
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

botaoStartPause.addEventListener("click", iniciarOuPausarContagem)

function iniciarOuPausarContagem() {
    if (intervaloId) {
        somBotaoPausarContagem.play();
        zerarIntervalo();
        return;
    }
    somBotaoIniciarContagem.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    textoBotaoStartPause.textContent = "Pausar";
    iconeIniciarPausar.setAttribute("src", "/imagens/pause.png");
}


function zerarIntervalo() {
    clearInterval(intervaloId);
    textoBotaoStartPause.textContent = "Começar";
    iconeIniciarPausar.setAttribute("src", "/imagens/play_arrow.png");
    intervaloId = null;

}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos*1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-pt', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();