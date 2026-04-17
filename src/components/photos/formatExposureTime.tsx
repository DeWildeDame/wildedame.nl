export default function formatExposureTime(seconds: number): string {

	if (seconds >= 1) {
		// 1 second
		return `${seconds} s`;
	}

	// Convert decimal seconds to a fraction
	const denominator = Math.round(1 / seconds);
	return `1/${denominator} s`;
}