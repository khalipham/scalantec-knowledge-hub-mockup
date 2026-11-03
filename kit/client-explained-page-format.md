# "Client, explained simply": how to build the page

A one-page HTML explainer that gets anyone on the team up to speed on a new client: what they sell, who buys it, what their data says, who we should target, and what to suggest to the client. Bojana has a finished example page, ask her for it and open it next to this guide.

## What goes in

Gather these before writing anything. Every number on the page should come from one of them, with its date.

- **The client's own ICP doc** (or whatever they told us about their target customers)
- **CRM export** of customers and deals (e.g. a HubSpot export, with its date)
- **Call transcripts** since the start of the engagement (Fireflies / tl;dv)
- **The client's website**

## Page structure

Pill links at the top jump to each section. Keep this order:

1. **The words you'll keep hearing.** About 6 cards, one per jargon term. Each has an emoji, a plain one-or-two-sentence definition, and an everyday comparison in italics ("Like the brain of the company: everything runs through it").
2. **What the client does, in one picture.** A before/after flow: the steps a customer goes through without the product, then with it.
3. **Who buys from them today.** One card per current customer group.
4. **What the data says (my own analysis).** Short findings, each with a simple bar chart (label, bar, value). Put caveats in an amber note box. Add a "4b" deep-dive if one product or channel is the main way new customers come in.
5. **Who we should target.**
   - Main ICP in a highlighted card (blue border)
   - Secondary groups, and groups worth a test (amber border)
   - Who to exclude (partners, existing customers)
   - **5b How we'll build the list:** the filters, e.g. right system / right size / right place
   - **5c The client's ICP vs ours,** side by side, saying where we agree and where the data points elsewhere
6. **Good moments to reach out.** Signals and triggers that mean a company is open to change right now.
7. **What to suggest to the client.** Numbered recommendations, then a separate card of questions to ask them.

**Footer:** who prepared it, the date, and where the figures come from, plus any "treat as approximate" warning.

## Writing rules

- Plain English, short sentences. Write for someone who has never heard of the client or their industry.
- Any jargon used on the page needs a card in section 1.
- Under the lead line, name every source and its date.
- Label our own analysis as ours, so it's never mistaken for what the client said.
- No em dashes.

## Design rules

- One self-contained HTML file with no external libraries. Charts are plain CSS bars.
- Colours are defined as variables on `:root`, with a dark-mode set so it reads in both themes.
- White cards with rounded corners on an off-white background. Coloured tags: blue = info, green = good, amber = test/caution, red = problem.
- Content is max 980px wide and works on a phone (layout changes at 560px).

The quickest start is to copy Bojana's example page, keep the `<style>` block, and replace the content section by section.

## Prompt to give Claude

> Build a "<Client>, explained simply" page in the same format as Bojana's example page: same 7 sections, same CSS. Use <ICP doc>, <CRM export + date>, <call transcripts> and <website>. Plain English, a jargon card for every term, a date on every source. Save it as `outputs/<slug>/<slug>-explained.html`.
