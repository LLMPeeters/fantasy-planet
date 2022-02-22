import { BREAD } from "./classes/BREAD.js";
import { Section } from "./classes/Section.js";
import { Doc } from "./classes/Doc.js";
import { Snippet } from "./classes/Snippet.js";

Section.fetchURL = `./scripts/fetches/handleFantasySections.fetch.php`;
Doc.fetchURL = `./scripts/fetches/handleFantasyDocs.fetch.php`;
Snippet.fetchURL = `./scripts/fetches/handleFantasySnippets.fetch.php`;

export { BREAD, Section, Doc, Snippet };