export function startTyping() {
	const source = document.getElementById("mdx-source");
	const output = document.getElementById("terminal-output");
	const choices = document.getElementById("choices");

	const blocks = Array.from(source.children);
	let index = 0;

	function typeNextBlock() {
		if (index >= blocks.length) {
			choices.classList.remove("hidden");
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

		// Character-by-character typing for text blocks
		const html = clone.innerHTML;
		clone.innerHTML = "";
		clone.style.opacity = 1;

		// Create cursor + text span
		const cursor = document.createElement("span");
		cursor.className = "cursor";
		cursor.textContent = "█";

		const textSpan = document.createElement("span");
		textSpan.className = "typed-text";

		clone.appendChild(textSpan);
		clone.appendChild(cursor);

		let charIndex = 0;

		function typeChar() {
			if (charIndex < html.length) {
				textSpan.innerHTML += html[charIndex];
				charIndex++;
				setTimeout(typeChar, 45);
			} else {
				choices.classList.remove("hidden");
				cursor.remove();
				index++;
				setTimeout(typeNextBlock, 200);
			}
		}

		typeChar();
	}

	typeNextBlock();
}
