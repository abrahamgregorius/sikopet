/** @format */

export default function SharedStyles() {
	return (
		<style>{`
            html { scroll-behavior: smooth; }
            .font-display { font-family: "Hanken Grotesk", sans-serif; }

            .glass-nav {
                background: rgba(247, 250, 252, 0.72);
                backdrop-filter: blur(14px) saturate(160%);
                -webkit-backdrop-filter: blur(14px) saturate(160%);
                border-bottom: 1px solid rgba(216, 228, 234, 0.6);
            }
            .glass-card {
                background: rgba(255, 255, 255, 0.62);
                backdrop-filter: blur(16px) saturate(160%);
                -webkit-backdrop-filter: blur(16px) saturate(160%);
                border: 1px solid rgba(255, 255, 255, 0.5);
            }

            .shadow-soft { box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.08); }
            .shadow-lift { box-shadow: 0 4px 10px rgba(15,23,42,0.05), 0 20px 40px -16px rgba(15,23,42,0.16); }
            .shadow-glow { box-shadow: 0 0 0 1px rgba(57,142,179,0.10), 0 12px 32px -8px rgba(57,142,179,0.28); }
            .hover\\:shadow-lift:hover { box-shadow: 0 4px 10px rgba(15,23,42,0.05), 0 20px 40px -16px rgba(15,23,42,0.16); }
            .hover\\:shadow-soft:hover { box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.08); }
            .focus-ring:focus-visible { outline: 2px solid #398eb3; outline-offset: 3px; border-radius: 8px; }

            .reveal {
                opacity: 0;
                transform: translateY(18px);
                transition: opacity 0.7s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1);
            }
            .reveal[data-revealed] { opacity: 1; transform: translateY(0); }
            .reveal-delay-1 { transition-delay: 0.08s; }
            .reveal-delay-2 { transition-delay: 0.16s; }
            .reveal-delay-3 { transition-delay: 0.24s; }

            .blob { filter: blur(70px); }

            .node-pulse { animation: nodePulse 2.6s ease-out infinite; }
            @keyframes nodePulse { 0% { transform: scale(0.6); opacity: 0.85; } 70% { transform: scale(2.6); opacity: 0; } 100% { transform: scale(2.6); opacity: 0; } }
            .node-pulse.d1 { animation-delay: 0.3s; }
            .node-pulse.d2 { animation-delay: 0.9s; }
            .node-pulse.d3 { animation-delay: 1.5s; }
            .node-pulse.d4 { animation-delay: 0.6s; }

            .float-y { animation: floatY 6s ease-in-out infinite; }
            .float-y.slow { animation-duration: 8s; }
            .float-y.rev { animation-direction: reverse; }
            @keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

            .dash { stroke-dasharray: 6 6; animation: dashMove 3.5s linear infinite; }
            @keyframes dashMove { to { stroke-dashoffset: -60; } }

            .faq-panel { max-height: 0; overflow: hidden; transition: max-height 0.45s ease, padding 0.3s ease; }
            .faq-item.open .faq-panel { max-height: 320px; }
            .faq-item .chev { transition: transform 0.3s ease; }
            .faq-item.open .chev { transform: rotate(180deg); }

            ::selection { background: #67b2d4; color: #fff; }
        `}</style>
	);
}
