const player = document.getElementById("player");
const game_area = document.getElementById("game_area");
const enemies = ['sprites/enemy1.png', 'sprites/enemy2.png', 'sprites/enemy3.png'];

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
	new_bullet.style.left = `$(xPos}px`;
	new_bullet.style.top = `${yPos - 7}px`;
	return new_bullet;
}

function moveBullet(bullet){
	let interval = setInterval(() =>{
		let xPos = parseInt(bullet.style.left);
		let enemies = document.querySelecorAll(".enemy");
		enemies.forEach(enemy => {
			if(collisionCheck(bullet,enemy)){
				let explosion = new Audio('sounds/rumble.wav');
				explosion.play();
				enemy.src = "images/explosion.png";
				enemy.classList.remove("enemy");
				enemy.classList.add("dead-enemy");
			}
		})
		//destroy when offscreen
		if(xPos == 760)
		{
			bullet.style.display = 'none';
			bullet.remove();
		//otherwise keep moving
		}else{
			bullet.style.left = `${xPos + 4}px`
		}
	}, 10)
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
	let interval = setInterval(() => {
		let xPos = parseInt(window.getComputedStyle(enemy).getPropertyValue('left'))
		if(xPos <= 50){
			enemy.remove();
		}else{
			enemy.style.left = `${xPos - 4}px`
		}
	},30)
}

function collisionCheck(bullet,enemy){
	//crude collision box
	let bLeft = parseInt(bullet.style.left);
	let bTop = parseInt(bullet.style.top);
	let bBottom = bTop - 20;
	let eTop = parseInt(enemy.style.top);
	let eBottom = eTop - 30;
	let eLeft = parseInt(enemy.style.left);
	//if the boxes overlap
	if(bLeft != 340 && laserLeft + 40 >= eLeft)
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