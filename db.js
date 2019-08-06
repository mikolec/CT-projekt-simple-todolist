var DB = (function() {
  var _url;
  var _user;

  function mapTodoToAJAXFormat(todo) {
    return {
      title: todo.title,
      id: todo.id,
      description: encodeURIComponent(todo.description),
      priority: todo.priority,
      author: todo.user || _user,
      extra: Number(todo.completed),
      url: encodeURIComponent(todo.url),
      parent_todo_id: todo.parent_id
    };
  }
  function mapTodoFromAJAXFormat(todo) {
    return {
      title: todo.title,
      id: todo.id,
      description: decodeURIComponent(todo.description),
      priority: todo.priority,
      user: todo.author,
      completed: Boolean(todo.extra),
      url: decodeURIComponent(todo.url),
      parent_id: todo.parent_todo_id
    };
  }

  function init(url, user = "miko") {
    _url = url;
    _user = user;
  }
  function readTodos() {
    return fetch(_url, { method: "GET" })
      .then(res => res.json())
      .then(res => {
        // console.log(res, _user, _url);

        return res
          .filter(todo => {
            return todo.author === _user;
          })
          .map(todo => mapTodoFromAJAXFormat(todo));
      });
  }
  function createTodo(todo) {
    todo = mapTodoToAJAXFormat(todo);

    return fetch(_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(todo)
    })
      .then(res => res.json())
      .then(response => {
        if (response.status == "0") console.log("Success:", JSON.stringify(response));
        else console.log("Failure:", JSON.stringify(response));
      })
      .catch(error => console.error("Error:", error));
  }
  function updateTodo(todo) {
    todo = mapTodoToAJAXFormat(todo);

    return fetch(_url + todo.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(todo)
    })
      .then(res => res.json())
      .then(response => {
        if (response.status == "0") console.log("Success:", JSON.stringify(response));
        else console.log("Failure:", JSON.stringify(response));
      })
      .catch(error => console.error("Error:", error));
  }
  function deleteTodo(id) {
    return fetch(_url + id, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(response => {
        if (response.status == "0") console.log("Success:", JSON.stringify(response));
        else console.log("Failure:", JSON.stringify(response));
      })
      .catch(error => console.error("Error:", error));
  }

  module_api = {
    init: init,
    readTodos: readTodos,
    createTodo: createTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo
  };
  return module_api;
})();
