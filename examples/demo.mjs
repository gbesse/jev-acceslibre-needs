// Objectif : montrer une décision sémantique avec des données entièrement synthétiques.
import assert from "node:assert/strict";
import { assessAccessNeeds } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "exemple-1",
  "text": "Usager en fauteuil manuel ; entrée de plain-pied, porte large et sanitaires adaptés déclarés.",
  "source": {
    "url": "https://example.test/source-publique",
    "date": "2026-09-25"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
};
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "compatible", probabilities: {
  "compatible": 0.82,
  "assistance_required": 0.045,
  "likely_barrier": 0.045,
  "insufficient_data": 0.045,
  "unavailable": 0.045
}, confidence: 0.82 } }, usage: { input_tokens: 120, output_tokens: 0 } }));
const résultat = await assessAccessNeeds(dossier, provider);
assert.equal(résultat.decision, "compatible");
assert.equal(résultat.review, false);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · probabilité : ${résultat.probability}`);
