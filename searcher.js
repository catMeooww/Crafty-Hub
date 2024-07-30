searchText = "";
searchV = "verified";
searchType = "forum"

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

            if ((searchText.toUpperCase() == forumName.toUpperCase() && searchType == "forum") || (searchText.toUpperCase() == firebaseMessageId.toUpperCase() && searchType == "id") || (searchText.toUpperCase() == whoSend.toUpperCase() && searchType == "user") || (searchText == "")) {

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

function loadPage(type) {
    if (type == "forums") {
        loadForumButtons();
    }
}

function setSearch() {
    searching = document.getElementById("searcherForums").value;
    searchText = searching;
    document.getElementById("searchName").innerHTML = searching;
    searchForums();
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