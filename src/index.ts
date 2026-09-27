import { Studio } from "@anvia/studio";
import { createAgent } from "./agents.js";
import { sandbox, tools } from "./sandbox.js";

const agent = createAgent();

new Studio([agent], {
	sandboxes: [{
		inspector: sandbox.inspector({ files: true }),
		agentIds: [agent.id],
		toolNames: tools.map((t) => t.name),
	}],
}).serve({ port: 3000, onShutdown: async () => sandbox.destroy() });