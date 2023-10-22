function searchShifts() {
    const shiftTableBody = document.getElementById("shiftTableBody");
    shiftTableBody.innerHTML = "";
    const shiftNameSearch = document.getElementById("shiftNameSearch").value.toLowerCase();
    const fromDateSearch = document.getElementById("fromDateSearch").value;
    const toDateSearch = document.getElementById("toDateSearch").value;
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.shifts) {
        currentUser.shifts.forEach(function (shift) {
            const matchName = shift.uniqueName.toLowerCase().includes(shiftNameSearch);
            const matchDate = (fromDateSearch === "" || shift.date >= fromDateSearch) &&
                (toDateSearch === "" || shift.date <= toDateSearch);
            if (matchName && matchDate) {
                addShiftRow(shift);
            }
        });
    }
}

function clearSearch() {
    const shiftTableBody = document.getElementById("shiftTableBody");
    shiftTableBody.innerHTML = "";
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.shifts) {
        currentUser.shifts.forEach(function (shift) {
            addShiftRow(shift);
        });
    }
    document.getElementById("shiftNameSearch").value = "";
    document.getElementById("fromDateSearch").value = "";
    document.getElementById("toDateSearch").value = "";
}

function addShiftRow(shiftData) {
    const shiftTableBody = document.getElementById("shiftTableBody");
    const newRow = shiftTableBody.insertRow();
    const dateCell = newRow.insertCell(0);
    dateCell.appendChild(document.createTextNode(shiftData.date));
    const startTimeCell = newRow.insertCell(1);
    startTimeCell.appendChild(document.createTextNode(shiftData.startTime));
    const endTimeCell = newRow.insertCell(2);
    endTimeCell.appendChild(document.createTextNode(shiftData.endTime));
    const hourlyWageCell = newRow.insertCell(3);
    hourlyWageCell.appendChild(document.createTextNode(shiftData.hourlyWage));
    const workplaceCell = newRow.insertCell(4);
    workplaceCell.appendChild(document.createTextNode(shiftData.workplace));
    const profitCell = newRow.insertCell(5);
    const profit = calculateProfit(shiftData);
    profitCell.textContent = profit.toFixed(2);
    const deleteCell = newRow.insertCell(6);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function (e) {
        e.stopPropagation();
        deleteShift(shiftData.uniqueName);
    });
    deleteCell.appendChild(deleteButton);
    newRow.addEventListener("click", function (e) {
        e.stopPropagation();
        editShift(shiftData);
    });
}

function calculateProfit(shiftData) {
    const startTime = new Date(`1970-01-01T${shiftData.startTime}`);
    const endTime = new Date(`1970-01-01T${shiftData.endTime}`);
    const hoursWorked = (endTime - startTime) / (1000 * 60 * 60);
    return shiftData.hourlyWage * hoursWorked;
}

function deleteShift(uniqueName) {
    const currentUser = getCurrentUser();
    const shiftIndex = (currentUser.shifts || []).findIndex(
        (shift) => shift.uniqueName === uniqueName
    );
    if (shiftIndex !== -1) {
        currentUser.shifts.splice(shiftIndex, 1);
        const userData = JSON.parse(localStorage.getItem("userData")) || {};
        userData[currentUser.email] = currentUser;
        localStorage.setItem("userData", JSON.stringify(userData));
        const shiftTable = document.getElementById("shiftTable");
        shiftTable.deleteRow(shiftIndex + 1);
    }
    calculateBestMonthProfit(currentUser.shifts);
}

function calculateBestMonthProfit(shifts) {
    const monthProfits = {};
    shifts.forEach(function (shift) {
        const profit = calculateProfit(shift);
        const [year, month] = shift.date.split('-');
        const monthYear = `${year}-${month}`;
        if (monthProfits[monthYear] === undefined) {
            monthProfits[monthYear] = profit;
        } else {
            monthProfits[monthYear] += profit;
        }
    });
    let bestMonthProfit = 0;
    let bestMonth = '';
    for (const monthYear in monthProfits) {
        if (monthProfits[monthYear] > bestMonthProfit) {
            bestMonth = monthYear;
            bestMonthProfit = monthProfits[monthYear];
        }
    }
    const bestMonthCell = document.getElementById("bestMonth");
    const bestMonthProfitCell = document.getElementById("bestMonthProfit");
    bestMonthCell.textContent = bestMonth;
    bestMonthProfitCell.textContent = bestMonthProfit.toFixed(2);
    return { bestMonth, bestMonthProfit };
}

function getCurrentUser() {
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    return userData[loggedInUserEmail] || null;
}

function addShift() {
    if (validateForm()) {
        const errorsParagraph = document.getElementById("errors");
        errorsParagraph.textContent = "";
        const currentUser = getCurrentUser();
        currentUser.shifts = currentUser.shifts || [];
        let date = document.getElementById("date").value;
        let startTime = document.getElementById("start_time").value;
        let endTime = document.getElementById("end_time").value;
        let hourlyWage = document.getElementById("wage").value;
        let workplace = document.getElementById("workplace").value;
        let uniqueName = document.getElementById("name").value;
        let comments = document.getElementById("comments").value;
        const shiftWithSameName = currentUser.shifts.find(shift => shift.uniqueName === uniqueName);
        if (shiftWithSameName) {
            errorsParagraph.textContent = "A shift with the same name already exists. Please choose a unique name.";
            return;
        }
        let newShift = {
            date,
            startTime,
            endTime,
            hourlyWage,
            workplace,
            uniqueName,
            comments,
        };
        currentUser.shifts = currentUser.shifts || [];
        currentUser.shifts.push(newShift);
        addShiftRow(newShift);
        calculateBestMonthProfit(currentUser.shifts);
        const userData = JSON.parse(localStorage.getItem("userData")) || {};
        userData[currentUser.email] = currentUser;
        localStorage.setItem("userData", JSON.stringify(userData));
        document.getElementById("date").value = "";
        document.getElementById("start_time").value = "";
        document.getElementById("end_time").value = "";
        document.getElementById("wage").value = "";
        document.getElementById("workplace").value = "option1";
        document.getElementById("name").value = "";
        document.getElementById("comments").value = "";
        document.getElementById("createShiftPage").style.display = "none";
        toggleLoadingAnimationAndTable(true);
    }
}
function editShift(shiftData) {
    const errorsParagraph = document.getElementById("errors");
    errorsParagraph.textContent = "";
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const currentUser = userData[loggedInUserEmail];
    const shiftToEdit = currentUser.shifts.find(shift => shift.uniqueName === shiftData.uniqueName);
    if (shiftToEdit) {
        document.getElementById("date-edit").value = shiftToEdit.date;
        document.getElementById("start_time_edit").value = shiftToEdit.startTime;
        document.getElementById("end_time_edit").value = shiftToEdit.endTime;
        document.getElementById("wage_edit").value = shiftToEdit.hourlyWage;
        document.getElementById("workplace_edit").value = shiftToEdit.workplace;
        document.getElementById("name_edit").value = shiftToEdit.uniqueName;
        document.getElementById("comments_edit").value = shiftToEdit.comments;
        document.getElementById("editShiftPage").style.display = "flex";
        document.getElementById("name_edit").style.display = "none";
        document.getElementById("shiftUniqueName").textContent = shiftToEdit.uniqueName;
    }
}

function updateShift() {
    let currentUser = getCurrentUser();
    let editedDate = document.getElementById("date-edit").value;
    let editedStartTime = document.getElementById("start_time_edit").value;
    let editedEndTime = document.getElementById("end_time_edit").value;
    let editedHourlyWage = document.getElementById("wage_edit").value;
    let editedWorkplace = document.getElementById("workplace_edit").value;
    let editedUniqueName = document.getElementById("name_edit").value;
    let editedComments = document.getElementById("comments_edit").value;
    const shiftIndex = (currentUser.shifts || []).findIndex(
        (shift) => shift.uniqueName === editedUniqueName
    );
    if (shiftIndex !== -1) {
        currentUser.shifts[shiftIndex] = {
            date: editedDate,
            startTime: editedStartTime,
            endTime: editedEndTime,
            hourlyWage: editedHourlyWage,
            workplace: editedWorkplace,
            uniqueName: editedUniqueName,
            comments: editedComments,
        };
        const editedProfit = calculateProfit(currentUser.shifts[shiftIndex]);
        const shiftTable = document.getElementById("shiftTable");
        const rowToUpdate = shiftTable.rows[shiftIndex + 1];
        rowToUpdate.cells[0].textContent = editedDate;
        rowToUpdate.cells[1].textContent = editedStartTime;
        rowToUpdate.cells[2].textContent = editedEndTime;
        rowToUpdate.cells[3].textContent = editedHourlyWage;
        rowToUpdate.cells[4].textContent = editedWorkplace;
        rowToUpdate.cells[5].textContent = editedProfit.toFixed(2);
        const userData = JSON.parse(localStorage.getItem("userData")) || {};
        userData[currentUser.email] = currentUser;
        localStorage.setItem("userData", JSON.stringify(userData));
        calculateBestMonthProfit(currentUser.shifts);
        document.getElementById("editShiftPage").style.display = "none";
    }
}

function loadShifts() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = "../login/login.html";
        return;
    }
    if (currentUser && currentUser.shifts) {
        let totalProfit = 0;
        currentUser.shifts.forEach(function (shift) {
            addShiftRow(shift);
            const profit = calculateProfit(shift);
            totalProfit += profit;
        });
        calculateBestMonthProfit(currentUser.shifts);
    }
}

function validateForm() {
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("start_time").value;
    const endTime = document.getElementById("end_time").value;
    const wage = parseFloat(document.getElementById("wage").value);
    const workplace = document.getElementById("workplace").value;
    const name = document.getElementById("name").value;
    const comments = document.getElementById("comments").value;
    const errorsParagraph = document.getElementById("errors");
    let errorMessage = "";
    if (date === "") {
        errorMessage += "Date is required.<br>";
    }
    if (startTime === "") {
        errorMessage += "Start time is required.<br>";
    }
    if (endTime === "") {
        errorMessage += "End time is required.<br>";
    }
    if (isNaN(wage) || wage <= 0) {
        errorMessage += "Hourly wage must be a valid positive number.<br>";
    }
    if (workplace === "") {
        errorMessage += "Workplace is required.<br>";
    }
    if (name === "") {
        errorMessage += "Unique name is required.<br>";
    }
    errorsParagraph.innerHTML = errorMessage;
    return errorMessage === "";
}

function toggleLoadingAnimationAndTable(showAnimation) {
    const loadingAnimation = document.getElementById("loading-animation");
    const table = document.getElementById("shiftTable");
    const searchField = document.getElementById("searchToggle");
    if (showAnimation) {
        table.style.display = "none";
        searchField.style.display = "none";
        loadingAnimation.style.display = "block";
        setTimeout(function () {
            loadingAnimation.style.display = "none";
            table.style.display = "table";
            searchField.style.display = "flex";
        }, 1000);
    } else {
        loadingAnimation.style.display = "none";
        table.style.display = "table";
        searchField.style.display = "flex";
    }
}

function toggleSearchField() {
    const searchButton = document.getElementById("searchToggle");
    const searchField = document.getElementById("searchField");

    if (searchField.style.display === "none" || searchField.style.display === "") {
        searchField.style.display = "flex";
        searchButton.style.display = "none"
    } else {
        searchField.style.display = "none";
        searchButton.style.display = "flex"
    }
}


document.getElementById("searchToggle").addEventListener("click", toggleSearchField);
document.getElementById("searchClose").addEventListener("click", toggleSearchField);
document.getElementById("search").addEventListener("click", searchShifts);
document.getElementById("clear").addEventListener("click", clearSearch);
window.addEventListener("load", loadShifts);
document.getElementById("save").addEventListener("click", addShift);
document.getElementById("update").addEventListener("click", updateShift);
document.getElementById("closeCreateShift").addEventListener("click", function () {
    const errorsParagraph = document.getElementById("errors");
    errorsParagraph.textContent = "";
    let createShiftPage = document.getElementById("createShiftPage");
    createShiftPage.style.display = "none";
});

document.getElementById("closeEditShift").addEventListener("click", function () {
    const errorsParagraph = document.getElementById("errors");
    errorsParagraph.textContent = "";
    let editShiftPage = document.getElementById("editShiftPage");
    editShiftPage.style.display = "none";
});

document.getElementById("createShiftBtn").addEventListener("click", function () {
    const errorsParagraph = document.getElementById("errors");
    errorsParagraph.textContent = "";
    let createShiftPage = document.getElementById("createShiftPage");
    createShiftPage.style.display = "flex";
});

document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("loggedInUserEmail");
    window.location.href = "../login/login.html";
});

document.getElementById("myShifts").addEventListener("click", function () {
    const shiftTable = document.getElementById("shiftTable");
    const searchToggle = document.getElementById("searchToggle");
    const searchField = document.getElementById("searchField");
    if (window.innerWidth < 768) {
        if (shiftTable.style.display === "none" || shiftTable.style.display === "") {
            shiftTable.style.display = "table";
            searchToggle.style.display = "flex";
        } else {
            shiftTable.style.display = "none";
            searchToggle.style.display = "none";
        }
    }
    else {
        if (searchField.style.display === "none" || searchField.style.display === "") {
            searchField.style.display = "flex";
            searchToggle.style.display = "none"
            shiftTable.style.display = "table"
        } else {
            searchField.style.display = "none";
            shiftTable.style.display = "none"
        }
    }
});





const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
const userData = JSON.parse(localStorage.getItem("userData")) || {};
loggedInUserEmail && userData[loggedInUserEmail]
const username = userData[loggedInUserEmail].username;
document.getElementById("username").textContent = username;
document.getElementById("delUpdate").addEventListener("click", deleteShiftAndUpdate);

function deleteShiftAndUpdate() {
    const editedUniqueName = document.getElementById("name_edit").value;
    deleteShift(editedUniqueName);
    const editShiftPage = document.getElementById("editShiftPage");
    editShiftPage.style.display = "none";
}

