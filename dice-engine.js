/* D.I.C.E. draw engine — JavaScript port of ~/framework/engine.py v0.3.
   Contract: identical seed → identical draw, card for card, byte for byte.
   Verified against the Python reference by scripts/verify-dice-port.js.
   Pure function: five arbitrary words -> deterministic draw from the 78-card deck.
   The engine ONLY draws and orients cards. Interpretation is a separate art (SPEC Law 8):
   raw meanings are material for a reader, never the final output. */
(function (root) {
  "use strict";

  // ── MAJOR ARCANA (22) — name: [upright, reversed]. Order is canon: it drives the deal. ──
  var MAJOR = [
    ["0 The Fool", "leap of faith, pure potential, the road not mapped yet", "reckless leap, no readiness, holding potential hostage"],
    ["I The Magician", "total command of tools; will made manifest", "charlatan energy; tools owned but unmastered, or used to deceive"],
    ["II The High Priestess", "hidden knowledge; trust what you already know but haven't said aloud", "ignored intuition; secrets festering; self-gaslighting"],
    ["III The Empress", "abundance through cultivation; grow the thing you mothered", "creative block; smothering instead of growing"],
    ["IV The Emperor", "structure, authority, the seat at the head of the table", "tyranny or weakness of structure; rigid authority collapsing"],
    ["V The Hierophant", "tradition, institutions, the established school — learn its canon", "dogma; rebelling for rebellion's sake, or hollow conformity"],
    ["VI The Lovers", "the crossroads; a values-revealing choice; true alignment", "misalignment; choice postponed until it chooses you"],
    ["VII The Chariot", "opposing forces harnessed to one will; momentum with discipline", "horses pulling apart; drive without reins"],
    ["VIII Strength", "gentle mastery over the wild thing; patience as power", "force where finesse was needed; the wild thing running you"],
    ["IX The Hermit", "deliberate withdrawal; the lamp that finds truth in the dark", "isolation as hiding; refusing to come back down the mountain"],
    ["X Wheel of Fortune", "the cycle turns; luck is structure you haven't read yet", "fighting the turn; mistaking a season for a life"],
    ["XI Justice", "cause and effect, weighted honestly; the account comes due", "bias in the scales; avoiding accountability"],
    ["XII The Hanged Man", "the productive pause; see it from upside-down", "stagnation dressed as sacrifice; martyrdom on layaway"],
    ["XIII Death", "a total ending that was already overdue; clear the site", "clinging to the corpse; slow death instead of clean cut"],
    ["XIV Temperance", "blending opposites into a third thing; patient alchemy", "imbalance; extremes running the table"],
    ["XV The Devil", "the chain that binds is yours to unhook; appetite, shadow, deal-making", "denying the chain; the bargain consuming the bargainer"],
    ["XVI The Tower", "sudden structural collapse of the false; the earthquake that clears ground", "the collapse resisted; rebuilding the same faulty tower"],
    ["XVII The Star", "hope after ruin; the clear signal in the quiet", "faith spent; dimming your own signal"],
    ["XVIII The Moon", "the fog path; instinct needed, facts incomplete", "deception — given or absorbed; fog weaponized against you"],
    ["XIX The Sun", "full visibility; success in daylight, nothing to hide", "blocked brightness; success delayed by your own shade"],
    ["XX Judgement", "the summons; the audit of your life that demands an answer", "ignoring the call; self-judgment weaponized"],
    ["XXI The World", "completion of a full cycle; the border crossed", "the loop left one step short; unfinished business blocking the gate"]
  ];

  // ── MINOR ARCANA (56): suit grammar + per-rank meanings, canon rank order ──
  var RANKS = [
    ["Ace", "the raw spark of the suit; undiluted potential", "the spark smothered or wasted"],
    ["Two", "the first decision; two real options, one table", "stalemate; the choice festering"],
    ["Three", "first expansion; the thing leaves the nest", "expansion stalled; the ship waiting in port"],
    ["Four", "consolidation; hold, celebrate, stabilize", "restlessness in stability, or clinging to it"],
    ["Five", "friction; competition, loss or disruption that tests", "the fight avoided; open conflict rotting"],
    ["Six", "the turnaround; a win, a gift, a homecoming", "the return refused; generosity with strings"],
    ["Seven", "assessment and strategy; holding the high ground", "the stand abandoned; defending the wrong hill"],
    ["Eight", "velocity; many moving at once, fast approach", "speed without aim; arrows fired in fog"],
    ["Nine", "the last stand; resilience one round before dawn", "paranoia; the guard up so long it becomes the wound"],
    ["Ten", "the suit's final weight: completion or overload", "carrying what should have been set down"],
    ["Page", "the student energy; curiosity, first contact, message incoming", "immaturity; talk instead of study"],
    ["Knight", "the questing energy; relentless, one-directional pursuit", "the charge misdirected; burnout on horseback"],
    ["Queen", "mastery from within; the suit held with instinct and care", "inner mastery turned inward as poison"],
    ["King", "mastery made external; command, authority, the public standard", "command as control; power without the suit's heart"]
  ];
  var SUITS = ["Wands", "Cups", "Swords", "Pentacles"];

  // Deck in engine.py insertion order: majors first, then suits × ranks.
  var DECK = [];
  MAJOR.forEach(function (c) { DECK.push({ name: c[0], up: c[1], rev: c[2] }); });
  SUITS.forEach(function (suit) {
    RANKS.forEach(function (r) {
      DECK.push({ name: r[0] + " of " + suit, up: r[1], rev: r[2] });
    });
  });

  var POSITIONS = {
    "01": ["01 THE HEART (the question's true center)", "02 THE CROSSING (what aids or obstructs it)",
      "03 THE REALIGNMENT VECTOR (the single executable move)"],
    "02": ["01 PERSONA (the face you're wearing)", "02 SHADOW (what you won't name)",
      "03 ANIMA (the inner driver)", "04 SELF (the verdict on who you are)"],
    "03": ["01 THE SELF (heart of the question)", "02 THE CROSSING (the card that aids or opposes it)",
      "03 THE ROOT (foundation beneath)", "04 THE RECENT PAST (what's fading out)",
      "05 THE CROWN (what crowns the matter, conscious aim)", "06 THE NEAR FUTURE (approaching)",
      "07 THE SELF-IMAGE (your stance in it)", "08 THE ENVIRONMENT (others, outside forces)",
      "09 HOPES & FEARS (what you want and dread)", "10 THE VERDICT (where it lands)"],
    "04": ["01 CORE STATUS (what is being made)", "02 FRICTION (what resists the making)",
      "03 DRIVER (the fuel)", "04 ANCHOR (the past in the work)", "05 FOCUS (where attention lands)"]
  };

  var CLARIFIER_POSITIONS = [
    "01 THE KNOT (what's actually tangled)",
    "02 THE HIDDEN HAND (the unseen force at work)",
    "03 THE WAY THROUGH (the exit the base spread couldn't see)"
  ];

  var SUIT_DOMAIN = {
    "Wands": "drive · creation · conflict",
    "Cups": "emotion · bonds · intuition",
    "Swords": "mind · truth · cost",
    "Pentacles": "matter · money · body · time"
  };

  var BASE_N = { "01": 3, "02": 4, "03": 10, "04": 5 };

  // Python: unicodedata.normalize("NFKD", words.strip().lower()), drop combining
  // marks, keep [a-z0-9 ]. Cyrillic and other non-Latin glyphs strip away; that
  // is engine behavior, not a bug (the hash sees what survives).
  function normalize(words) {
    var t = String(words).trim().toLowerCase().normalize("NFKD");
    t = t.replace(/\p{M}+/gu, "");
    return t.replace(/[^a-z0-9 ]+/g, "");
  }

  function sha256(bytes) {
    return root.crypto.subtle.digest("SHA-256", bytes).then(function (buf) {
      return new Uint8Array(buf);
    });
  }

  function bytesToHex(b) {
    var out = "";
    for (var i = 0; i < b.length; i++) out += (b[i] < 16 ? "0" : "") + b[i].toString(16);
    return out;
  }

  // Port of engine.draw(): hash-chain stream, two bytes per attempt,
  // skip repeats, bit 9 of the draw number sets the reversal.
  function draw(seedWords, config, clarifier) {
    var n = BASE_N[config] + (clarifier ? 3 : 0);
    var norm = normalize(seedWords);
    if (!norm) {
      return Promise.reject(new Error("seed produced no usable words"));
    }
    var names = DECK.map(function (c) { return c.name; });
    return sha256(new TextEncoder().encode(norm)).then(function (digest0) {
      var stream = digest0, idx = 0, picks = [], used = {};
      function step() {
        while (picks.length < n) {
          if (idx + 2 > stream.length) {
            return sha256(stream).then(function (next) {
              stream = next; idx = 0;
              return step();
            });
          }
          var num = stream[idx] * 256 + stream[idx + 1];
          idx += 2;
          var card = names[num % names.length];
          if (used[card]) { continue; }
          used[card] = true;
          var orientation = ((num >> 9) % 2) ? "reversed" : "upright";
          picks.push([card, orientation]);
        }
        var entropy = digest0[digest0.length - 1] % 10;
        return { picks: picks, entropy: entropy, norm: norm, digest: digest0 };
      }
      return Promise.resolve(step());
    });
  }

  function rawMeaning(cardName, orientation) {
    for (var i = 0; i < DECK.length; i++) {
      if (DECK[i].name === cardName) return orientation === "reversed" ? DECK[i].rev : DECK[i].up;
    }
    return "";
  }

  function entropyDirective(entropy) {
    if (entropy <= 2) return "0-2 surgical refinement of the current direction.";
    if (entropy <= 6) return "3-6 strong pivot. Change the spine, keep the skeleton.";
    return "7-9 full teardown authorized. Nothing survives by seniority.";
  }

  // Port of engine.render(): the raw manifest, byte-matched to the Python output.
  function render(seedWords, config, clarifier, result) {
    var nBase = BASE_N[config];
    var hash16 = bytesToHex(result.digest).slice(0, 16);
    var lines = [
      "[SYSTEM DIAGNOSTIC RUN // INITIALIZED]",
      "[SEED ACCEPTED :: \"" + seedWords.trim() + "\"] [DECK: 78 · FULL TAROT] " +
        "[DRAW: " + nBase + (clarifier ? " + 3 CLARIFIER" : "") + "] " +
        "[ENTROPY INDEX: " + result.entropy + "] [HASH :: " + hash16 + "]",
      "",
      "RAW DRAW — material for the reader, never the final output:"
    ];
    var positions = POSITIONS[config];
    result.picks.forEach(function (p, i) {
      var card = p[0], o = p[1];
      var meaning = o === "reversed" ? rawMeaning(card, "reversed") : rawMeaning(card, "upright");
      if (i < nBase) {
        var pos = i < positions.length ? positions[i] : String(i + 1).padStart(2, "0");
        lines.push(pos.padEnd(26, " ") + " " + card + " (" + o + ")");
      } else {
        var j = i - nBase;
        lines.push("CLARIFIER " + CLARIFIER_POSITIONS[j]);
        lines.push(" ".repeat(28) + card + " (" + o + ")");
      }
      var suit = null;
      Object.keys(SUIT_DOMAIN).forEach(function (s) { if (card.indexOf(s) !== -1) suit = s; });
      lines.push(suit
        ? " ".repeat(28) + "raw meaning (" + SUIT_DOMAIN[suit] + "): " + meaning
        : " ".repeat(28) + "raw meaning: " + meaning);
    });
    lines.push("");
    lines.push("ENTROPY DIRECTIVE: " + entropyDirective(result.entropy));
    lines.push("");
    lines.push("[HAND OFF TO READER — weave these into the story of the circumstance. " +
      "Literal keyword output is a failed reading. See SPEC Law 8.]");
    return lines.join("\n");
  }

  var DICE = {
    DECK: DECK,
    POSITIONS: POSITIONS,
    CLARIFIER_POSITIONS: CLARIFIER_POSITIONS,
    BASE_N: BASE_N,
    normalize: normalize,
    draw: draw,
    render: render,
    rawMeaning: rawMeaning,
    entropyDirective: entropyDirective,
    bytesToHex: bytesToHex,
    VERSION: "0.3-js.1 (port of engine.py v0.3)"
  };

  if (typeof module !== "undefined" && module.exports) { module.exports = DICE; }
  root.DICE = DICE;
})(typeof window !== "undefined" ? window : globalThis);
