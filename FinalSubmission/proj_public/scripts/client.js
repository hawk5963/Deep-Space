var app;

function Init() {
    app = new Vue({
        el: "#app",
        data: {
	username: '',
	password: '',
	highscore: 0,
	action_type: "/SignIn"
	}
    });
}

function SignIn(event) {
	console.log("we here");
       GetJson(app.action_type + "?" + app.username + "/" + app.password).then((data) => {
            console.log(data);
        });
    }



function GetJson(url) {
    return new Promise((resolve, reject) => {
        $.get(url, (data) => {
            resolve(data);
        }, "json");
    });
}
