import { Agent } from "@anvia/core";
import { getModel } from "./models.js";
import { INSTRUCTIONS } from "./instructions.js";
import { tools as sandboxTools } from "./sandbox.js";
import { searchWeb } from "./tools/search-web.js";
import { lens } from "./observer.js";

export function createAgent() {
  return new Agent({
    id: "kompos-researcher",
    model: getModel(),
    instructions: INSTRUCTIONS,
    // instructions: "You are a helpful assistant.",
    tools: [searchWeb, ...sandboxTools],
    observability: {
      observers: { tracing: lens.observer({ captureMode: "full" }) },
    },
  });
}