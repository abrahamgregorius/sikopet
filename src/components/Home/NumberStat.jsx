/** @format */

import { useEffect, useRef, useState } from "react";

export default function NumberStat({ end, decimals = 0, suffix = "" }) {
	const [count, setCount] = useState(0);
	const ref = useRef(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const io = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					const duration = 1400;
					const start = performance.now();

					const tick = (now) => {
						const progress = Math.min((now - start) / duration, 1);
						const eased = 1 - Math.pow(1 - progress, 3);
						setCount(end * eased);
						if (progress < 1) requestAnimationFrame(tick);
					};
					requestAnimationFrame(tick);
					io.unobserve(el);
				}
			},
			{ threshold: 0.4 },
		);

		io.observe(el);
		return () => io.disconnect();
	}, [end]);

	const displayValue = decimals
		? count.toFixed(decimals)
		: Math.round(count).toLocaleString("id-ID");

	return (
		<span ref={ref}>
			{displayValue}
			{suffix}
		</span>
	);
}