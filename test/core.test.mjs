// Objectif : vérifier la normalisation, la règle déterministe et les décisions sémantiques.
import test from "node:test";
import assert from "node:assert/strict";
import { accessCase, assessAccessNeeds } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const casLimite = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-27"
  },
  "establishmentOpen": false
};
const casPrincipal = {
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
const casÀRevoir = {
  "id": "revue-1",
  "text": "L’établissement indique une rampe amovible, sans pente, largeur ni procédure pour demander son installation.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-09-26"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};
test("exige une source", () => assert.throws(() => accessCase({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => {
  const provider = createFakeProvider(() => { throw new Error("appel interdit"); });
  assert.equal((await assessAccessNeeds(casLimite, provider)).decision, "unavailable");
  assert.equal(provider.calls, 0);
});
test("classe un dossier sourcé avec une confiance suffisante", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "compatible", probabilities: {
  "compatible": 0.82,
  "assistance_required": 0.045,
  "likely_barrier": 0.045,
  "insufficient_data": 0.045,
  "unavailable": 0.045
}, confidence: 0.82 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await assessAccessNeeds(casPrincipal, provider);
  assert.equal(résultat.decision, "compatible");
  assert.equal(résultat.review, false);
  assert.equal(provider.calls, 1);
});
test("marque une décision incertaine pour revue humaine", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "insufficient_data", probabilities: {
  "compatible": 0.12,
  "assistance_required": 0.12,
  "likely_barrier": 0.12,
  "insufficient_data": 0.52,
  "unavailable": 0.12
}, confidence: 0.62 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await assessAccessNeeds(casÀRevoir, provider);
  assert.equal(résultat.decision, "insufficient_data");
  assert.equal(résultat.review, true);
  assert.equal(résultat.confidence, 0.62);
  assert.equal(provider.calls, 1);
});
