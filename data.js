// All hub content lives here, so updating the hub means editing one file.

const LINKS = {
  drive: "https://drive.google.com/drive/folders/1GKec1JhvCj_ONNlTto00YKdESjSMguWp",
  muriel: "https://claude.ai/artifact/JkjK4htKZcbiFYCbxRzSey",
  sop: "https://github.com/Scalantec/Scalantec/blob/main/sops/260814-campaign-sop-v2.md",
  kit: "kit/client-explained-page-format.md",
  clayCompany: "https://app.clay.com/workspaces/325042/workbooks/wb_0tfyt7hBKUAne8TiBPi",
  clayPeople: "https://app.clay.com/workspaces/325042/workbooks/wb_0t1955yoWqb8V99rYzU",
};

const PEOPLE = {
  muriel: { name: "Muriel", color: "#3ecf8e", about: "Anything campaign related: EmailBison, HeyReach and reply management." },
  david:  { name: "David",  color: "#5b8cff", about: "ICP, list rules and the Clay master templates." },
  bojana: { name: "Bojana", color: "#f5a524", about: "The client explainer kit and working in shared Clay tables." },
  leon:   { name: "Leon",   color: "#a78bfa", about: "Ops console, access, tokens and the repo." },
};

const STAGES = [
  {
    id: "understand", label: "Understand", sub: "the client", icon: "lightbulb", color: "#a78bfa", owner: "bojana",
    title: "Understand the client",
    intro: "Before you build anything, get a feel for who the client is and who buys from them. If you can explain it in one sentence, you're ready for the next step.",
    steps: [
      "Read the client's internal Slack channel and their CLAUDE.md in the repo. Tools and setups are a bit different for every client.",
      "Build a \"client, explained simply\" page with Bojana's kit. Claude does most of the work, you check it.",
      "Try the one-sentence test on the right. Whatever you can't fill in is your first question for the team.",
    ],
    visual: "sentence",
    tips: [
      { t: "Look at who pays", d: "For a platform, only the paying side counts. On a craftsman platform the craftsmen are the network, and insurers and property managers are the ones who pay." },
      { t: "Industry labels can be off", d: "Two of our software clients were labelled \"Consulting\". It helps more to look at what a company actually sells." },
    ],
    links: [
      { label: "Bojana's explainer kit", icon: "package", href: LINKS.kit },
      { label: "Scalantec Drive", icon: "hard-drive", href: LINKS.drive },
    ],
    prompt: "Build a \"[client], explained simply\" page with the format from Bojana's kit. Use [their ICP doc], [CRM export + date], [call transcripts] and [website]. Keep it plain English and add a card for every term I might not know.",
  },
  {
    id: "find", label: "Find", sub: "companies", icon: "search", color: "#5b8cff", owner: "david",
    title: "Find the companies",
    intro: "Now you split the ideal customer into a few groups and pull the companies for each group. Pulling lists is cheap, so it's fine to go wide here and sort them out in Clay later.",
    steps: [
      "Write down the ICP groups first and guess how many companies are in each. That tells you how many months of outreach the market can carry.",
      "Pick the source that fits the group (hover over the sources on the right).",
      "Bring everything into one company table in Clay.",
    ],
    visual: "sources",
    tips: [
      { t: "Agree on the end result first", d: "Sometimes the team needs 10 names to ask a contact about, and sometimes a scored list of 400. Asking first saves you a lot of work." },
      { t: "Treat a headcount of \"10\" as unknown", d: "The Google estimate often says exactly 10 employees, so it's better to double check the real size." },
    ],
    links: [
      { label: "AI Ark", icon: "external-link", href: "https://app.ai-ark.com" },
      { label: "DiscoLike", icon: "external-link", href: "https://discolike.com" },
      { label: "Campaign SOP, part 4", icon: "file-text", href: LINKS.sop },
    ],
    prompt: "Here is the ICP for [client]: [paste]. Split it into 3 to 5 groups, guess how many companies each group has in DACH and tell me which source (AI Ark, North Data, Google Maps, DiscoLike) fits each group. Mark your guesses as guesses.",
  },
  {
    id: "build", label: "Build", sub: "in Clay", icon: "table", color: "#22c3e6", owner: "david",
    title: "Build the list in Clay",
    intro: "Clay is where the list gets cleaned, checked and filled with people. You start from David's master templates, so you don't have to build the tables yourself.",
    steps: [
      "Import the companies into the <strong>master company table</strong>. Dedupe on the domain and check the blacklist before you spend any credits.",
      "Run the cheap filters first (size, region, industry), then let the AI read the website and check the ICP.",
      "Move the companies that fit into the <strong>master people table</strong> and find 1 to 2 people per small company.",
      "Find and verify their emails. Only deliverable emails go on.",
    ],
    visual: "funnel",
    tips: [
      { t: "Let the AI collect facts", d: "Ask the AI what it sees (who are the customers, what do they sell) and turn that into keep, check or cut with a formula. That made our results a lot more stable." },
      { t: "Shared tables need run conditions", d: "In a table someone else uses too, leave their prompts as they are. Tag your rows and add a run condition on your tag, so only your rows run." },
      { t: "Logos get lost", d: "The website scrape drops images, so customer logos never reach the AI. For the short list, Claygent (it searches the web) or a quick look by hand catches them." },
      { t: "AI Ark in small chunks", d: "AI Ark gives max 3 people per company per search and blocks big runs (error 429). Smaller batches work fine." },
    ],
    links: [
      { label: "Master company table", icon: "table", href: LINKS.clayCompany },
      { label: "Master people table", icon: "users", href: LINKS.clayPeople },
      { label: "Campaign SOP, parts 4 to 7", icon: "file-text", href: LINKS.sop },
    ],
    prompt: "I imported [n] companies into the master company table in Clay. Walk me through dedupe, the blacklist check and the cheap filters step by step, so I only spend credits on companies that can fit.",
  },
  {
    id: "review", label: "Review", sub: "the list", icon: "list-checks", color: "#f5a524", owner: "david",
    title: "Review the list",
    intro: "This is the step people like to skip, and it's the one that saves the most trouble later. You look at the list with your own eyes before anyone else sees it.",
    steps: [
      "Open 10 to 20 random rows and look at the websites yourself. Does it match what the client sells to?",
      "Hover over the checklist on the right and go through it.",
      "Export a sample to a Google Sheet in the client's Drive folder and ask David (or the person who owns the client) to have a look.",
    ],
    visual: "checklist",
    tips: [
      { t: "Keep an answer key", d: "A few companies you rated by hand, plus our own clients. Test every rule change against it before a big run and you'll save a lot of credits." },
      { t: "Know when to stop", d: "When a round of changes only fixes one or two companies, it's time for one full run and a hand check of the short list." },
      { t: "Clay sheet export", d: "Clay's Google Sheet push runs under the account of whoever set it up. If that's a colleague, connect your own account to write to your sheet." },
    ],
    links: [
      { label: "Scalantec Drive", icon: "hard-drive", href: LINKS.drive },
      { label: "Export to Sheets SOP", icon: "file-text", href: "https://github.com/Scalantec/Scalantec/blob/main/sops/export-to-google-sheets.md" },
    ],
    prompt: "Here are 20 rows from my list with my own verdict for each: [paste]. Where do my rules and my gut disagree, and what does that tell me about the rules?",
  },
  {
    id: "send", label: "Send", sub: "and reply", icon: "send", color: "#3ecf8e", owner: "muriel",
    title: "Send and handle replies",
    intro: "Muriel's walkthrough is the source for everything here. The main idea is that nobody launches alone: a campaign stays on draft until a second person checked the leads and copy, and the client said OK where that's agreed.",
    steps: [
      "Domains and inboxes come from Zapmail and warm up in EmailBison for 2 to 3 weeks. LinkedIn can already start in that time.",
      "Email campaigns go into EmailBison: lead list first, then the sequence with fallbacks, a spun subject line and an opt-out line. Send yourself a test email for every step.",
      "LinkedIn campaigns go into HeyReach: one lead per company, a fallback for every message, and connection requests within the daily limits.",
      "Replies land in Master Inbox and get a label automatically. Muriel handles the reply management.",
    ],
    visual: "gates",
    tips: [
      { t: "Read the client's Slack channel first", d: "Every client has a slightly different setup, and the channel tells you what's agreed." },
      { t: "Check what was sent", d: "A campaign can say \"success\" and still send nothing. Look at the first sends yourself." },
      { t: "Blacklist requests are tricky", d: "One complaint blacklists one email, and a company's request blacklists the whole domain. If you're unsure, ask Muriel before you approve." },
    ],
    links: [
      { label: "Muriel's setup walkthrough", icon: "map", href: LINKS.muriel },
      { label: "EmailBison", icon: "external-link", href: "https://send.scalantec.com" },
      { label: "HeyReach", icon: "external-link", href: "https://app.heyreach.io" },
      { label: "Master Inbox", icon: "external-link", href: "https://app.masterinbox.com" },
    ],
    prompt: "Check this campaign before I hand it over for the second check: [paste sequence + 3 sample leads]. Go through variables, fallbacks, salutation, signature and the opt-out line.",
  },
];

const SOURCES = [
  { name: "AI Ark", best: "Our main source for companies and people, good for volume." },
  { name: "North Data", best: "German registry data. Runs from Tools in this console." },
  { name: "Google Maps", best: "Local businesses with a real address. Also under Tools." },
  { name: "DiscoLike", best: "Niches that the big databases don't cover well." },
  { name: "Public lists", best: "Associations, directories, award and member lists." },
];

const FUNNEL = [
  { label: "All companies", w: 100, d: "Everything you pulled from the sources." },
  { label: "Off the blacklist", w: 86, d: "Customers, partners and competitors come out first, before any credits." },
  { label: "Pass the filters", w: 58, d: "Size, region and industry. Every cut here saves money." },
  { label: "ICP fit", w: 34, d: "The AI read the website and the rules said keep." },
  { label: "People found", w: 26, d: "1 to 2 people per small company, a few more for big ones." },
  { label: "Verified email", w: 19, d: "Only deliverable emails make it to the campaign." },
];

const REVIEW_CHECKS = [
  { t: "Does it look like the client's customers?", d: "Open the website. If you need to think twice, it probably goes out." },
  { t: "No customers, partners or competitors", d: "Search the list for names from the client's blacklist." },
  { t: "Right person, still there", d: "Check the role and that they still work at the company." },
  { t: "\"Check by hand\" rows stay out", d: "Anything that isn't clearly a fit stays off the list until someone checked it." },
  { t: "A second person had a look", d: "Share a sample sheet and get an OK before the next step." },
];

const GATES = [
  { t: "Domains + inboxes", s: "Zapmail", d: "3 inboxes per domain, with a profile photo." },
  { t: "Warm-up", s: "2 to 3 weeks", d: "EmailBison sends a few mails a day so providers learn to trust the inboxes.", bar: true },
  { t: "Campaign on draft", s: "EmailBison · HeyReach", d: "Everything is set up, but nothing sends yet." },
  { t: "Second check + client OK", s: "Nobody launches alone", d: "A colleague checks leads and copy, and the client approves where agreed.", gate: true },
  { t: "Live", s: "Mon to Fri, 8 to 17", d: "Sends in the leads' timezone, usually Berlin." },
  { t: "Replies", s: "Master Inbox", d: "Every reply gets a label automatically, and Muriel takes it from there." },
];

const TOOLS = [
  { stage: "start", name: "Ops console", url: "https://scalantec-ops.pages.dev", icon: "layout-grid", what: "Clients, campaigns, logins and this hub.", access: "Google login, token from Leon" },
  { stage: "start", name: "Scalantec Drive", url: LINKS.drive, icon: "hard-drive", what: "Client folders, lead lists and big files.", access: "Your Scalantec Google account" },
  { stage: "start", name: "Scalantec repo", url: "https://github.com/Scalantec/Scalantec", icon: "github", what: "Client facts, SOPs and Claude skills.", access: "GitHub invite from Leon" },
  { stage: "start", name: "Fireflies", url: "https://app.fireflies.ai", icon: "mic", what: "Call recordings and transcripts.", access: "Your Scalantec Google account" },
  { stage: "find", name: "AI Ark", url: "https://app.ai-ark.com", icon: "database", what: "Our main source for companies and people.", access: "Secrets tab" },
  { stage: "find", name: "DiscoLike", url: "https://discolike.com", icon: "radar", what: "Companies and people in niches.", access: "Secrets tab" },
  { stage: "find", name: "North Data", url: "https://www.northdata.com", icon: "landmark", what: "German registry data.", access: "Tools tab in this console" },
  { stage: "build", name: "Clay", url: "https://app.clay.com", icon: "table", what: "Where the list gets built and checked.", access: "Invite to the Scalantec workspace" },
  { stage: "send", name: "EmailBison", url: "https://send.scalantec.com", icon: "mail", what: "Sends our cold emails.", access: "Secrets tab" },
  { stage: "send", name: "HeyReach", url: "https://app.heyreach.io", icon: "linkedin", what: "LinkedIn outreach.", access: "Secrets tab" },
  { stage: "send", name: "Master Inbox", url: "https://app.masterinbox.com", icon: "inbox", what: "All replies in one place, with labels.", access: "Secrets tab" },
  { stage: "send", name: "Zapmail", url: "https://zapmail.ai", icon: "server", what: "Buys sending domains and inboxes.", access: "Ask Muriel" },
];

const WHERE = [
  { q: "Facts about a client", icon: "user-round", a: "clients/<slug>/CLAUDE.md", note: "And the client's internal Slack channel for what's going on right now." },
  { q: "How a campaign gets set up", icon: "map", a: "Muriel's setup walkthrough", href: LINKS.muriel, note: "Zapmail to Master Inbox, step by step." },
  { q: "The whole process in detail", icon: "route", a: "sops/260814-campaign-sop-v2.md", href: LINKS.sop, note: "The long version of the path on the first tab." },
  { q: "Lead lists and big files", icon: "folder", a: "Scalantec Drive", href: LINKS.drive, note: "Each client's folder IDs are in clients/<slug>/DRIVE.md." },
  { q: "Logins and API keys", icon: "key-round", a: "Secrets tab in this console", note: "They never go into the repo or a doc." },
  { q: "What Claude can do for you", icon: "sparkles", a: ".claude/skills/", note: "team-gtm-engineer is a good place to start." },
];

const GLOSSARY = [
  { t: "ICP", long: "Ideal customer profile", cat: "Basics", e: "🎯", d: "A description of the companies that fit a client best.", like: "Like a wanted poster for the perfect customer." },
  { t: "TAM", long: "Total addressable market", cat: "Basics", e: "🗺️", d: "All the companies that could buy from a client. It tells you how many months of outreach are possible.", like: "Like the size of the pond you're fishing in." },
  { t: "GTM", long: "Go-to-market", cat: "Basics", e: "🚀", d: "Everything a company does to bring its product to buyers: who to target, how to reach them and how to sell." },
  { t: "DACH", cat: "Basics", e: "🏔️", d: "Germany, Austria and Switzerland. Most of our campaigns target this region." },
  { t: "SME / KMU", cat: "Basics", e: "🏢", d: "Small and mid-sized companies. They reply to cold outreach a lot more often than big corporates (about 10% vs 1%)." },
  { t: "CRM", long: "Customer relationship management", cat: "Basics", e: "📇", d: "The tool where a company keeps its customers and deals, e.g. HubSpot or Salesforce.", like: "Like the company's address book with a memory." },
  { t: "Lead", cat: "Sales", e: "🙋", d: "A person we want to contact or already contacted." },
  { t: "Account", cat: "Sales", e: "🏬", d: "The company a lead works at. One account can have several leads." },
  { t: "Persona", cat: "Sales", e: "🧑‍💼", d: "The role we want to talk to at a company, e.g. Head of Marketing. Look at what the person does day to day, since titles can be misleading." },
  { t: "Pipeline", cat: "Sales", e: "🚰", d: "All open deals and how far along they are." },
  { t: "SDR / BDR", cat: "Sales", e: "📞", d: "The people who do the first outreach and book meetings." },
  { t: "AE", long: "Account executive", cat: "Sales", e: "🤝", d: "The salesperson who takes over after the first meeting and closes the deal." },
  { t: "Signal", cat: "Lists & Clay", e: "📡", d: "A sign that a company might be open to buying right now, like hiring, funding or visiting the website.", like: "Like a hand going up in class." },
  { t: "Enrichment", cat: "Lists & Clay", e: "➕", d: "Adding data to a row, like headcount, email or LinkedIn URL. Each lookup costs credits." },
  { t: "Waterfall", cat: "Lists & Clay", e: "🌊", d: "Trying several data sources one after the other and stopping at the first one that finds an answer." },
  { t: "Credits", cat: "Lists & Clay", e: "🪙", d: "What Clay and other tools charge per lookup. Cheap filters first means fewer credits spent." },
  { t: "Tier", cat: "Lists & Clay", e: "🥇", d: "A priority group. Tier 1 is the best fit and gets contacted first." },
  { t: "Batch", cat: "Lists & Clay", e: "📦", d: "A slice of the list that goes out together, e.g. 200 leads per week." },
  { t: "Blacklist / DNC", long: "Do not contact", cat: "Sending", e: "🚫", d: "Companies and people we never contact: the client's customers, partners, competitors and anyone who opted out." },
  { t: "Sequence", cat: "Sending", e: "🔗", d: "The series of messages a lead gets, e.g. a first email and one follow-up." },
  { t: "Angle", cat: "Sending", e: "📐", d: "The hook a campaign uses, e.g. a pain point or a trigger. We often test 2 to 3 angles against each other." },
  { t: "Variable + fallback", cat: "Sending", e: "🧩", d: "A placeholder like {first_name} that gets filled per lead. The fallback is the text used when the field is empty." },
  { t: "Spintax", cat: "Sending", e: "🎲", d: "Writing several versions of a phrase so every email looks a bit different, e.g. {Hi|Hello|Hey}." },
  { t: "Warm-up", cat: "Sending", e: "🔥", d: "A new inbox sends a few mails a day for 2 to 3 weeks, so email providers learn to trust it." },
  { t: "Bounce", cat: "Sending", e: "↩️", d: "An email that couldn't be delivered. Too many bounces hurt the sending domain." },
  { t: "Label", cat: "Sending", e: "🏷️", d: "The tag Master Inbox gives every reply, e.g. Interested or Not interested. Our reply numbers come from these." },
];
