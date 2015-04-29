var characters = 0;
var money = 0;
var character_worth = 0.10;
var update_speed = 0.1;
var speed_target = 0.1;
var stream = "";
var stream_max = 50;
var selected = 0;
var char_list = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", " ", ",", ".", "\"", "'", "?", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ")", "!", "@", "#", "$", "%", "^", "&", "*", "("];
var char_codes = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 32, 188, 190, 222, 219, 191, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
var pressed = [];
var inventory = [];
var total_bananas = 0;
var tab_view = 0;
var old_tab_view = -1;
var items;
var num_tabs = 2;

function deselect_element(element) {
	if (element != null) {
		element.removeAttribute("class");
	}
}

function select_element(element) {
	if (element != null) {
		element.setAttribute("class", "selected");
	}
}

function deselect_item() {
	if (selected > -1) {
		deselect_element(document.getElementById(items[selected].id + "-name"));
	}
}

function select_item() {
	if (selected > -1) {
		select_element(document.getElementById(items[selected].id + "-name"));
	}
}

function check_inventory() {
	if (tab_view == 0) {
		items = banana_types;
	}
	else if (tab_view == 1) {
		items = corms;
	}
	var previous_inventory = inventory;
	inventory = [];
	for (var i = 0; i < items.length; i++) {
		if (items[i].amount() > 0) {
			inventory.push(i);
		}
	}
	var selected_i = previous_inventory.indexOf(selected);
	if (selected_i == -1) {
		selected_i = 0;
	}
	if (selected_i >= inventory.length) {
		selected_i = inventory.length - 1;
	}
	if (selected_i > -1) {
		deselect_item();
		selected = inventory[selected_i];
		select_item();
	}
}

function reset_inventory() {
	inventory = [];
	selected = 0;
}

// A map to special_keys
var key_i = {
	up: 0,
	down: 1,
	left: 2,
	right: 3,
	shift: 4,
	enter: 5,
	tab: 6,
	backspace: 7
};

// An easy way to handle important key presses
// Can loop through array and check for press at each element
// Function is executed when state changes from false to true
var special_keys = [{
	code: 38,
	pressed: false,
	func: function() {
		check_inventory();
		var selected_i = inventory.indexOf(selected);
		if (selected_i > 0) {
			selected_i--;
			deselect_item();
			selected = inventory[selected_i];
			select_item();
		}
	}
}, {
	code: 40,
	pressed: false,
	func: function() {
		check_inventory();
		var selected_i = inventory.indexOf(selected);
		selected_i++;
		if (selected_i < inventory.length) {
			deselect_item();
			selected = inventory[selected_i];
			select_item();
		}
	}
}, {
	code: 37,
	pressed: false,
	func: function() {
		if (special_keys[key_i.shift].pressed) {
			deshift_item(selected);
		}
		else {
			if (tab_view > 0) {
				tab_view--;
			}
		}
	}
}, {
	code: 39,
	pressed: false,
	func: function() {
		if (special_keys[key_i.shift].pressed) {
			shift_item(selected);
		}
		else {
			if (tab_view < (num_tabs - 1)) {
				tab_view++;
			}
		}
	}
}, {
	code: 16,
	pressed: false,
	func: function() {
	}
}, {
	code: 13,
	pressed: false,
	func: function() {
		publish();
	}
}, {
	code: 9,
	pressed: false,
	func: function() {
		if (special_keys[key_i.shift].pressed) {
			if (tab_view == 0) {
				feed_monkeys(selected, 1);
			}
		}
		else {
			if (tab_view == 0) {
				buy_banana();
			}
			else if (tab_view == 1) {
				buy_corm();
			}
		}
	}
}, {
	code: 8,
	pressed: false,
	func: function() {
		delete_characters(1);
	}
}];
var enter = false;
var time_previous = 0;
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
	id: "green-banana",
	ripe_time_max: 30,
	ripe_time: 30,
	ripe: 1,
	count: 0,
	fridge: 0,
	cost: 0.19,
	amount: function() {
		return this.count + this.fridge;
	},
	left: function() {
		return this.count;
	},
	right: function() {
		return this.fridge;
	},
	time: function() {
		return this.ripe_time;
	},
	use: function() {
		
	}
}, {
	name: "Regular Banana",
	id: "regular-banana",
	ripe_time_max: 120,
	ripe_time: 120,
	ripe: 2,
	count: 0,
	fridge: 0,
	cost: 0.19,
	amount: function() {
		return this.count + this.fridge;
	},
	left: function() {
		return this.count;
	},
	right: function() {
		return this.fridge;
	},
	time: function() {
		return this.ripe_time;
	},
	use: function() {
		
	}
}, {
	name: "Rotten Banana",
	id: "rotten-banana",
	ripe_time_max: 60,
	ripe_time: 60,
	ripe: 3,
	count: 0,
	fridge: 0,
	cost: 0.19,
	amount: function() {
		return this.count + this.fridge;
	},
	left: function() {
		return this.count;
	},
	right: function() {
		return this.fridge;
	},
	time: function() {
		return this.ripe_time;
	},
	use: function() {
		
	}
}, {
	name: "Fertilizer Banana",
	id: "fertilizer-banana",
	ripe_time_max: -1,
	ripe_time: -1,
	ripe: -1,
	count: 0,
	fridge: 0,
	cost: 0.19,
	amount: function() {
		return this.count + this.fridge;
	},
	left: function() {
		return this.count;
	},
	right: function() {
		return this.fridge;
	},
	time: function() {
		return this.ripe_time;
	},
	use: function() {
		
	}
}
];

var corms = [ {
	name: "Regular Corm",
	id: "regular-corm",
	planted: 0,
	grow_time_max: 100,
	grow_time: 0,
	type: 0,
	count: 0,
	fruits: 10,
	cost: 5,
	amount: function() {
		return this.count + this.planted;
	},
	time: function() {
		return this.ripe_time;
	},
	use: function() {
		
	}
} ];

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
			if (banana_types[type].count == 0) {
				banana_types[type].ripe_time = banana_types[type].ripe_time_max;
			}
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
		if (banana_types[type].count == 0) {
			banana_types[type].ripe_time = banana_types[type].ripe_time_max;
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
	if (banana_types[type].count == 0) {
		banana_types[type].ripe_time = banana_types[type].ripe_time_max;
	}
	update_stats();
}

// Monkey Types
var monkey_types = [{
	name: "Angry Monkeys",
	id: "angry",
	icon: "\<Ờ Ṓ\><br />&nbsp;(^)",
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
	icon: "\<^ ^\><br />&nbsp;(v)",
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
	var tbody = document.createElement("tbody");
	var tr_head = document.createElement("tr");
	var td_icon = document.createElement("td");
	td_icon.setAttribute("rowspan", "3");
	td_icon.innerHTML = monkey_types[i].icon;
	tr_head.appendChild(td_icon);
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
	tbody.appendChild(tr_head);
	
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
	td1.setAttribute("style", "border: 1px solid black");
	td1.setAttribute("id", banana_types[i].id + "-name");
	td1.innerHTML = banana_types[i].name;
	banana_tr.appendChild(td1);
	var td2 = document.createElement("td");
	td2.setAttribute("style", "border: 1px solid black");
	td2.innerHTML = "x ";
	var count_span = document.createElement("span");
	count_span.setAttribute("id", banana_types[i].id + "-left");
	count_span.innerHTML = banana_types[i].count.toString();
	td2.appendChild(count_span);
	banana_tr.appendChild(td2);
	var td3 = document.createElement("td");
	td3.setAttribute("style", "border: 1px solid black");
	var ripe_time_span = document.createElement("span");
	ripe_time_span.setAttribute("id", banana_types[i].id + "-time");
	ripe_time_span.innerHTML = banana_types[i].ripe_time.toString();
	td3.appendChild(ripe_time_span);
	td3.innerHTML += "s until ripe";
	banana_tr.appendChild(td3);
	var td4 = document.createElement("td");
	td4.setAttribute("style", "border: 1px solid black");
	var fridge_span = document.createElement("span");
	fridge_span.setAttribute("id", banana_types[i].id + "-right");
	fridge_span.innerHTML = banana_types[i].fridge.toString();
	td4.appendChild(fridge_span);
	td4.innerHTML += " in fridge";
	banana_tr.appendChild(td4);
}

function add_corm(i) {
	var corm_tr = document.getElementById(corms[i].id);
	var td1 = document.createElement("td");
	td1.setAttribute("style", "border: 1px solid black");
	td1.setAttribute("id", corms[i].id + "-name");
	td1.innerHTML = corms[i].name;
	corm_tr.appendChild(td1);
	var td2 = document.createElement("td");
	td2.setAttribute("style", "border: 1px solid black");
	td2.innerHTML = "x ";
	var left_span = document.createElement("span");
	left_span.setAttribute("id", corms[i].id + "-left");
	left_span.innerHTML = corms[i].count.toString();
	td2.appendChild(left_span);
	corm_tr.appendChild(td2);
	var td3 = document.createElement("td");
	td3.setAttribute("style", "border: 1px solid black");
	var time_span = document.createElement("span");
	time_span.setAttribute("id", corms[i].id + "-time");
	time_span.innerHTML = corms[i].time().toString();
	td3.appendChild(time_span);
	td3.innerHTML += "s until grown";
	corm_tr.appendChild(td3);
	var td4 = document.createElement("td");
	td4.setAttribute("style", "border: 1px solid black");
	var right_span = document.createElement("span");
	right_span.setAttribute("id", corms[i].id + "-right");
	right_span.innerHTML = corms[i].planted.toString();
	td4.appendChild(right_span);
	td4.innerHTML += " planted";
	corm_tr.appendChild(td4);
}

function remove_banana(i) {
	var banana_tr = document.getElementById(banana_types[i].id);
	banana_tr.setAttribute("style", "");
	banana_tr.innerHTML = "";
}

function remove_corm(i) {
	var corm_tr = document.getElementById(corms[i].id);
	corm_tr.setAttribute("style", "");
	corm_tr.innerHTML = "";
}

function shift_item(i) {
	if (tab_view == 0) {
		if (banana_types[i].count > 0) {
			banana_types[i].count--;
			banana_types[i].fridge++;
		}
		if (banana_types[i].count == 0) {
			banana_types[i].ripe_time = banana_types[i].ripe_time_max;
		}
	}
	else if (tab_view == 1) {
		if (corms[i].count > 0) {
			corms[i].count--;
			corms[i].planted++;
		}
	}
}

function deshift_item(i) {
	if (tab_view == 0) {
		if (banana_types[i].fridge > 0) {
			banana_types[i].fridge--;
			banana_types[i].count++;
		}
	}
	else if (tab_view == 1) {
		if (corms[i].planted > 0) {
			corms[i].planted--;
			corms[i].count++;
		}
		if (corms[i].planted == 0) {
			corms[i].grow_time = 0;
		}
	}
}

function update_stats() {
	document.getElementById("characters-value").innerHTML = Math.floor(characters);
	document.getElementById("stream").innerHTML = stream;
	document.getElementById("money-value").innerHTML = money.toFixed(2);
	document.getElementById("bananas-value").innerHTML = total_bananas;
	var i;
	if (tab_view == 0) {
		if (old_tab_view != 0) {
			var banana_table = document.getElementById("banana-table");
			banana_table.innerHTML = "";
			for (var i = 0; i < banana_types.length; i++) {
				var banana_type_tr = document.createElement("tr");
				banana_type_tr.setAttribute("id", banana_types[i].id);
				banana_table.appendChild(banana_type_tr);
			}
			if (old_tab_view == 1) {
				deselect_element(document.getElementById("corm-view"));
			}
			select_element(document.getElementById("banana-view"));
			old_tab_view = 0;
		}
		for (i = 0; i < banana_types.length; i++) {
			if ((banana_types[i].count + banana_types[i].fridge) > 0) {
				var banana_tr = document.getElementById(banana_types[i].id);
				if (banana_tr.innerHTML === "") {
					add_banana(i);
				}
				document.getElementById(banana_types[i].id + "-left").innerHTML = banana_types[i].count.toString();
				document.getElementById(banana_types[i].id + "-time").innerHTML = Math.floor(banana_types[i].ripe_time).toString();
				document.getElementById(banana_types[i].id + "-right").innerHTML = banana_types[i].fridge.toString();
			}
			else {
				remove_banana(i);
			}
		}
	}
	if (tab_view == 1) {
		if (old_tab_view != 1) {
			var banana_table = document.getElementById("banana-table");
			banana_table.innerHTML = "";
			for (var i = 0; i < corms.length; i++) {
				var corm_tr = document.createElement("tr");
				corm_tr.setAttribute("id", corms[i].id);
				banana_table.appendChild(corm_tr);
			}
			if (old_tab_view == 0) {
				deselect_element(document.getElementById("banana-view"));
			}
			select_element(document.getElementById("corm-view"));
			old_tab_view = 1;
		}
		for (i = 0; i < corms.length; i++) {
			if ((corms[i].count + corms[i].planted) > 0) {
				var corm_tr = document.getElementById(corms[i].id);
				if (corm_tr.innerHTML === "") {
					add_corm(i);
				}
				document.getElementById(corms[i].id + "-left").innerHTML = corms[i].count.toString();
				document.getElementById(corms[i].id + "-time").innerHTML = Math.floor((corms[i].grow_time_max / corms[i].planted) - corms[i].grow_time);
				document.getElementById(corms[i].id + "-right").innerHTML = corms[i].planted.toString();
			}
			else {
				remove_corm(i);
			}
		}
	}
	for (i = 0; i < monkey_types.length; i++) {
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

function delete_characters(num_chars) {
	if (num_chars < 1) {
		return;
	}
	if ((characters - num_chars) >= 0) {
		characters -= num_chars;
		if (num_chars < stream.length) {
			stream = stream.substring(0, stream.length - num_chars);
		}
		else {
			stream = "";
		}
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

function buy_corm_type(type, amount) {
	if (money < (corms[type].cost * amount)) {
		return;
	}
	money -= (corms[type].cost * amount);
	corms[type].count += amount;
	update_stats();
}

function buy_banana_type(type, amount) {
	if (money < (banana_types[type].cost * amount)) {
		return;
	}
	money -= (banana_types[type].cost * amount);
	banana_types[type].count += amount;
	total_bananas += amount;
	update_stats();
}

function buy_corm() {
	buy_corm_type(0, 1);
}

function buy_banana() {
	buy_banana_type(0, 1);
}

// Things that happen every frame
function monkey_metabolism() {
	// Calculate time since previous frame
	var date = new Date();
	var time = date.getTime();
	if (time_previous > 0) {
		update_speed = time - time_previous;
		update_speed /= 1000;
	}
	time_previous = time;
	
	var char_previous = Math.floor(characters);
	var i;
	for (i = 0; i < corms.length; i++) {
		if (corms[i].planted > 0) {
			corms[i].grow_time += update_speed;
			if (corms[i].grow_time > (corms[i].grow_time_max / corms[i].planted)) {
				var grown = Math.floor(corms[i].grow_time / corms[i].grow_time_max * corms[i].planted);
				corms[i].grow_time -= grown * corms[i].grow_time_max / corms[i].planted;
				banana_types[corms[i].type].count += grown * corms[i].fruits;
				corms[i].planted -= grown;
				corms[i].count += Math.floor(grown * Math.random() * 4);
			}
		}
	}
	var banana_inventory = [];
	for (i = 0; i < banana_types.length; i++) {
		if (banana_types[i].count < 1) {
			continue;
		}
		if (banana_types[i].ripe >= 0) {
			if (banana_types[i].ripe_time > 0) {
				banana_types[i].ripe_time -= update_speed;
			}
			if (banana_types[i].ripe_time <= 0) {
				banana_types[banana_types[i].ripe].count += banana_types[i].count;
				banana_types[i].count = 0;
				banana_types[i].ripe_time = banana_types[i].ripe_time_max;
			}
		}
	}
	check_inventory();
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
	var metab_interval = setInterval(monkey_metabolism, 1000 * speed_target);
	var monkey_div = document.getElementById("monkey-div");
	for (var i = 0; i < monkey_types.length; i++) {
		monkey_types[i].stamina = monkey_types[i].stamina_max;
		monkey_types[i].patience = monkey_types[i].patience_max;
		var monkey_type_div = document.createElement("div");
		monkey_type_div.setAttribute("id", monkey_types[i].id);
		monkey_div.appendChild(monkey_type_div);
	}
	window.onkeyup = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		var i = char_codes.indexOf(key);
		if (i != -1) {
			if (pressed[i]) {
				pressed[i] = false;
			}
		}
		for (var k = 0; k < special_keys.length; k++) {
			if ((key == special_keys[k].code) && (special_keys[k].pressed)) {
				special_keys[k].pressed = false;
			}
		}
	}
	window.onkeydown = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		var i = char_codes.indexOf(key);
		if ((key == 8) || (key == 9) || ((key <= 40) && (key >= 37))) {
			if (e.preventDefault) {
				e.preventDefault();
			}
		}
		for (var k = 0; k < special_keys.length; k++) {
			if ((key == special_keys[k].code) && (!special_keys[k].pressed)) {
				special_keys[k].pressed = true;
				special_keys[k].func();
			}
		}
		if (i != -1) {
			if (!pressed[i]) {
				pressed[i] = true;
				var char = char_list[i];
				if (special_keys[key_i.shift].pressed) {
					if (i >= char_codes.indexOf(48)) {
						char = char_list[i + 10];
					}
					else {
						char = char.toUpperCase();
					}
				}
				keyboard_type(char);
			}
		}
		return !(key == 32);
	}
}
