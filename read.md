# The Vowel Lab

Listening, speaking and pronunciation practice for the North American English
vowel system, built on Chapter 4, *The Vowel System*.

Four files, all at the repo root — the same convention as the Consonant Lab:

```
index.html    page shell
style.css     warm analog-lab styling
script.js     data, figure, activities, exam, recorder
Code.gs       Google Apps Script backend (paste into your Sheet)
```

Drop them in a GitHub repo, turn on Pages, and it runs. No build step, no
dependencies, works offline once the fonts are cached.

---

## What's inside

**Sound Lab** — a study card for each of the 15 vowels: where the tongue sits,
what the jaw and lips do, tense or lax, and the common spellings.

**Ten contrast units**, ordered by the relative functional load table
(Table 4.15, p. 160):

| | Contrast | RFL |
|---|---|---|
| 1 | /iy/ – /ɪ/ beat / bit | 95% |
| 2 | /ey/ – /ɛ/ bait / bet | 42.5% |
| 3 | /ɛ/ – /æ/ bet / bat | 42% |
| 4 | /æ/ – /ɑ/ cat / cot | 66% |
| 5 | /ʌ/ – /ɑ/ cut / cot | 61% |
| 6 | /ɑ/ – /ɔ/ cot / caught | dialectal |
| 7 | /ɔ/ – /ow/ bought / boat | 88% |
| 8 | /ʊ/ – /uw/ look / Luke | few pairs |
| 9 | the diphthongs /ay aw ɔy/ | — |
| 10 | /r/-colouring and reduced vowels | — |

**Five activities per unit**, ten questions each, 80% to clear one — Minimal
Pairs, Same or Different, Odd One Out, In Context, Spelling to Sound. Questions
reshuffle on every attempt, so a retry is never the same test.

**Speaking Studio** — plays a model, records the student, puts the two side by
side.

**Final exam** — 40 items drawn from all ten units, unlocked after five units
are cleared.

---

## The figure

The diagram is a recreation of the book's **Figure 4.1** — the NAE vowel
quadrant superimposed on a sagittal section of the mouth — and not the
mid-sagittal drawing from the Consonant Lab, which shows the wrong thing for
vowels.

Three of the book's figures are folded into one live drawing:

- **Figure 4.1** gives the layout: the quadrant sitting inside the oral cavity,
  front / central / back across, high / mid / low down.
- **Figure 4.2** gives the tongue contours. The solid vermilion line is the
  selected vowel; the dashed lines behind it are all the others, so the whole
  system stays visible at once.
- **Figure 4.5** gives the glide arrows for /ay aw ɔy/ and for the
  vowel-plus-glide sounds.
- **Figure 4.3** gives the lip inset — the five plates, from extreme spread (1)
  to tightly rounded (5).

Everything is drawn as SVG maths from each vowel's front/back, high/low, jaw
and lip values, so it is sharp at any size and every vowel gets a genuinely
different tongue shape rather than a stock picture.

---

## Wiring up the spreadsheet

The web app is already deployed and wired into `CONFIG.endpoint` at the top of
`script.js`, so the Send buttons are live. What's left is to make sure that
deployment is running the `Code.gs` in this repo:

1. Open your Google Sheet → **Extensions → Apps Script**.
2. Paste in `Code.gs`, replacing what's there.
3. **Deploy → Manage deployments →** edit the existing one → **New version →
   Deploy**. Execute as *Me*, access *Anyone*.
4. Run `test()` from the editor to confirm the sheets appear.

Redeploying a *new version* of the existing deployment keeps the same `/exec`
URL. Creating a brand-new deployment gives you a different URL, which would
then need pasting into `CONFIG.endpoint`.

Scores land in a **Vowel Scores** tab. Recordings are saved to a Drive folder
and linked from a **Vowel Recordings** tab.

You can point this at the same Sheet as the Consonant Lab — the tab names are
different, so the two won't collide — but you'll need to merge the two
`Code.gs` files or give the vowel app its own deployment.

Leave `CONFIG.endpoint` empty and the Send buttons simply don't appear; the app
works fine without a backend.

---

## Notes

- Audio uses the browser's speech synthesis. Clicking a bare vowel symbol never
  speaks — audio is on words and sentences only.
- Students should pick the clearest English voice under **Settings**; the rate
  defaults to 0.90.
- Nothing is stored between sessions. Progress and recordings live in the page
  and are gone on reload, which is why the Send buttons exist.
