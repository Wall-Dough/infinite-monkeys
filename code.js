var characters = 0;
var money = 0;
var bananas = 0;
var monkeys = 0;
var hungry_monkeys = 0;
var angry_monkeys = 0;
var character_worth = 0.25;
var banana_cost = 0.5;
var stamina_max = 120;
var stamina = stamina_max;
var patience_max = 30;
var patience = patience;
var update_speed = 0.5;
var are_hungry = false;

function update_stats() {
	document.getElementById("characters").innerHTML = characters;
	document.getElementById("money").innerHTML = money;
	document.getElementById("bananas").innerHTML = bananas;
	document.getElementById("monkeys").innerHTML = monkeys;
	document.getElementById("hungry").innerHTML = hungry_monkeys;
	document.getElementById("angry").innerHTML = angry_monkeys;
	document.getElementById("stamina").innerHTML = stamina;
	document.getElementById("patience").innerHTML = patience;
}

function type_character() {
	characters++;
	update_stats();
}

function publish() {
	var earned = Math.floor(characters * character_worth);
	if (earned < 1) {
		return;
	}
	characters -= Math.floor(earned) / character_worth;
	money += earned / 100;
	update_stats();
}

function buy_banana() {
	if (money < banana_cost) {
		return;
	}
	money -= banana_cost;
	bananas++;
	update_stats();
}

function feed_monkey() {
	if (banana < 1) {
		return;
	}
	bananas--;
	monkeys++;
	if (hungry_monkeys > 0) {
		hungry_monkeys--;
	}
	update_stats();
}

function monkey_metabolism() {
	if (monkeys < 1) {
		return;
	}
	if (stamina > 0) {
		stamina -= update_speed;
	}
	if (stamina <= 0) {
		if (!are_hungry) {
			are_hungry = true;
			hungry_monkeys += monkeys;
			monkeys = 0;
		}
		if (patience > 0) {
			patience -= update_speed;
		}
		if (patience <= 0) {
			are_hungry = false;
			stamina = stamina_max;
			patience = patience_max;
			if (hungry_monkeys > 0) {
				angry_monkeys += hungry_monkeys;
				hungry_monkeys = 0;
			}
		}
	}
	update_stats();
}
