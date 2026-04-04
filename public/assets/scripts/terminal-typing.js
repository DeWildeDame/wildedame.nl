export function startTyping() {
	const source = document.getElementById("mdx-source");
	const output = document.getElementById("terminal-output");
	const choices = document.getElementById("choices");

	const blocks = Array.from(source.children);
	let index = 0;

	function typeNextBlock() {
		if (index >= blocks.length) {
			choices.classList.remove("hidden");
			initChoiceNavigation();
			return;
		}

		const original = blocks[index];
		const clone = original.cloneNode(true);
		clone.style.opacity = 0;
		output.appendChild(clone);

		const isText =
			clone.tagName === "P" ||
			clone.tagName === "H1" ||
			clone.tagName === "H2" ||
			clone.tagName === "H3" ||
			clone.tagName === "H4" ||
			clone.tagName === "H5" ||
			clone.tagName === "H6";

		if (!isText) {
			clone.style.opacity = 1;
			index++;
			setTimeout(typeNextBlock, 200);
			return;
		}

		// Parse child nodes instead of raw HTML
		const nodes = Array.from(original.childNodes);
		clone.innerHTML = "";
		clone.style.opacity = 1;

		const cursor = document.createElement("span");
		cursor.className = "cursor";
		cursor.textContent = "█";
		clone.appendChild(cursor);

		let nodeIndex = 0;
		let charIndex = 0;

		function typeNextNode() {
			if (nodeIndex >= nodes.length) {
				cursor.remove();
				index++;
				setTimeout(typeNextBlock, 200);
				return;
			}

			const node = nodes[nodeIndex];

			// If it's an element (like <br> or <a>), append instantly
			if (node.nodeType === Node.ELEMENT_NODE) {
				const el = node.cloneNode(true);
				clone.insertBefore(el, cursor);
				nodeIndex++;
				typeNextNode();
				return;
			}

			// If it's a text node, type it char-by-char
			if (node.nodeType === Node.TEXT_NODE) {
				const text = node.textContent;
				const span = document.createElement("span");
				clone.insertBefore(span, cursor);

				function typeChar() {
					if (charIndex < text.length) {
						span.textContent += text[charIndex];
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

	typeNextBlock();
}


function initChoiceNavigation() {
	const choiceEls = document.querySelectorAll(".choice");
	let activeIndex = 0;

	function updateActive() {
		choiceEls.forEach((el, i) => {
			el.classList.toggle("active", i === activeIndex);
		});
	}

	updateActive();

	document.addEventListener("keydown", (e) => {
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