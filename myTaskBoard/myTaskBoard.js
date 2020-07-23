(function () {


    // View the all the notes that already exist.   
    showNote();

    let btnSave = document.getElementById("save");
    btnSave.addEventListener("click", onSave);

    let btnReset = document.getElementById("reset");
    btnReset.addEventListener("click", onReset);

    //----------------------------model--------------------------------

    /**
     * This function updates the model when a new note is added.
     */
    function updateModel(note) {
        let strNotes = localStorage.getItem("allNotes");
        let allNotes;

        //if localStorge is emptey create new array
        if (strNotes == null) {
            allNotes = new Array();
        }
        else {
            allNotes = JSON.parse(strNotes);
        }

        allNotes.push(note);

        let strAllNotes = JSON.stringify(allNotes);
        localStorage.setItem("allNotes", strAllNotes);


    }

     /**
     * This function updates the model when a note deleted.
     */
    function removeNotes() {
        this.parentNode.remove();
        let strAllNotes = localStorage.getItem("allNotes");
        let allNotes = JSON.parse(strAllNotes);

        for (let i = 0; i < allNotes.length; i++) {
            if (allNotes[i].id == this.id) {
                allNotes.splice(i, 1);
            }
        }

        if (allNotes.length == 0) {
            localStorage.clear();
            return;
        }
        localStorage.setItem("allNotes", JSON.stringify(allNotes));


    }

    //----------------------------view--------------------------------

     /**
     * This function displays all the notes that already exist.
     */
    function showNote() {
        let myFooter = document.getElementById("myFooter");
        myFooter.innerHTML = "";

        let strAllNotes = localStorage.getItem("allNotes");
        let allNotes = JSON.parse(strAllNotes);

        if (strAllNotes != null) {
            for (let index = 0; index < allNotes.length; index++) {
                let boxNote = createDiv("boxNote");
                let descriptionText = createDiv("descriptionText");
                let dateSpan = createDiv("dateSpan");
                let iconX = createIconX(allNotes[index].id);

                boxNote.appendChild(iconX);
                boxNote.appendChild(descriptionText);
                boxNote.appendChild(dateSpan);
                myFooter.appendChild(boxNote);

                descriptionText.innerHTML = allNotes[index].task;
                dateSpan.innerHTML = allNotes[index].date + "<br>" + allNotes[index].time;
            }
            myFooter.lastChild.classList.add("lastChild");
        }
        onReset();
    }

    /**
     * This function creates a div with a class name.
     */
    function createDiv(className) {
        let name = document.createElement("div");
        name.setAttribute("class", className);

        return name;
    }

     /**
     * This function creates an iconx Using bootstrap classes.
     */
    function createIconX(id) {
        let icon = document.createElement("span");
        icon.setAttribute("class", "glyphicon glyphicon-remove");
        icon.setAttribute("id", id);
        icon.addEventListener("click", removeNotes);
        return icon;
    }

    //----------------------------controller--------------------------------

    /**
     * This function  is the Main function, performed when save is clicked.
     */
    function onSave() {
        let task = document.getElementById("text");
        let date = document.getElementById("date");
        let time = document.getElementById("time");


        let isTaskEmpty = validateIfInputIsEmpty(task);
        let isDateEmpty = validateIfInputIsEmpty(date);
        let isValidDateAndTime = validateDateInput(date, time);
        if (!isTaskEmpty || !isDateEmpty || !isValidDateAndTime) {
            return;
        }

        let note = createNote(task, date, time);
        updateModel(note);
        showNote();
    }

     /**
     * This function creates a valid and unique id.
     */
    function createValidId() {
        let strAllNotes = localStorage.getItem("allNotes");
        let allNotes = JSON.parse(strAllNotes);
        let id = 0;

        if (strAllNotes != null) {
            id = allNotes[allNotes.length - 1].id + 1;
        }

        return id;
    }

     /**
     * This function validates that the user has entered values ​​in all inputs.
     */
    function validateIfInputIsEmpty(input) {
        input.style.backgroundColor = "";
        input.style.opacity = "1";

        if (input.value.trim() == "") {
            input.style.backgroundColor = "red";
            input.style.opacity = "0.7";
            return false;
        }
        return true;
    }

/**
 * This function creates the object note.
 */
    function createNote(task, date, time) {
        let note = {
            id: createValidId(),
            task: task.value.trim(),
            date: reverseDate(date.value),
            time: time.value
        };

        return note;
    }

     /**
     * This function reverses to date to Israeli format .
     */
    function reverseDate(date) {
        var splitDate = date.split("-");
        var year = splitDate[0];
        var month = splitDate[1];
        var day = splitDate[2];
        var reversedDate = day + "/" + month + "/" + year;
        return reversedDate;
    }

    /**
     * This function  deletes all inputs when the reset button is pressed.
     */
    function onReset() {
        let task = document.getElementById("text");
        let date = document.getElementById("date");
        let time = document.getElementById("time");

        task.style.backgroundColor = "";
        date.style.backgroundColor = "";
        time.style.backgroundColor = "";

        task.value = "";
        date.value = "";
        time.value = "";
    }
    
/**
 * This function validates the date.
 */
    function validateDateInput(date, time) {
        date.style.opacity = "1";
        time.style.backgroundColor = "";

        var today = new Date().setHours(0, 0, 0, 0);
        var dateTask = new Date(date.value).setHours(0, 0, 0, 0);

        if (dateTask < today) {
            date.style.backgroundColor = "red";
            date.style.opacity = "0.7";

            return false;
        }
        else if (dateTask == today) {
            if (!validateTimeInput(date, time)) {
                return false;
            }
        }
        return true
    }

/**
 * This function is validates the time.
 */
    function validateTimeInput(date, time) {
        time.style.opacity = "1";


        var today = new Date().getTime();
        var dateTask = new Date(date.value + "," + time.value).getTime();

        if (dateTask < today && time.value != "") {
            time.style.backgroundColor = "red";
            time.style.opacity = "0.7";
            return false
        }
        return true
    }

})();