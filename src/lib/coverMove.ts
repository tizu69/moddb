import { spring } from 'svelte/motion';

export default function coverMove(element: HTMLElement) {
	const coords = spring(
		{ x: 0, y: 0, scale: 1 },
		{
			stiffness: 0.1,
			damping: 1
		}
	);

	const firstChild = element.firstChild as HTMLElement;
	if (!firstChild) return;

	const rect = firstChild.getBoundingClientRect();

	element.addEventListener('mouseleave', () => {
		coords.set({ x: 0, y: 0, scale: 1 });
	});

	element.addEventListener('mousemove', (event) => {
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const deltaX = (event.clientX - centerX) * 1.75;
		const deltaY = (event.clientY - centerY) * 1.75;
		coords.set({ x: deltaX, y: deltaY, scale: 1.5 });
	});

	coords.subscribe((value) => {
		firstChild.style.transform = `translate(${value.x}px, ${value.y}px) scale(${value.scale})`;
	});
}
