// file storage
const exercicioStorageAdd = (payload) => {
    const base = exercicioStorageGetAll();
    base.push(payload)
    localStorage.setItem("treino-exercicios", JSON.stringify(base))
}
const exercicioStorageUpdate = (array) => {
    localStorage.setItem("treino-exercicios", JSON.stringify(array))
}
const exercicioStorageGetAll = () => {
    return JSON.parse(localStorage.getItem("treino-exercicios") || "[]");
}

// elements
const $todoList = $("#to-do .task-list");
const $onProgressList = $("#on-progress .task-list");
const $doneList = $("#done .task-list");
const $todoContainer = $("#to-do");
const $cardTask = $(".card-task");
var exercicioSelecionado = "";

//btns
const $btnSave = $("#btn-save");
const $btnUpdateTask = $("#btn-update-task");

//inputs
const $campoExercicioNome = $("#campo-exercicio-nome");
const $campoExercicioDescricao = $("#campo-exercicio-descricao");

const $modal = $("#modal");
const $modalCreateProject = $("#createProjectModal");

const $errorMessage = $("#error-message");

//day { 0: a fazer, 1: em andamento, 2: concluido}
const taskStatus = ["to-do", "on-progress", "done"]

//cria e retorna uma nova task


const isValid = () => {
    const exercicios = exercicioStorageGetAll();
    if(exercicios.length < 1)
        return true;

    if(exercicios.map(a => a.title).includes($campoExercicioNome.val())) {
        $errorMessage.removeClass("d-none");
        $errorMessage.text("Este exercicio já existe");
    }
    console.log($errorMessage.attr("class"))
    return $errorMessage.attr("class") === "d-none"
}


// reloads
const reloadCards = () => {
    //adicionando as fila dos "a fazer"
    const exercicios = exercicioStorageGetAll();
    $(".list").empty();

    if(exercicios.length > 0) {
        exercicios.forEach(t => {
            let newItem = newCard(t);
            console.log(t)
            console.log($("#"+t.day+" .list"))
            //continuar aqui
            $("#"+t.day+" .list").append(newItem);
        });
    }
}

//creates
const criarExercicio = () => {
    const exercicios = exercicioStorageGetAll();
    const novoExercicio = {
        id: exercicios.length,
        title: $campoExercicioNome.val(),
        description: $campoExercicioDescricao.val(),
        day: "segunda"
    };

    exercicioStorageAdd(novoExercicio);
    
    $campoExercicioNome.val("");
    $campoExercicioDescricao.val("");
    $modal.modal("hide");
    reloadCards();
}

const newCard = (task) => {
    const containerComp = document.createElement("div");
    containerComp.className = "card";
    containerComp.id = task.id;
    containerComp.draggable = true;
    const titleComp = document.createElement("p");
    titleComp.innerText = task.title;
    // const descriptionComp = document.createElement("p");
    // descriptionComp.innerText = task.description;

    containerComp.appendChild(titleComp);
    // containerComp.appendChild(descriptionComp);

    containerComp.addEventListener("click", (event) => {
        const target = event.target.id;
        if(target != "") {
            const currentTask = exercicioStorageGetAll().find(x => x.id == target);
            const detailsModal = $("#modal");
            detailsModal.modal('show');
            exercicioSelecionado = currentTask.id;
            // detailsModal.find("b#modal-task-title").text(currentTask.title);

            $campoExercicioNome.val(currentTask.title)
            $campoExercicioDescricao.val(currentTask.description)
        }
    })

    return containerComp;
}


//update task
const atualizarExercicio = () => {
    const desc = $campoExercicioDescricao.val();

    let exercicios = exercicioStorageGetAll();
    exercicios.forEach(x => {
        if(x.id === exercicioSelecionado) {
            x.description = desc;
        }
    })

    $("#modal").modal('hide');
    exercicioStorageUpdate(exercicios);

    reloadCards();
}

// drag and drop
const columns = document.querySelectorAll(".list");

document.addEventListener("dragstart", (e) => {
  e.target.classList.add("dragging");
});

document.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
    const exercicios = exercicioStorageGetAll();
    exercicios.forEach(x => {
        if(x.id == e.target.id) {
            x.day = e.target.parentElement.parentElement.id
        }
  }) //ver se isso aqui vai ser necessario depois
  exercicioStorageUpdate(exercicios);
});

columns.forEach((item) => {
    item.addEventListener("dragover", (e) => {
        const dragging = document.querySelector(".dragging");
        const applyAfter = getNewPosition(item, e.clientY);
        
        if (applyAfter) {
            applyAfter.insertAdjacentElement("afterend", dragging);
        } else {
            item.prepend(dragging);
    }
});
});

function getNewPosition(column, posY) {
  const cards = column.querySelectorAll(".card:not(.dragging)");
  let result;
  
  for (let refer_card of cards) {
      const box = refer_card.getBoundingClientRect();
      const boxCenterY = box.y + box.height / 2;
      
      if (posY >= boxCenterY) result = refer_card;
    }
    
    return result;
}

// end - drag and drop

const init = () => {
    //on changes
    $campoExercicioNome.on("keydown", (e) => {
        $errorMessage.addClass("d-none");
        if(e.key === "Enter" && isValid()) {
            if(true) criarExercicio();
            else atualizarExercicio()
        }
    })
    
    
    // $selProject.on("change", () => {
    //     reloadCards();
    // })

    // confirmação de modal
    $btnSave.click(() => {
        if(isValid()) {
            if(true) criarExercicio();
            else atualizarExercicio()
        }
    });

    reloadCards();
}

// Shorthand for $( document ).ready()
$(function() {
    init()
});