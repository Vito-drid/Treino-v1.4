const cronometro = document.getElementById('cronometro');
const checkboxes = document.querySelectorAll('.checkbox-serie');
let minutos = 0, segundos = 0, milissegundos = 0;
let intervalo;
let proximoCheckbox = 0;
let cronometroAtivo = false; // Verifica se o cronômetro está ativo - linha 6

function formatarNumero(num, tamanho) {
    return num.toString().padStart(tamanho, '0');
}

function iniciarCronometro() {
    intervalo = setInterval(() => {
        milissegundos++;
        if (milissegundos >= 100) {
            milissegundos = 0;
            segundos++;
        }
        if (segundos >= 60) {
            segundos = 0;
            minutos++;
        }

        cronometro.textContent = `${formatarNumero(minutos, 2)}:${formatarNumero(segundos, 2)}:${formatarNumero(milissegundos, 2)}`;
    }, 10);
}

function resetarCronometro() {
    clearInterval(intervalo);
    minutos = 0;
    segundos = 0;
    milissegundos = 0;
    cronometro.textContent = "00:00:00";
    cronometroAtivo = false; // Reseta a flag do cronômetro
}

document.body.addEventListener('keydown', (e) => {
    // Impede o comportamento padrão (rolar a página) quando a barra de espaço é pressionada - linha 38
    if (e.code === 'Space') {
        e.preventDefault();

        if (cronometroAtivo) {
            // Se o cronômetro já estiver ativo e a barra de espaço for pressionada, reseta e reinicia
            resetarCronometro();
            iniciarCronometro();
            cronometroAtivo = true;
        } else {
            // Caso o cronômetro não esteja ativo, apenas inicia
            iniciarCronometro();
            cronometroAtivo = true;
        }

        // Avança para a próxima checkbox visível
        while (proximoCheckbox < checkboxes.length && checkboxes[proximoCheckbox].parentElement.style.display === "none") {
            proximoCheckbox++;
        }

        if (proximoCheckbox < checkboxes.length) {
            checkboxes[proximoCheckbox].checked = true; // Marca a checkbox
            proximoCheckbox++;
        }

        if (proximoCheckbox >= checkboxes.length) {
            clearInterval(intervalo); // Para o cronômetro quando todas as checkboxes são marcadas
        }
    }
});

// Adiciona o evento de clique no botão com a classe "cronometro-reset-btn" - linha 69
document.querySelector('.cronometro-reset-btn').addEventListener('click', () => {
    if (cronometroAtivo) {
        // Se o cronômetro já estiver ativo e o botão for pressionado, reseta e reinicia
        resetarCronometro();
        iniciarCronometro();
        cronometroAtivo = true;
    } else {
        // Caso o cronômetro não esteja ativo, apenas inicia
        iniciarCronometro();
        cronometroAtivo = true;
    }

    // Avança para a próxima checkbox visível
    while (proximoCheckbox < checkboxes.length && checkboxes[proximoCheckbox].parentElement.style.display === "none") {
        proximoCheckbox++;
    }

    if (proximoCheckbox < checkboxes.length) {
        checkboxes[proximoCheckbox].checked = true; // Marca a checkbox
        proximoCheckbox++;
    }

    if (proximoCheckbox >= checkboxes.length) {
        clearInterval(intervalo); // Para o cronômetro quando todas as checkboxes são marcadas
    }
});


// Função para alterar a visibilidade das checkboxes - linha 98
function updateCheckboxVisibility(checkboxes, count) {
    checkboxes.forEach((checkbox, index) => {
        if (index < count) {
            checkbox.parentElement.style.display = 'block'; // Torna a label visível
            checkbox.disabled = false; // Habilita a checkbox
        } else {
            checkbox.parentElement.style.display = 'none'; // Torna a label invisível
            checkbox.disabled = true; // Desabilita a checkbox
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const tarefas = document.querySelectorAll('.tarefa');

    tarefas.forEach(tarefa => {
        const id = tarefa.getAttribute('data-id');
        const titleElement = tarefa.querySelector('.exercice-title');
        const checkboxes = tarefa.querySelectorAll('.checkbox-serie');
        const editTitleBtn = tarefa.querySelector('.edit-task-title');
        const editCheckBtn = tarefa.querySelector('.edit-task-check');

        // Carregar dados do localStorage
        const storedData = JSON.parse(localStorage.getItem('tarefas')) || {};
        if (storedData[id]) {
            titleElement.textContent = storedData[id].title || titleElement.textContent; // Verifica se o título existe
            const visibleCheckboxes = storedData[id].visibleCheckboxes || 4; // Valor padrão se não houver
            updateCheckboxVisibility(checkboxes, visibleCheckboxes);
        } else {
            // Se não houver dados, inicializar com 4 checkboxes visíveis
            updateCheckboxVisibility(checkboxes, 4);
        }

        // Editar título
        editTitleBtn.addEventListener('click', () => {
            const newTitle = prompt("Digite o novo título:", titleElement.textContent);
            if (newTitle) {
                titleElement.textContent = newTitle;
                saveToLocalStorage(id, { title: newTitle }); // Salva o título junto com os outros dados
            }
        });

        // Editar quantidade de checkboxes
        editCheckBtn.addEventListener('click', () => {
            const newCount = parseInt(prompt("Quantos checkboxes você deseja exibir? (1-8)", 4));
            if (newCount >= 1 && newCount <= 8) {
                updateCheckboxVisibility(checkboxes, newCount);
                saveToLocalStorage(id, { visibleCheckboxes: newCount }); // Salva também a quantidade de checkboxes visíveis
            }
        });

        // Função para alternar a visibilidade dos botões de edição - linha 150
        const taskConfigBtns = tarefa.querySelectorAll('.task-config-btn');
        taskConfigBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const editTaskBtns = this.closest('.tarefa').querySelector('.edit-task-btn');
                editTaskBtns.style.display = (editTaskBtns.style.display === 'none' || editTaskBtns.style.display === '') ? 'block' : 'none';
            });
        });
    });

    function saveToLocalStorage(id, data) {
        const storedData = JSON.parse(localStorage.getItem('tarefas')) || {};
        storedData[id] = { ...storedData[id], ...data }; // Mescla os dados existentes com os novos
        localStorage.setItem('tarefas', JSON.stringify(storedData));
    }
});


function toggleSlider() {
    const slider = document.querySelector('.slider');

    // Alterna a visibilidade da div slider - linha 172
    if (slider.style.display === "none" || slider.style.display === "") {
        slider.style.display = "block"; // Torna a div visível
    } else {
        slider.style.display = "none"; // Torna a div invisível
    }
}

//localStorage.clear()