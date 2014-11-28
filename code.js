var characters = 0;
var money = 0;
var bananas = 0;
var monkeys = 0;
var hungry_monkeys = 0;
var angry_monkeys = 0;
var hangry_monkeys = 0;
var character_worth = 0.25;
var banana_cost = 0.19;
var stamina_max = 120;
var stamina = stamina_max;
var type_rate = 2 / 3;
var angry_stamina = stamina / 2;
var patience_max = 30;
var patience = patience_max;
var angry_patience = patience_max / 2;
var update_speed = 0.5;
var are_hungry = false;
var are_hangry = false;
var added_chars = 0;
var stream = "";
var stream_max = 50;
var char_list = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", " ", "!", ",", ".", "\"", "'", "?"];
var char_codes = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 32, 49, 188, 190, 222, 219, 191];

function update_stats() {
	document.getElementById("characters").innerHTML = Math.floor(characters);
	document.getElementById("stream").innerHTML = stream;
	document.getElementById("money").innerHTML = money.toFixed(2);
	document.getElementById("bananas").innerHTML = bananas;
	document.getElementById("monkeys").innerHTML = monkeys;
	document.getElementById("hungry").innerHTML = hungry_monkeys;
	document.getElementById("angry").innerHTML = angry_monkeys;
	document.getElementById("hangry").innerHTML = hangry_monkeys;
	if ((!are_hungry) && (monkeys > 0)) {
		document.getElementById("stamina").innerHTML = Math.floor(stamina);
		var bar_size = Math.floor(stamina / stamina_max * 100);
		document.getElementById("happy-stamina-bar").setAttribute("class", "green");
		document.getElementById("happy-stamina-bar-box").setAttribute("class", "yellow");
		document.getElementById("happy-stamina-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
	}
	else {
		document.getElementById("stamina").innerHTML = "--";
	}
	if ((!are_hangry) && (angry_monkeys > 0)) {
		document.getElementById("angry-stamina").innerHTML = Math.floor(angry_stamina);
	}
	else {
		document.getElementById("angry-stamina").innerHTML = "--";
	}
	if (are_hungry) {
		var bar_size = Math.floor(patience / patience_max * 100);
		document.getElementById("happy-stamina-bar").setAttribute("class", "yellow");
		document.getElementById("happy-stamina-bar-box").setAttribute("class", "red");
		document.getElementById("happy-stamina-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
		document.getElementById("patience").innerHTML = Math.floor(patience);
	}
	else {
		document.getElementById("patience").innerHTML = "--";
	}
	if (are_hangry) {
		document.getElementById("angry-patience").innerHTML = Math.floor(angry_patience);
	}
	else {
		document.getElementById("angry-patience").innerHTML = "--";
	}
	if ((happy_monkeys + hungry monkeys) == 0) {
		document.getElementById("happy-stamina-bar").setAttribute("style", "width: 0;");
	}
}

function random_char() {
	var char = char_list[Math.floor(Math.random() * char_list.length)];
	if (Math.random() > 0.5) {
		char = char.toUpperCase();
	}
	return char;
}

function add_to_stream(num_chars) {
	if (num_chars < 1) {
		return;
	}
	if (num_chars >= stream_max) {
		num_chars = stream_max;
	}
	for (var i = 0; i < num_chars; i++) {
		stream += random_char();
	}
	if (stream.length > stream_max) {
		stream = stream.substring(stream.length - stream_max);
	}
}

function type_character() {
	document.getElementById("key").setAttribute("src", "images/key_down.png");
	characters++;
	add_to_stream(1);
	update_stats();
}

function keyboard_type(char) {
	characters++;
	stream += char;
	if (stream.length > stream_max) {
		stream = stream.substring(stream.length - stream_max);
	}
	update_stats();
}

function key_up() {
	document.getElementById("key").setAttribute("src", "images/key_up.png");
}

function publish() {
	document.getElementById("book").setAttribute("src", "images/published.png");
	var earned = Math.floor(characters * character_worth);
	if (earned < 1) {
		return;
	}
	characters -= Math.floor(earned) / character_worth;
	stream = stream.substring(stream.length - characters);
	money += earned / 100;
	update_stats();
}

function unpublish() {
	document.getElementById("book").setAttribute("src", "images/book.png");
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
	document.getElementById("monkey").setAttribute("src", "images/monkey_get_banana.png");
	if (bananas < 1) {
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

function unfeed_monkey() {
	document.getElementById("monkey").setAttribute("src", "images/monkey_give_banana.png");
}

function monkey_metabolism() {
	var total_normal_monkeys = monkeys + hungry_monkeys;
	var total_angry_monkeys = angry_monkeys + hangry_monkeys;
	var total_monkeys = total_normal_monkeys + total_angry_monkeys;
	var char_previous = Math.floor(characters);
	characters += (monkeys + angry_monkeys) * (update_speed * type_rate);
	add_to_stream(Math.floor(characters) - char_previous);
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
		if (hungry_monkeys <= 0) {
			are_hungry = false;
			stamina = stamina_max;
			patience = patience_max;
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
					angry_monkeys += bananas;
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
		if (hangry_monkeys <= 0) {
			are_hangry = false;
			angry_stamina = stamina_max / 2;
			angry_patience = patience_max / 2;
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

window.onload = function () {
	document.getElementById("banana-price").innerHTML = banana_cost.toFixed(2);
	document.getElementById("character-worth").innerHTML = character_worth.toFixed(2);
	document.getElementById("type-rate").innerHTML = type_rate.toFixed(2);
	var metab_interval = setInterval(monkey_metabolism, 1000 * update_speed);
	window.onkeydown = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		var i = char_codes.indexOf(key);
		if (i != -1) {
			keyboard_type(char_list[i]);
		}
	}
}
