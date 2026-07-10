/** @format */

export default function SkipLink({ href = "#main-content", label = "Lompat ke konten utama" }) {
	return (
		<a
			href={href}
			className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg shadow-lift"
		>
			{label}
		</a>
	);
}
