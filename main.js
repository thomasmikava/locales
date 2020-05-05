let currentLines = [];
let overwrite = false;

const onMainTextChange = () => {
	console.log("dsaasd");
	const el = document.getElementById("mainTextarea");
	const text = el.value.trim();
	const lines = text.split("\n");
	console.log(lines);

	if (lines.length === 0) return;

	const numOfLanguages = lines[0].split("\t").length - 1;
	ensureTextAreas(numOfLanguages);

	currentLines = lines.map(e => e.split("\t")).filter(e => e.length > 0);

	recalculate();
}

function recalculate() {

	if (!currentLines.length || !currentLines[0].length) return;

	const numOfLanguages = currentLines[0].length - 1;
	console.log("numOfLanguages", numOfLanguages);

	for (let i = 0; i < numOfLanguages; ++i) {
		const el = document.getElementById("res" + i).querySelector(".title");
		el.innerText = currentLines[0][i + 1];
		onExistingTextChange(i);
	}
}

function ensureTextAreas(num) {
	const el = document.getElementById("results");
	const existing = el.children.length;
	if (existing > num) {
		const children = [...el.children];
		for (let i = num; i < existing; ++i) {
			const child = children[i];
			child.remove();
		}
		return;
	}
	for (let i = existing; i < num; ++i) {
		var child = document.createElement('div');
		el.appendChild(child);
		child.outerHTML = "\
		<div class=\"resContainer\" id=\"res"+i+"\">\
			<div class=\"title\"></div>\
			<div class=\"textareas\">\
				<div class=\"current\">\
					<textarea class=\"textarea\" placeholder=\"current\" oninput=\"onExistingTextChange("+i+")\"></textarea>\
				</div>\
				<div class=\"new\">\
					<textarea class=\"textarea\"></textarea>\
				</div>\
			</div>\
		</div>";
	}
}

function onExistingTextChange(num) {
	const el = document.getElementById("res" + num);
	const currentTextArea = el.querySelector(".current textarea");
	const newTextArea = el.querySelector(".new textarea");

	const obj = JSON.parse(currentTextArea.value.trim() || "{}");
	for (let i = 1; i < currentLines.length; ++i) {
		const line = currentLines[i];
		const key = line[0];
		if (!key) continue;
		const translation = line[num + 1];

		const keys = key.split(".");
		let subObj = obj;
		for (let i = 0; i < keys.length - 1; ++i) {
			const k = keys[i];
			if (!obj[k]) obj[k] = {};
			subObj = obj[k];
		}
		const lastKey = keys[keys.length - 1];
		if (subObj[lastKey] == undefined || (subObj[lastKey] !== undefined && overwrite)) {
			subObj[lastKey] = translation;
		}
	}

	newTextArea.value = JSON.stringify(obj, null, "\t");
}

function chnageOverWrite(that) {
	overwrite = !!that.checked;
	recalculate();
}
