# Function Kingdom · Math 138

A self-contained calculus warmup game inspired by the earlier **Math 107 Quest / Function Kingdom**. It keeps that project's dark mission-board feel, short rounds, hints, XP, and Memory Dojo while using new Math 138 content. No API key, account, or package install is needed. The hosted version needs internet for its first load; after that, its service worker caches the game for offline use.

## Play

The simplest option is to open `index.html` in a modern browser. For the most consistent browser storage behavior, run a local server from this folder:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. The local server only serves files on your computer. Stop it with `Ctrl+C`.

## Put it on your phone

1. While online, open <https://preston0917.github.io/math-138-function-kingdom/> on your phone and let the page finish loading.
2. On iPhone, use Safari's Share menu → **Add to Home Screen**. On Android, use Chrome's menu → **Install app** or **Add to Home screen**.
3. Open the new icon once while online so the installed app can cache its own files. After that, the game opens without a connection.
4. Keep using that same icon. XP, best round scores, learned study cards, the current card, unfinished rounds, and the missed-question queue are saved in that app's `localStorage`. If you close it mid-round, return to the mission board and tap **Resume round**.

On iPhone, the Home Screen app's storage can be separate from Safari's storage, so install it before building up progress in Safari. Progress stays on that device and app; it does not sync to another phone or browser. Clearing website data, deleting the Home Screen app, or device storage eviction can remove it. [WebKit explains the storage separation](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/) and [storage eviction behavior](https://webkit.org/blog/14403/updates-to-storage-policy/).

The installable offline mode requires HTTPS (as on GitHub Pages) or localhost. Opening `index.html` directly still runs the game, but a `file://` page cannot register the offline service worker.

## What is inside

- **Parent Grove:** recognize square root, quadratic, absolute value, reciprocal, exponential, and cubic parents; practice domains and ranges with graph prompts.
- **Shift Forge:** horizontal and vertical shifts, reflections, stretches, compression, vertices, and shifted-root domains.
- **Factor Foundry:** a four-step teaching path followed by practice on GCF, difference of squares, `x² + bx + c`, `ax² + bx + c` with `a ≠ 1`, grouping, FOIL checks, and factoring before a limit.
- **Rate Ridge:** secant and tangent slope, the tangent-line workflow, derivatives, position/velocity signs, and rate units.
- **Quiz 2 Recovery:** four short checkpoints or a full run based on the supplied Quiz 2 photos. Practice one-sided and two-sided graph limits, filled values, limit laws, method selection, and sketch anchors for `x²`, `eˣ`, `1/x`, and `ln x`.
- **Notes Lab:** four short checkpoints or a full run connecting the class notes to practice. Work through piecewise limits versus point values, direct substitution, difference-of-squares cancellation, conjugates, `|x|/x`, the squeeze theorem, vertical asymptotes, limits at infinity, and first-principles tangent lines.
- **Exam Sprint:** 12 questions, three each from the four core realms: parents, shifts, factoring, and rates. **Memory Dojo:** flip cards grouped by topic, including Quiz 2 and Class Notes, with a way to queue related questions for review.

Each answer produces an explanation and a takeaway. Wrong answers enter a persistent review queue; a correct retry removes the question from it. Progress saves after each answer, hint, card move, and study-card mark. Keys `A`–`D` or `1`–`4` choose answers, `H` shows a hint, `Enter` advances after feedback, and `Space` flips a study card.

## Source and scope

The parent-function families and transformation framework come from the supplied **Parent Functons.pdf**, Harold Toomey's *Parent Functions “Cheat Sheet”* (2016), especially pages 1–3 and 9. The Quiz 2 Recovery questions and reconstructed vector graphs are based on four supplied Math 138 Quiz 2 photos. Notes Lab follows supplied handwritten class-note topics. The source photos are not bundled with the app. The game intentionally focuses on current high-value algebra and calculus prerequisites rather than every conic, trig, inverse trig, and hyperbolic row. Its additional tangent, velocity, and factoring practice is original Math 138-focused content.

One correction to page 9: for `y = f(b(x − h))`, a larger `|b|` **compresses** the graph horizontally by `1/|b|`; it does not stretch it wider. The game uses this mathematically correct rule.

The older Math 107 Quest project informed the mission-board style and practice loop. No old code or assets were copied into this game.

## Add material later

Add a question object to `QUESTIONS` in `game.js` with a unique `id`, a `realm`, four `options`, the zero-based `answer`, a `hint`, an `explanation`, and a `takeaway`. Add a linked study card to `FLASHCARDS` with a `group`, `front`, `back`, and `question` id. The arrays drive the realm rounds, sprint selection, study filters, and missed-question review.

## Check

```sh
node --check game.js
node --check sw.js
node tests/persistence.test.js
```

There is no build step or external dependency.
