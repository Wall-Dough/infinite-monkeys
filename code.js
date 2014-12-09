var characters = 0;
var money = 0;
var character_worth = 0.10;
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
	id: "green",
	ripe_time_max: 30,
	ripe_time: 30,
	ripe: 1,
	count: 0,
	cost: 0.19
}, {
	name: "Regular Banana",
	id: "regular",
	ripe_time_max: 120,
	ripe_time: 120,
	ripe: 2,
	count: 0,
	cost: 0.19
}, {
	name: "Rotten Banana",
	id: "rotten",
	ripe_time_max: 60,
	ripe_time: 60,
	ripe: 3,
	count: 0,
	cost: 0.19
}, {
	name: "Fertilizer Banana",
	id: "fertilizer",
	ripe_time_max: -1,
	ripe_time: -1,
	ripe: -1,
	count: 0,
	cost: 0.19
}
];

var base_rate = Math.floor(banana_types[1].cost * character_worth * 1000) / 10;

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
	rate: base_rate,
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
	rate: base_rate,
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

function add_monkey(i) {
	var table = document.createElement("table");
	table.setAttribute("border", "1");
	table.setAttribute("id", monkey_types[i].id + "-table");
	var thead = document.createElement("thead");
	var tr_head = document.createElement("tr");
	var td_name = document.createElement("td");
	td_name.setAttribute("colspan", "2");
	td_name.innerHTML = monkey_types[i].name;
	tr_head.appendChild(td_name);
	var td_type_rate = document.createElement("td");
	td_type_rate.innerHTML = "(";
	var span_type_rate = document.createElement("span");
	span_type_rate.setAttribute("id", monkey_types[i].id + "-type-rate");
	span_type_rate.innerHTML = monkey_types[i].rate.toFixed(2);
	td_type_rate.appendChild(span_type_rate);
	td_type_rate.innerHTML += " characters per monkey per second)";
	tr_head.appendChild(td_type_rate);
	thead.appendChild(tr_head);
	table.appendChild(thead);
	
	var tbody = document.createElement("tbody");
	
	var tr1_body = document.createElement("tr");
	var td1_tr1 = document.createElement("td");
	td1_tr1.innerHTML = "Stamina:";
	tr1_body.appendChild(td1_tr1);
	var td2_tr1 = document.createElement("td");
	var div_timer_bar_box = document.createElement("div");
	div_timer_bar_box.setAttribute("id", monkey_types[i].id + "-timer-bar-box");
	div_timer_bar_box.setAttribute("class", "red");
	var div_timer_bar = document.createElement("div");
	div_timer_bar.setAttribute("id", monkey_types[i].id + "-timer-bar");
	div_timer_bar.setAttribute("class", "green");
	div_timer_bar.setAttribute("style", "width: 0;");
	div_timer_bar_box.appendChild(div_timer_bar);
	td2_tr1.appendChild(div_timer_bar_box);
	tr1_body.appendChild(td2_tr1);
	var td3_tr1 = document.createElement("td");
	var span_timer = document.createElement("span");
	span_timer.setAttribute("id", monkey_types[i].id + "-timer");
	span_timer.innerHTML = monkey_types[i].stamina.toString();
	td3_tr1.appendChild(span_timer);
	tr1_body.appendChild(td3_tr1);
	tbody.appendChild(tr1_body);
	
	var tr2_body = document.createElement("tr");
	var td1_tr2 = document.createElement("td");
	td1_tr2.innerHTML = "Busy Monkeys:";
	tr2_body.appendChild(td1_tr2);
	var td2_tr2 = document.createElement("td");
	var div_hungry_bar_box = document.createElement("div");
	div_hungry_bar_box.setAttribute("id", monkey_types[i].id + "-hungry-bar-box");
	var div_hungry_bar = document.createElement("div");
	div_hungry_bar.setAttribute("id", monkey_types[i].id + "-hungry-bar");
	div_hungry_bar.setAttribute("style", "width: 100%");
	div_hungry_bar_box.appendChild(div_hungry_bar);
	td2_tr2.appendChild(div_hungry_bar_box);
	tr2_body.appendChild(td2_tr2);
	var td3_tr2 = document.createElement("td");
	var span_busy = document.createElement("span");
	span_busy.setAttribute("id", monkey_types[i].id + "-busy-value");
	span_busy.innerHTML = monkey_types[i].busy;
	td3_tr2.appendChild(span_busy);
	td3_tr2.innerHTML += " / ";
	var span_total = document.createElement("span");
	span_total.setAttribute("id", monkey_types[i].id + "-value");
	span_total.innerHTML = monkey_types[i].count;
	td3_tr2.appendChild(span_total);
	tr2_body.appendChild(td3_tr2);
	
	tbody.appendChild(tr2_body);
	table.appendChild(tbody);
	var monkey_div = document.getElementById(monkey_types[i].id);
	monkey_div.appendChild(table);
}

function remove_monkey(i) {
	var monkey_div = document.getElementById(monkey_types[i].id);
	monkey_div.innerHTML = "";
}

function add_banana(i) {
	var banana_tr = document.getElementById(banana_types[i].id);
	var td1 = document.createElement("td");
	td1.innerHTML = banana_types[i].name;
	banana_tr.appendChild(td1);
	var td2 = document.createElement("td");
	td2.innerHTML = "x " + banana_types[i].count.toString();
	banana_tr.appendChild(td2);
	var td3 = document.createElement("td");
	td3.innerHTML = banana_types[i].ripe_time.toString() + "s until ripe";
	banana_tr.appendChild(td3);
}

function remove_banana(i) {
	var banana_tr = document.getElementById(banana_types[i].id);
	banana_tr.innerHTML = "";
}

function update_stats() {
	document.getElementById("characters-value").innerHTML = Math.floor(characters);
	document.getElementById("stream").innerHTML = stream;
	document.getElementById("money-value").innerHTML = money.toFixed(2);
	document.getElementById("bananas-value").innerHTML = banana_types[1].count;
	for (var i = 0; i < monkey_types.length; i++) {
		if (monkey_types[i].count > 0) {
			var monkey_table = document.getElementById(monkey_types[i].id + "-table");
			if (monkey_table == null) {
				add_monkey(i);
			}
			var bar_size = Math.floor(monkey_types[i].hungry / monkey_types[i].count * 100);
			document.getElementById(monkey_types[i].id + "-hungry-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
			document.getElementById(monkey_types[i].id + "-busy-value").innerHTML = monkey_types[i].count - monkey_types[i].hungry;
			document.getElementById(monkey_types[i].id + "-value").innerHTML = monkey_types[i].count;
			if ((!monkey_types[i].are_hungry)) {
				document.getElementById(monkey_types[i].id + "-timer").innerHTML = Math.floor(monkey_types[i].stamina);
				var bar_size = Math.floor(monkey_types[i].stamina / monkey_types[i].stamina_max * 100);
				document.getElementById(monkey_types[i].id + "-timer-bar").setAttribute("class", "green");
				document.getElementById(monkey_types[i].id + "-timer-bar-box").setAttribute("class", "yellow");
				document.getElementById(monkey_types[i].id + "-timer-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
			}
			if (monkey_types[i].are_hungry) {
				var bar_size = Math.floor(monkey_types[i].patience / monkey_types[i].patience_max * 100);
				document.getElementById(monkey_types[i].id + "-timer-bar").setAttribute("class", "yellow");
				document.getElementById(monkey_types[i].id + "-timer-bar-box").setAttribute("class", "red");
				document.getElementById(monkey_types[i].id + "-timer-bar").setAttribute("style", "width: " + bar_size.toString() + "%;");
				document.getElementById(monkey_types[i].id + "-timer").innerHTML = Math.floor(monkey_types[i].patience);
			}
		}
		else {
			var monkey_table = document.getElementById(monkey_types[i].id + "-table");
			if (!!monkey_table != null) {
				remove_monkey(i);
			}
		}
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
	var metab_interval = setInterval(monkey_metabolism, 1000 * update_speed);
	var monkey_div = document.getElementById("monkey-div");
	for (var i = 0; i < monkey_types.length; i++) {
		monkey_types[i].stamina = monkey_types[i].stamina_max;
		monkey_types[i].patience = monkey_types[i].patience_max;
		var monkey_type_div = document.createElement("div");
		monkey_type_div.setAttribute("id", monkey_types[i].id);
		monkey_div.appendChild(monkey_type_div);
	}
	var banana_table = document.getElementById("banana-table");
	for (var i = 0; i < banana_types.length; i++) {
		var banana_type_tr = document.createElement("tr");
		banana_type_tr.setAttribute("id", banana_types[i].id);
		banana_table.appendChild(banana_type_tr);
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
