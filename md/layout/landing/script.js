tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#398eb3",
                    dark: "#2F7698",
                    light: "#67B2D4",
                    soft: "#EAF6FB",
                },
                accent: "#4CC9B0",
                success: "#22C55E",
                warning: "#F59E0B",
                danger: "#EF4444",
                canvas: "#F7FAFC",
                surface: { DEFAULT: "#FFFFFF", alt: "#F1F5F9" },
                hairline: "#D8E4EA",
                divider: "#E8EEF2",
                ink: {
                    DEFAULT: "#0F172A",
                    soft: "#475569",
                    mute: "#94A3B8",
                },
            },
            fontFamily: {
                display: ['"Hanken Grotesk"', "sans-serif"],
                body: ["Inter", "sans-serif"],
            },
            boxShadow: {
                soft: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.08)",
                lift: "0 4px 10px rgba(15,23,42,0.05), 0 20px 40px -16px rgba(15,23,42,0.16)",
                glow: "0 0 0 1px rgba(57,142,179,0.10), 0 12px 32px -8px rgba(57,142,179,0.28)",
            },
            borderRadius: { "3xl": "1.75rem", "4xl": "2.25rem" },
        },
    },
};
