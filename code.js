var characters = 0;
var money = 0;
var character_worth = 0.25;
var update_speed = 0.1;
var stream = "";
var stream_max = 50;
var char_list = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", " ", "!", ",", ".", "\"", "'", "?"];
var char_codes = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 32, 49, 188, 190, 222, 219, 191];
var pressed = [];
var enter = false;
for (var i = 0; i < char_codes.length; i++) {
	pressed[i] = false;
}
var shift = false;
var tab = false;

// Recipes for the Banananator 9000
// - = TODO = => Add more recipes
var banana_recipes = [
	[0, 0, 0]	
];

// Banana types
// Each type of banana will have a different effect on each monkey
// - = TODO = => Add ripening
//            => Add more bananas
var banana_types = [ {
	name: "Green Banana",
	ripe_time_max: 30,
	ripe_time: this.ripe_time_max,
	ripe: 1,
	count: 0,
	cost: 0.19
}, {
	name: "Regular Banana",
	ripe_time_max: 120,
	ripe_time: this.ripe_time_max,
	ripe: 2,
	count: 0,
	cost: 0.19
}, {
	name: "Rotten Banana",
	ripe_time_max: 60,
	ripe_time: this.ripe_time_max,
	ripe: 3,
	count: 0,
	cost: 0.19
}, {
	name: "Fertilizer Banana",
	ripe_time_max: -1,
	ripe_time: this.ripe_time_max,
	ripe: -1,
	count: 0,
	cost: 0.19
}
];

function feed_monkeys(type, amount) {
	if (amount > banana_types[type].count) {
		amount = banana_types[type].count;
	}
	if (amount < 1) {
		return;
	}
	var i;
	var to_feed;
	// Hungry monkeys are fed first
	for (i = 0; i < monkey_types.length; i++) {
		if (type != monkey_types[i].food) {
			continue;
		}
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
			banana_types[type].count -= to_feed;
			if (amount < 1) {
				update_stats();
				return;
			}
		}
	}
	// Monkeys are given treats second
	for (i = 0; i < monkey_types.length; i++) {
		if (type != monkey_types[i].treat) {
			continue;
		}
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
				monkey_types[monkey_types[i].happy].count += to_feed;
				banana_types[type].count -= to_feed;
			}
		}
		if (amount < 1) {
			update_stats();
			return;
		}
	}
	// Monkeys are hired third
	for (i = 0; i < monkey_types.length; i++) {
		if (type != monkey_types[i].hire) {
			continue;
		}
		monkey_types[i].count += amount;
		banana_types[type].count -= amount;
		break;
	}
	update_stats();
}

// Monkey Types
var monkey_types = [{
	name: "Angry Monkeys",
	id: "angry",
	count: 0,
	hungry: 0,
	busy: 0,
	are_hungry: false,
	stamina_max: 60,
	stamina: 0,
	patience_max: 15,
	patience: 0,
	rate: 2 / 3,
	func: function () {
		characters += this.busy * update_speed * this.rate;
	},
	angry: 0,
	treat: 1,
	happy: 1,
	hire: -1,
	food: 1
}, {
	name: "Happy Monkeys",
	id: "happy",
	count: 0,
	hungry: 0,
	busy: 0,
	are_hungry: false,
	stamina_max: 120,
	stamina: 0,
	patience_max: 30,
	patience: 0,
	rate: 2 / 3,
	func: function () {
		characters += this.busy * update_speed * this.rate;
	},
	angry: 0,
	treat: -1,
	happy: -1,
	hire: 1,
	food: 1
}, {
	name: "Publisher Monkeys",
	id: "publisher",
	count: 0,
	hungry: 0,
	busy: 0,
	are_hungry: false,
	stamina_max: 120,
	stamina: 0,
	patience_max: 30,
	patience: 0,
	rate: 2 / 3,
	func: function () {
		if (Math.floor(characters * character_worth) > Math.floor(this.busy * this.rate * this.update_speed)) {
			earned = Math.floor(this.busy * this.rate * this.update_speed);
		}
		else {
			earned = Math.floor(characters * character_worth);
		}
		characters -= earned / character_worth;
		money += earned / 100;
	},
	angry: 2,
	treat: -1,
	happy: -1,
	hire: -1,
	food: -1
}, {
	name: "Banana-Buying Monkeys",
	id: "buyer",
	count: 0,
	hungry: 0,
	busy: 0,
	are_hungry: false,
	stamina_max: 120,
	stamina: 0,
	patience_max: 30,
	patience: 0,
	rate: 2 / 3,
	func: function () {
		if (Math.floor(this.busy * this.rate * update_speed) > Math.floor(money / banana_cost)) {
			buy = Math.floor(money / banana_cost);
		}
		else {
			buy = Math.floor(this.busy * this.rate * update_speed);
		}
		money -= buy * banana_cost;
		bananas += buy;
	},
	angry: 3,
	treat: -1,
	happy: -1,
	hire: -1,
	food: -1
}, {
	name: "Feeding Monkeys",
	id: "feeding",
	count: 0,
	hungry: 0,
	busy: 0,
	are_hungry: false,
	stamina_max: 120,
	stamina: 0,
	patience_max: 30,
	patience: 0,
	rate: 2 / 3,
	func: function () {
		if (Math.floor(this.busy * this.rate * update_speed) > bananas) {
			feed = Math.floor(this.busy * this.rate * update_speed);
		}
		else {
			feed = bananas;
		}
		feed_monkeys(feed);
	},
	angry: 4,
	treat: -1,
	happy: -1,
	hire: -1,
	food: -1
}
];

function update_stats() {
	document.getElementById("characters-value").innerHTML = Math.floor(characters);
	document.getElementById("stream").innerHTML = stream;
	document.getElementById("money-value").innerHTML = money.toFixed(2);
	document.getElementById("bananas-value").innerHTML = banana_types[1].count;
	var bar_size = Math.floor(monkey_types[1].hungry / monkey_types[1].count * 100);
	document.getElementById("hungry-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
	document.getElementById("busy-happy-value").innerHTML = monkey_types[1].count - monkey_types[1].hungry;
	document.getElementById("happy-value").innerHTML = monkey_types[1].count;
	bar_size = Math.floor(monkey_types[0].hungry / monkey_types[0].count * 100);
	document.getElementById("hangry-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
	document.getElementById("busy-angry-value").innerHTML = monkey_types[0].count - monkey_types[0].hungry;
	document.getElementById("angry-value").innerHTML = monkey_types[0].count;
	if ((!monkey_types[1].are_hungry) && (monkey_types[1].count > 0)) {
		document.getElementById("happy-timer").innerHTML = Math.floor(monkey_types[1].stamina);
		var bar_size = Math.floor(monkey_types[1].stamina / monkey_types[1].stamina_max * 100);
		document.getElementById("happy-timer-bar").setAttribute("class", "green");
		document.getElementById("happy-timer-bar-box").setAttribute("class", "yellow");
		document.getElementById("happy-timer-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
	}
	if ((!monkey_types[0].are_hungry) && (monkey_types[0].count > 0)) {
		document.getElementById("angry-timer").innerHTML = Math.floor(monkey_types[0].stamina);
		var bar_size = Math.floor(monkey_types[0].stamina / monkey_types[0].stamina_max * 100);
		document.getElementById("angry-timer-bar").setAttribute("class", "green");
		document.getElementById("angry-timer-bar-box").setAttribute("class", "yellow");
		document.getElementById("angry-timer-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
	}
	if (monkey_types[1].are_hungry) {
		var bar_size = Math.floor(monkey_types[1].patience / monkey_types[1].patience_max * 100);
		document.getElementById("happy-timer-bar").setAttribute("class", "yellow");
		document.getElementById("happy-timer-bar-box").setAttribute("class", "red");
		document.getElementById("happy-timer-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
		document.getElementById("happy-timer").innerHTML = Math.floor(monkey_types[1].patience);
	}
	if (monkey_types[0].are_hungry) {
		var bar_size = Math.floor(monkey_types[0].patience / monkey_types[0].max * 100);
		document.getElementById("angry-timer-bar").setAttribute("class", "yellow");
		document.getElementById("angry-timer-bar-box").setAttribute("class", "red");
		document.getElementById("angry-timer-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
		document.getElementById("angry-timer").innerHTML = Math.floor(monkey_types[0].patience);
	}
	if (monkey_types[1].count == 0) {
		document.getElementById("happy-timer-bar").setAttribute("style", "width: 0;");
		document.getElementById("happy-timer-bar-box").setAttribute("class", "red");
		document.getElementById("happy-timer").innerHTML = "--";
	}
	if (monkey_types[0].count == 0) {
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

function publish() {
	var earned = Math.floor(characters * character_worth);
	if (earned < 1) {
		return;
	}
	characters -= Math.floor(earned) / character_worth;
	stream = stream.substring(stream.length - characters);
	money += earned / 100;
	update_stats();
}

function buy_banana_type(type, amount) {
	if (money < (banana_types[type].cost * amount)) {
		return;
	}
	money -= (banana_types[type].cost * amount);
	banana_types[type].count += amount;
	update_stats();
}

function buy_banana() {
	buy_banana_type(1, 1);
}

function feed_monkey() {
	feed_monkeys(1, 1);
}

function monkey_metabolism() {
	var char_previous = Math.floor(characters);
	var i;
	for (i = 0; i < monkey_types.length; i++) {
		if (monkey_types[i].count < 1) {
			continue;
		}
		monkey_types[i].busy = monkey_types[i].count - monkey_types[i].hungry;
		monkey_types[i].func();
		if (monkey_types[i].count < 1) {
			monkey_types[i].stamina = monkey_types[i].stamina_max;
			monkey_types[i].patience = monkey_types[i].patience_max;
		}
		if (monkey_types[i].stamina > 0) {
			monkey_types[i].stamina -= update_speed;
		}
		if ((monkey_types[i].stamina <= 0)) {
			if (!monkey_types[i].are_hungry) {
				monkey_types[i].are_hungry = true;
				monkey_types[i].hungry += monkey_types[i].count;
			}
			if (monkey_types[i].patience > 0) {
				monkey_types[i].patience -= update_speed;
			}
			if (monkey_types[i].patience <= 0) {
				monkey_types[i].are_hungry = false;
				monkey_types[i].stamina = monkey_types[i].stamina_max;
				monkey_types[i].patience = monkey_types[i].patience_max;
				if (monkey_types[i].hungry > 0) {
					if (banana_types[monkey_types[i].food].count > monkey_types[i].hungry) {
						banana_types[monkey_types[i].food].count -= monkey_types[i].hungry;		// All hungry monkeys steal bananas
						if (monkey_types[i].angry > -1) {
							monkey_types[i].count -= monkey_types[i].hungry;			// All hungry monkeys become angry
							monkey_types[monkey_types[i].angry].count += monkey_types[i].hungry;
						}
					}
					else {
						monkey_types[i].hungry -= banana_types[monkey_types[i].food].count;		// Run out of bananas - some monkeys still hungry
						if (monkey_types[i].angry > -1) {
							monkey_types[monkey_types[i].angry].count += banana_types[monkey_types[i].food].count;	// The monkeys that were able to steal bananas become angry
						}
						monkey_types[i].count -= monkey_types[i].hungry;				// Monkeys that couldn't steal bananas quit
						banana_types[monkey_types[i].food].count = 0;
					}
					monkey_types[i].hungry = 0;
				}
			}
			if (monkey_types[i].hungry <= 0) {
				monkey_types[i].are_hungry = false;
				monkey_types[i].stamina = monkey_types[i].stamina_max;
				monkey_types[i].patience = monkey_types[i].patience_max;
			}
		}
	}
	add_to_stream(Math.floor(characters) - char_previous);
	update_stats();
}

window.onload = function () {
	document.getElementById("banana-price").innerHTML = banana_types[1].cost.toFixed(2);
	document.getElementById("character-worth").innerHTML = character_worth.toFixed(2);
	document.getElementById("happy-type-rate").innerHTML = monkey_types[1].rate.toFixed(2);
	document.getElementById("angry-type-rate").innerHTML = monkey_types[0].rate.toFixed(2);
	var metab_interval = setInterval(monkey_metabolism, 1000 * update_speed);
	for (var i = 0; i < monkey_types.length; i++) {
		monkey_types[i].stamina = monkey_types[i].stamina_max;
		monkey_types[i].patience = monkey_types[i].patience_max;
	}
	window.onkeyup = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		var i = char_codes.indexOf(key);
		if (i != -1) {
			if (pressed[i]) {
				pressed[i] = false;
			}
		}
		if (key == 13) {
			enter = false;
		}
		if (key == 16) {
			shift = false;
		}
		if (key == 9) {
			tab = false;
		}
	}
	window.onkeydown = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		var i = char_codes.indexOf(key);
		if (key == 16) {
			shift = true;
		}
		if ((key == 13) && (!enter)) {
			enter = true;
			publish();
		}
		if (key == 9) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			if (!tab) {
				tab = true;
				if (shift) {
					feed_monkey();
				}
				else {
					buy_banana();
				}
			}
		}
		else if (i != -1) {
			if (!pressed[i]) {
				pressed[i] = true;
				var char = char_list[i];
				if (shift) {
					char = char.toUpperCase();
				}
				keyboard_type(char);
			}
		}
		return !(key == 32);
	}
}
