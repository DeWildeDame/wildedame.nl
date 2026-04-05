import * as Tone from "tone";
//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

import { Midi } from "@tonejs/midi";

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
			console.log(img);
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
	console.log("Starting terminal typing effect...");
	const source = document.getElementById("mdx-source");
	const output = document.getElementById("terminal-output");
	const choices = document.getElementById("choices");

	const blocks = Array.from(source.children);
	let index = 0;

	// Allow to skip typing by pressing esacepe
	let skipTyping = false;

	document.addEventListener("keydown", (e) => {
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



