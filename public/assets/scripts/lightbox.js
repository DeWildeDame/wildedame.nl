// We get to do some javaScript dom hacking 🥳

// Wait dor the document to be ready.
document.addEventListener("DOMContentLoaded", () => {

	// Prepare a lightBox so that the users can zoom in
	const lightBox = document.createElement("div");
	lightBox.className = "lightbox";
	lightBox.innerHTML = `
		<div class="lightbox-inner">
			<img id="lightbox-img" />
		</div>
	`;
	// Append the lightbox to the body don't worry it won't show up
	document.body.appendChild(lightBox);

	// Select the img, this will where we will enlarge the image in.
	const lbImg = lightBox.querySelector("#lightbox-img");

	// Walk through all the images, except for those who have an <a> as their parent.
	// Links take precedence over lightbox.
	document.querySelectorAll("img").forEach((img) => {
		// Skip if parent is an <a>
		if (img.closest("a")) return;

		// Hint that there is some magix happening here.
		img.style.cursor = "zoom-in";
		img.addEventListener("click", () => {
			// Same image no extra queries the user waits one time, which is always preferable over multiple times.
			lbImg.src = img.src;
			lightBox.style.display = "flex";
		});
	});

	// Close lightbox when clicked
	lightBox.addEventListener("click", (e) => {
		if (e.target === lbImg) {
			lightBox.style.display = "none";
			lbImg.style.transform = "scale(1)";
		}
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") lightBox.style.display = "none";
	});

	// Magnifier
	lightBox.addEventListener("mousemove", (e) => {
		const rect = lbImg.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;

		lbImg.style.transformOrigin = `${x}% ${y}%`;
		lbImg.style.transform = "scale(2)";
	});

	lightBox.addEventListener("mouseleave", () => {
		lbImg.style.transform = "scale(1)";
	});
});