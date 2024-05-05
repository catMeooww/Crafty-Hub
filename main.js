var user = localStorage.getItem("user");
var password = localStorage.getItem("password");
var logged = false;

const firebaseConfig = {
    apiKey: "AIzaSyCKvz7g09FsdbEhA0Kr87_FWI5PjW1K1lM",
    authDomain: "crafty-news-forum.firebaseapp.com",
    databaseURL: "https://crafty-news-forum-default-rtdb.firebaseio.com",
    projectId: "crafty-news-forum",
    storageBucket: "crafty-news-forum.appspot.com",
    messagingSenderId: "110293336180",
    appId: "1:110293336180:web:25cc1fe8bdfc1b563d5121"
};
firebase.initializeApp(firebaseConfig);

function loadUserData() {
    if (user != undefined && password != undefined) {
        var userref = firebase.database().ref("/users/" + user + "/status");
        var passref = firebase.database().ref("/users/" + user + "/password");
        var isUserCreated;
        var isJoining = false;
        userref.on("value", data => {
            isUserCreated = data.val();
            if (!isJoining) {
                isJoining = true;
                if (isUserCreated == "online") {
                    passref.on("value", data => {
                        canPass = data.val();
                        if (canPass == password) {
                            logged = true;
                            document.getElementById("user-name").innerHTML = user;
                            console.log("logged: " + logged);
                        }
                    })
                }
            }
        });
    }
    console.log("logged: " + logged);
}

function redirect(to) {
    if (to == 1) {
        window.location = "surfacehub.html";
        console.info("surface hub");
    } else if (to == 2) {
        window.location = "netherhub.html";
        console.info("nether hub");
    } else if (to == 3) {
        window.location = "craftylogin.html";
        console.info("login page");
    } else if (to == 4) {
        console.info("creation page");
        window.location = "craftyDesigner.html";
    } else {
        console.info("index");
        window.location = "index.html";
    }
}

function userBright() {
    if (logged == true) {
        var UserNameStyle = document.getElementById("user-name").style;
        UserNameStyle.color = "blueviolet";
        UserNameStyle.textShadow = "5px 5px 5px blue";
    }
}
function unuserBright() {
    if (logged == true) {
        var UserNameStyle = document.getElementById("user-name").style;
        UserNameStyle.color = "white";
        UserNameStyle.textShadow = "0px 0px 0px black";
    }
}

function showOptions() {
    document.getElementById("mainBody").style.width = "74%";
    document.getElementById("option-container").style.width = "25%";
    var options = document.getElementsByClassName("option-label");
    for (var i = 0; i < options.length; i++) {
        options.item(i).style.visibility = "visible";
    }
}
function hideOptions() {
    document.getElementById("mainBody").style.width = "89%";
    document.getElementById("option-container").style.width = "10%";
    var options = document.getElementsByClassName("option-label");
    for (var i = 0; i < options.length; i++) {
        options.item(i).style.visibility = "hidden";
    }
}

//server

function getForums(isSurface) {
    firebase.database().ref("/forums").on('value', function (snapshot) {
        document.getElementById("output").innerHTML = "";
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();

            firebaseMessageId = childKey;
            forumData = childData;

            forumName = forumData['name'];
            whoSend = forumData['by'];
            verified = forumData['verification'];

            nameH2 = "<h2>" + forumName + "</h2>";
            if (verified) {
                bottomLabel = "<div class='trueV'><label>sended by: " + whoSend + "</label><label class='isVerifier'>Verified</label></div>";
            } else {
                bottomLabel = "<div class='falseV'><label>sended by: " + whoSend + "</label><label class='isVerifier'>Unverified</label></div>";
            }

            forumdiv = "<div class='forumdiv' id='" + firebaseMessageId + "' onclick='openforum(this.id)'>" + nameH2 + bottomLabel + "</div><br><br>";

            if (isSurface == true) {
                if (verified == true) {
                    document.getElementById("output").innerHTML += forumdiv;
                }
            } else {
                document.getElementById("output").innerHTML += forumdiv;
            }
        });
    });
}

function openforum(forumid) {
    console.log(forumid);
    localStorage.setItem("selectedForum", forumid);
    window.location = "craftyforum.html";
}

function getForumData() {
    selectedForum = localStorage.getItem("selectedForum");
    if (selectedForum != undefined) {
        document.getElementById("forumID").textContent = selectedForum;

        //forum header
        firebase.database().ref("/forums/" + selectedForum + "/name").on("value", data => {
            thisForumName = data.val();
            document.getElementById("thisForumName").innerHTML = thisForumName;
        })
        firebase.database().ref("/forums/" + selectedForum + "/by").on("value", data => {
            thisForumCreator = data.val();
            firebase.database().ref("/forums/" + selectedForum + "/verification").on("value", data => {
                thisForumVerification = data.val();
                if (thisForumVerification) {
                    thisForumHeader = "<div class='trueV'><label>sended by: " + thisForumCreator + "</label><label class='isVerifier'>Verified</label></div>";
                } else {
                    thisForumHeader = "<div class='falseV'><label>sended by: " + thisForumCreator + "</label><label class='isVerifier'>Unverified</label></div>";
                }
                document.getElementById("thisForumHeader").innerHTML = thisForumHeader;
            })
        })

        //forum body
        firebase.database().ref("/forums/" + selectedForum + "/resources").on('value', function (snapshot) {
            document.getElementById("forumData").innerHTML = "";
            snapshot.forEach(function (childSnapshot) {
                childKey = childSnapshot.key; childData = childSnapshot.val();
    
                firebaseMessageId = childKey;
                resourceItem = childData;
    
                resourceData = resourceItem['data'];
                resourceType = resourceItem['type'];
    
                if (resourceType == "Text") {
                    document.getElementById("forumData").innerHTML += "<div class='wood-bg item'><h3>" + resourceData + "</h3></div>";
                } else if (resourceType == "Image") {
                    document.getElementById("forumData").innerHTML += "<div class='frame-bg item'><img src='" + resourceData + "'></div>";
                } else if (resourceType == "Link") {
                    document.getElementById("forumData").innerHTML += "<div class='portal-bg item'><br><br><br><a target='_blank' style='color:aquamarine;' href='" + resourceData + "'>View Website</a><br><br><br><br></div>";
                } else if (resourceType == "IFrame") {
                    document.getElementById("forumData").innerHTML += "<div class='frame-bg item'><iframe src='" + resourceData + "'></div>";
                } else if (resourceType == "CrFr") {
                    document.getElementById("forumData").innerHTML += "<div class='world-bg item' id='"+resourceData+"' title='go to this forum' onclick='openforum(this.id)'><h1>Crafty Forum Link: <h3>ID-" + resourceData + "</h3></h1><hr><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div>";
                }
            });
        });

        //forum comments
        firebase.database().ref("/forums/" + selectedForum + "/comments").on('value', function (snapshot) {
            document.getElementById("forumComments").innerHTML = "";
            commentsQuantity = 0;
            snapshot.forEach(function (childSnapshot) {
                childKey = childSnapshot.key; childData = childSnapshot.val();
    
                firebaseMessageId = childKey;
                commentItem = childData;
    
                commentData = commentItem['comment'];
                commentSender = commentItem['by'];
                commentColor = "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";
                commentH3 = "<h4>"+commentSender+"</h4><h3 style='color:"+commentColor+"'>"+commentData+"</h3>";
    
                document.getElementById("forumComments").innerHTML += "<div class='commentItem'>"+commentH3+"</div>";
                commentsQuantity++;
            });
            if(commentsQuantity == 0){
                document.getElementById("forumComments").innerHTML = "<div class='commentError'><h3>No comments yet</h3><h4>Maybe a creeper exploded them?</h4><div>";
            }else{
                document.getElementById("commentsHeader").innerHTML = "Comments - " + commentsQuantity;
            }
        });
    }else{
        window.location = "surfacehub.html";
    }
}

function OpenComments(){
    document.getElementById("commentSection").style.left = "80%";
}

function CloseComments(){
    document.getElementById("commentSection").style.left = "100%";
}

function sendComment(commentType){
    commentToSend = document.getElementById("commentInput").value;
    if(logged){
       if(commentType == "diamond"){
        firebase.database().ref("/forums/" + selectedForum + "/comments").push({
            comment:"<b class='commentDiamond'>"+user+" sended a diamond!</b>",
            by:user
        })
       }else if(commentType == "text" && commentToSend != ""){
        firebase.database().ref("/forums/" + selectedForum + "/comments").push({
            comment:commentToSend,
            by:user
        })
       }
    }else{
        document.getElementById("commentError").innerHTML = "You need to Login First";
    }
}