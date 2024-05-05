switchLogMode = "login";

function LogAccount() {
    userinput = document.getElementById("login-username").value;
    passwordinput = document.getElementById("login-userpassword").value;
    if (userinput != "" && passwordinput != "") {
        var userref = firebase.database().ref("/users/" + userinput + "/status");
        var passref = firebase.database().ref("/users/" + userinput + "/password");
        var isUserCreated;
        var isJoining = false;
        userref.on("value", data => {
            isUserCreated = data.val();
            if (!isJoining) {
                isJoining = true;
                if (isUserCreated == "online") {
                    passref.on("value", data => {
                        canPass = data.val();
                        if (canPass == passwordinput) {
                            localStorage.setItem("user", userinput);
                            localStorage.setItem("password", passwordinput);
                            location.reload();
                        } else {
                            document.getElementById("login-error").innerHTML = "Incorrect Password";
                            document.getElementById("login-userpassword").style.borderColor = "red";
                        }
                    })
                } else {
                    document.getElementById("login-error").innerHTML = "Incorrect Username";
                    document.getElementById("login-username").style.borderColor = "red";
                }
            }
        });
    } else {
        document.getElementById("login-error").innerHTML = "All the inputs need a value";
        document.getElementById("login-username").style.borderColor = "yellow";
        document.getElementById("login-userpassword").style.borderColor = "yellow";
    }
}

function createAccount() {
    userinput = document.getElementById("login-username").value;
    passwordinput = document.getElementById("login-userpassword").value;
    if (userinput != "" && passwordinput != "") {
        var userref = firebase.database().ref("/users/" + userinput + "/status");
        var isUserCreated;
        var isJoining = false;
        userref.on("value", data => {
            isUserCreated = data.val();
            if (!isJoining) {
                isJoining = true;
                if (isUserCreated == null) {
                    firebase.database().ref("/users/").child(userinput).update({
                        password: passwordinput,
                        status: "online"
                    });
                    document.getElementById("login-error").innerHTML = "Account Sucessfuly Created";
                } else {
                    document.getElementById("login-error").innerHTML = "This username already exists";
                    document.getElementById("login-username").style.borderColor = "red";
                }
            }
        });
    } else {
        document.getElementById("login-error").innerHTML = "All the inputs need a value";
        document.getElementById("login-username").style.borderColor = "yellow";
        document.getElementById("login-userpassword").style.borderColor = "yellow";
    }
}

function loadUserLogData() {
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
                            document.getElementById("login-page").innerHTML = "<div style='padding: 10px;background-color: rgba(0, 0, 0, 0.500); border: outset black 5px;'><h3>Logged as: "+user+"</h3><button style='background-color:red;color:white;padding:1px;' onclick='logout()'>Log-Out</button>"
                            console.log("logged: " + logged);
                        }
                    })
                }
            }
        });
    }
    console.log("logged: " + logged);
}

function switchlogin() {
    if (switchLogMode == "login") {
        switchLogMode = "create";
        document.getElementById("logindiv").innerHTML = "<label>Create Account</label><p>Your Username</p><input type='text' id='login-username'><p>Your Password</p><input type='password' id='login-userpassword'><br><br><button onclick='createAccount()' class='mc-button'>Create Account</button><br><p id='login-error'></p>"
        document.getElementById("switch-btn").innerHTML = "Log-in";
    } else {
        switchLogMode = "login";
        document.getElementById("logindiv").innerHTML = "<label>Log-in Account</label><p>Your Username</p><input type='text' id='login-username'><p>Your Password</p><input type='password' id='login-userpassword'><br><br><button onclick='LogAccount()' class='mc-button'>Log-in</button><br><p id='login-error'></p>"
        document.getElementById("switch-btn").innerHTML = "Create Account";
    }
}

function logout(){
    localStorage.removeItem("user");
    localStorage.removeItem("password");
    location.reload();
}