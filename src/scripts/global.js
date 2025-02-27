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

function resetData() {
    // Exibe a confirmação
    const confirmReset = confirm("Tem certeza que deseja apagar todos os dados?");

    // Se o usuário confirmar, apaga os dados
    if (confirmReset) {
        localStorage.clear();
        alert("Dados apagados!");
        location.reload();
    } else {
        alert("Os dados não foram apagados.");
    }
}

// Função para obter o número de tarefas visíveis, com valor padrão de 6
function getVisibleTasks(pageId) {
    const storedTasks = localStorage.getItem(pageId);
    return storedTasks ? parseInt(storedTasks, 10) : 6; // Valor padrão de 6
}

// Função para salvar o número de tarefas visíveis
function setVisibleTasks(pageId, count) {
    localStorage.setItem(pageId, count);
}

// Função para atualizar a visibilidade das tarefas
function updateVisibleTasks(pageId) {
    const visibleCount = getVisibleTasks(pageId);
    const tasks = document.querySelectorAll(`#${pageId} .tarefa`);
    
    tasks.forEach((task, index) => {
        task.style.display = index < visibleCount ? 'block' : 'none';
    });
}

// Quando o botão de definir número de tarefas for clicado
document.querySelector('.define-number-tasks').addEventListener('click', function() {
    const pageId = document.querySelector('.tarefa-lista').id; // ID único para a div da lista de tarefas
    const currentVisibleTasks = getVisibleTasks(pageId);

    // Pergunta ao usuário quantas tarefas ele deseja ver (entre 1 e 9)
    const newVisibleCount = prompt('Quantas tarefas você quer ver? (Entre 1 e 9)', currentVisibleTasks);

    const count = parseInt(newVisibleCount, 10);

    // Verifica se o valor está entre 1 e 9
    if (!isNaN(count) && count >= 1 && count <= 9) {
        setVisibleTasks(pageId, count);
        updateVisibleTasks(pageId);
    } else {
        alert('Por favor, insira um número entre 1 e 9.');
    }
});

// Atualiza a visibilidade ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const pageId = document.querySelector('.tarefa-lista').id;
    updateVisibleTasks(pageId);
});















document.addEventListener('DOMContentLoaded', () => {
    // Pega o ID da página atual (da div que contém a lista de tarefas)
    const pageId = document.querySelector('.tarefa-lista').id;

    // Busca as tarefas salvas no localStorage (ou um objeto vazio se não houver dados)
    const storedTasks = JSON.parse(localStorage.getItem('tarefas')) || {};

    // Obtém o número de tarefas visíveis salvas para a página atual
    const visibleTasks = getVisibleTasks(pageId);

    // Exibe no console o ID da página e o número de tarefas visíveis
    console.log(`Página: ${pageId}`);
    console.log(`Tarefas visíveis: ${visibleTasks}`);

    // Seleciona todas as tarefas da página atual
    const tarefas = document.querySelectorAll(`#${pageId} .tarefa`);

    // Percorre cada tarefa e exibe seu título e quantidade de checkboxes visíveis
    tarefas.forEach(tarefa => {
        // Pega o ID da tarefa (atributo data-id de cada elemento .tarefa)
        const id = tarefa.getAttribute('data-id');

        // Busca os dados da tarefa pelo ID no localStorage (ou valores padrão)
        const { title = `Exercise ${id}`, visibleCheckboxes = '4 padrão' } = storedTasks[id] || {};

        // Exibe no console o ID, título e número de checkboxes da tarefa
        console.log(`Tarefa ${id}: Título: "${title}", Checkboxes: ${visibleCheckboxes}`);
    });
});





