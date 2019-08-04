// Zmienne globalne

var $list, $mainInput, $addBtn, $modal, $modalContent, $modalInput, $modalOKBtn, $modalCancelBtn, $modalCloseBtn;

var todoList = [];

const url = "http://195.181.210.249:3000/todo/";
const db = new DB(url, todoList);

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
  // ** do pobrania lista z bazy
  db.getTodos(renderList);
}

function addButtonClickHandler() {
  if ($mainInput.value) {
    db.addNewTodo({ title: $mainInput.value }, prepareTodoList);

    $mainInput.value = "";
    $mainInput.focus();
  }
}

function renderList() {
  removeAllElementsFromTodoList();
  todoList.forEach(todo => {
    addNewElementToList(todo);
  });
}

function removeAllElementsFromTodoList() {
  while ($list.hasChildNodes()) {
    $list.removeChild($list.lastChild);
  }
}

function addNewElementToList(todo /* Title, author, id */) {
  //obsługa dodawanie elementów do listy
  const newElement = createElement(todo);
  $list.appendChild(newElement);
}

function createBtn(innerText, className) {
  var btn = document.createElement("BUTTON");
  btn.innerText = innerText;
  btn.className = className;
  return btn;
}

function createElement(todo) {
  const newElement = document.createElement("LI");
  newElement.innerText = todo.title;
  newElement.id = "todo-" + todo.id;
  if (todo.completed) {
    newElement.classList.add("checked");
  }

  newElement.appendChild(createBtn("Delete", "delete"));
  newElement.appendChild(createBtn("Edit", "edit"));
  newElement.appendChild(createBtn("Mark completed", "completed"));
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
  db.deleteTodo(id, prepareTodoList);
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
  db.updateTodo(id, { title: $modalInput.value }, prepareTodoList);
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
  db.updateTodo(id, { completed: true }, prepareTodoList);
}

document.addEventListener("DOMContentLoaded", main);

// var todo = {
//   title: "test_04",
//   author: "miko",
//   description: encodeURI("AAAA opis zawierający polskie znaki ŁÓDŹ"),
//   completed: true,
//   url: encodeURI("https://www.youtube.com/watch?v=1NRnMNcl1uE"),
//   parent_id: 11
// };
