// Objectif : vérifier que les types publics sont importables.
import { accessCase, assessAccessNeeds } from "../src/index.mjs";
const dossier = accessCase({
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
});
void assessAccessNeeds(dossier, { decide: async () => ({}) });
