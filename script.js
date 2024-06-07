document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("addButton");
    const modal = document.getElementById("myModal");
    const closeModal = document.getElementsByClassName("close")[0];
    const addForm = document.getElementById("addForm");

    let editRowIndex = null;

    fetch("data.json")
        .then((response) => response.json())
        .then((data) => {
            const users = data.users;
            const todos = data.todos;
            const posts = data.posts;

            const tableBody = document.getElementById("data-table-body");

            todos.forEach((todo) => {
                const user = users.find((u) => u.id === todo.userid);
                const post = posts.find((p) => p.todosid === todo.id);

                const row = createRow(user, todo, post);

                tableBody.appendChild(row);
            });

            addButton.addEventListener("click", () => {
                
                document.getElementById("submit").textContent = "Add";
                document.getElementById("formTitle").textContent = "Tambah Data";
                modal.style.display = "block";
                addForm.reset();
                editRowIndex = null;
            });

            closeModal.addEventListener("click", () => {
                modal.style.display = "none";
                addForm.reset();
                editRowIndex = null;
            });

            addForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const userName = document.getElementById("userName").value;
                const todoTitle = document.getElementById("todoTitle").value;
                const todoCompleted =
                    document.getElementById("todoCompleted").value === "true";
                const postTitle = document.getElementById("postTitle").value;
                const postBody = document.getElementById("postBody").value;

                if (editRowIndex === null) {
                    const newRow = createRow(
                        { name: userName },
                        { title: todoTitle, completed: todoCompleted },
                        { title: postTitle, body: postBody }
                    );
                    tableBody.appendChild(newRow);
                } else {
                    const rowToUpdate = tableBody.childNodes[editRowIndex+1];
                    console.log("editRowIndex", editRowIndex);
                    console.log("rowToUpdate", tableBody.childNodes[editRowIndex]);
                    if (rowToUpdate && rowToUpdate.childNodes && rowToUpdate.childNodes.length >= 5) {
                        const cells = rowToUpdate.childNodes;

                        cells[0].textContent = userName;
                        cells[1].textContent = todoTitle;
                        cells[3].textContent = postTitle;
                        cells[4].textContent = postBody;

                        if (cells[2]) {
                            cells[2].textContent = todoCompleted ? "Done" : "Not Finished";
                        }
                    } else {
                        console.error("Undefined");
                    }
                }

                modal.style.display = "none";
                addForm.reset();
                editRowIndex = null; 
            });

            tableBody.addEventListener("click", (event) => {
                if (event.target.classList.contains("deleteButton")) {
                    // const row = event.target.closest("tr");
                    // row.remove();
                    if (confirm("Are you sure you want to delete this data?")) {
                        const row = event.target.closest("tr");
                        row.remove();
                      }
                } else if (event.target.classList.contains("editButton")) {
                    const row = event.target.closest("tr");
                    editRowIndex = Array.from(row.parentNode.children).indexOf(row);

                    const cells = row.childNodes;
                    document.getElementById("userName").value = cells[0].textContent;
                    document.getElementById("todoTitle").value = cells[1].textContent;
                    document.getElementById("todoCompleted").value =
                        cells[2].textContent === "Done" ? "true" : "false";
                    document.getElementById("postTitle").value = cells[3].textContent;
                    document.getElementById("postBody").value = cells[4].textContent;

                    document.getElementById("submit").textContent = "Update";
                    document.getElementById("formTitle").textContent = "Edit Data";

                    modal.style.display = "block";
                }
            });

            window.addEventListener("click", (event) => {
                if (event.target == modal) {
                    modal.style.display = "none";
                    addForm.reset();
                    editRowIndex = null;
                }
            });
        })
        .catch((error) => console.error("Error fetching data:", error));

  function createRow(user, todo, post) {
    const row = document.createElement("tr");

    const userNameCell = document.createElement("td");
    userNameCell.textContent = user ? user.name : "N/A";
    row.appendChild(userNameCell);

    const todoTitleCell = document.createElement("td");
    todoTitleCell.textContent = todo.title;
    row.appendChild(todoTitleCell);

    const todoCompletedCell = document.createElement("td");
    todoCompletedCell.textContent = todo.completed ? "Done" : "Not Finished";
    row.appendChild(todoCompletedCell);

    const postTitleCell = document.createElement("td");
    postTitleCell.textContent = post ? post.title : "N/A";
    row.appendChild(postTitleCell);

    const postBodyCell = document.createElement("td");
    postBodyCell.textContent = post ? post.body : "N/A";
    row.appendChild(postBodyCell);

    const actionCell = document.createElement("td");
    actionCell.setAttribute("class", "action");
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editButton.classList.add("editButton");
    actionCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add("deleteButton");
    actionCell.appendChild(deleteButton);

    row.appendChild(actionCell);

    return row;
  }
});
