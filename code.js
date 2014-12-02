var characters = 0;
var money = 0;
var bananas = 0;
var happy_monkeys = 0;
var hungry_monkeys = 0;
var angry_monkeys = 0;
var hangry_monkeys = 0;
var character_worth = 0.25;
var banana_cost = 0.19;
var stamina_max = 120;
var stamina = stamina_max;
var type_rate = 2 / 3;
var angry_stamina_max = stamina_max / 2;
var angry_stamina = angry_stamina_max;
var patience_max = 30;
var patience = patience_max;
var angry_patience_max = patience_max / 2;
var angry_patience = angry_patience_max;
var update_speed = 0.5;
var are_hungry = false;
var are_hangry = false;
var added_chars = 0;
var stream = "";
var stream_max = 50;
var char_list = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", " ", "!", ",", ".", "\"", "'", "?"];
var char_codes = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 32, 49, 188, 190, 222, 219, 191];

function feed_monkeys(amount) {
	if (amount > bananas) {
		amount = bananas;
	}
	if (amount < 1) {
		return;
	}
	var i;
	var to_feed;
	for (i = 0; i < monkey_types.length; i++) {
		if (monkey_types[i].hungry > 0) {
			to_feed = amount;
			if (to_feed > monkey_types[i].hungry) {
				to_feed = monkey_types[i].hungry;
				amount -= monkey_types[i].hungry;
			}
			else {
				amount = 0;
			}
			monkey_types[i].hungry -= to_feed;
			bananas -= to_feed;
			if (amount < 1) {
				update_stats();
				return;
			}
		}
	}
	for (i = 0; i < monkey_types.length; i++) {
		if (monkey_types[i].count > 0) {
			if (monkey_types[i].treat > -1) {
				to_feed = amount;
				if (to_feed > monkey_types[i].count) {
					to_feed = monkey_types[i].count;
					amount -= monkey_types[i].count;
				}
				else {
					amount = 0;
				}
				monkey_types[i].count -= to_feed;
				monkey_types[monkey_types[i].treat].count += to_feed;
				bananas -= to_feed;
			}
		}
		if (amount < 1) {
			update_stats();
			return;
		}
	}
	bananas -= amount;
	happy_monkeys += amount;
	update_stats();
}

var monkey_types = [{
	name: "Angry Monkeys",
	count: 0,
	hungry: 0,
	stamina_max: 60,
	stamina: this.stamina_max,
	patience_max: 15,
	patience: this.patience_max,
	rate: 2 / 3,
	func: function () {
		characters += this.count * update_speed * this.rate;
	},
	angry: 0,
	treat: 1
}, {
	name: "Happy Monkeys",
	count: 0,
	hungry: 0,
	stamina_max: 120,
	stamina: this.stamina_max,
	patience_max: 30,
	patience: this.patience_max,
	rate: 2 / 3,
	func: function () {
		characters += this.count * update_speed * this.rate;
	},
	angry: 0,
	treat: -1
}, {
	name: "Publisher Monkeys",
	count: 0,
	hungry: 0,
	stamina_max: 120,
	stamina: this.stamina_max,
	patience_max: 30,
	patience: this.patience_max,
	rate: 2 / 3,
	func: function () {
		if (Math.floor(characters * character_worth) > Math.floor(this.count * this.rate * this.update_speed)) {
			earned = Math.floor(this.count * this.rate * this.update_speed);
		}
		else {
			earned = Math.floor(characters * character_worth);
		}
		characters -= earned / character_worth;
		money += earned / 100;
	},
	angry: 2,
	treat: -1
}, {
	name: "Banana-Buying Monkeys",
	count: 0,
	hungry: 0,
	stamina_max: 120,
	stamina: this.stamina_max,
	patience_max: 30,
	patience: this.patience_max,
	rate: 2 / 3,
	func: function () {
		if (Math.floor(this.count * this.rate * update_speed) > Math.floor(money / banana_cost)) {
			buy = Math.floor(money / banana_cost);
		}
		else {
			buy = Math.floor(this.count * this.rate * update_speed);
		}
		money -= buy * banana_cost;
		bananas += buy;
	},
	angry: 3,
	treat: -1
}, {
	name: "Feeding Monkeys",
	count: 0,
	hungry: 0,
	stamina_max: 120,
	stamina: this.stamina_max,
	patience_max: 30,
	patience: this.patience_max,
	rate: 2 / 3,
	func: function () {
		if (Math.floor(this.count * this.rate * update_speed) > bananas) {
			feed = Math.floor(this.count * this.rate * update_speed);
		}
		else {
			feed = bananas;
		}
		feed_monkeys(feed);
	},
	angry: 4,
	treat: -1
}
];

function update_stats() {
	document.getElementById("characters-value").innerHTML = Math.floor(characters);
	document.getElementById("stream").innerHTML = stream;
	document.getElementById("money-value").innerHTML = money.toFixed(2);
	document.getElementById("bananas-value").innerHTML = bananas;
	var bar_size = Math.floor(happy_monkeys / (hungry_monkeys + happy_monkeys) * 100);
	document.getElementById("hungry-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
	document.getElementById("busy-happy-value").innerHTML = happy_monkeys;
	document.getElementById("happy-value").innerHTML = happy_monkeys + hungry_monkeys;
	bar_size = Math.floor(angry_monkeys / (hangry_monkeys + angry_monkeys) * 100);
	document.getElementById("hangry-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
	document.getElementById("busy-angry-value").innerHTML = angry_monkeys;
	document.getElementById("angry-value").innerHTML = angry_monkeys + hangry_monkeys;
	if ((!are_hungry) && (happy_monkeys > 0)) {
		document.getElementById("happy-timer").innerHTML = Math.floor(stamina);
		var bar_size = Math.floor(stamina / stamina_max * 100);
		document.getElementById("happy-timer-bar").setAttribute("class", "green");
		document.getElementById("happy-timer-bar-box").setAttribute("class", "yellow");
		document.getElementById("happy-timer-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
	}
	if ((!are_hangry) && (angry_monkeys > 0)) {
		document.getElementById("angry-timer").innerHTML = Math.floor(angry_stamina);
		var bar_size = Math.floor(angry_stamina / angry_stamina_max * 100);
		document.getElementById("angry-timer-bar").setAttribute("class", "green");
		document.getElementById("angry-timer-bar-box").setAttribute("class", "yellow");
		document.getElementById("angry-timer-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
	}
	if (are_hungry) {
		var bar_size = Math.floor(patience / patience_max * 100);
		document.getElementById("happy-timer-bar").setAttribute("class", "yellow");
		document.getElementById("happy-timer-bar-box").setAttribute("class", "red");
		document.getElementById("happy-timer-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
		document.getElementById("happy-timer").innerHTML = Math.floor(patience);
	}
	if (are_hangry) {
		var bar_size = Math.floor(angry_patience / angry_patience_max * 100);
		document.getElementById("angry-timer-bar").setAttribute("class", "yellow");
		document.getElementById("angry-timer-bar-box").setAttribute("class", "red");
		document.getElementById("angry-timer-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
		document.getElementById("angry-timer").innerHTML = Math.floor(angry_patience);
	}
	if ((happy_monkeys + hungry_monkeys) == 0) {
		document.getElementById("happy-timer-bar").setAttribute("style", "width: 0;");
		document.getElementById("happy-timer-bar-box").setAttribute("class", "red");
		document.getElementById("happy-timer").innerHTML = "--";
	}
	if ((angry_monkeys + hangry_monkeys) == 0) {
		document.getElementById("angry-timer-bar").setAttribute("style", "width: 0;");
		document.getElementById("angry-timer-bar-box").setAttribute("class", "red");
		document.getElementById("angry-timer").innerHTML = "--";
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
		happy_monkeys++;
	}
	else if (angry_monkeys > 0) {
		bananas--;
		angry_monkeys--;
		happy_monkeys++;
	}
	else {
		bananas--;
		happy_monkeys++;
	}
	update_stats();
}

function unfeed_monkey() {
	document.getElementById("monkey").setAttribute("src", "images/monkey_give_banana.png");
}

function monkey_metabolism() {
	var total_happy_monkeys = happy_monkeys + hungry_monkeys;
	var total_angry_monkeys = angry_monkeys + hangry_monkeys;
	var total_monkeys = total_happy_monkeys + total_angry_monkeys;
	var char_previous = Math.floor(characters);
	add_to_stream(Math.floor(characters) - char_previous);
	if (total_happy_monkeys < 1) {
		stamina = stamina_max;
		patience = patience_max;
		are_hungry = false;
	}
	if (total_angry_monkeys < 1) {
		angry_stamina = angry_stamina_max;
		angry_patience = angry_patience_max;
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
			hungry_monkeys += happy_monkeys;
			happy_monkeys = 0;
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
			angry_stamina = angry_stamina_max;
			angry_patience = angry_patience_max;
		}
		if (angry_patience <= 0) {
			are_hangry = false;
			angry_stamina = angry_stamina_max;
			angry_patience = angry_patience_max;
			if (bananas > hangry_monkeys) {
				bananas -= hangry_monkeys;
				angry_monkeys += hangry_monkeys;
				hangry_monkeys = 0;
			}
			else {
				angry_monkeys += bananas;
				bananas = 0;
			}
		}
	}
	update_stats();
}

window.onload = function () {
	document.getElementById("banana-price").innerHTML = banana_cost.toFixed(2);
	document.getElementById("character-worth").innerHTML = character_worth.toFixed(2);
	document.getElementById("happy-type-rate").innerHTML = type_rate.toFixed(2);
	document.getElementById("angry-type-rate").innerHTML = type_rate.toFixed(2);
	var metab_interval = setInterval(monkey_metabolism, 1000 * update_speed);
	window.onkeydown = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		var i = char_codes.indexOf(key);
		if (i != -1) {
			keyboard_type(char_list[i]);
		}
	}
}
