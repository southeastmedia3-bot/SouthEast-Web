# Off-site SEO — the work that has to be done by hand

Everything in the codebase is done (see [SEO_GEO_AEO.md](SEO_GEO_AEO.md)). This
file is the other half: the work that happens outside the repository, in order,
with the copy already written so nothing has to be invented twice.

**Read §0 before doing anything else.** The single most common way this goes
wrong is starting at step 4 and having to redo steps 1–3.

---

## 0. Do this first, once — the NAP block

NAP = **N**ame, **A**ddress, **P**hone. Every ranking system for local search
works by matching these three strings across the internet and counting how
consistently they agree. "Suite 4" in one place and "Ste. 4" in another are read
as two different businesses, and the confidence in both drops.

**This is now settled and live on the site.** Copy-paste it everywhere below.
Never retype it, and never reformat it — not the word order, not the
punctuation, not the spacing in the phone number.

```
Name:     Southeast Media
Address:  B Block, Asian Sun City, 309, Kondapur, Forest Dept Colony
          Hyderabad, Telangana 500084
          India
Phone:    +91 72079 30735
Email:    info@southeastmedia.in
Website:  https://www.southeastmedia.in
Hours:    Monday–Friday, 10:00–19:00
Founded:  2025
```

Every one of those strings is published by the site as of 2026-08-11 — in the
footer of every page, on `/contact`, and as `LocalBusiness` JSON-LD. So the site
is now the reference copy: if any of it is wrong, tell me and I will change it
there **first**, before it goes on a listing.

Three rules for that block:

1. **The Name is "Southeast Media".** Not "Southeast Media - Best 3D Animation
   Company in Hyderabad". Putting keywords in a Google Business Profile name
   violates their guidelines and is one of the few things that gets a listing
   suspended outright. It is also the most common bad advice you will be given.
2. **The address format is frozen**, exactly as written above. The door number
   sitting third ("Asian Sun City, 309") looks like a typo and is not — it is
   how the studio wrote it, so it is what goes everywhere.
3. **One phone number.** Changing it later means updating every listing made
   below, so if a landline is coming, use that from the start instead.

**One field still outstanding:** the map pin coordinates. Those should be read
off the Google Business Profile once §1 is verified — I will add them then. The
schema is complete and valid without them.

---

## 1. Google Business Profile — biggest single lever

Nothing else on this list comes close. For "medical animation company in
Hyderabad" style searches, the map pack sits above the blue links, and only
businesses with a verified profile appear in it.

Go to <https://business.google.com>.

### 1.1 Create and verify

- Sign in with the account that should own this long-term. **Use the same Google
  account you use for Search Console** (§2) — it makes verification easier and
  links the two.
- Search for "Southeast Media" first. If a listing already exists (Google
  sometimes auto-creates them from other data), **claim it** rather than making a
  second one. Duplicate listings compete with each other and both get suppressed.
  (The studio has confirmed it has not created one, so expect to be starting fresh
  — but check anyway, because auto-created listings are common.)
- Enter the NAP block from §0 exactly, hours included: **Monday–Friday,
  10:00–19:00**, with Saturday and Sunday left closed. Those are the same hours
  the site's footer and `LocalBusiness` schema now publish, and Google compares
  the two.
- Set the opening date to **2025**. It matches the `foundingDate` in the site's
  structured data.
- **Once verified, send me the map pin's coordinates** (open the listing on Google
  Maps, right-click the pin, copy the lat/long). It is the last field missing from
  the schema.

**Expect video verification.** For service businesses in India, Google now
usually asks for a short unedited video walkthrough rather than a postcard. Be
ready to film, in one take, without cutting:

1. The street and any signage or building number outside
2. Walking in through the entrance
3. The working space — desks, machines, the render farm if it is on site
4. Something proving you control the place: keys, a utility bill with the
   address, letterhead, the equipment

The render farm is a genuine asset here. Most agencies verifying in Hyderabad are
a room with laptops; fifteen servers on a rack is unusually strong evidence.

If it fails, you can reapply. Do not create a second listing to get around it.

### 1.2 Categories

Primary category is the heaviest ranking signal on the whole profile. Pick one
primary and add the rest as secondary (Google allows up to nine additional).

- **Primary:** `Video production service`
- Secondary, in this order — add whichever exist in the picker:
  `Animation studio` · `Advertising agency` · `Marketing agency` ·
  `Media company` · `Graphic designer` · `Commercial photographer`

Why `Video production service` as primary and not `Advertising agency`: it is the
category most of the keyword list actually maps to, and it is less crowded in
Hyderabad than the generic agency categories.

### 1.3 Services

Add each of these as a named service. This is a free, direct keyword surface and
most competitors leave it empty. Use these names exactly — they match the
`Service` schema now on the website, which is how Google connects the two:

| Service name                              | Description to paste                                                                                                                                                                                              |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Medical & Pharmaceutical 3D Animation     | Mechanism of Action (MoA) films, anatomical and molecular visualization, patient education animation and pharmaceutical video production, rendered at 4K–8K with MD-reviewed anatomy under NDA.                   |
| Architectural & Real-Estate Visualization | Photorealistic 3D exterior and interior rendering, property walkthrough animation, 3D virtual tours and pre-construction CGI for institutional, commercial and premium residential developments.                  |
| Corporate & Commercial Film Production    | Corporate video, TV and commercial film, product films and facility shoots inside hospitals and manufacturing plants, captured in uncompressed 8K and finished with in-house Digital Intermediate colour grading. |
| VFX & CGI Production                      | Simulation, compositing, look development and photorealistic rendering on a 15-server GPU render farm, finished through Octane at 8K.                                                                             |
| 3D Animation & Motion Graphics            | 2D and 3D motion graphics, explainer videos, character animation, kinetic typography, 3D product animation, and AR, VR and projection-mapped experiential media.                                                  |
| Product & SaaS Video Production           | Launch films, product explainers, 3D product animation and rendering, animated B-roll and paid social cutdowns, produced end to end in one studio.                                                                |
| Enterprise Media Retainer                 | An outsourced media division for brands, agencies and product teams, with assigned artists, reserved render capacity, NDA cover and milestone-based statements of work.                                           |

Each service should link to its page on the site
(`https://www.southeastmedia.in/pharma`, `/real-estate`, `/films`, `/vfx`,
`/animation`, `/saas`, `/enterprise`).

### 1.4 Business description (750 char limit)

Paste this. Every claim in it is already on the website, and it is 742
characters — the field cuts off hard at 750, so if you edit it, count again.

Note the phrasing "twenty years of **combined** CGI experience". That word is
load-bearing now that the profile carries a 2025 opening date: the twenty years
are the team's, not the company's, and saying it the other way puts a claim on the
profile that the website's own structured data contradicts.

> Southeast Media is a creative, CGI and video production studio in Hyderabad,
> working across medical and pharmaceutical animation, architectural
> visualization, live-action film, VFX, motion graphics and product video. Over
> twenty years of combined CGI experience, on our own infrastructure: a 15-server
> GPU render farm with 672GB of VRAM and 100TB of RAID storage, an 8K delivery
> pipeline, and
> in-house Digital Intermediate colour grading — so a project is shot, built,
> composited and graded in one building rather than passed between vendors. We
> produce Mechanism of Action films for pharma, pre-construction walkthroughs for
> developers, and brand and product films for enterprises. Every engagement runs
> under NDA, scoped against milestones.

### 1.5 Photos and video

Profiles with regular photo activity rank better and convert far better. Upload:

- **Logo** — `public/brand/logo-mark.png` from the repo
- **Cover** — a strong 16:9 render; the architectural exterior or the MoA frame
- **Interior** — the studio, the suites, the render farm rack
- **Exterior** — the building and signage (also helps verification)
- **Team** — real people at work
- **Work samples** — 15–20 of the best stills. They are all in `public/media/`.
- **Video** — upload the showreel

Then **add 2–3 new photos a month, forever.** It is a live activity signal.

### 1.6 Posts and Q&A

- **Posts:** one a week or fortnight. A new render, a finished film, a note on a
  capability. Takes five minutes and keeps the profile active.
- **Q&A:** you are allowed to ask and answer your own questions, and you should.
  Seed it with the same questions now on the website's FAQ sections — "What is a
  Mechanism of Action animation?", "How long does a set of renders take?", "What
  determines the cost of a corporate film?" — and paste the answers from the site
  so they match. This is the section that most often gets quoted in local results.

### 1.7 Reviews

The hardest and most valuable part. A profile with 25 detailed reviews beats one
with 4, more or less regardless of anything else.

- Ask every completed client, by name, with a direct link to the review form.
- Ask them to **mention the service and the city** in the text — "the medical
  animation team in Hyderabad" is worth many times more than "great work".
- **Reply to every review**, positive or negative. Replies are a ranking signal.
- **Never buy reviews or run an incentive.** Google detects clustered fake
  reviews and the penalty lands on the listing, not the reviewer.

---

## 2. Google Search Console

<https://search.google.com/search-console>. This is how you find out whether any
of this is working; without it you are guessing.

### 2.1 Verify

Choose **Domain property** (not URL prefix). It covers `southeastmedia.in`,
`www.`, and every subdomain in one, which matters because of §4.

It verifies by DNS TXT record:

1. GSC gives you a string like `google-site-verification=xxxxxxxx`
2. Go to GoDaddy → your domain → DNS → Add record
3. Type `TXT`, Name `@`, Value = the string Google gave you
4. Save, wait ~15 minutes, click Verify

**Alternative:** if DNS is awkward, GSC also accepts an HTML meta tag. Send me the
tag content and I will add it to the site's metadata in one line — but the domain
property is better, so try DNS first.

### 2.2 Then

- **Submit the sitemap:** Sitemaps → enter `sitemap.xml` → Submit.
  (It is live at <https://www.southeastmedia.in/sitemap.xml>.)
- **Request indexing** for the homepage and the seven service pages, via URL
  Inspection → Request Indexing. Speeds up the first crawl considerably.
- **Check Coverage** after a week: every page should be "Indexed". If any say
  "Discovered – currently not indexed", tell me.
- **Rich results:** Enhancements should start showing FAQ, Breadcrumb and Video
  items within a couple of weeks. That confirms the schema is being read.

### 2.3 What to watch, and when

Do not check daily — you will read noise as signal.

| When      | What you should see                                 |
| --------- | --------------------------------------------------- |
| Week 1–2  | Pages indexed; rich results detected                |
| Week 3–6  | Impressions appearing for brand and long-tail terms |
| Month 2–3 | First real movement on service + city terms         |
| Month 4–6 | Position for the priority keywords                  |

The Performance → Queries tab is the important one. It tells you what people
actually typed, which is nearly always different from what anyone guessed.

---

## 3. Bing Webmaster Tools

<https://www.bing.com/webmasters>. Ten minutes, and worth it for a reason most
people miss: **Bing's index is what backs ChatGPT's web search.** If the studio
is not in Bing, it cannot be cited by ChatGPT when someone asks for a medical
animation company in Hyderabad.

- Sign in and choose **Import from Google Search Console** — it copies the
  verification and the sitemap across automatically.
- Submit `sitemap.xml` if the import does not.
- Use "Submit URLs" for the eight main pages.

---

## 4. Fix the apex domain

Right now `southeastmedia.in` (without `www`) still points at GoDaddy's parking
servers and shows a holding page. `www.southeastmedia.in` serves the real site.

This costs you in two ways: anyone typing the bare domain sees a parking page,
and any link built to the bare domain sends its value nowhere.

**What needs to happen:** point the apex at Firebase App Hosting and have it
redirect to `www`.

1. Firebase Console → App Hosting → your backend → **Add custom domain** →
   `southeastmedia.in`
2. Firebase gives you A records (and possibly a TXT for verification)
3. GoDaddy → DNS → replace the existing parking A records for `@` with Firebase's
4. Wait for the certificate to issue (can take a few hours)
5. In Firebase, set `southeastmedia.in` to **redirect** to
   `https://www.southeastmedia.in`

Use the `southeastmedia4@gmail.com` account for Firebase — the other account gets
a permission error that does not explain itself.

Do not skip step 5. If both hosts serve the site independently you get two copies
of everything in the index; the canonical tags handle it, but a redirect is
cleaner and consolidates all the link value onto one host.

---

## 5. Social profiles

Two jobs here. They are places buyers look, and they are `sameAs` targets —
schema.org's way of saying "these accounts are the same entity as this website",
which is one of the strongest signals for a search engine trying to work out
whether Southeast Media is a real, single, identifiable business.

**Two are live and now published by the site** — they appear in the footer of
every page and in `Organization.sameAs`, as of 2026-08-11:

- **LinkedIn:** <https://www.linkedin.com/company/south-east-media>
- **YouTube:** <https://www.youtube.com/@SouthEastMedia03>

Still to create or claim, in this order:

1. **Instagram** — where visual studios get found. Post work, not office photos.
   The studio said this one is coming; send me the handle and it goes into the
   footer and the schema with the other two.
2. **Behance** — genuinely good for CGI discovery, and it ranks.
3. **Vimeo** — the industry-standard portfolio host for film work.

Rules: identical NAP in every bio (§0), identical logo, and the website URL on
every one. On the two that exist, go and check that now — a LinkedIn page with no
address, or with a different one, is a citation that disagrees with the site.

On YouTube specifically: title the films for search — "3D Medical Animation —
Mechanism of Action | Southeast Media", not "Reel_final_v3" — write real
descriptions, and link each back to the matching page on the site.

**Why the two live URLs matter more than they look.** `sameAs` is schema.org's way
of saying "these accounts are the same entity as this website". It is one of the
strongest signals a search engine has for deciding that a business is a single,
real, identifiable thing rather than a name on a page — and it is read heavily by
the AI answer engines. The site published no social links at all until now,
because the ones it had pointed at `instagram.com` and `linkedin.com` themselves;
putting those in `sameAs` would have told Google that Southeast Media _is_
LinkedIn.

---

## 6. Directory listings and citations

Each of these is a NAP citation. Consistency matters more than volume — twenty
identical listings beat sixty that disagree.

**Do these first (highest value for an Indian B2B studio):**

- Google Business Profile _(§1 — the one that matters)_
- LinkedIn company page
- **Clutch.co** — B2B agency directory, ranks well, and buyers genuinely use it.
  Worth completing properly with case studies.
- **DesignRush** — same idea, easier to get listed
- **GoodFirms**
- **Sortlist**
- Justdial, Sulekha, IndiaMART — high domestic search volume
- Bing Places (separate from Bing Webmaster Tools)
- Apple Business Connect — feeds Apple Maps and Siri

**Then, if there is time:** Yellow Pages India, TradeIndia, AmbitionBox, Glassdoor
(a company page is a citation too), Crunchbase.

For every one: **paste the NAP block from §0.** Do not retype it.

Description to paste where a short one is wanted (about 300 characters):

> Southeast Media is a creative, CGI and video production studio in Hyderabad —
> medical and pharmaceutical animation, architectural visualization, corporate
> and commercial film, VFX, and motion graphics. Over twenty years of combined
> CGI experience, an in-house 15-server render farm, and 8K delivery end to end.

---

## 7. Backlinks

Links from other real websites are still the strongest off-site ranking factor
after the business profile. They are also where most of the bad advice lives.

**Do:**

- **Client attribution.** Every finished project — ask whether they will credit
  the studio with a link. Pharma and real-estate clients often have a vendors or
  partners page.
- **Case studies on the client's site**, linking back.
- **Software and vendor pages.** Maxon (Cinema 4D), OTOY (Octane), Insydium
  (X-Particles), Chaos, Unreal — several run showcase or featured-artist
  programmes. A studio with this pipeline is a legitimate candidate.
- **Industry press and awards.** Indian advertising and animation trade press,
  and any relevant awards. An award page is a strong link.
- **Guest writing.** A genuinely technical piece — how an MoA animation gets
  scientifically reviewed, why uncompressed 8K matters for compositing — placed
  on an industry site. Substance is what gets these accepted.
- **Local business associations** and any chamber of commerce membership.
- **Behance and Vimeo project pages** linking back to the site.

**Do not:**

- Buy links, or use any service selling "500 backlinks". These are detectable and
  the penalty is severe and slow to lift.
- Use private blog networks.
- Do reciprocal link exchanges at scale.
- Spam blog comments or forum signatures.

Ten real links from real companies beat a thousand bought ones, and there is no
version of this where the shortcut works.

---

## 8. Ongoing, once the above is done

The setup is finite; this part is not.

| Cadence   | Task                                                          |
| --------- | ------------------------------------------------------------- |
| Weekly    | One Google Business Profile post                              |
| Weekly    | Post work to Instagram / LinkedIn                             |
| Monthly   | 2–3 new photos on the profile                                 |
| Monthly   | Ask every completed client for a review                       |
| Monthly   | Check Search Console → Performance → Queries                  |
| Quarterly | New case study or portfolio piece on the site                 |
| Quarterly | Re-check that every directory listing still has the right NAP |

---

## 9. Using ChatGPT for this — what it tends to get wrong

You said you would use ChatGPT to work through this. That is fine for drafting
listing copy and review requests. Be careful on these six, where the common
advice is out of date or actively harmful:

1. **"Put keywords in your Google Business Profile name."** No. Guidelines
   violation, and among the few things that gets a listing suspended.
2. **"Add meta keywords to the site."** Google has ignored that tag since 2009.
   Harmless but pointless; do not let anyone charge you for it.
3. **"FAQ schema gets you rich results on Google."** Not since 2023 — Google now
   shows those only for recognised government and health sites. The site has FAQ
   schema anyway, for a different and still-valid reason: Bing reads it, and it is
   the cleanest format for AI answer engines to lift.
4. **"Make a landing page for every keyword."** That is the textbook definition
   of a doorway page and Google demotes them. The seven service pages already
   cover the whole keyword list; depth beats count.
5. **"Submit to 500 directories."** Volume without consistency actively hurts.
   The list in §6 is the list.
6. **"Blog three times a week for SEO."** Thin AI-written blog posts are a
   liability now, not an asset. One real case study a quarter is worth more than
   fifty generated articles — and for a visual studio, the work itself is the
   content.

A good way to use it: give it §0's NAP block and ask it to write a listing bio to
a specific character limit. A bad way: ask it for "SEO tricks".

---

## 10. Straight answer on expectations

Local commercial terms in a metro like Hyderabad do not move in a fortnight, and
anyone promising position one in a month is selling something.

Realistically, with the website work already done and this list executed:

- **Weeks 1–3:** indexed, rich results detected, brand searches working
- **Months 1–2:** map-pack visibility once the profile has photos and a few
  reviews; long-tail and question-shaped searches start converting
- **Months 3–6:** movement on the priority service + city terms
- **Months 6–12:** competitive position on those terms, if reviews and links keep
  accumulating

The two things that most determine where this lands are **reviews** and
**backlinks**, and both are earned rather than built. The site is now doing
everything a site can do; the rest is proof that other people vouch for the
studio.
