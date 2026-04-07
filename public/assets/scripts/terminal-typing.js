window.__commandMode = false;
window.__curentTheme = null;
const THEMES = [
	{
		name: "default",
		void0: "#0d0014",
		void1: "#9a2f6a",
		void2: "#3a0044",
		void3: "#52005e",
		void4: "#6b0079",
		void5: "#880096",
		void6: "#ff4d8d",
		terminalLink: "242, 143, 63",
		hightlight: "255, 77, 141"
	},

	{
		name: "sunset",
		void0: "#140400",
		void1: "#ff6b3d",
		void2: "#d94a73",
		void3: "#a83279",
		void4: "#6a1b9a",
		void5: "#4a148c",
		void6: "#ff9e80",
		terminalLink: "255, 120, 80",
		hightlight: "255, 90, 150"
	},

	{
		name: "ocean",
		void0: "#001014",
		void1: "#006a9a",
		void2: "#003a44",
		void3: "#005e6b",
		void4: "#00797a",
		void5: "#009688",
		void6: "#4dd0e1",
		terminalLink: "63, 180, 242",
		hightlight: "77, 255, 200"
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

function applyTheme(name) {
	// create theme variable;
	let theme;

	console.log(typeof name);

	// Gotta respect how horrible javascript is with types, I kind of love it :)
	if (name == null || name === "random")
		theme = THEMES[Math.floor(Math.random() * THEMES.length)];
	else if (typeof parseInt(name) === "number")
		theme = THEMES[parseInt(name)];
	else
		theme = THEMES.find(t => t.name === name);
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