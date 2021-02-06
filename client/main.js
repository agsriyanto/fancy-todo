const baseUrl = "http://localhost:3000"

let editStatusId = 0;
let editTodoId = 0;

function auth() {
  if(!localStorage.getItem("accessToken")) {
    $("#login-container").show()
    $("#register-container").hide()
    // $("#list-todo").hide()
    $("#login-link").hide()
    $("#register-link").show()
    $("#logout-link").show() //
    $("#todo-page").hide()
    $("#addTodo-page").hide()
    $("#editStatus-todo").hide()
    $("#editTodo-page").hide()
  } else {
    $("#login-container").hide()
    $("#register-container").hide()
    // $("#list-todo").show()
    $("#login-link").hide()
    $("#register-link").hide()
    $("#logout-link").show()
    $("#todo-page").show()
    $("#addTodo-page").hide()
    $("#editStatus-todo").hide()
    $("#editTodo-page").hide()
    showTodo()
  }
}

function registerLink() {
  $("#login-container").hide()
  $("#register-link").hide()
  $("#logout-link").hide()
  $("#login-link").show()
  $("#register-container").show()
}

function loginLink() {
  $("#login-container").show()
  $("#register-link").show()
  $("#logout-link").hide()
  $("#login-link").hide()
  $("#register-container").hide()
}

function linkAddTodo(done) {
  if (done) {
    $("#todo-page").show()
    $("#addTodo-page").hide()
  } else {
    $("#todo-page").hide()
    $("#addTodo-page").show()
  }
}

function linkEditStatus(done) {
  if (done) {
    $("#todo-page").show()
    $("#editStatus-todo").hide()
  } else {
    $("#todo-page").hide()
    $("#editStatus-todo").show()
  }
}

function linkEditTodo(done) {
  if (done) {
    $("#todo-page").show()
    $("#editTodo-page").hide()
  } else {
    $("#todo-page").hide()
    $("#editTodo-page").show()
  }
}

function readTodoForUpdate(id) {
  editTodoId = id
  $.ajax({
    url: `${baseUrl}/todos/${id}`,
    method: "GET",
    headers: {
      token: localStorage.getItem("accessToken")
    }
  })
  .done(todos => {
    console.log({todos, id});
    $("#edit-title").val(todos.title)
    $("#edit-description").val(todos.description)
    $("#edit-status").val(todos.status)
    $("#edit-due_date").val(todos.due_date)
    linkEditTodo()
  })
  .fail(err => {
    alert('your acoount not authorize')
  })
}

function readTodoById(id) {
  editStatusId = id
  $.ajax({
    url: `${baseUrl}/todos/${id}`,
    method: "GET",
    headers: {
      token: localStorage.getItem("accessToken")
    }
  })
  .done(todos => {
    console.log({todos, id});
    $("#editStatus").val(todos.status)
    linkEditStatus()
  })
  .fail(err => {
    alert('your acoount not authorize')
  })
}

function register() {
  const name = $("#register-name").val()
  const email = $("#register-email").val()
  const password = $("#register-password").val()
  // console.log({name, email, password});
  $.ajax({
    url: `${baseUrl}/users/register`,
    method: "POST",
    data: {
      name,
      email,
      password
    }
  })
  .done(success => {
    localStorage.clear()
    auth()
  })
  .fail((xhr, text) => {
    console.log({xhr, text});
  })
  .always(() => {
    $("#register").trigger("reset")
  })
}

function login() {
  const email = $("#login-email").val()
  const password = $("#login-password").val()
  console.log({email, password});
  $.ajax({
    url: `${baseUrl}/users/login`,
    method: "POST",
    data: {
      email,
      password
    }
  })
  .done((response) => {
    // console.log({response});
    localStorage.setItem("accessToken", response.accessToken)
    auth()
  })
  .fail((xhr, text) => {
    console.log({xhr, text});
  })
  .always(() => {
    $("#login").trigger("reset")
  })
}

function logout() {
  localStorage.clear()
  let auth2 = gapi.auth2.getAuthInstance()
  auth2.signOut()
  .then(() => {
    console.log('user logout');
  })
  auth()
}

function showTodo() {
  $.ajax({
    url: `${baseUrl}/todos`,
    method: "GET",
    headers: {
      token: localStorage.getItem("accessToken")
    }
  })
  .done(response => {
    // console.log('masuk show done');
    // $("#todo-page").empty()
    // console.log(response.todos);
    response.todos.forEach((el) => {
      $("#todo-page").append(`
        <tr id="all-todo-${el.id}">
          <td>${el.title}</td>
          <td>${el.description}</td>
          <td>${el.status}</td>
          <td>${el.due_date}</td>
          <td>
            <a href="#" onclick="readTodoById(${el.id})">Edit Status</a>
            <a href="#" onclick="readTodoForUpdate(${el.id})">Edit Todo</a>
            <a href="#" onclick="deleteTodo(${el.id})">Delete</a>
          </td>
        </tr>
      `)
    })
  })
  .fail((xhr, text) => {
    console.log(xhr, text);
  })
}

function addTodo() {
  const title = $("#add-title").val()
  const description = $("#add-description").val()
  const status = $("#add-status").val()
  const due_date = $("#add-due_date").val()
  console.log({title, description, status, due_date});
  $.ajax({
    url: `${baseUrl}/todos`,
    method: "POST",
    headers: {
      token: localStorage.getItem("accessToken")
    },
    data: {
      title,
      description,
      status,
      due_date
    }
  })
  .done(response => {
    $("#todo-page").append(`
        <tr id="all-todo-${response.id}">
          <td>${response.title}</td>
          <td>${response.description}</td>
          <td>${response.status}</td>
          <td>${response.due_date}</td>
          <td>
            <a href="#" onclick="readTodoById(${response.id})">Edit Status</a>
            <a href="#" onclick="readTodoForUpdate(${response.id})">Edit Todo</a>
            <a href="#" onclick="deleteTodo(${response.id})">Delete</a>
          </td>
        </tr>
      `)
    linkAddTodo(true)
  })
  .fail((xhr, text) => {
    console.log((xhr, text));
  })
  .always(() => {
    $("#addTodo").trigger("reset")
  })
}

function editTodo(id) {
  const title = $("#edit-title").val()
  const description = $("#edit-description").val()
  const status = $("#edit-status").val()
  const due_date = $("#edit-due_date").val()
  console.log({title, description, status, due_date});
  $.ajax({
    url: `${baseUrl}/todos/${id}`,
    method: "PUT",
    headers: {
      token: localStorage.getItem("accessToken")
    },
    data: {
      title,
      description,
      status,
      due_date
    }
  })
  .done(response => {
    $(`#all-todo-${id}`).remove()
    $("#todo-page").append(`
        <tr id="all-todo-${response.id}">
          <td>${response.title}</td>
          <td>${response.description}</td>
          <td>${response.status}</td>
          <td>${response.due_date}</td>
          <td>
            <a href="#" onclick="readTodoById(${response.id})">Edit Status</a>
            <a href="#" onclick="readTodoForUpdate(${response.id})">Edit Todo</a>
            <a href="#" onclick="deleteTodo(${response.id})">Delete</a>
          </td>
        </tr>
      `)
    linkEditTodo(true)
  })
  .fail((xhr, text) => {
    console.log((xhr, text));
  })
  .always(() => {
    $("#editTodo").trigger("reset")
  })
}

function editStatus(id) {
  console.log({id, addTodo: 'masuuuk'});
  const status = $("#editStatus").val()
  $.ajax({
    url: `${baseUrl}/todos/${id}`,
    method: "PATCH",
    headers: {
      token: localStorage.getItem("accessToken")
    },
    data: {
      status
    }
  })
  .done(response => {
    $(`#all-todo-${id}`).remove()
    $("#todo-page").append(`
        <tr id="all-todo-${response.id}">
          <td>${response.title}</td>
          <td>${response.description}</td>
          <td>${response.status}</td>
          <td>${response.due_date}</td>
          <td>
            <a href="#" onclick="readTodoById(${response.id})">Edit Status</a>
            <a href="#" onclick="readTodoForUpdate(${response.id})">Edit Todo</a>
            <a href="#" onclick="deleteTodo(${response.id})">Delete</a>
          </td>
        </tr>
      `)
    linkEditStatus(true)
  })
  .fail(err => {
    console.log(err);
  })
}

function deleteTodo(id) {
  $.ajax({
    url: `${baseUrl}/todos/${id}`,
    method: 'DELETE',
    headers: {
      token: localStorage.getItem("accessToken")
    }
  })
  .done(succes => {
    $(`#all-todo-${id}`).remove()
    console.log('berhasil delete');
    // auth()
  })
  .fail(err => {
    alert('your acoount not authorize')
  })
}

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token
  console.log({id_token});
  $.ajax({
    url: `${baseUrl}/users/googleLogin`,
    method: "POST",
    data: {
      googleToken: id_token
    }
  })
  .done(response => {
    console.log({response});
    localStorage.setItem("accessToken", response.accessToken)
    localStorage.setItem("email", $("#login-email").vall())
    $("#login-email").val('')
    $("#login-password").val('')
  })
  .fail(err => {
    console.error({err})
  })
}

$(document).ready(() => {
  auth()

  $("#register").on("submit", (e) => {
    e.preventDefault()
    register()
  })

  $("#login").on("submit", (e) => {
    e.preventDefault()
    login()
  })

  $("#addTodo").on("submit", (e) => {
    e.preventDefault()
    addTodo()
  })

  $("#edit-status-todo").on("submit", (e) => {
    e.preventDefault()
    editStatus(editStatusId)
  })

  $("#editTodo").on("submit", (e) => {
    e.preventDefault()
    editTodo(editTodoId)
  })

})