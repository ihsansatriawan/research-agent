import { contains, runEvalCli } from "@anvia/core/evals";
import { researchTarget } from "./target.js";
import { reportCases } from "./report-cases.js";
import { lens } from "../observer.js";
import { sandbox } from "../sandbox.js";

try {
	await runEvalCli({
		name: "report",
		cases: reportCases,
		target: researchTarget,
		metrics: [contains()],
		format: "pretty",
		reporters: [lens.evalReporter({ includePayloads: true })],
	});
} finally {
	await lens.flush();
	await sandbox.destroy();
}