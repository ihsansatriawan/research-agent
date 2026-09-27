import { gEval, runEvalCli } from "@anvia/core/evals";
import { researchTarget } from "./target.js";
import { behaviorCases } from "./behavior-cases.js";
import { getModel } from "../models.js";
import { lens } from "../observer.js";
import { sandbox } from "../sandbox.js";

try {
  await runEvalCli({
    name: "behavior",
    cases: behaviorCases,
    target: researchTarget,
    metrics: [
      gEval({
        name: "behavior",
        model: getModel(),
        threshold: 0.7,
        criteria:
          "Perilaku agent pada actual output sesuai dengan deskripsi di expected output.",
        evaluationParams: ["input", "actualOutput", "expectedOutput"],
      }),
    ],
    format: "pretty",
    reporters: [lens.evalReporter({ includePayloads: true })],
  });
} finally {
  await lens.flush();
  await sandbox.destroy();
}