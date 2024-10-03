var ThisForumName = "";
var whosEditing = "";

function loadUserCreatorData() {
    if (user != undefined && password != undefined) {
        var userref = firebase.database().ref("/users/" + user + "/status");
        var passref = firebase.database().ref("/users/" + user + "/password");
        var isUserCreated;
        var isJoining = false;
        userref.on("value", data => {
            isUserCreated = data.val();
            if (!isJoining) {
                isJoining = true;
                if (isUserCreated == "online" || isUserCreated == "mod") {
                    passref.on("value", data => {
                        canPass = data.val();
                        if (canPass == password) {
                            logged = true;
                            whosEditing = user;
                            if (isMobile) {
                                document.getElementById("user-name-mb").innerHTML = whosEditing;
                            } else {
                                document.getElementById("user-name").innerHTML = whosEditing;
                            }
                            console.log("logged: " + logged);
                            openForumNameCreator();
                        }
                    })
                }
            }
        });
    } else {
        console.warn("Not Logged");
        document.getElementById("canEditDiv").innerHTML = "<center><h1>You need to login first</h1></center>";
    }
    console.log("logged: " + logged);
}

function openForumNameCreator() {
    thisH1 = "<h1>Creating a new Forum</h1><h2>Forum Name:</h2>";
    thisInput = "<input id='inputNAME'><br><br><button onclick='createThisForum()'>CREATE</button>";
    thisNameHandler = "<p>Forum By: " + whosEditing + "</p>";
    document.getElementById("canEditDiv").innerHTML = "<center>" + thisH1 + thisInput + thisNameHandler + "</center>";
}

function createThisForum() {
    selectedName = document.getElementById("inputNAME").value;
    if (selectedName != "") {
        ThisForumName = selectedName;
        document.getElementById("ForumNameHandler").innerHTML = selectedName;
        document.getElementById("canEditDiv").style.visibility = "hidden";
    }
}

var resources = [];

function addToTopic(type) {
    if (type == 1) {
        textArea = "<p>Add Text:</p><textarea id='input" + resources.length + "'></textarea><br>";
        buttons = "<button id='" + resources.length + "' onclick='finishItem(this.id)'>Ok</button><button id='" + resources.length + "' onclick='cancelItem(this.id)'>Cancel</button>";
        document.getElementById("createMain").innerHTML += "<div id='div" + resources.length + "' class='wood-bg item'>" + textArea + buttons + "</div>";
        resources.push({
            type: "Text",
            data: ""
        });
    } else if (type == 2) {
        textArea = "<p>Add Image URL:</p><textarea id='input" + resources.length + "'></textarea><br>";
        buttons = "<button id='" + resources.length + "' onclick='finishItem(this.id)'>Ok</button><button id='" + resources.length + "' onclick='cancelItem(this.id)'>Cancel</button>";
        document.getElementById("createMain").innerHTML += "<div id='div" + resources.length + "' class='frame-bg item'>" + textArea + buttons + "</div>";
        resources.push({
            type: "Image",
            data: ""
        });
    } else if (type == 3) {
        textArea = "<p>Add Link URL:</p><textarea id='input" + resources.length + "'></textarea><br>";
        buttons = "<button id='" + resources.length + "' onclick='finishItem(this.id)'>Ok</button><button id='" + resources.length + "' onclick='cancelItem(this.id)'>Cancel</button>";
        document.getElementById("createMain").innerHTML += "<div id='div" + resources.length + "' class='portal-bg item'>" + textArea + buttons + "</div>";
        resources.push({
            type: "Link",
            data: ""
        });
    } else if (type == 4) {
        textArea = "<p>Add Link URL:</p><textarea id='input" + resources.length + "'></textarea><br>";
        buttons = "<button id='" + resources.length + "' onclick='finishItem(this.id)'>Ok</button><button id='" + resources.length + "' onclick='cancelItem(this.id)'>Cancel</button>";
        document.getElementById("createMain").innerHTML += "<div id='div" + resources.length + "' class='frame-bg item'>" + textArea + buttons + "</div>";
        resources.push({
            type: "IFrame",
            data: ""
        });
    } else if (type == 5) {
        textArea = "<p>Add Forum ID:</p><textarea id='input" + resources.length + "'></textarea><br>";
        buttons = "<button id='" + resources.length + "' onclick='finishItem(this.id)'>Ok</button><button id='" + resources.length + "' onclick='cancelItem(this.id)'>Cancel</button>";
        document.getElementById("createMain").innerHTML += "<div id='div" + resources.length + "' class='world-bg item'>" + textArea + buttons + "</div>";
        resources.push({
            type: "CrFr",
            data: ""
        });
    }
}

function finishItem(item) {
    resources[item].data = document.getElementById("input" + item).value;
    document.getElementById("div" + item).innerHTML = "<button class='topCancel' id='" + item + "' onclick='cancelItem(this.id)'>X</button>";
    if (resources[item].type == "Text") {
        document.getElementById("div" + item).innerHTML += "<h3>" + resources[item].data + "</h3>";
    } else if (resources[item].type == "Image") {
        document.getElementById("div" + item).innerHTML += "<img src='" + resources[item].data + "'>";
    } else if (resources[item].type == "Link") {
        document.getElementById("div" + item).innerHTML += "<br><br><br><a target='_blank' style='color:aquamarine;' href='" + resources[item].data + "'>View Website</a><br><br><br><br>";
    } else if (resources[item].type == "IFrame") {
        document.getElementById("div" + item).innerHTML += "<iframe src='" + resources[item].data + "'>";
    } else if (resources[item].type == "CrFr") {
        document.getElementById("div" + item).innerHTML += "<h1>Crafty Forum Link: <h3>ID " + resources[item].data + "</h3></h1><hr><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
    }
    console.log(resources);
    document.getElementById("LabelLength").innerHTML = resources.length;
}

function cancelItem(item) {
    resources[item].type = "CanceledItem";
    document.getElementById("div" + item).innerHTML = "";
    document.getElementById("div" + item).className = "deleted";
}

function send() {
    if (resources.length > 0) {
        firebase.database().ref("/forums/").push({
            by: whosEditing,
            name: ThisForumName,
            verification: false,
            resources: resources,
        });
        document.getElementById("canEditDiv").style.visibility = "visible";
        document.getElementById("canEditDiv").innerHTML = "<h1>FORUM SENT</h1><p>Name: "+ThisForumName+"</p><p>Creator: "+whosEditing+"</p><p>" + resources.length + " resources in it</p>";
    }else{
        console.error("Too small Forum!");
    }
}