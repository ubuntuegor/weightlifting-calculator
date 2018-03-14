var settings = document.querySelector(".settings"), icon = document.querySelector(".icon");

function toggleSettings(){
	switch (settings.style.height){
		case "0px":
			settings.style.height = settings.querySelector("table").offsetHeight+"px";
			icon.style.backgroundPosition = "0px 0px";
			break;
		default:
			settings.style.height = "0px";
			icon.style.backgroundPosition = "0px 24px";
			break;
	}
}
var data = {
	"0.5": {
		"color": "#00FAFF",
		"size": 25
	},
	"1": {
		"color": "#009A0A",
		"size": 30
	},
	"1.25": {
		"color": "#ECC612",
		"size": 30
	},
	"2": {
		"color": "#0020C1",
		"size": 40
	},
	"2.5": {
		"color": "#FF3C51",
		"size": 40
	},
	"5": {
		"color": "#7F7F2C",
		"size": 60
	},
	"10": {
		"color": "#00B211",
		"size": 80
	},
	"15": {
		"color": "#E3ED11",
		"size": 100
	},
	"20": {
		"color": "#1251EC",
		"size": 120
	},
	"25": {
		"color": "#CF2A1A",
		"size": 130
	},
	"50": {
		"color": "#000000",
		"size": 140
	}
};
function sortsb(a,b) {
    return a - b;
}
function sortbs(a,b) {
    return b - a;
}
function getKeys(a, b = true){
	var keys = [];
	for (var key in a){
		keys.push(parseFloat(key));
	}
	if (b) keys.sort(sortsb);
	else keys.sort(sortbs);
	return keys;
}
function init(){
	settings.innerHTML = "";
	var tbl = document.createElement("table");
	var row = document.createElement("tr");
	var hhh = document.createElement("td");
	var button = document.createElement("button");
	button.onclick = function (){
		window.localStorage.clear();
		location.reload();
	}
	button.textContent = "Reset";
	var sec = document.createElement("td");
	var check = document.createElement("input");
	check.type = "checkbox";
	check.id = "security";
	check.checked = "on";
	var label = document.createElement("label");
	label.textContent = "Prevent wrong values";
	label.setAttribute("for", "security");
	hhh.appendChild(button);
	sec.appendChild(check);
	sec.appendChild(label);
	row.appendChild(hhh);
	row.appendChild(sec);
	tbl.appendChild(row);
	var row = document.createElement("tr");
	var name = document.createElement("td");
	name.innerHTML = "Step";
	var hhh = document.createElement("td");
	var input = document.createElement("input");
		input.setAttribute("type", "number");
		input.setAttribute("min", "0");
		input.setAttribute("step", "0.5");
		input.setAttribute("value", window.localStorage.getItem("step")||"2.5");
		input.id = "step";
		input.oninput = changeStep;
	hhh.appendChild(input);
	row.appendChild(name);
	row.appendChild(hhh);
	tbl.appendChild(row);
	var row = document.createElement("tr");
	var name = document.createElement("td");
	name.innerHTML = "Barbell";
	var hhh = document.createElement("td");
	var input = document.createElement("input");
		input.setAttribute("type", "number");
		input.setAttribute("min", "0");
		input.setAttribute("step", "1");
		input.setAttribute("value", window.localStorage.getItem("grif")||"25");
		input.id = "grif";
		input.oninput = draw;
	hhh.appendChild(input);
	row.appendChild(name);
	row.appendChild(hhh);
	tbl.appendChild(row);
	var title = document.createElement("tr");
	var title1 = document.createElement("th");
	title1.innerHTML = "Weight";
	var title2 = document.createElement("th");
	title2.innerHTML = "Amount of pairs";
	title.appendChild(title1);
	title.appendChild(title2);
	tbl.appendChild(title);
	getKeys(data).forEach(function(elem){
		var row = document.createElement("tr");
		var value = document.createElement("td");
		value.textContent = elem;
		var hhh = document.createElement("td");
		var input = document.createElement("input");
		input.setAttribute("type", "number");
		input.setAttribute("min", "0");
		input.setAttribute("step", "1");
		input.setAttribute("value", window.localStorage.getItem("disk"+elem)||"1");
		input.id = elem;
		input.oninput = draw;
		hhh.appendChild(input);
		row.appendChild(value);
		row.appendChild(hhh);
		tbl.appendChild(row);
	});
	settings.appendChild(tbl);
	settings.style.height = "0px";
	document.getElementById("weight").value = document.getElementById("grif").value;
	draw();
}

function changeStep(){
	document.getElementById("weight").setAttribute("step", this.value);
	window.localStorage.setItem("step", this.value);
}

function amount(a){
	return parseInt(document.getElementById(a.toString()).value);
}

function draw(){
	var max = parseFloat(document.getElementById("grif").value);
	for (var key in data){
		max += parseFloat(key) * amount(key) * 2;
	}
	if (document.getElementById("security").checked){
	if (parseFloat(document.getElementById("weight").value)==(parseFloat(document.getElementById("grif").value)-parseFloat(document.getElementById("step").value)))
		document.getElementById("weight").value = max;
	else if (parseFloat(document.getElementById("weight").value)<parseFloat(document.getElementById("grif").value)||isNaN(parseFloat(document.getElementById("weight").value)))
		document.getElementById("weight").value = document.getElementById("grif").value;
	else if (parseFloat(document.getElementById("weight").value)==(max+parseFloat(document.getElementById("step").value)))
		document.getElementById("weight").value = document.getElementById("grif").value;
	else if (parseFloat(document.getElementById("weight").value)>max)
		document.getElementById("weight").value = max;
	}
	var weight = parseFloat(document.getElementById("weight").value)-parseFloat(document.getElementById("grif").value);
	var res = {}, ost;
	getKeys(data, false).forEach(function (elem){
		var needed = Math.min(Math.floor(weight/(elem*2)), amount(elem));
		if(needed!=0) res[elem] = needed;
		weight -= elem*needed*2;
		window.localStorage.setItem("disk"+elem, amount(elem));
	});
	window.localStorage.setItem("grif", document.getElementById("grif").value);
	if (weight>0) ost = weight/2;
	var disks = document.querySelector(".disks");
	var str = "";
	var ctx = document.getElementById("pic").getContext("2d");
	ctx.clearRect(0,0,document.getElementById("pic").width, document.getElementById("pic").height);
	ctx.beginPath();
	ctx.rect (0, 67, 300, 16);
	ctx.fillStyle = "#eeeeee";
	ctx.fill();
	ctx.strokeStyle = "#111";
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.rect (0, 55, 15, 40);
	ctx.fillStyle = "#eeeeee";
	ctx.fill();
	ctx.strokeStyle = "#111";
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
	var n = 0;
	getKeys(res, false).forEach(function(elem){
		str += '<div class="disk"><p class="title"><span class="color" style="background-color: '+data[elem].color+'"></span> '+elem+':</p><p>'+res[elem]+'</p></div>';
	for (var i = 1; i <= parseInt(res[elem]); i++){
		ctx.beginPath();
		ctx.rect (15+(n)*20, 75-(data[elem].size/2), 20, data[elem].size);
		ctx.fillStyle = data[elem].color;
		ctx.fill();
		ctx.strokeStyle = "#ffffff";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath();
		n++;
	}
	});
	if (ost!=undefined) str += '<div class="disk"><p class="title error">'+ost+'?:</p><p>1</p></div>';
	disks.innerHTML = str;
	return res;
}

init();
function butt(a){
	if (a=="+")
		document.getElementById("weight").value = parseFloat(document.getElementById("weight").value) + parseFloat(document.getElementById("step").value);
	else if (a=="-")
		document.getElementById("weight").value = parseFloat(document.getElementById("weight").value) - parseFloat(document.getElementById("step").value);
	draw();
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function() { 
    console.log("Service Worker Registered"); 
  });
}