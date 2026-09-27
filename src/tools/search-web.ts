import { createTool } from "@anvia/core";
import { z } from "zod";
import { tavily } from "@tavily/core";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY! });

export const searchWeb = createTool({
  name: "searchWeb",
  description:
    "Cari informasi di web tentang metode pengolahan sampah organik dapur. " +
    "Mengembalikan daftar hasil berisi title, url, dan content.",
  inputSchema: z.object({
    query: z.string().describe("Kata kunci pencarian, contoh: cara membuat eco enzyme"),
  }),
  execute: async ({ query }) => {
    const res = await client.search(query, { maxResults: 5 });
    const results = res.results.map((r) => ({ title: r.title, url: r.url, content: r.content }));
    return JSON.stringify(results);
  },
});