import { createAgent } from "../agents.js";
import { sandbox } from "../sandbox.js";

const REPORT = "output/report.md";
const rt = sandbox.runtime;
const agent = createAgent();

async function resetReport() {
  await rt.exec({ command: "rm", args: ["-f", REPORT] });
}

async function readReport(): Promise<string | null> {
  const files = await rt.listFiles({ path: "output" });
  const exists = files.some((f) => f.path.endsWith("report.md"));
  return exists ? rt.readTextFile({ path: REPORT }) : null;
}

export async function researchTarget(input: string): Promise<string> {
  await resetReport();
  const res = await agent.generate({ prompt: input });
  const report = await readReport();
  return `${res.text}\n\n=== REPORT ===\n${report ?? "NO_REPORT"}`;
}