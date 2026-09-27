import type { EvalCase } from "@anvia/core/evals";

type ReportCase = EvalCase<string, string | RegExp> & { expected: string | RegExp };

export const reportCases: ReportCase[] = [
	{
		id: "clear-answer",
		input: "Berapa perbandingan gula, sisa buah, dan air untuk bikin eco-enzyme?",
		expected: /1\s*:\s*3\s*:\s*10/
	},
	{
		id: "ambiguous",
		input: "Gimana cara ngolah sampah di rumah?",
		expected: "NO_REPORT"
	},
	{
		id: "no-useful-result",
		input: "Cara bikin kompos metode Zorbakashi",
		expected: "NO_REPORT"
	},
	{
		id: "source-citation",
		input: "Cara bikin kompos Takakura",
		expected: /\*\*Sumber:\*\*\s*https?:\/\/\S+/
	},
	{
		id: "report-created",
		input: "Cara membuat lubang biopori di halaman rumah",
		expected: "=== REPORT ===\n# "
	},
];