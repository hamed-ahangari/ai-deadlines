// Generates machine-readable feeds for AI agents from the conference YAML files.
// Outputs: public/conferences.json, public/conferences-open.json, public/llms.txt
// Wired into `npm run build`, so Cloudflare regenerates them on every push.
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as yaml from "js-yaml";
import { parseISO, isValid } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFERENCES_DIR = path.resolve(__dirname, "../src/data/conferences");
const PUBLIC_DIR = path.resolve(__dirname, "../public");
const SITE_URL = "https://mmforens-deadlines.pages.dev/";

interface Deadline {
  type?: string;
  label?: string;
  date?: string;
  timezone?: string;
}
interface Conference {
  title: string;
  year: number;
  id: string;
  full_name?: string;
  link?: string;
  city?: string;
  country?: string;
  venue?: string;
  date?: string;
  start?: string;
  end?: string;
  tags?: string[];
  note?: string;
  timezone?: string;
  deadline?: string;
  deadlines?: Deadline[];
}

// Copied verbatim from src/utils/dateUtils.ts so the feed's "open" status matches the site exactly.
function normalizeTimezone(tz: string | undefined): string {
  if (!tz) return "UTC";
  if (tz === "AoE") return "-12:00";
  const gmtMatch = tz.match(/^GMT([+-])(\d+)$/);
  if (gmtMatch) {
    const [, sign, hours] = gmtMatch;
    return `${sign}${hours.padStart(2, "0")}:00`;
  }
  if (!tz.toUpperCase().startsWith("UTC") && !tz.toUpperCase().startsWith("GMT")) return tz;
  const utcMatch = tz.match(/^UTC([+-])(\d+)$/);
  if (utcMatch) {
    const [, sign, hours] = utcMatch;
    return `${sign}${hours.padStart(2, "0")}:00`;
  }
  if (tz === "UTC+0" || tz === "UTC-0" || tz === "UTC+00" || tz === "UTC-00") return "UTC";
  return "UTC";
}

// Returns the UTC instant of a deadline, or null if unparseable.
function deadlineToUTC(date: string | undefined, timezone: string | undefined): Date | null {
  if (!date || date === "TBD") return null;
  const parsed = parseISO(date);
  if (!isValid(parsed)) return null;
  try {
    return zonedTimeToUtc(parsed, normalizeTimezone(timezone));
  } catch {
    return null;
  }
}

// Mirrors getAllDeadlines: new-format `deadlines[]` plus legacy `deadline` as a submission.
function allDeadlines(conf: Conference): Deadline[] {
  const out: Deadline[] = [];
  if (Array.isArray(conf.deadlines)) out.push(...conf.deadlines);
  if (conf.deadline && !out.some((d) => d.type === "submission")) {
    out.push({ type: "submission", label: "Paper Submission", date: conf.deadline, timezone: conf.timezone });
  }
  return out;
}

function isOpen(conf: Conference, now: Date): boolean {
  return allDeadlines(conf).some((d) => {
    if (d.type !== "submission") return false;
    const utc = deadlineToUTC(d.date, d.timezone || conf.timezone);
    return utc !== null && utc.getTime() > now.getTime();
  });
}

function nextDeadline(conf: Conference, now: Date): Deadline | null {
  const upcoming = allDeadlines(conf)
    .map((d) => ({ d, utc: deadlineToUTC(d.date, d.timezone || conf.timezone) }))
    .filter((x) => x.utc !== null && x.utc.getTime() > now.getTime())
    .sort((a, b) => a.utc!.getTime() - b.utc!.getTime());
  return upcoming.length ? upcoming[0].d : null;
}

function loadConferences(): Conference[] {
  const files = fs.readdirSync(CONFERENCES_DIR).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml")).sort();
  const all: Conference[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONFERENCES_DIR, file), "utf-8");
    const content = yaml.load(raw);
    if (Array.isArray(content)) all.push(...(content as Conference[]));
  }
  return all;
}

function toFeedEntry(conf: Conference, now: Date) {
  return {
    title: conf.title,
    year: conf.year,
    id: conf.id,
    full_name: conf.full_name ?? null,
    link: conf.link ?? null,
    city: conf.city ?? null,
    country: conf.country ?? null,
    venue: conf.venue ?? null,
    date: conf.date ?? null,
    start: conf.start ?? null,
    end: conf.end ?? null,
    tags: conf.tags ?? [],
    note: conf.note ?? null,
    open: isOpen(conf, now),
    next_deadline: nextDeadline(conf, now),
    deadlines: allDeadlines(conf),
  };
}

function buildLlmsTxt(open: ReturnType<typeof toFeedEntry>[], generated: string): string {
  const lines = [
    "# MM Forensics Conference & Workshop Deadlines",
    "",
    "> Submission deadlines for Multimedia Forensics and Computer Vision conferences and workshops (deepfake detection, watermarking, steganography, media authenticity, biometrics).",
    "",
    `Live site: ${SITE_URL}`,
    `Last updated: ${generated}`,
    "",
    "## Machine-readable feeds",
    "",
    `- [All conferences (JSON)](${SITE_URL}conferences.json): every tracked conference and workshop with full deadline lists.`,
    `- [Open submissions only (JSON)](${SITE_URL}conferences-open.json): conferences and workshops whose paper submission deadline has not yet passed.`,
    "",
    "All deadline times are stored with their timezone; `AoE` means Anywhere on Earth (UTC-12).",
    "",
    "## Currently open for submission",
    "",
  ];
  if (open.length === 0) {
    lines.push("_None currently open._");
  } else {
    for (const c of open) {
      const nd = c.next_deadline;
      const ndStr = nd ? ` — next: ${nd.label} ${nd.date} ${nd.timezone ?? ""}`.trimEnd() : "";
      const loc = [c.city, c.country].filter(Boolean).join(", ");
      lines.push(`- **${c.title} ${c.year}**${c.full_name ? ` (${c.full_name})` : ""}${loc ? ` — ${loc}` : ""}${ndStr}${c.link ? ` — ${c.link}` : ""}`);
    }
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const now = new Date();
  const generated = now.toISOString();
  const confs = loadConferences();
  const entries = confs.map((c) => toFeedEntry(c, now));
  const openEntries = entries.filter((e) => e.open);

  const meta = { generated, site: SITE_URL };
  fs.writeFileSync(
    path.join(PUBLIC_DIR, "conferences.json"),
    JSON.stringify({ ...meta, count: entries.length, conferences: entries }, null, 2)
  );
  fs.writeFileSync(
    path.join(PUBLIC_DIR, "conferences-open.json"),
    JSON.stringify({ ...meta, count: openEntries.length, conferences: openEntries }, null, 2)
  );
  fs.writeFileSync(path.join(PUBLIC_DIR, "llms.txt"), buildLlmsTxt(openEntries, generated));

  // Self-check: feeds must be non-empty and the open set must be a subset of all.
  if (entries.length === 0) throw new Error("generate-feeds: no conferences loaded");
  if (openEntries.length > entries.length) throw new Error("generate-feeds: open count exceeds total");

  console.log(`✓ Generated feeds: ${entries.length} conferences (${openEntries.length} open) + llms.txt`);
}

main();
