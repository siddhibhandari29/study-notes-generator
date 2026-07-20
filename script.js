// ---------- Sample text (for the "Try a sample text" button) ----------
const SAMPLE_TEXT = `Cellular respiration is the process by which cells break down glucose to release energy in the form of ATP. It occurs in three main stages: glycolysis, the Krebs cycle, and the electron transport chain. Glycolysis takes place in the cytoplasm and splits one molecule of glucose into two molecules of pyruvate, producing a small net gain of ATP. The Krebs cycle happens inside the mitochondrial matrix, where pyruvate is further broken down and releases carbon dioxide as a byproduct while generating electron carriers like NADH and FADH2. The electron transport chain, located on the inner mitochondrial membrane, uses those electron carriers to pump protons across the membrane, creating a gradient that drives ATP synthase to produce the majority of the cell's ATP. Oxygen acts as the final electron acceptor in this chain, which is why the overall process is described as aerobic respiration. Without oxygen, cells can only perform glycolysis and a much less efficient process called fermentation, yielding far less energy. Mitochondria are often called the powerhouse of the cell because this entire multi-stage process is what supplies most of the energy that living organisms need to function.`;

// A small list of common words to ignore when scoring sentence importance
const STOPWORDS = new Set(("the a an is are was were be been being of to in on for and or but "
  + "with as by at from this that these those it its into which who whom whose "
  + "not can will would should could may might do does did has have had "
  + "than then so such very more most other some any each every own same "
  + "also often only just when where while because if about across").split(" "));

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map(s => s.trim())
    .filter(s => s.length > 20);
}

function wordFrequencies(sentences) {
  const freq = {};
  sentences.forEach(sentence => {
    sentence.toLowerCase().match(/[a-z0-9']+/g)?.forEach(word => {
      if (!STOPWORDS.has(word) && word.length > 2) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });
  });
  return freq;
}

function scoreSentences(sentences, freq) {
  return sentences.map((sentence, index) => {
    const words = sentence.toLowerCase().match(/[a-z0-9']+/g) || [];
    let score = 0;
    words.forEach(w => { if (freq[w]) score += freq[w]; });
    // Normalize by length so long sentences don't win purely on word count
    const normalized = words.length ? score / Math.sqrt(words.length) : 0;
    return { sentence, index, score: normalized };
  });
}

function topSentences(scored, count) {
  return [...scored]
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.index - b.index) // put back in original reading order
    .map(s => s.sentence);
}

function keyTermFor(sentence, freq) {
  const words = sentence.toLowerCase().match(/[a-z0-9']+/g) || [];
  let best = null, bestScore = -1;
  words.forEach(w => {
    if (!STOPWORDS.has(w) && freq[w] > bestScore) {
      bestScore = freq[w];
      best = w;
    }
  });
  return best ? best.charAt(0).toUpperCase() + best.slice(1) : "Key idea";
}

function generateStudyGuide(text, format) {
  const sentences = splitSentences(text);
  if (sentences.length < 2) return null;

  const freq = wordFrequencies(sentences);
  const scored = scoreSentences(sentences, freq);

  const notesCount = Math.max(3, Math.min(6, Math.round(sentences.length * 0.35)));
  const notes = topSentences(scored, notesCount);

  const flashCount = Math.max(3, Math.min(6, Math.round(sentences.length * 0.3)));
  const flashSource = topSentences(scored, flashCount);
  const flashcards = flashSource.map(s => ({ front: keyTermFor(s, freq), back: s }));

  return { notes, flashcards, format };
}

// ---------- UI wiring ----------
const sourceText = document.getElementById("sourceText");
const generateBtn = document.getElementById("generateBtn");
const sampleBtn = document.getElementById("sampleBtn");
const errorMsg = document.getElementById("errorMsg");
const notesPanel = document.getElementById("notesPanel");
const notesOutput = document.getElementById("notesOutput");
const flashPanel = document.getElementById("flashPanel");
const flashcardsEl = document.getElementById("flashcards");
const toggleButtons = document.querySelectorAll(".btn-toggle");

let currentFormat = "bullets";

toggleButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    toggleButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFormat = btn.dataset.format;
  });
});

sampleBtn.addEventListener("click", () => {
  sourceText.value = SAMPLE_TEXT;
});

generateBtn.addEventListener("click", () => {
  errorMsg.hidden = true;
  const text = sourceText.value.trim();

  if (text.split(/\s+/).length < 40) {
    errorMsg.textContent = "Paste a bit more text — at least a few sentences works best.";
    errorMsg.hidden = false;
    notesPanel.hidden = true;
    flashPanel.hidden = true;
    return;
  }

  const guide = generateStudyGuide(text, currentFormat);
  if (!guide) {
    errorMsg.textContent = "Couldn't find enough distinct sentences to summarize. Try a longer passage.";
    errorMsg.hidden = false;
    return;
  }

  renderNotes(guide.notes, guide.format);
  renderFlashcards(guide.flashcards);
  notesPanel.hidden = false;
  flashPanel.hidden = false;
});

function renderNotes(notes, format) {
  notesOutput.innerHTML = "";
  if (format === "bullets") {
    const ul = document.createElement("ul");
    notes.forEach(n => {
      const li = document.createElement("li");
      li.textContent = n;
      ul.appendChild(li);
    });
    notesOutput.appendChild(ul);
  } else {
    const p = document.createElement("p");
    p.textContent = notes.join(" ");
    notesOutput.appendChild(p);
  }
}

function renderFlashcards(cards) {
  flashcardsEl.innerHTML = "";
  cards.forEach(card => {
    const el = document.createElement("div");
    el.className = "flashcard";
    el.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-face flashcard-front">${card.front}</div>
        <div class="flashcard-face flashcard-back">${card.back}</div>
      </div>`;
    el.addEventListener("click", () => el.classList.toggle("flipped"));
    flashcardsEl.appendChild(el);
  });
}
