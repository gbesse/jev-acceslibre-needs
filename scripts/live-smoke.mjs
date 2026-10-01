// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { assessAccessNeeds } from "../src/index.mjs";
const client = createJevClient();
const résultat = await assessAccessNeeds({
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
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
