// All hub content lives here, so updating the hub means editing one file.

const PEOPLE = {
  leon:   { name: "Leon",   initials: "L", color: "#5b8cff", about: "Ops console, access tokens, the repo and anything that needs a new branch or repo." },
  david:  { name: "David",  initials: "D", color: "#3ecf8e", about: "ICP rules, Clay templates and how a client's list should look." },
  bojana: { name: "Bojana", initials: "B", color: "#f5a524", about: "Company kit for new clients and how to work in shared Clay tables." },
};

const FIRST_WEEK = [
  { title: "Get your logins", text: "Slack, Google Drive, Clay, EmailBison, Master Inbox and HeyReach. Shared logins sit in the Secrets tab of this console." },
  { title: "Set up the repo", text: "Clone the Scalantec repo and always start Claude from the client folder (clients/<slug>/), so it knows that client." },
  { title: "Read one client folder", text: "Open a client's CLAUDE.md and INDEX.md. That's where client facts live, not in Slack." },
  { title: "Walk the flow once", text: "Go through \"The flow\" tab with a colleague on a real client and click every link once." },
  { title: "Ask for your ops token", text: "Leon mints it. Without it, Claude can't read the ops console for you." },
];

const PHASES = [
  { id: "understand", label: "Understand", title: "Understand the client", sub: "Before any list, know who you're selling for.", color: "#a78bfa" },
  { id: "build",      label: "Build",      title: "Build the list",        sub: "Find companies, qualify them, then find the right people.", color: "#5b8cff" },
  { id: "send",       label: "Send",       title: "Send and follow up",    sub: "Get it reviewed, launch it, handle the replies.", color: "#3ecf8e" },
];

const STEPS = [
  {
    phase: "understand", title: "Understand the company",
    short: "What does the client sell, to whom, and why would anyone reply?",
    what: [
      "Read the client's <strong>CLAUDE.md</strong> and the sales handover first.",
      "Have Claude explain the company simply (there's a skill for it: <strong>tool-client-explainer</strong>).",
      "Fill in the one-sentence test from the tip. If you can't, the gap is your first question to the team.",
    ],
    result: "You can explain the client in one sentence and you know who the buyer is.",
    tip: "\"X sells Y to Z, one deal is worth about N, there are roughly K Zs in DACH.\" For a platform, only look at the side that pays.",
    prompt: "Explain [company] to me simply. What do they sell, who buys it, what is one deal roughly worth, and how many possible buyers are there in DACH? Then list the terms I need to know and 3 questions I should ask the team.",
    links: [
      { label: "Claude skill: tool-client-explainer", icon: "sparkles" },
      { label: "Company kit (from Bojana)", icon: "folder", todo: true },
    ],
    owner: "bojana",
  },
  {
    phase: "understand", title: "Map the market (TAM)",
    short: "Split the ideal customer into groups and count them roughly.",
    what: [
      "Write down the ICP groups before you enrich anything (a quick draw.io sketch is enough).",
      "Estimate how many companies sit in each group. That tells everyone how many months of outbound the market can carry.",
      "Sanity check the total with a quick desk research estimate. A big gap means the sourcing needs a rethink.",
    ],
    result: "A short list of ICP groups with a rough count for each.",
    tip: "Industry labels lie a lot. Two of our software clients were labelled \"Consulting\". Judge by what a company sells.",
    prompt: "Here is our ICP for [client]: [paste]. Split it into 3 to 5 groups and estimate how many companies exist per group in DACH. Say which numbers are guesses.",
    links: [
      { label: "Campaign SOP, section 4", icon: "file-text", href: "https://github.com/Scalantec/Scalantec/blob/main/sops/260814-campaign-sop-v2.md" },
    ],
    owner: "david",
  },
  {
    phase: "build", title: "Source companies",
    short: "Pull the companies from the right source for the market.",
    what: [
      "<strong>AI Ark</strong> is our main source for volume.",
      "<strong>North Data</strong> for German registry data (also under Tools in this console).",
      "<strong>Google Maps</strong> for local businesses with a real address (also under Tools).",
      "<strong>DiscoLike</strong> for niches, <strong>public lists</strong> (associations, directories) for the rest.",
    ],
    result: "A CSV or list of companies with at least name and domain.",
    tip: "Sourcing is cheap, enrichment is not. Pull wide here and cut hard in the next steps.",
    prompt: "I need companies for this ICP group: [group]. Which source should I use (AI Ark, North Data, Google Maps, DiscoLike or public lists) and which filters should I set?",
    links: [
      { label: "AI Ark", icon: "external-link", href: "https://app.ai-ark.com" },
      { label: "DiscoLike", icon: "external-link", href: "https://discolike.com" },
      { label: "North Data", icon: "external-link", href: "https://www.northdata.com" },
    ],
    owner: "david",
  },
  {
    phase: "build", title: "Company table in Clay",
    short: "Import everything into one company table, clean it, check the blacklist.",
    what: [
      "Start from David's company template instead of building a table from scratch.",
      "Dedupe on domain, clean the domains (no https, no www), then dedupe again.",
      "Check the client blacklist <strong>before</strong> any paid enrichment. Blacklisted means stop.",
    ],
    result: "One clean company table with no duplicates and no blacklisted companies.",
    tip: "In a shared table, never change someone else's prompts. Tag your rows and add a run condition on your tag, so only your rows run.",
    prompt: "I imported [n] companies into Clay. Walk me through dedupe, domain cleaning and the blacklist check, step by step, before I spend credits.",
    links: [
      { label: "Clay", icon: "external-link", href: "https://app.clay.com" },
      { label: "David's company template", icon: "table", todo: true },
    ],
    owner: "david",
  },
  {
    phase: "build", title: "Qualify companies (ICP check)",
    short: "Cheap filters first, AI last. Keep only clear fits.",
    what: [
      "Hard filters first: size, region, industry. Every company cut here saves money.",
      "Scrape the website, then let the AI report <strong>facts</strong> (who are the customers, what do they sell).",
      "Turn those facts into keep / check / cut with formulas, not with AI scores.",
    ],
    result: "Every company marked keep, check or cut, and you can say why.",
    tip: "Check 10 companies by hand before writing any prompt. And keep an answer key of hand-rated companies to test every change against.",
    prompt: "Here are 10 companies I checked by hand with my verdict: [paste]. Help me write clear keep / check / cut rules that would give the same result.",
    links: [
      { label: "Campaign SOP, section 5", icon: "file-text", href: "https://github.com/Scalantec/Scalantec/blob/main/sops/260814-campaign-sop-v2.md" },
    ],
    owner: "david",
  },
  {
    phase: "build", title: "Find people (people table)",
    short: "Find the right person at each kept company.",
    what: [
      "Use a separate <strong>people table</strong>, so your contacts don't mix with other outbound.",
      "Order to try: AI Ark, then Clay people search, then Google search, then scrapers, then the imprint page.",
      "Check the persona <strong>before</strong> enriching. Right role beats a senior title.",
    ],
    result: "A people table with 1 to 2 people per small company, a few more for big ones.",
    tip: "AI Ark gives max 3 people per company per search and blocks bulk runs (error 429). Run it in small chunks. Also check if a colleague already has contacts at those companies.",
    prompt: "For [client], the buyer is [persona]. Give me the job titles to search for in German and English, and the titles to exclude.",
    links: [
      { label: "AI Ark", icon: "external-link", href: "https://app.ai-ark.com" },
      { label: "David's people template", icon: "table", todo: true },
    ],
    owner: "david",
  },
  {
    phase: "build", title: "Find and verify emails",
    short: "Get an email for each person and only keep the safe ones.",
    what: [
      "Find: Better Contact first, then our Clay waterfall.",
      "Verify: Million Verifier for all, BounceBan for catch-all domains.",
      "Only upload <strong>deliverable</strong> emails. Never undeliverable.",
    ],
    result: "People with a verified email, ready for the review sheet.",
    tip: "Bad emails hurt the sending domains for every campaign on them, so this step protects everyone else too.",
    prompt: "My email verification came back with [x] deliverable, [y] risky and [z] catch-all. What should I upload and what should I drop?",
    links: [
      { label: "Better Contact", icon: "external-link", href: "https://bettercontact.rocks" },
      { label: "Million Verifier", icon: "external-link", href: "https://www.millionverifier.com" },
      { label: "BounceBan", icon: "external-link", href: "https://bounceban.com" },
    ],
    owner: "david",
  },
  {
    phase: "send", title: "Export to Google Sheets for review",
    short: "Put the list in a sheet so the team or client can check it.",
    what: [
      "Export the final people list to a Google Sheet in the client's Drive folder.",
      "Show a sample first, not the whole list, and get an OK.",
    ],
    result: "A reviewed sheet that someone signed off.",
    tip: "Clay's sheet push runs under the account that set it up. If it was a colleague, it can't write to your sheet, so use your own connection.",
    prompt: "Turn this Clay export into a clean Google Sheet for review: one row per person, columns [list], and a short summary tab on top.",
    links: [
      { label: "Export SOP", icon: "file-text", href: "https://github.com/Scalantec/Scalantec/blob/main/sops/export-to-google-sheets.md" },
      { label: "Google Drive", icon: "external-link", href: "https://drive.google.com" },
    ],
    owner: "david",
  },
  {
    phase: "send", title: "Launch the campaign",
    short: "Upload to EmailBison and HeyReach, after the human checks.",
    what: [
      "Email goes through <strong>EmailBison</strong>, LinkedIn through <strong>HeyReach</strong>.",
      "Batch by company, so one company never gets everything at once.",
      "Nothing sends before the four human gates are signed off (see the Outreach engine under Tools).",
    ],
    result: "A live campaign that passed every check.",
    tip: "Green is not delivered. A launch that says \"success\" can still send nothing, so check the first sends yourself.",
    prompt: "Check this campaign before launch: [paste sequence + sample leads]. Go through variables, salutation, signature and the pre-launch checklist.",
    links: [
      { label: "EmailBison", icon: "external-link", href: "https://send.scalantec.com" },
      { label: "HeyReach", icon: "external-link", href: "https://app.heyreach.io" },
    ],
    owner: "leon",
  },
  {
    phase: "send", title: "Replies and blacklist",
    short: "Answer replies in Master Inbox and keep the blacklist fresh.",
    what: [
      "All replies land in <strong>Master Inbox</strong>. Label them, that's where the reply numbers come from.",
      "Booked a meeting? Take that person out of all other outreach.",
      "Refresh the client blacklist every week.",
    ],
    result: "Every reply answered and labelled, nobody gets contacted twice.",
    tip: "Never send a message as someone else without their review. Draft it, get the OK, then send.",
    prompt: "Here is a reply from a lead: [paste]. Draft an answer in [sender]'s voice and tell me which label to set.",
    links: [
      { label: "Master Inbox", icon: "external-link", href: "https://app.masterinbox.com" },
    ],
    owner: "bojana",
  },
];

const TOOLS = [
  { group: "Start here", name: "Ops console", url: "https://scalantec-ops.pages.dev", icon: "layout-grid", what: "Clients, campaigns, deliverability, secrets and this hub.", access: "Google login, ops token from Leon" },
  { group: "Start here", name: "Scalantec repo", url: "https://github.com/Scalantec/Scalantec", icon: "github", what: "Client folders, SOPs and Claude skills. Everything goes on main.", access: "GitHub invite from Leon" },
  { group: "Start here", name: "Google Drive", url: "https://drive.google.com", icon: "hard-drive", what: "Lead lists, big files and client folders. IDs are in each client's DRIVE.md.", access: "Your Scalantec Google account" },

  { group: "Find companies & people", name: "AI Ark", url: "https://app.ai-ark.com", icon: "database", what: "Our main source for companies and people.", access: "Secrets tab" },
  { group: "Find companies & people", name: "DiscoLike", url: "https://discolike.com", icon: "radar", what: "Finding companies and people in niches.", access: "Secrets tab" },
  { group: "Find companies & people", name: "North Data", url: "https://www.northdata.com", icon: "landmark", what: "German registry data. Also runs from Tools in this console.", access: "Use the console tool" },
  { group: "Find companies & people", name: "Apify", url: "https://console.apify.com", icon: "bug", what: "Scrapers, mostly for LinkedIn when nothing else works.", access: "Secrets tab" },

  { group: "Enrich & qualify", name: "Clay", url: "https://app.clay.com", icon: "table", what: "Company and people tables, enrichment, AI columns.", access: "Invite to the Scalantec workspace" },
  { group: "Enrich & qualify", name: "Better Contact", url: "https://bettercontact.rocks", icon: "at-sign", what: "First stop for finding emails.", access: "Secrets tab" },
  { group: "Enrich & qualify", name: "Million Verifier", url: "https://www.millionverifier.com", icon: "shield-check", what: "Checks if an email is safe to send to.", access: "Secrets tab" },

  { group: "Send & reply", name: "EmailBison", url: "https://send.scalantec.com", icon: "mail", what: "Sends our cold emails.", access: "Secrets tab" },
  { group: "Send & reply", name: "HeyReach", url: "https://app.heyreach.io", icon: "linkedin", what: "LinkedIn outreach from our senders' accounts.", access: "Secrets tab" },
  { group: "Send & reply", name: "Master Inbox", url: "https://app.masterinbox.com", icon: "inbox", what: "All replies in one place, with labels. Source of truth for reply numbers.", access: "Secrets tab" },
  { group: "Send & reply", name: "Zapmail", url: "https://zapmail.ai", icon: "server", what: "Buys and warms up sending domains and inboxes.", access: "Ask Leon" },

  { group: "Meetings & team", name: "Fireflies", url: "https://app.fireflies.ai", icon: "mic", what: "Call recordings and transcripts.", access: "Your Scalantec Google account" },
  { group: "Meetings & team", name: "Slack", url: "https://slack.com", icon: "message-square", what: "Each client has its own channels. Big decisions still go into the repo.", access: "Invite from the team" },
];

const WHERE = [
  { q: "Facts about a client", icon: "user-round", a: "clients/<slug>/CLAUDE.md", note: "Start with INDEX.md in the same folder, it lists what's current." },
  { q: "How we run a campaign", icon: "route", a: "sops/260814-campaign-sop-v2.md", note: "The full process. \"The flow\" tab here is the short version." },
  { q: "Logins and API keys", icon: "key-round", a: "Secrets tab · ~/.config/scalantec-ops", note: "Never in the repo, never in /tmp." },
  { q: "Lead lists and big files", icon: "folder", a: "The client's Google Drive folder", note: "Folder IDs are in clients/<slug>/DRIVE.md." },
  { q: "What Claude knows how to do", icon: "sparkles", a: ".claude/skills/", note: "New? Start with team-gtm-engineer, it points to the rest." },
  { q: "Meeting notes and calls", icon: "mic", a: "Fireflies", note: "Search by client name or person." },
  { q: "Quick throwaway work", icon: "trash-2", a: "outputs/", note: "Ignored by git. Move anything worth keeping into the client folder." },
  { q: "A problem someone already solved", icon: "lightbulb", a: "LEARNINGS.md inside the platform-* skill", note: "Found a new gotcha? Add it there with /learned." },
];

const LEARNINGS = [
  { group: "Judging a company", icon: "scale", items: [
    "Write one sentence: <em>\"X sells Y to Z, one deal is worth about N, there are roughly K Zs in DACH.\"</em> If you can't fill it in, that gap is your question.",
    "For a platform, only judge the side that pays.",
    "\"Most offices already have one\" is not a reason to drop a company. Almost every B2B market is a switching market.",
    "Good fit: B2B, thousands of possible buyers, small and mid-sized buyers (about 10% reply, corporates about 1%).",
    "Good fit: selling more doesn't need many more people. Software and media yes, consulting and made-to-order no.",
    "Good fit: independent, about 20 to 500 people, DACH first, and they actually want more customers.",
    "Easiest pitch: the company looks like a client we already have.",
  ]},
  { group: "Building an ICP check", icon: "list-filter", items: [
    "Agree on the end result first. Sometimes the team needs 10 names to ask about, not a scored list of 371.",
    "Check 10 companies by hand before writing any prompt. A few website reads show more than any test run.",
    "Keep an answer key and test every change against it before a bigger run. It saves credits.",
    "Rules beat points. With points, a factory and a software firm can both end up at 85.",
    "Let the AI report facts and put the numbers in formulas. That made results a lot more stable (72% to about 90%).",
    "Turn feedback into reasons, not 1:1 rules. \"Cut consulting\" as a label rule cut two of our best clients.",
    "Stop iterating when a round only fixes one or two companies. Do one full run, then check the short list by hand.",
  ]},
  { group: "Clay", icon: "table", items: [
    "For a sanity check, use Claygent (it researches the web) instead of only the scraped website. Gate it to the short list.",
    "The website scrape drops images, so customer logos never reach the AI. Check those by hand.",
    "Headcount from the Google estimate is often exactly \"10\". Treat it as unknown.",
    "Umlauts in a prompt built as a formula can break it silently. Write it with ensure_ascii=False.",
    "After changing a formula, old cells keep the old value until the row runs again.",
    "Renaming a column is safe. Formulas link by field id, not by name.",
    "Test dedupe before trusting it. Re-sent rows merge into the existing record.",
    "Trust only company name and domain from a webhook. Let the table's own checks decide the rest.",
  ]},
];

const GLOSSARY = [
  { t: "AE", long: "Account Executive", cat: "Sales", d: "The salesperson who runs the deal after the first meeting and closes it." },
  { t: "Abmahnung", long: "Legal warning (DE)", cat: "Sending", d: "A formal legal warning, for example about unwanted cold email. These go to blacklist@scalantec.com and get handled by a person." },
  { t: "Answer key", cat: "Clay & data", d: "A set of companies you rated by hand. You test every rule change against it before a big run." },
  { t: "Auto-run", cat: "Clay & data", d: "A Clay setting that runs a column on every new row by itself. Saves clicks, can burn credits." },
  { t: "B2B", long: "Business to business", cat: "Basics", d: "A company that sells to other companies, not to private people." },
  { t: "BDR / SDR", long: "Business / Sales Development Rep", cat: "Sales", d: "The person who does the first outreach and books meetings for the AE." },
  { t: "Blacklist / DNC", long: "Do not contact", cat: "Sending", d: "Companies and people we must never contact: existing customers, partners, competitors, people who opted out." },
  { t: "Bounce", cat: "Sending", d: "An email that couldn't be delivered. Too many bounces damage the sending domain." },
  { t: "Catch-all", cat: "Sending", d: "A domain that accepts every address, so you can't tell if a person's email is real. We check those with BounceBan." },
  { t: "Claygent", cat: "Clay & data", d: "Clay's AI agent that researches on the web, not just on the scraped website." },
  { t: "CLAUDE.md", cat: "Repo", d: "The file Claude reads first in a folder. Each client has one with the facts that matter." },
  { t: "Credits", cat: "Clay & data", d: "What enrichment tools charge per lookup. Cheap filters first, so you spend fewer." },
  { t: "CRM", long: "Customer relationship management", cat: "Sales", d: "Where a company keeps its customers and deals, for example HubSpot or Salesforce." },
  { t: "DACH", cat: "Basics", d: "Germany, Austria and Switzerland (Deutschland, Austria, Confoederatio Helvetica)." },
  { t: "Dedupe", cat: "Clay & data", d: "Removing duplicates, usually by domain for companies and by LinkedIn URL or email for people." },
  { t: "Deliverability", cat: "Sending", d: "How many of our emails land in the inbox and not in spam." },
  { t: "Enrichment", cat: "Clay & data", d: "Adding data to a row, like headcount, email or LinkedIn URL. Costs credits." },
  { t: "GTM", long: "Go-to-market", cat: "Basics", d: "Everything a company does to bring a product to buyers: who to target, how to reach them, how to sell." },
  { t: "ICP", long: "Ideal customer profile", cat: "Basics", d: "The description of the companies that are the best fit for a client.", ex: "Software firm, 20 to 500 people, DACH, sells to SMEs." },
  { t: "Imprint / Impressum", cat: "Clay & data", d: "The legal page on German websites. Lists the managing directors, which makes it a good last source for names." },
  { t: "KMU / SME", long: "Small and mid-sized enterprises", cat: "Basics", d: "Smaller companies. They reply to cold outreach far more often than corporates." },
  { t: "Lead", cat: "Sales", d: "A person we might contact or already contacted." },
  { t: "Master Inbox (MI)", cat: "Tools", d: "Where all replies land. Its labels are the source of truth for reply numbers." },
  { t: "Meeting booked", cat: "Sales", d: "The main result we report. A lead agreed to a call with the client." },
  { t: "Multichannel", cat: "Sending", d: "Reaching the same person by email and LinkedIn in one sequence." },
  { t: "Persona", cat: "Sales", d: "The role we want to talk to at a company. Right role beats a senior title." },
  { t: "Positive reply", cat: "Sending", d: "A reply that shows interest. The number clients care about most after meetings." },
  { t: "QBR", long: "Quarterly business review", cat: "Sales", d: "A meeting every quarter where we show a client results and next steps." },
  { t: "RevOps", long: "Revenue operations", cat: "Basics", d: "The systems behind sales and marketing: CRM, data, automations, reporting." },
  { t: "Run condition", cat: "Clay & data", d: "A rule that says when a Clay column is allowed to run. Use it to only touch your own rows." },
  { t: "Sequence", cat: "Sending", d: "The series of messages a lead gets, for example a first email and one follow-up." },
  { t: "Signal", cat: "Clay & data", d: "A sign that a company might buy now, like a website visit, a new hire or funding." },
  { t: "SPF / DKIM / DMARC", cat: "Sending", d: "Email settings that prove we are allowed to send from a domain. Without them we land in spam." },
  { t: "TAM", long: "Total addressable market", cat: "Basics", d: "All the companies that could buy from a client. Tells you how many months of outbound are possible." },
  { t: "Tier 1 / 2 / 3", cat: "Clay & data", d: "Priority groups. Tier 1 is the best fit and gets contacted first." },
  { t: "Waterfall", cat: "Clay & data", d: "Trying several data sources in a row until one finds the answer. Saves money because you stop at the first hit." },
  { t: "Warm-up", cat: "Sending", d: "Sending a few emails a day from a new inbox for a while, so providers trust it before real campaigns." },
  { t: "Webhook", cat: "Clay & data", d: "A link that lets one tool push data into another automatically, for example new website visitors into Clay." },
];
