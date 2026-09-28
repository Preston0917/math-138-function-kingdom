const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "game.js"), "utf8");
const storage = new Map();

function boot() {
  const main = {innerHTML: "", focus() {}, addEventListener(name, fn) {this[name] = fn}};
  const elements = {screen: main, totalXp: {textContent: ""}, homeButton: {addEventListener() {}}, studyNav: {addEventListener() {}}};
  const context = vm.createContext({
    document: {getElementById: id => elements[id], addEventListener() {}, activeElement: null},
    localStorage: {getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value)},
    Math, Number, String, Array, JSON
  });
  vm.runInContext(source, context);
  return {context, main, run: code => vm.runInContext(code, context), click: (action, extra = {}) => main.click({target: {closest: () => ({dataset: {action, ...extra}})}})};
}

let app = boot();
const questions = app.run("QUESTIONS");
const cards = app.run("FLASHCARDS");
assert.equal(new Set(questions.map(q => q.id)).size, questions.length, "question IDs must be unique");
for (const q of questions) {
  assert.equal(q.options.length, 4, `${q.id} must have four choices`);
  assert(q.answer >= 0 && q.answer < 4, `${q.id} needs a valid answer`);
  assert(q.hint && q.explanation && q.takeaway, `${q.id} needs teaching feedback`);
}
for (const card of cards) assert(questions.some(q => q.id === card.question), `missing question for ${card.front}`);

app.run('launch("parents")');
const first = app.run("state.round[0]");
app.run(`answer(${first.answer})`);
assert.equal(app.run("state.correct"), 1);
assert.equal(app.run("progress.xp"), 10);
assert(app.run("progress.session.answered"));

app = boot();
assert(app.main.innerHTML.includes("Resume round"), "unfinished round should appear on home screen");
app.run("resumeRound()");
assert.equal(app.run("state.round[0].id"), first.id);
assert.equal(app.run("state.correct"), 1);
assert(app.main.innerHTML.includes("Correct."), "answered feedback should survive reload");
app.run("next()");
assert.equal(app.run("state.index"), 1);

app.run('study("Class Notes")');
app.click("studyNext");
app.click("learned");
app.click("mark");
assert.equal(app.run("progress.study.index"), 1);
assert.equal(app.run("progress.learned.length"), 1);
assert.equal(app.run("progress.missed.length"), 1);

app = boot();
app.run("study()");
assert.equal(app.run("state.studyGroup"), "Class Notes");
assert.equal(app.run("state.studyIndex"), 1);
assert.equal(app.run("progress.learned.length"), 1);
assert.equal(app.run("progress.missed.length"), 1);
assert.equal(app.run("progress.session.index"), 1);

const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));
for (const file of ["index.html", "style.css", "game.js", "sw.js", ...manifest.icons.map(icon => icon.src)]) {
  assert(fs.existsSync(path.join(root, file)), `missing offline asset ${file}`);
}
assert.equal(manifest.display, "standalone");
console.log(`Persistence and assets OK: ${questions.length} questions, ${cards.length} cards.`);
