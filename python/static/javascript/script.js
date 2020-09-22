/**
 * For page 1 to be the first page to load.
 */

var currentPage = 1;

/**
 * Displaying the users onto the table by "GET"ting those users from the API.
 *
 * @param pageNumber    The current page number.
 */

function getUsers(pageNumber){
    var xhr = new XMLHttpRequest();
    xhr.open("GET","api/users?page=" + String(pageNumber), true);
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            var objUsers = JSON.parse(xhr.responseText);
            renderUsers(objUsers);
        }
        else {
            alert("Error " + xhr.status);
        }
    };
    xhr.send()
}

/**
 * Deleting the rows in the table and inserting new rows with the users
 * from objUsers. Only needing as many rows as required.
 *
 * @param objUsers    The users to render.
 */

function renderUsers(objUsers) {
    var table = document.getElementById("tblUsers");

    while (table.rows.length > 1) {
        table.deleteRow(1)
    }
    for (var objUser in objUsers.data) {
        var row = table.insertRow(-1);
        row.id = "user"+objUsers.data[objUser].id;
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        cell1.innerHTML = objUsers.data[objUser].id;
        cell2.innerHTML = objUsers.data[objUser].email;
        cell3.innerHTML = objUsers.data[objUser].first_name;
        cell4.innerHTML = objUsers.data[objUser].last_name;
        cell5.innerHTML = "<img src='" + objUsers.data[objUser].avatar + "' alt='avatar'>";
    }
}

/**
 * "GET"ting a single user from the user_list. Enabling the user to be edited or deleted.
 *
 * @param userID    The userID of the user from the user_list in the API.
 */

function getASingleUser(userID){
    var xhr = new XMLHttpRequest();
    xhr.open("GET","api/users/" + String(userID), true);
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            var objUser = JSON.parse(xhr.responseText);
            renderSingleUser(objUser)
        }
        else {
            alert("Error " + xhr.status);
        }
    };
    xhr.send()
}

/**
 * Displaying the selected user from getASingleUser() in the "User" section. With all the forms filled out automatically.
 *
 * @param userID    The userID of the user from the user_list in the API.
 */

function renderSingleUser(objUser) {
    document.getElementById("selectedUser").setAttribute( "src", objUser.data.avatar);
    document.getElementById("userID").setAttribute("value", objUser.data.id);
    document.getElementById("userEmail").setAttribute("value", objUser.data.email);
    document.getElementById("userFirstName").setAttribute("value", objUser.data.first_name);
    document.getElementById("userLastName").setAttribute("value", objUser.data.last_name);
    document.getElementById("userAvatarEdit").setAttribute("value", objUser.data.avatar);
}

/**
 * An event listener to enable the ability of selecting users in the table. Sends over the user ID.
 */

function selectRow() {
    document.getElementById("tblUsers").addEventListener('click', function (e) {
        var row = e.target.parentNode;
        var userID = row.firstChild.innerHTML;
        getASingleUser(userID);
        document.getElementById("userID").disabled = true;
    })
}

/**
 * Creating a new user by reading the form data and then sending over the JSON data to the API.
 */

function createUser() {
    var userID = document.getElementById("newUserID").value;
    var userEmail = document.getElementById("newUserEmail").value;
    var userFirstName = document.getElementById("newUserFirstName").value;
    var userLastName = document.getElementById("newUserLastName").value;
    var userAvatar = document.getElementById("newUserAvatar").value;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            alert(xhr.responseText)
        }
    }
    xhr.open("POST", "api/users", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({"id": userID, "email": userEmail, "first_name": userFirstName, "last_name": userLastName, "avatar": userAvatar}));
}

/**
 * Deleting the selected user from from the table.
 *
 * @param userID    The userID of the user from the user_list in the API.
 */

function deleteASingleUser(userID){
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE","api/users/" + String(userID), true);
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            JSON.parse(xhr.responseText);
        }
        else {
            alert("Error " + xhr.status);
        }
    };
    xhr.send()
}

/**
 * Editing a selected user from the table.
 *
 * @param userID    The userID of the user from the user_list in the API.
 */

function editASingleUser(userID){
    var newUserID = document.getElementById("userID").value;
    var userEmail = document.getElementById("userEmail").value;
    var userFirstName = document.getElementById("userFirstName").value;
    var userLastName = document.getElementById("userLastName").value;
    var userAvatar = document.getElementById("userAvatarEdit").value;

    var xhr = new XMLHttpRequest();
    xhr.open("PUT","api/users/" + String(userID), true);
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            JSON.parse(xhr.responseText);
        }
        else {
            alert("Error " + xhr.status);
        }
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    try {
        xhr.send(JSON.stringify({"id": newUserID, "email": userEmail, "first_name": userFirstName, "last_name": userLastName, "avatar": userAvatar}));
    }
    catch (error) {
        alert.error("Cannot edit user ID");
    }


}

/**
 * getUsers() loads the users onto the page.
 * totalPages() changes the total pages to the required amount.
 * selectRow() enabled the ability to select rows in the table.
 */

function startPage() {
    getUsers(currentPage);
    totalPages(currentPage);
    selectRow()
    document.getElementById("userID").disabled = true;
}
startPage()

/**
 * Pagination. Calculates the number of pages needed for all the users. Since only 6 should be displayed on
 * a single page.
 *
 * @param pageNumber    The current page number.
 */


function totalPages(pageNumber) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET","api/users?page=" + String(pageNumber), true);
    xhr.onload = function() {
        var objUsers = JSON.parse(xhr.responseText);
        renderUsers(objUsers);
        var numberOfUsers = (objUsers.total)
        var totalPages = document.getElementById("totalPages");
        totalPages.innerHTML = Math.trunc((numberOfUsers + 5) / 6).toString()
    };
    xhr.send()

}

/**
 * Pressing the Previous button will change the page number and display the users associated with it.
 */

function usePreviousButton() {
    currentPage--;
    if (currentPage < 1) {
    currentPage++
    }
    document.getElementById("pageNumber").innerHTML = currentPage.toString();
    getUsers(currentPage)
}
document.getElementById("btnPrevious").addEventListener("click", usePreviousButton);

/**
 * Pressing the Next button will change the page number and display the users associated with it.
 */

function useNextButton() {
    currentPage++
    var totalPages = parseInt(document.getElementById("totalPages").innerHTML)
    if (currentPage > totalPages) {
        currentPage--
    }
    document.getElementById("pageNumber").innerHTML = currentPage.toString();
    getUsers(currentPage)
}
document.getElementById("btnNext").addEventListener("click", useNextButton);

/**
 * Pressing the Save button will run the editASingleUser() function while also refreshing the
 * table and page numbers.
 */


function useSaveButton() {
    var user = document.getElementById("userID").value;
    editASingleUser(user)
    startPage()
}
document.getElementById("btnSaveUser").addEventListener("click", useSaveButton);

/**
 * Pressing the Delete button will run the deleteASingleUser() function while also refreshing the
 * table and page numbers.
 */

function useDeleteButton() {
    var user = document.getElementById("userID").value;
    deleteASingleUser(user)
    startPage()
}
document.getElementById("btnDeleteUser").addEventListener("click", useDeleteButton);

/**
 * Pressing the New button will run the createUser() function while also refreshing the
 * table and page numbers.
 */

function useNewButton() {
    createUser();
    startPage()
}
document.getElementById("btnNewUser").addEventListener("click", useNewButton);
