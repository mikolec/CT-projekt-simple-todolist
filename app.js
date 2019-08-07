// Zmienne globalne

var $list, $mainInput, $addBtn, $modal, $modalContent, $modalInput, $modalOKBtn, $modalCancelBtn, $modalCloseBtn;

var todoList = [];

const url = "http://195.181.210.249:3000/todo/";
DB.init(url, "miko");
// const db = new DB(url, todoList);

function main() {
  prepareDOMElements();
  prepareDOMEvents();
  prepareTodoList();
}

function prepareDOMElements() {
  //przygotowanie- wyszukanie elementów w drzewie DOM
  $list = document.getElementById("list");
  $addBtn = document.querySelector('[rel="js-add-todo-btn"]');
  $mainInput = document.querySelector('[rel="js-todo-input"]');
  $modal = document.querySelector('[rel="js-modal"]');
  $modalContent = $modal.querySelector('[rel="js-modal-content"]');
  $modalInput = $modal.querySelector('[rel="js-modal-input"]');
  $modalOKBtn = $modal.querySelector('[rel="js-modal-ok"]');
  $modalCancelBtn = $modal.querySelector('[rel="js-modal-cancel"]');
  $modalCloseBtn = $modal.querySelector('[rel="js-modal-close"]');
}

function prepareDOMEvents() {
  //przygotowanie listenerów
  $addBtn.addEventListener("click", addButtonClickHandler);
  $list.addEventListener("click", listClickManager);
  $modalOKBtn.addEventListener("click", acceptChangeHandler);
  $modalCancelBtn.addEventListener("click", declineChanges);
  $modalCloseBtn.addEventListener("click", closePopup);
}

function prepareTodoList() {
  //wrzucenie poczatkowych elementów do listy
  DB.readTodos().then(res => {
    todoList = res;
    renderList();
  });
}

function renderList() {
  removeAllElementsFromTodoList();
  todoList.forEach(todo => {
    addNewListElement(todo);
  });
}

function removeAllElementsFromTodoList() {
  while ($list.hasChildNodes()) {
    $list.removeChild($list.lastChild);
  }
}

function addButtonClickHandler() {
  if ($mainInput.value) {
    DB.createTodo({ title: $mainInput.value }).then(() => prepareTodoList());

    $mainInput.value = "";
    $mainInput.focus();
  }
}

function addNewListElement(todo /* Title, author, id */) {
  //obsługa dodawanie elementów do listy
  const newElement = createListElement(todo);
  $list.appendChild(newElement);
}

function createBtn(innerText, className, disabled) {
  var btn = document.createElement("BUTTON");
  btn.innerText = innerText;
  btn.className = className;
  if (disabled) btn.disabled = true;
  return btn;
}

function createListElement(todo) {
  const span = document.createElement("SPAN");
  span.innerText = todo.title;
  const newElement = document.createElement("LI");
  newElement.appendChild(span);
  newElement.id = "todo-" + todo.id;

  newElement.appendChild(createBtn("Delete", "delete"));
  if (todo.completed) {
    newElement.classList.add("checked");
  }
  newElement.appendChild(createBtn("Edit", "edit", todo.completed));
  newElement.appendChild(createBtn("Mark completed", "completed", todo.completed));

  return newElement;
}

function listClickManager(event) {
  var id = getTodoIdFromParentElement(event.target.parentNode.id);
  if (event.target.className === "edit") {
    editListElement(id);
  } else if (event.target.className === "delete") {
    removeListElement(id);
  } else if (event.target.className === "completed") {
    markElementAsDone(id);
  }
}

function getTodoIdFromParentElement(todoId) {
  return todoId.slice(todoId.indexOf("-") + 1);
}

function removeListElement(id) {
  //**usuwanie elementu z bazy */
  DB.deleteTodo(id).then(() => prepareTodoList());
}

function findTodo(id) {
  return todoList.filter(todo => todo.id === +id)[0];
}

function editListElement(id) {
  var todo = findTodo(id);
  addDataToPopup(todo.title, id);
  openPopup();
}

function addDataToPopup(title, id /* Title, author, id */) {
  $modalInput.value = title;
  $modalContent.setAttribute("data-todo-id", id);
}

function acceptChangeHandler() {
  var id = $modalContent.getAttribute("data-todo-id");
  DB.updateTodo({ id: id, title: $modalInput.value }).then(() => prepareTodoList());
  closePopup();
}

function openPopup() {
  $modal.style.display = "block";
}

function closePopup() {
  $modal.style.display = "none";
}

function declineChanges() {
  //niepotrzebna raczej
  $modalInput.value = "";
  $modalContent.removeAttribute("data-todo-id");
  closePopup();
}

function markElementAsDone(id /* id */) {
  //zaznacz element jako wykonany (podmień klasę CSS)
  DB.updateTodo({ id: id, completed: true }).then(() => {
    prepareTodoList();
  });
}

document.addEventListener("DOMContentLoaded", main);

// var todo = {
//   title: "test_04",
//   author: "miko",
//   description: encodeURI("AAAA opis zawierający polskie znaki ŁÓDŹ"),
//    priority: 1,
//   completed: true,
//   url: encodeURI("https://www.youtube.com/watch?v=1NRnMNcl1uE"),
//   parent_id: 11
// };
