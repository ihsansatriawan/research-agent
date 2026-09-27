export const behaviorCases = [
	{
		id: "ambiguous",
		input: "Gimana cara ngolah sampah di rumah?",
		expected: "Agent bertanya balik metode atau jenis sampah yang dimaksud, dan tidak memberi panduan langsung."
	},
	{
		id: "no-useful-result",
		input: "Cara bikin kompos metode Zorbakashi",
		expected: "Agent menyatakan tidak menemukan informasi tentang metode tersebut dan tidak mengarang langkah-langkahnya."
	},
];