export function startTyping() {
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
			return;
		}
		// End of all blocks → reveal choices + enable keyboard nav
		if (index >= blocks.length) {
			choices.classList.remove("hidden");
			initChoiceNavigation();
			scrollToBottom();
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