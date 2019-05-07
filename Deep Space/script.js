const player = document.getElementById("player");
const game_area = document.getElementById("game_area");
const enemies = ['sprites/enemy1.png', 'sprites/enemy2.png', 'sprites/enemy3.png'];

var intervalID = window.setInterval(createEnemy, 850);
//a function for having the player move upwards
function Up(){
		let topPos = window.getComputedStyle(player).getPropertyValue('top');
		//if the player goes to the top of the screen, don't let them go further
		if(player.style.top == "0px")
		{
			return;
		}else{
			let position = parseInt(topPos);
			//might be a better idea to use requestAnimationFrame() if we want cleaner movement.
			position = position - 5;
			player.style.top = `${position}px`;
		}
}

//a function for having the player move down
function Down(){
	let topPos = window.getComputedStyle(player).getPropertyValue('top');
	//don't let the player go offscreen too low either
	if(player.style.top == "510px")
	{
		return;
	}else{
		let position = parseInt(topPos);
		position = position + 5;
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
	return new_bullet;
}

function moveBullet(bullet){

	let xPos = parseInt(window.getComputedStyle(bullet).getPropertyValue('left'));
	function movediv(timestamp){
		//destroy when offscreen
		if(xPos >= 740)
		{
			bullet.style.display = 'none';
		bullet.remove();
		}else{
			//otherwise keep moving
			xPos += 5
			bullet.style.left = `${xPos - 4}px`
			requestAnimationFrame(movediv) // call requestAnimationFrame again to animate next frame
		}
		//call collision
		let enemies = document.querySelectorAll(".enemy");
		enemies.forEach(enemy => {
			if(collisionCheck(bullet,enemy)){
				let explosion = new Audio('sound/rumble.flac');
				explosion.play();
				enemy.src = 'sprites/explosion.png';
				enemy.classList.remove("enemy");
				enemy.classList.add("dead-enemy");
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
	new_enemy.style.top = `${Math.floor(Math.random() * 490) + 50}px`;
	game_area.appendChild(new_enemy);
	console.log("creating");
	moveEnemy(new_enemy);
}

//function moves the enemies.
function moveEnemy(enemy){
	let xPos = parseInt(window.getComputedStyle(enemy).getPropertyValue('left'))
	function movediv(timestamp){
		xPos -= 5
		enemy.style.left = `${xPos - 4}px`
		requestAnimationFrame(movediv) // call requestAnimationFrame again to animate next frame
	}
	requestAnimationFrame(movediv)
}

function collisionCheck(bullet,enemy){
	let bLeft = parseInt(bullet.style.left);
	let bTop = parseInt(bullet.style.top);
	let bBottom = bTop - 20;
	let eTop = parseInt(enemy.style.top);
	let eBottom = eTop - 30;
	let eLeft = parseInt(enemy.style.left);
	//if the boxes overlap
	if(bLeft != 340 && bLeft + 40 >= eLeft)
	{
		if((bTop <= eTop && bTop >= eBottom)){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}