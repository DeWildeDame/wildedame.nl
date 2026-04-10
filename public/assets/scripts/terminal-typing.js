window.__commandMode = false;
window.__curentTheme = null;
const THEMES = [
	{
		name: "default",
		void0: "13, 15, 18",
		void1: "26, 29, 34",
		void2: "42, 46, 54",
		void3: "60, 65, 80",
		void4: "85, 92, 110",
		void5: "122, 130, 144",
		void6: "184, 190, 201",
		terminalLink: "127, 179, 255",
		hightlight: "188, 216, 255"
	},
	{
		name: "sunset",
		void0: "26, 15, 28",
		void1: "58, 20, 48",
		void2: "106, 30, 74",
		void3: "162, 50, 79",
		void4: "217, 90, 60",
		void5: "242, 143, 63",
		void6: "255, 210, 122",
		terminalLink: "255, 158, 94",
		hightlight: "255, 184, 138"
	},
	{
		name: "ocean",
		void0: "7, 20, 28",
		void1: "11, 42, 58",
		void2: "18, 74, 99",
		void3: "28, 111, 143",
		void4: "47, 154, 181",
		void5: "85, 199, 217",
		void6: "155, 232, 242",
		terminalLink: "95, 212, 255",
		hightlight: "168, 236, 255"
	},
	{
		name: "mocca",
		void0: "26, 18, 13",
		void1: "46, 28, 18",
		void2: "74, 43, 26",
		void3: "107, 62, 36",
		void4: "140, 86, 48",
		void5: "180, 122, 74",
		void6: "227, 185, 138",
		terminalLink: "216, 154, 99",
		hightlight: "240, 203, 161"
	},
	{
		name: "forest",
		void0: "11, 18, 12",
		void1: "16, 32, 24",
		void2: "26, 58, 40",
		void3: "37, 86, 58",
		void4: "58, 122, 82",
		void5: "88, 163, 111",
		void6: "142, 217, 163",
		terminalLink: "108, 212, 155",
		hightlight: "166, 242, 200"
	},
	{
		name: "calm",
		void0: "15, 17, 24",
		void1: "28, 34, 48",
		void2: "47, 58, 82",
		void3: "68, 85, 122",
		void4: "95, 120, 163",
		void5: "138, 164, 199",
		void6: "199, 214, 236",
		terminalLink: "155, 184, 255",
		hightlight: "201, 216, 255"
	},
	{
		name: "cherry",
		void0: "26, 5, 10",
		void1: "48, 8, 17",
		void2: "82, 13, 28",
		void3: "122, 20, 42",
		void4: "168, 31, 60",
		void5: "217, 54, 87",
		void6: "255, 122, 154",
		terminalLink: "255, 79, 110",
		hightlight: "255, 159, 179"
	},
	{
		name: "nightcity",
		void0: "11, 7, 20",
		void1: "26, 15, 42",
		void2: "47, 26, 74",
		void3: "74, 42, 122",
		void4: "106, 63, 176",
		void5: "154, 99, 230",
		void6: "211, 168, 255",
		terminalLink: "79, 242, 255",
		hightlight: "159, 250, 255"
	},
	{
		name: "monaco",
		void0: "12, 15, 20",
		void1: "20, 32, 51",
		void2: "31, 58, 92",
		void3: "45, 87, 133",
		void4: "63, 127, 176",
		void5: "90, 174, 214",
		void6: "155, 220, 242",
		terminalLink: "255, 204, 128",
		hightlight: "255, 229, 179"
	},
	{
		name: "hotdogstand",
		void0: "255, 0, 0",
		void1: "255, 255, 255",
		void2: "255, 0, 0",
		void3: "122, 0, 0",
		void4: "255, 255, 1",
		void5: "255, 255, 1",
		void6: "255, 255, 1",
		terminalLink: "255, 255, 1",
		hightlight: "255, 255, 1"
	}
]
// Shuffle themes on each load for variety and to show off the palette system
function applyRandomTheme() {
	const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
	const root = document.documentElement;

	root.style.setProperty("--void-0", theme.void0);
	root.style.setProperty("--void-1", theme.void1);
	root.style.setProperty("--void-2", theme.void2);
	root.style.setProperty("--void-3", theme.void3);
	root.style.setProperty("--void-4", theme.void4);
	root.style.setProperty("--void-5", theme.void5);
	root.style.setProperty("--void-6", theme.void6);

	root.style.setProperty("--terminal-link", theme.terminalLink);
	root.style.setProperty("--hightlight", theme.hightlight);
}

function isPureNumber(str) {
	// I got 99 problems but a regex ain't one
	return /^[0-9]+$/.test(str);
}

function applyTheme(name) {
	// create theme variable;
	let theme;

	// Gotta respect how horrible javascript is with types, I kind of love it :)
	if (name === null || name === "random") {
		theme = THEMES[Math.floor(Math.random() * THEMES.length)];
	}
	else if (isPureNumber(name)) {
		theme = THEMES[Number(name)];
	}
	else {
		theme = THEMES.find(t => t.name.toLowerCase() === name.toLowerCase());
	}

	if (!theme) return false;

	const root = document.documentElement;
	root.style.setProperty("--void-0", theme.void0);
	root.style.setProperty("--void-1", theme.void1);
	root.style.setProperty("--void-2", theme.void2);
	root.style.setProperty("--void-3", theme.void3);
	root.style.setProperty("--void-4", theme.void4);
	root.style.setProperty("--void-5", theme.void5);
	root.style.setProperty("--void-6", theme.void6);

	root.style.setProperty("--terminal-link", theme.terminalLink);
	root.style.setProperty("--hightlight", theme.hightlight);

	return theme.name;
}

applyTheme(null); // apply random theme on load


//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

async function playJsonMidi(json) {
	await Tone.start();

	const reverb = new Tone.Reverb({ decay: 2, wet: 0.3 }).toDestination();

	const synths = json.tracks.map((track) => {
		if (track.channel === 9) {
			return new Tone.MembraneSynth().connect(reverb);
		}
		return new Tone.PolySynth(Tone.Synth).connect(reverb);
	});

	const now = Tone.now();

	json.tracks.forEach((track, i) => {
		const synth = synths[i];

		track.notes.forEach((note) => {
			synth.triggerAttackRelease(
				note.name,
				note.duration,
				now + note.time,
				note.velocity
			);
		});
	});

}


function enhanceLinks() {
	const links = document.querySelectorAll("#terminal-output a");

	links.forEach((link) => {
		let noScrubsCooldown = false;

		// Process all links with a click animation
		link.addEventListener("click", async (e) => {

			// Click animation
			link.classList.add("clicked");
			setTimeout(() => link.classList.remove("clicked"), 200);

		});

		//Dim links for sfx cooldown
		if (link.classList.contains("sfx")) {
			link.addEventListener("click", async (e) => {
				link.classList.add("cooldown");
			});

		}
		// Special handling for the "No Scrubs" link
		if (link.classList.contains("play-no-scrubs")) {
			const img = document.querySelector("#terminal-output .no-scrubs");

			link.addEventListener("click", async (e) => {
				e.preventDefault();

				// Prevent re-triggering during cooldown
				if (noScrubsCooldown) return;
				noScrubsCooldown = true;

				// Play MIDI JSON
				const json = await fetch("/assets/songs/no-scrubs.json").then(r => r.json());
				playJsonMidi(json);
				//Show item with classname "no-scrubs"
				img.classList.remove("hidden");

				// Reset cooldown after 4 seconds
				setTimeout(() => {
					link.classList.remove("cooldown");
					noScrubsCooldown = false;
					img.classList.add("hidden");
				}, 5000);
			});
		}
	});
}



export function startTyping() {
	// Open command prompt
	initCommandInput();
	const source = document.getElementById("mdx-source");
	const output = document.getElementById("terminal-output");
	const choices = document.getElementById("choices");

	const blocks = Array.from(source.children);
	let index = 0;

	// Allow to skip typing by pressing esacepe
	let skipTyping = false;

	document.addEventListener("keydown", (e) => {
		if (document.querySelector(".command-line")) return;
		if (e.key === "Escape") {
			skipTyping = true;
		}
	});
	function typeNextBlock() {
		if (skipTyping) {
			// Dump all remaining blocks instantly
			for (let i = index; i < blocks.length; i++) {
				const clone = blocks[i].cloneNode(true);
				clone.style.opacity = 1;
				output.appendChild(clone);
			}
			choices.classList.remove("hidden");

			initChoiceNavigation();
			scrollToBottom();
			enhanceLinks();
			return;
		}
		// End of all blocks → reveal choices + enable keyboard nav
		if (index >= blocks.length) {
			choices.classList.remove("hidden");
			initChoiceNavigation();
			scrollToBottom();

			// Add sfx handlers
			enhanceLinks();
			return;
		}

		const original = blocks[index];
		const clone = original.cloneNode(true);
		clone.style.opacity = 0;
		output.appendChild(clone);

		// Detect text blocks
		const isText =
			clone.tagName === "P" ||
			clone.tagName === "H1" ||
			clone.tagName === "H2" ||
			clone.tagName === "H3" ||
			clone.tagName === "H4" ||
			clone.tagName === "H5" ||
			clone.tagName === "H6";

		// Non-text blocks appear instantly
		if (!isText) {
			clone.style.opacity = 1;
			scrollToBottom();
			index++;
			setTimeout(typeNextBlock, 200);

			return;
		}

		// Parse child nodes instead of raw HTML
		const nodes = Array.from(original.childNodes);
		clone.innerHTML = "";
		clone.style.opacity = 1;

		// Cursor
		const cursor = document.createElement("span");
		cursor.className = "cursor";
		cursor.textContent = "█";
		clone.appendChild(cursor);

		let nodeIndex = 0;
		let charIndex = 0;

		function typeNextNode() {
			if (skipTyping) {
				// Dump all remaining nodes instantly
				for (let i = nodeIndex; i < nodes.length; i++) {
					const node = nodes[i];
					if (node.nodeType === Node.TEXT_NODE) {
						const span = document.createElement("span");
						span.textContent = node.textContent;
						clone.insertBefore(span, cursor);
					} else {
						clone.insertBefore(node.cloneNode(true), cursor);
					}
				}
				cursor.remove();
				index++;
				typeNextBlock();
				return;
			}

			if (nodeIndex >= nodes.length) {
				cursor.remove();
				index++;
				setTimeout(typeNextBlock, 200);
				return;
			}

			const node = nodes[nodeIndex];

			// ELEMENT NODE → append instantly (handles <br>, <a>, <em>, etc.)
			if (node.nodeType === Node.ELEMENT_NODE) {
				const el = node.cloneNode(true);
				clone.insertBefore(el, cursor);
				scrollToBottom();
				nodeIndex++;
				typeNextNode();
				return;
			}

			// TEXT NODE → type character-by-character
			if (node.nodeType === Node.TEXT_NODE) {
				const text = node.textContent;
				const span = document.createElement("span");
				clone.insertBefore(span, cursor);

				function typeChar() {
					if (skipTyping) {
						span.textContent = text; // dump full text
						charIndex = text.length;
						scrollToBottom();
						typeNextNode();
						return;
					}

					if (charIndex < text.length) {
						span.textContent += text[charIndex];
						scrollToBottom();
						charIndex++;
						setTimeout(typeChar, 45);
					} else {
						charIndex = 0;
						nodeIndex++;
						typeNextNode();
					}
				}

				typeChar();
			}
		}

		typeNextNode();
	}

	// -------------------------------
	// KEYBOARD NAVIGATION FOR CHOICES
	// -------------------------------
	function initChoiceNavigation() {
		const choiceEls = Array.from(document.querySelectorAll(".choice"));
		if (choiceEls.length === 0) return;

		let activeIndex = 0;

		function updateActive() {
			choiceEls.forEach((el, i) => {
				el.classList.toggle("active", i === activeIndex);
			});
		}

		updateActive();

		// --- Make choices clickable ---
		choiceEls.forEach((el, i) => {
			el.addEventListener("click", () => {
				activeIndex = i;
				updateActive();

				const target = el.dataset.target;
				if (target) {
					window.location.href = target;
				}
			});
		});

		// Block more keys!
		const blocked = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "];

		document.addEventListener("keydown", (e) => {
			if (window.__commandMode) {
				return; // don't interfere with command input
			}

			if (blocked.includes(e.key)) {
				e.preventDefault();
			}

			if (e.key === "ArrowDown") {
				activeIndex = (activeIndex + 1) % choiceEls.length;
				updateActive();
			}
			if (e.key === "ArrowUp") {
				activeIndex = (activeIndex - 1 + choiceEls.length) % choiceEls.length;
				updateActive();
			}
			if (e.key === "Enter") {

				const target = choiceEls[activeIndex].dataset.target;
				window.location.href = target;
			}
		});
	}

	typeNextBlock();
}


function scrollToBottom() {
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			window.scrollTo({
				top: document.body.scrollHeight,
				behavior: "smooth"
			});
		});
	});
}


// Process command input (triggered by ":" key) for fun hidden features
function initCommandInput() {
	document.addEventListener("keydown", (e) => {

		if (window.__commandMode) return; // already open

		if (e.key === ":") {
			e.preventDefault();
			openCommandPrompt();
		}
	});
}


function openCommandPrompt() {

	{
		const output = document.getElementById("terminal-output");

		const prompt = document.createElement("div");
		prompt.className = "command-line";
		prompt.innerHTML = `
			<span class="prompt">$</span>
			<input class="cmd-input" autofocus />
			<span class="cmd-cursor">█</span>
		`;
		// Insert AFTER terminal-output
		output.insertAdjacentElement("afterend", prompt);


		const input = prompt.querySelector(".cmd-input");

		input.style.width = "10px"; // start with minimal width

		input.focus();

		// Disable choice navigation while typing a command
		window.__commandMode = true;

		input.addEventListener("input", () => {
			input.style.width = (input.value.length + 1) * 10 + "px"; // simple width adjustment based on character count
		});
		input.addEventListener("keydown", () => {
			input.style.width = (input.value.length + 1) * 10 + "px"; // simple width adjustment based on character count
		});



		input.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				const cmd = input.value.trim();
				handleCommand(cmd);
				prompt.remove();
			}
		});
	}
}



function handleCommand(cmd) {
	const output = document.getElementById("terminal-output");

	if (cmd === "help") {
		const pre = document.createElement("pre");
		pre.className = "command-output";
		pre.textContent = `
AVAILABLE COMMANDS
───────────────────────────────────────────────
help
    Show this list.

theme <name | number>
    Change the terminal theme.

theme random
    Pick a random theme.`;
		output.appendChild(pre);
		scrollToBottom();
		setTimeout(() => {
			window.__commandMode = false; // re-enable choices
		}, 200);
		return;
	}

	if (cmd.startsWith("theme ")) {
		const name = cmd.split(" ")[1];
		const ok = applyTheme(name);

		const p = document.createElement("p");
		p.className = "command-output";

		if (ok) {
			p.textContent = `Theme switched to "${ok}".`;
		} else {
			p.textContent = `Unknown theme "${name}". Available: ${Object.keys(THEMES).join(", ")}`;
		}

		output.appendChild(p);
		scrollToBottom();
		setTimeout(() => {
			window.__commandMode = false; // re-enable choices
		}, 200);

		return;
	}
	if (cmd === "Global Thermonuclear War") {
		const pre = document.createElement("pre");
		pre.className = "command-output";
		pre.innerHTML = "How about a nice game of chess?";
		output.appendChild(pre);
		scrollToBottom();

		return;
	}

	// fallback
	const p = document.createElement("p");
	p.className = "command-output";
	p.textContent = `Unknown command: ${cmd}`;
	output.appendChild(p);
	scrollToBottom();

	setTimeout(() => {
		window.__commandMode = false; // re-enable choices
	}, 200);
}