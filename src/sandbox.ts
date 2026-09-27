import { createDockerSandboxTools, DockerSandboxClient } from "@anvia/sandbox";

const IMAGE = "ghcr.io/astral-sh/uv:alpine";
const client = new DockerSandboxClient();
await client.pullImage({ image: IMAGE });

export const sandbox = await client.createSandbox({
  image: IMAGE,
  workspace: { type: "ephemeral" },
  network: { mode: "none" },
  directories: ["output"],
  resources: { memoryMb: 256, cpus: 0.5, pidsLimit: 32 },
  runtime: { commandTimeoutMs: 10_000, maxOutputBytes: 64_000 },
});

export const tools = createDockerSandboxTools({
  sandbox: sandbox.runtime,
  tools: ["write_file", "read_file", "list_files"],
  writeFile: { maxBytes: 16_000 },
});