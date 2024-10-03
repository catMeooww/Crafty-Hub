page = "forums";
searchText = "";
searchV = "verified";
searchType = "forum";

function searchForums() {
    firebase.database().ref("/forums").on('value', function (snapshot) {
        document.getElementById("output").innerHTML = "";
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();

            firebaseMessageId = childKey;
            forumData = childData;

            forumName = forumData['name'];
            whoSend = forumData['by'];
            verified = forumData['verification'];

            if ((forumName.toUpperCase().indexOf(searchText.toUpperCase()) != -1 && searchType == "forum") || (firebaseMessageId.toUpperCase().indexOf(searchText.toUpperCase()) != -1 && searchType == "id") || (whoSend.toUpperCase().indexOf(searchText.toUpperCase()) != -1 && searchType == "user")) {

                nameH2 = "<h2>" + forumName + "</h2>";
                if (verified) {
                    bottomLabel = "<div class='trueV'><label>sent by: " + whoSend + "</label><label class='isVerifier'>| Verified |</label></div>";
                } else {
                    bottomLabel = "<div class='falseV'><label>sent by: " + whoSend + "</label><label class='isVerifier'>| Unverified |</label></div>";
                }

                forumdiv = "<div class='forumdiv' id='" + firebaseMessageId + "' onclick='openforum(this.id)'>" + nameH2 + bottomLabel + "</div><br><br>";

                if (searchV == 'verified' && verified == true) {
                    document.getElementById("output").innerHTML += forumdiv;

                } else if (searchV == "unverified" && !verified) {
                    document.getElementById("output").innerHTML += forumdiv;
                }
            }
        });
    });
}

function searchUsers() {
    firebase.database().ref("/users").on('value', function (snapshot) {
        document.getElementById("output").innerHTML = "";
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();

            userName = childKey;
            userStatus = childData['status'];

            if (userName.toUpperCase().indexOf(searchText.toUpperCase()) != -1) {

                nameH2 = "<h2>" + userName + "</h2>";
                if (userStatus == "online") {
                    bottomLabel = "<div class='trueV'><label>Normal Account</label></div>";
                }else if(userStatus == "mod"){
                    bottomLabel = "<div class='trueV'><label>Administrator</label></div>";
                } else {
                    bottomLabel = "<div class='falseV'><label>Disabled Account</label></div>";
                }

                userdiv = "<div class='forumdiv' title='" + userName + "'>" + nameH2 + bottomLabel + "</div><br><br>";

                document.getElementById("output").innerHTML += userdiv;
            }
        });
    });
}

function loadForumButtons() {
    latestPage = localStorage.getItem("latestPage");
    latestType = localStorage.getItem("latestSearchT");
    document.getElementById("V1").style.borderColor = 'yellow';
    document.getElementById("V2").style.borderColor = 'yellow';
    if (latestPage == "surfacehub") {
        searchV = "verified";
        document.getElementById("V1").style.borderColor = 'blue';
    } else {
        searchV = "unverified";
        document.getElementById("V2").style.borderColor = 'blue';
    }
    document.getElementById("T1").style.borderColor = 'yellow';
    document.getElementById("T2").style.borderColor = 'yellow';
    document.getElementById("T3").style.borderColor = 'yellow';
    if (latestType == "id") {
        searchType = "id";
        document.getElementById("T2").style.borderColor = 'blue';
    } else if (latestType == "user") {
        searchType = "user";
        document.getElementById("T3").style.borderColor = 'blue'
    } else {
        searchType = "forum";
        document.getElementById("T1").style.borderColor = 'blue';
    }
    searchForums();
}

function loadUsersButtons() {
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
                    passref.on("value", async data => {
                        canPass = data.val();
                        if (canPass == password) {
                            logged = true;
                            if (isMobile) {
                                document.getElementById("user-name-mb").innerHTML = user;
                            } else {
                                document.getElementById("user-name").innerHTML = user;
                            }
                            console.log("logged: " + logged);

                            firebase.database().ref("/forums").on('value', function (snapshot) {
                                forumQ = 0;
                                snapshot.forEach(function (childSnapshot) {
                                    childKey = childSnapshot.key; childData = childSnapshot.val();
                                    firebaseMessageId = childKey;
                                    forumData = childData;
                                    whoSend = forumData['by'];
                                    if (whoSend == user){
                                        forumQ += 1;
                                    }
                                });
                                userDetailName = "<hr> <img src='assets/steve.jpeg' width=50> <label style='font-size:40px'>"+user+"</label><br><br>";
                                userDetailPassword = "<button id='password_show' onclick='showpassword()'>Password: "+password+"</button><br><br>";
                                userTotalForums = "<label>Forums Created: "+ forumQ +"</label><br><br>";
                                loginPageBtn = "<button class='searchButton' onclick='redirect(3)'>Access Login Page</button><br><br>";
                                document.getElementById("userData").innerHTML = userDetailName + userDetailPassword + userTotalForums + loginPageBtn;
                            });
                        }
                    });
                }
            }
        });
    }
    console.log("logged: " + logged);

    searchUsers();
}

function loadPage(type) {
    if (type == "forums") {
        loadForumButtons();
    } else if (type == "users"){
        loadUsersButtons()
    }
    page = type;
}

function setSearch() {
    searching = document.getElementById("searcherForums").value;
    searchText = searching;
    document.getElementById("searchName").innerHTML = searching;
    if (page == "forums"){
        searchForums();
    }else if (page ==  "users"){
        searchUsers();
    }
}

function filterV(v){
  if(v == 0){
    localStorage.setItem('latestPage','surfacehub');
  }else if(v == 1){
    localStorage.setItem('latestPage','netherhub');
  }
  loadForumButtons();
}

function filterT(t){
    if(t == 0){
      localStorage.setItem('latestSearchT','forum');
    }else if(t == 1){
      localStorage.setItem('latestSearchT','id');
    }else if(t == 2){
        localStorage.setItem('latestSearchT','user');
    }
    loadForumButtons();
  }

function showpassword(){
    passwordswitch = document.getElementById("password_show");
    if (passwordswitch.style.backgroundColor == "black"){
        passwordswitch.style.backgroundColor = "purple";
    }else{
        passwordswitch.style.backgroundColor = "black";
    }
}