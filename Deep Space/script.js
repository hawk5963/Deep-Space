const player = document.getElementById("player");
const game_area = document.getElementById("game_area");
const enemies = ['sprites/enemy1.png', 'sprites/enemy2.png', 'sprites/enemy3.png'];
const counter = document.querySelector('#counter span')
var intervalID = window.setInterval(createEnemy, 850);
//a function for having the player move upwards
function Up(){
		let topPos = window.getComputedStyle(player).getPropertyValue('top');
		//if the player goes to the top of the screen, don't let them go further
		if(player.style.top == "11px")
		{
			return;
		}else{
			let position = parseInt(topPos);
			//might be a better idea to use requestAnimationFrame() if we want cleaner movement.
			position = position - 7;
			player.style.top = `${position}px`;
		}
}

//a function for having the player move down
function Down(){
	let topPos = window.getComputedStyle(player).getPropertyValue('top');
	//don't let the player go offscreen too low either
	if(player.style.top == "431px")
	{
		return;
	}else{
		let position = parseInt(topPos);
		position = position + 7;
		player.style.top = `${position}px`;
	}
}

//a function to actually let the player move

function fly(event){
	if(event.key == "ArrowUp"){
		//need to prevent default so our custom function runs instead
		event.preventDefault();
		Up();
	}else if(event.key == "ArrowDown"){
		event.preventDefault();
		Down();
	//shoot with space bar
	}else if(event.key == " ")
	{
		event.preventDefault();
		fire();
	}
}
window.addEventListener("keydown", fly);

//a function for firing the weapon
function fire(){
	let bullet = makeBullet();
	game_area.appendChild(bullet);
	let sfx = new Audio('sound/bullet.wav');
	sfx.play();
	moveBullet(bullet);
}

function makeBullet(){
	let xPos = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
	let yPos = parseInt(window.getComputedStyle(player).getPropertyValue('top'));
	let new_bullet = document.createElement('img');
	new_bullet.src = 'sprites/bullet.png';
	new_bullet.classList.add('bullet');
	new_bullet.style.left = `$20px`;
	new_bullet.style.top = `${yPos}px`;
	new_bullet.style.bottom = `${yPos - 20}px`;
	return new_bullet;
}

function moveBullet(bullet){

	let xPos = parseInt(window.getComputedStyle(bullet).getPropertyValue('left'));
	let yPos = parseInt(window.getComputedStyle(bullet).getPropertyValue('top'));
	function movediv(timestamp){
		//destroy when offscreen
		if(xPos >= 740)
		{
			bullet.style.display = 'none';
		bullet.remove();
		}else{
			//otherwise keep moving
			xPos += 5;
			bullet.style.left = `${xPos}px`
			bullet.style.top = `${yPos}px`
			bullet.style.bottom = `${yPos - 20}px`
			requestAnimationFrame(movediv) // call requestAnimationFrame again to animate next frame
		}
		//call collision
		let enemies = document.querySelectorAll(".enemy");
		enemies.forEach(enemy => {
			if(collisionCheck(bullet,enemy) == true){
				let explosion = new Audio('sound/rumble.flac');
				explosion.play();
				enemy.src = 'sprites/explosion.png';
				enemy.classList.remove("enemy");
				enemy.classList.add("dead-enemy");
				counter.innerText = parseInt(counter.innerText) + 1;
			}
		})
	}
	requestAnimationFrame(movediv)
}

//function creates enemies, selecting from 3 possible ones
function createEnemy()
{
	let new_enemy = document.createElement('img');
	//randomly select which enemy
	let sprite = enemies[Math.floor(Math.random()*enemies.length)];
	new_enemy.src = sprite;
	new_enemy.classList.add('enemy');
	new_enemy.style.left = '560px';
	new_enemy.style.top = `${Math.floor(Math.random() * 500) + 50}px`;
	game_area.appendChild(new_enemy);
	moveEnemy(new_enemy);
}

//function moves the enemies.
function moveEnemy(enemy){
	let xPos = parseInt(window.getComputedStyle(enemy).getPropertyValue('left'));
	let yPos = parseInt(window.getComputedStyle(enemy).getPropertyValue('top'));
	function movediv(timestamp){
		xPos -= 5
		enemy.style.left = `${xPos}px`
		enemy.style.top = `${yPos}px`
		enemy.style.bottom = `${yPos - 37}px`
		requestAnimationFrame(movediv) // call requestAnimationFrame again to animate next frame
	}
	requestAnimationFrame(movediv)
}

function collisionCheck(bullet,enemy){
	let bLeft = parseInt(bullet.style.left);
	let bTop = parseInt(bullet.style.top);
	let bBottom = bTop + 20;
	let eTop = parseInt(enemy.style.top);
	let eBottom = eTop + 30;

    let eheight = 30;
    let bheight = 20;

    let width = 100;

	let eLeft = parseInt(enemy.style.left);
//b = rect1 ; e = rect2

    if (bLeft < eLeft + width &&
    bLeft + width > eLeft &&
    bTop < eTop + eheight &&
    bTop + bheight > eTop) {
        console.log("colliding!");
        return true;
    }

    return false;
}
/*
	//if the boxes overlap in the y coordinates
	if((bTop <= eTop && bBottom >= eBottom)){
		if(bLeft >= eLeft && bLeft <= (eLeft + 100)){
			console.log("kaboom");
			console.log("eTop: " + eTop);
			console.log("eBottom: " + eBottom);
			console.log("eLeft: " + eLeft);
			console.log("bTop: " + bTop);
			console.log("bBottom: " + bBottom);
			console.log("bLeft: " + bLeft);
			return true;
		}
		else{
			return false;
		}
	}else{
		return false;
	}

}*/
/*
function UpdateUserStats(username,password,highscores,enemiesDestroyed,SurvivalTime){
	var sqlite3 = require('sqlite3').verbose();

	var db = userData.sqlite3;
	db.run("INSERT INTO userData(username,password,highscores,enemiesDestroyed,SurvivalTime)");
	db.run("VALUES('" + username + "','" + password + "'," + highscores + "," + enemiesDestroyed + "," + SurvivalTime + ");");
	db.close();
}

function AddUser(username,password,){
	var sqlite3 = require('sqlite3').verbose();

	var db = userData.sqlite3;
	db.run("INSERT INTO userData(username,password,highscores,enemiesDestroyed,SurvivalTime)");
	db.run("VALUES('" + username + "','" + password + "',0,0,0);");
	db.close();
}

function checkForUser(username,password){
	var sqlite3 = require('sqlite3').verbose();
	var db = userData.sqlite3;
	db.run("SELECT username FROM userData WHERE username == ")
}
*/
// Get the modal
var loginBox = document.getElementById('loginButton');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == loginBox) {
    loginBox.style.display = "none";
  }
}

var SignUpBox = document.getElementById('signUpButton');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == SignUpBox) {
    SignUpBox.style.display = "none";
  }
}

