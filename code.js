var characters = 0;
var money = 0;
var bananas = 0;
var monkeys = 0;
var hungry_monkeys = 0;
var angry_monkeys = 0;
var hangry_monkeys = 0;
var character_worth = 0.25;
var banana_cost = 0.5;
var stamina_max = 120;
var stamina = stamina_max;
var angry_stamina = stamina / 2;
var patience_max = 30;
var patience = patience_max;
var angry_patience = patience_max / 2;
var update_speed = 0.5;
var are_hungry = false;
var are_hangry = false;

function update_stats() {
	document.getElementById("characters").innerHTML = characters;
	document.getElementById("money").innerHTML = money;
	document.getElementById("bananas").innerHTML = bananas;
	document.getElementById("monkeys").innerHTML = monkeys;
	document.getElementById("hungry").innerHTML = hungry_monkeys;
	document.getElementById("angry").innerHTML = angry_monkeys;
	document.getElementById("hangry").innerHTML = hangry_monkeys;
	if ((!are_hungry) && (monkeys > 0)) {
		document.getElementById("stamina").innerHTML = stamina;
	}
	else {
		document.getElementById("stamina").innerHTML = "--";
	}
	if ((!are_hangry) && (angry_monkeys > 0)) {
		document.getElementById("angry-stamina").innerHTML = angry_stamina;
	}
	else {
		document.getElementById("angry-stamina").innerHTML = "--";
	}
	if (are_hungry) {
		document.getElementById("patience").innerHTML = patience;
	}
	else {
		document.getElementById("patience").innerHTML = "--";
	}
	if (are_hangry) {
		document.getElementById("angry-patience").innerHTML = angry_patience;
	}
	else {
		document.getElementById("angry-patience").innerHTML = "--";
	}
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
	if (hangry_monkeys > 0) {
		bananas--;
		hangry_monkeys--;
		angry_monkeys++;
	}
	else if (hungry_monkeys > 0) {
		bananas--;
		hungry_monkeys--;
		monkeys++;
	}
	else if (angry_monkeys > 0) {
		bananas--;
		angry_monkeys--;
		monkeys++;
	}
	else {
		bananas--;
		monkeys++;
	}
	update_stats();
}

function monkey_metabolism() {
	var total_normal_monkeys = monkeys + hungry_monkeys;
	var total_angry_monkeys = angry_monkeys + hangry_monkeys;
	var total_monkeys = total_normal_monkeys + total_angry_monkeys;
	if (total_normal_monkeys < 1) {
		stamina = stamina_max;
		patience = patience_max;
		are_hungry = false;
	}
	if (total_angry_monkeys < 1) {
		angry_stamina = stamina_max / 2;
		angry_patience = patience_max / 2;
		are_hangry = false;
	}
	if (total_monkeys < 1) {
		return;
	}
	if (stamina > 0) {
		stamina -= update_speed;
	}
	if (angry_stamina > 0) {
		angry_stamina -= update_speed;
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
				if (bananas > hungry_monkeys) {
					bananas -= hungry_monkeys;
					angry_monkeys += hungry_monkeys;
				}
				else {
					angry_monkeys += hungry_monkeys;
					bananas = 0;
				}
				hungry_monkeys = 0;
			}
		}
	}
	if (angry_stamina <= 0) {
		if (!are_hangry) {
			are_hangry = true;
			hangry_monkeys += angry_monkeys;
			angry_monkeys = 0;
		}
		if (angry_patience > 0) {
			angry_patience -= update_speed;
		}
		if (angry_patience <= 0) {
			are_hangry = false;
			angry_stamina = stamina_max / 2;
			angry_patience = patience_max / 2;
			hangry_monkeys = 0;
		}
	}
	update_stats();
}

var metab_interval = setInterval(monkey_metabolism, 1000 * update_speed);
