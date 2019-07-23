// Zmienne globalne

var $list, $mainInput, $addBtn, $modal, $modalContent, $modalInput, $modalOKBtn, $modalCancelBtn, $modalCloseBtn;
//var todoList = []; //tablica objektów: {id, name, completed}
var idCounter = 1;
const initialList = ['Sample task...'];

function main() {
  prepareDOMElements();
  prepareDOMEvents();
  prepareInitialList();
}

function prepareDOMElements() {
  //przygotowanie- wyszukanie elementów w drzewie DOM
  $list = document.getElementById('list');
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
  $addBtn.addEventListener('click', addButtonClickHandler);
  $list.addEventListener('click', listClickManager);
  $modalOKBtn.addEventListener('click', acceptChangeHandler);
  $modalCancelBtn.addEventListener('click', declineChanges);
  $modalCloseBtn.addEventListener('click', closePopup);
}

function prepareInitialList() {
  //wrzucenie poczatkowych elementów do listy
  initialList.forEach(todo => {
    addNewElementToList(todo);
  });
}

function addButtonClickHandler() {
  if ($mainInput.value) {
    addNewElementToList($mainInput.value);
    $mainInput.value = '';
    $mainInput.focus();
  }
}

function addNewElementToList(title /* Title, author, id */) {
  //obsługa dodawanie elementów do listy
  // $list.appendChild(createElement('nowy', 2))
  const newElement = createElement(title);
  $list.appendChild(newElement);
}

function createBtn(innerText, className) {
  var btn = document.createElement('BUTTON');
  btn.innerText = innerText;
  btn.className = className;
  return btn;
}

function createElement(title /* Title, author, id */) {
  const newElement = document.createElement('LI');
  newElement.innerText = title;
  newElement.id = 'todo-' + idCounter++;

  newElement.appendChild(createBtn('Delete', 'delete'));
  newElement.appendChild(createBtn('Edit', 'edit'));
  newElement.appendChild(createBtn('Mark completed', 'completed'));
  //ciekawe, elementy bpokażą się w odrotnej kolejności... ze względu na działanie float... jak to zrobić lepiej? flex?
  return newElement;
}

function listClickManager(event) {
  if (event.target.className === 'edit') {
    editListElement(event.target.parentNode.id);
  } else if (event.target.className === 'delete') {
    removeListElement(event.target.parentNode.id);
  } else if (event.target.className === 'completed') {
    markElementAsDone(event.target.parentNode.id);
  }
}

/*
function getTodoIdFromParentElement(target) {
  var id = target.parentNode.id; //"todo-NUM"
  id = id.slice(id.indexOf('-') + 1);
  return id;
}
*/

function removeListElement(id) {
  document.querySelector(`#${id}`).remove();
}

function editListElement(id) {
  var elem = document.querySelector(`#${id}`);
  addDataToPopup(elem.firstChild.textContent, id);
  openPopup();
}

function addDataToPopup(title, id /* Title, author, id */) {
  $modalInput.value = title;
  $modalContent.setAttribute('data-todo-id', id);
}

function acceptChangeHandler() {
  var id = $modalContent.getAttribute('data-todo-id');
  var title = $modalInput.value;
  var liText = document.querySelector(`#${id}`).firstChild;
  liText.textContent = title;
  closePopup();
}

function openPopup() {
  $modal.style.display = 'block';
}

function closePopup() {
  $modal.style.display = 'none';
}

function declineChanges() {
  //niepotrzebna raczej
  $modalInput.value = '';
  $modalContent.removeAttribute('data-todo-id');
  closePopup();
}

function markElementAsDone(id /* id */) {
  //zaznacz element jako wykonany (podmień klasę CSS)
  document.querySelector(`#${id}`).classList.toggle('checked');
}

document.addEventListener('DOMContentLoaded', main);
