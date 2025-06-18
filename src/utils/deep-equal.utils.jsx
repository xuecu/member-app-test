// 核對 a, b 物件相同
export function deepEqual(a, b) {
	if (a === b) return true;

	if (typeof a !== 'object' || typeof b !== 'object' || a == null || b == null) return false;

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	if (keysA.length !== keysB.length) return false;

	for (let key of keysA) {
		if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
	}
	return true;
}
