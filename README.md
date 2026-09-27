# Research Agent — Pengolahan Sampah Organik Dapur

Agent AI yang meriset cara mengolah sampah organik dapur di rumah (misalnya eco-enzyme, kompos Takakura, biopori, maggot BSF), lalu menulis hasilnya ke report Markdown di dalam sandbox Docker.

Dibangun dengan [Anvia](https://www.npmjs.com/package/@anvia/core) (agent, studio, sandbox, observability) dan [Tavily](https://tavily.com) untuk pencarian web.

## Diagram

Buka di browser untuk melihat cara kerja dari beberapa sudut pandang:

- [`docs/diagrams/01-architecture.html`](docs/diagrams/01-architecture.html) — komponen & koneksinya
- [`docs/diagrams/02-agent-flow.html`](docs/diagrams/02-agent-flow.html) — alur keputusan agent
- [`docs/diagrams/03-request-sequence.html`](docs/diagrams/03-request-sequence.html) — perjalanan satu prompt
- [`docs/diagrams/04-eval-pipeline.html`](docs/diagrams/04-eval-pipeline.html) — cara agent dievaluasi

## Cara kerja

Alur agent (didefinisikan di `src/instructions.ts`):

1. Kalau permintaan tidak jelas (metode tidak disebut / bukan soal sampah organik dapur), agent **bertanya balik** tanpa memanggil tool.
2. Mencari informasi metode tersebut lewat tool `searchWeb` (Tavily).
3. Kalau hasil pencarian tidak membahas metode itu, agent menyatakan **tidak menemukan informasi yang valid**, tanpa mengarang langkah dan tanpa menulis file.
4. Menulis report ke `output/report.md` di sandbox, mengikuti template:
   ```md
   # <Nama Metode>

   **Bahan:** ...
   **Langkah singkat:**
   1. ...
   **Lama proses:** ...
   **Sumber:** <url>
   ```
5. Membaca ulang report untuk verifikasi.
6. Membalas user dengan ringkasan 2–3 kalimat beserta Source URL.

Aturan penting: satu report untuk satu metode, URL sumber wajib disalin persis dari hasil `searchWeb`, dan rasio ditulis dalam format `1:3:10`.

## Struktur proyek

```
src/
├── index.ts            # Entry point: menjalankan Anvia Studio di port 3000
├── agents.ts           # Definisi agent "kompos-researcher"
├── instructions.ts     # System prompt (alur, aturan, template report)
├── models.ts           # Client OpenAI(-compatible) & pemilihan model
├── observer.ts         # Tracing & eval reporter ke Anvia Lens
├── sandbox.ts          # Sandbox Docker + tool write_file/read_file/list_files
├── tools/
│   └── search-web.ts   # Tool searchWeb (Tavily, maks. 5 hasil)
└── evals/
    ├── target.ts       # Menjalankan agent & mengambil isi output/report.md
    ├── report.ts       # Eval berbasis `contains` terhadap isi report
    ├── report-cases.ts
    ├── behavior.ts     # Eval LLM-as-judge (G-Eval) untuk perilaku agent
    └── behavior-cases.ts
```

### Sandbox

Tool file berjalan di container Docker `ghcr.io/astral-sh/uv:alpine` yang terisolasi:

- workspace ephemeral, **tanpa akses network**
- memori 256 MB, 0.5 CPU, maks. 32 proses
- timeout perintah 10 detik, output maks. 64 KB
- ukuran file yang ditulis maks. 16 KB

## Prasyarat

- Node.js 22 (lihat `.nvmrc`)
- pnpm 11
- Docker yang sedang berjalan (image sandbox akan di-pull otomatis)
- API key OpenAI (atau endpoint OpenAI-compatible) dan Tavily
- (Opsional) kredensial Anvia Lens untuk tracing & laporan eval

## Setup

```bash
pnpm install
cp .env.example .env
```

Isi `.env`:

| Variabel | Keterangan |
| --- | --- |
| `OPENAI_API_KEY` | Wajib. API key model. |
| `OPENAI_BASE_URL` | Opsional, untuk endpoint OpenAI-compatible. |
| `TAVILY_API_KEY` | Wajib. Dipakai tool `searchWeb`. |
| `ANVIA_LENS_BASE_URL` | Opsional. URL Anvia Lens. |
| `ANVIA_LENS_PUBLIC_KEY` | Opsional. Public key Anvia Lens. |
| `ANVIA_LENS_SECRET_KEY` | Opsional. Secret key Anvia Lens. |

## Menjalankan

```bash
pnpm start
```

Anvia Studio akan berjalan di `http://localhost:3000`. Dari sana kamu bisa mengobrol dengan agent dan memeriksa isi sandbox (termasuk `output/report.md`). Sandbox dihapus otomatis saat server dimatikan.

Contoh prompt:

- `Berapa perbandingan gula, sisa buah, dan air untuk bikin eco-enzyme?`
- `Cara bikin kompos Takakura`
- `Cara membuat lubang biopori di halaman rumah`

## Evaluasi

Ada dua suite eval. Output setiap run disimpan ke folder `results/` (buat dulu dengan `mkdir -p results` bila belum ada) dan dikirim ke Anvia Lens.

```bash
pnpm eval:report     # cek isi report dengan pencocokan string/regex
pnpm eval:behavior   # cek perilaku agent dengan LLM-as-judge (threshold 0.7)
```

**Report eval** (`src/evals/report-cases.ts`):

| Case | Ekspektasi |
| --- | --- |
| `clear-answer` | Report memuat rasio eco-enzyme `1:3:10` |
| `ambiguous` | Tidak ada report yang ditulis |
| `no-useful-result` | Metode fiktif ("Zorbakashi") → tidak ada report |
| `source-citation` | Report memuat `**Sumber:** <url>` |
| `report-created` | Report terbentuk dan diawali heading `# ` |

**Behavior eval** (`src/evals/behavior-cases.ts`): memastikan agent bertanya balik untuk permintaan ambigu, dan tidak mengarang langkah untuk metode yang tidak ditemukan.

## Scripts lain

```bash
pnpm typecheck   # tsc --noEmit
```
