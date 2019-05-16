const player = document.getElementById("player");
//const player2 = document.getElementById("player2");
const game_area = document.getElementById("game_area");
const enemies = ['sprites/enemy1.png', 'sprites/enemy2.png', 'sprites/enemy3.png'];
const counter = document.querySelector('#counter span')
var over = 0;
let game_start = document.createElement('img');
let sprite = "sprites/gamestart.png";
game_start.src = sprite;
game_start.style.left = `$250px`;
game_start.style.top = `$250px`;
game_area.appendChild(game_start);
game_start.addEventListener("click", start);
var interval;
function start()
{
	game_start.style.display = 'none';
	interval = window.setInterval(createEnemy, 2400);
	window.addEventListener("keydown", fly);
}
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
	}else if(event.key == "p"){
		event.preventDefault();
		pause();
	//shoot with space bar
	}else if(event.key == " ")
	{
		event.preventDefault();
		fire();
	}
}

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
			xPos = xPos + 10;
			bullet.style.left = `${xPos + 5}px`
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
				enemy.dead = true;
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
	let dead = false;
	new_enemy.dead = false;
	new_enemy.src = sprite;
	new_enemy.classList.add('enemy');
	new_enemy.style.left = '560px';
	new_enemy.style.top = `${Math.floor(Math.random() * 450) + 1}px`;
	new_enemy.style.bottom = new_enemy.style.top + 37;
	//make sure the enemy spawned within the correct y value, otherwise call spawn again. Not a great way but it was easier than tweaking the random number generator.
	//and this doesn't work. This is ridiculous.
	if(new_enemy.style.top < 30 || new_enemy.style.top > 431)
	{
		createEnemy();
	}
	else{
		game_area.appendChild(new_enemy);
		moveEnemy(new_enemy);
	}
}

//function moves the enemies.
function moveEnemy(enemy){
	let xPos = parseInt(window.getComputedStyle(enemy).getPropertyValue('left'));
	let yPos = parseInt(window.getComputedStyle(enemy).getPropertyValue('top'));
	function movediv(timestamp){
		if(xPos < 0){
			if(Array.from(enemy.classList).includes("dead-enemy")){
				enemy.remove();
			}else{
				allOgre();
			}
		}
		xPos = xPos - 4;
		enemy.style.left = `${xPos - 4}px`
		enemy.style.top = `${yPos}px`
		requestAnimationFrame(movediv) // call requestAnimationFrame again to animate next frame
	}
	requestAnimationFrame(movediv)
}

function collisionCheck(bullet,enemy){
	let bLeft = parseInt(bullet.style.left);
	let bTop = parseInt(bullet.style.top);
	//let bBottom = bTop + 20;
	let eTop = parseInt(enemy.style.top);
	let eLeft = parseInt(enemy.style.left);
	//let eBottom = eTop + 30;

    let eHeight = 30;
    let bHeight = 20;

    let eWidth = 25;
    let bWidth = 25;
//b = rect1 ; e = rect2

	//all of the numbers check out, something else is broken with hit detection. JS positioning sucks
    if (bLeft < (eLeft + eWidth) &&
    (bLeft + bWidth) > eLeft &&
    bTop < (eTop + eHeight) &&
    (bTop + bHeight) > eTop) {
        return true;
    }else{
		return false;
	}

}
function allOgre()
{
	if(over == 0)
	{
		over = 1;
		clearInterval(createEnemy);
		let enemies = document.querySelectorAll(".enemy");
		enemies.forEach(enemy => enemy.remove());
		let bullets = document.querySelectorAll(".bullet");
		bullets.forEach(bullet => bullet.remove())
		setTimeout(() => {
			player.remove();
			//add game over
			let game_over = document.createElement('img');
			let sprite = "sprites/gameover.png";
			game_over.src = sprite;
			game_over.style.left = `$250px`;
			game_over.style.top = `$250px`;
			game_area.appendChild(game_over);
			game_over.addEventListener("click", refresh);
			//send to client.js when game ends
			onEnd(counter.innerText);
			clearInterval(interval);
		}, 1000);
	}
}
function refresh()
{
	window.location.href = "index.html";
}
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

