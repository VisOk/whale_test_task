let login = null;
let password = null;
let button = null;
let buttonTwo = null;
let confirmPassword = null;

let token = "";

let nav = document.getElementById("nav");
let content = document.getElementById("content");

let page = "";

const apiSignIn = "http://127.0.0.1/signin";
const apiSignUp = "http://127.0.0.1/signup";
const apiLatency = "http://127.0.0.1/latency";
const apiLogout = "http://127.0.0.1/logout?all=";

nav.addEventListener("click", ()=>{
    switch(event.target.id){
        case "menu_signin": signinPage(event.target);
            break;
        case "menu_signup": signupPage(event.target);
            break;
        case "menu_info": infoPage(event.target);
            break;
        case "menu_latency": latencyPage(event.target);
            break;
        case "menu_logout": logoutPage(event.target);
            break;
        default: return;
    }
})

function activeMenuButton(button){
    for(let e of nav.children){
        e.lastChild.classList.remove("menu_active");
    };
    button.classList.add("menu_active");
}

function signinPage(button){
    activeMenuButton(button);
    page = "signin";

    content.innerHTML = `
    <div id="input">
        <h3>Authorization</h3>
        <input id="login" type="text" value="" placeholder="Login"> <br>
        <input id="password" type="password" value="" placeholder="Password"> <br>
        <input id="submit" type="button" value="SignIn">
    </div>`;

    login = document.getElementById("login");
    password = document.getElementById("password");
    button = document.getElementById("submit");

    button.addEventListener("click", ()=>{
        if(!login.value || !password.value){
            login.classList.add("errorData");
            password.classList.add("errorData");
            return;
        }
    
        fetch(apiSignIn, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
              },
            body: JSON.stringify({
                login: login.value,
                password: password.value
                }),
        })
        .then(res=>{
            if(!res.ok){
                console.log(res.status);
                return;
            }
            res.json()
            .then(res=>{
                console.log(res);
                token = res.token;
            })
            .catch(err=>{
                console.error(err);
            })
        })
        .catch(err=>{
            console.error(err);
        })
    
        login.value = "";
        password.value = "";
        login.classList.remove("errorData");
        password.classList.remove("errorData");
    });

}

function signupPage(button){
    activeMenuButton(button);
    page = "signup";

    content.innerHTML = `
    <div id="input">
        <h3>Registration</h3>
        <input id="login" type="text" value="" placeholder="Phone or email"> <br>
        <input id="password" type="password" value="" placeholder="Password"> <br>
        <input id="conf_password" type="password" value="" placeholder="Confirm password"> <br>
        <input id="submit" type="button" value="SignUp">
    </div>`;

    login = document.getElementById("login");
    password = document.getElementById("password");
    confirmPassword = document.getElementById("conf_password");
    button = document.getElementById("submit");

    button.addEventListener("click", ()=>{
        if(!login.value || !password.value || !confirmPassword){
            login.classList.add("errorData");
            password.classList.add("errorData");
            confirmPassword.classList.add("errorData");
            return;
        }else if(password.value!=confirmPassword.value){
            password.classList.add("errorData");
            confirmPassword.classList.add("errorData");
            return;
        }
    
        fetch(apiSignUp, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
              },
            body: JSON.stringify({
                login: login.value,
                password: password.value
                }),
        })
        .then(res=>{
            if(!res.ok){
                console.log(res.status);
                return;
            }
            res.json()
            .then(res=>{
                console.log(res);
                token = res.token;
            })
            .catch(err=>{
                console.error(err);
            })
        })
        .catch(err=>{
            console.error(err);
        })
    
        login.value = "";
        password.value = "";
        confirmPassword.value = "";
        login.classList.remove("errorData");
        password.classList.remove("errorData");
        confirmPassword.classList.remove("errorData");
    });
}

function infoPage(button){
    activeMenuButton(button);
    page = "info";

    content.innerHTML = ``;
}

function latencyPage(button){
    activeMenuButton(button);
    page = "latency";

    content.innerHTML = `
    <div id="input">
        <h3>Check ping to google.com</h3>
        <input id="submit" type="button" value="Ping">
    </div>
    `;

    button = document.getElementById("submit");

    button.addEventListener("click", ()=>{
        fetch(apiLatency, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
              },
        })
        .then(res=>{
            if(!res.ok){
                console.error("Response status " + res.status);
                return;
            }
            res.json()
            .then(res=>{
                token = res.token ? res.token : token;
                console.log(res);
            })
            .catch(err=>{
                console.error(err);
            })
        })
        .catch(err=>{
            console.error(err);
        })
    })
}

function logoutPage(button){
    activeMenuButton(button);
    page = "logout";

    content.innerHTML = ` 
    <div id="input">
        <h3>LogOut</h3>
        <input id="submitAll" type="button" value="All sessions">
        <input id="submitCurrent" type="button" value="Current session">
    </div>`;

    buttonAll = document.getElementById("submitAll");
    buttonCurrent = document.getElementById("submitCurrent");

    buttonAll.addEventListener("click", logoutClick);
    buttonCurrent.addEventListener("click", logoutClick);

    function logoutClick(){
        let all = event.target.id=="submitAll" ? true : false;
        fetch(apiLogout+all, {
            method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                  },
        })
        .then()
        .catch()
    }
    
}