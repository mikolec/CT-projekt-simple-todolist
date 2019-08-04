// globals
// const todoList = [];
// const user = "miko";

class DB {
  // constructor(url, todoList) {
  constructor(url) {
    this.url = url;
    // this.todoList = todoList || [];
    this.user = "miko";
    // console.log(this.user);
  }

  getTodos(callback) {
    todoList = [];
    fetch(this.url, { method: "GET" })
      .then(res => res.json())
      .then(res => {
        res
          .filter(
            function(todo) {
              return todo.author === this.user;
            }.bind(this)
          )
          .map(
            function(todo) {
              // this.todoList.push({ //jak zrobić, przepisanie??
              todoList.push({
                title: todo.title,
                id: todo.id,
                description: decodeURIComponent(todo.description),
                user: todo.author,
                completed: Boolean(todo.extra),
                url: decodeURIComponent(todo.url),
                parent_id: todo.parent_todo_id
              });
            }.bind(this)
          );
      })
      .then(() => {
        if (callback) {
          callback();
        }
      });
  }
  //todo: object

  mapTodoToAJAXFormat(todo) {
    return {
      id: todo.id,
      title: todo.title,
      author: todo.author,
      description: todo.description,
      author: todo.user || this.user,
      extra: Number(todo.completed),
      url: todo.url,
      parent_todo_id: todo.parent_id
    };
  }
  addNewTodo(todo, callback) {
    todo = this.mapTodoToAJAXFormat(todo);
    console.log(todo);

    fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.mapTodoToAJAXFormat(todo))
    })
      .then(res => res.json())
      .then(response => {
        console.log("Success:", JSON.stringify(response));
        // this.getTodos();
        if (callback) {
          callback();
        }
      })
      .catch(error => console.error("Error:", error));
  }

  updateTodo(id, todo, callback) {
    fetch(this.url + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.mapTodoToAJAXFormat(todo))
    })
      .then(res => res.json())
      .then(response => {
        console.log("Success:", JSON.stringify(response));

        if (callback) {
          callback();
        }
      })
      .catch(error => console.error("Error:", error));
  }

  deleteTodo(id, callback) {
    fetch(this.url + id, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(response => {
        console.log("Success:", JSON.stringify(response));
        if (callback) {
          callback();
        }
      })
      .catch(error => console.error("Error:", error));
  }
}
