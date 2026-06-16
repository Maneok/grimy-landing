# Routine #4 — Publication de contenu GEO (« content loop closer »)

> Rôle : **fermer la boucle** ouverte par la routine #5 (AI Search Visibility).
> La routine #5 _détecte_ les requêtes LCB-FT où GRIMY est absent et crée des
> issues `geo-opportunity`. Cette routine #4 _produit et publie_ l'article qui
> comble le trou, en s'appuyant sur des données de mots-clés réelles
> (DataForSEO) plutôt que sur l'intuition.

---

## ⚙️ CONFIGURATION REQUISE (à faire UNE fois avant le premier run)

Cette routine consomme l'API **DataForSEO** (payante). Les identifiants se
fournissent par variables d'environnement — **jamais en dur dans le repo, jamais
dans un fichier committé, jamais dans une issue/PR**.

### 1. Compte DataForSEO

- Créer un compte sur https://app.dataforseo.com/
- Récupérer le **login** (= l'e-mail du compte) et le **password API**
  (Dashboard → API Access → « API password », distinct du mot de passe du portail).
- DataForSEO s'authentifie en **HTTP Basic Auth** : `base64("login:password")`.

### 2. Secrets de l'environnement Claude Code (web)

Dans la config de l'environnement / de la routine planifiée, définir :

```
DATAFORSEO_LOGIN=<email-du-compte-dataforseo>
DATAFORSEO_PASSWORD=<api-password-dataforseo>
```

> ⚠️ Ces deux valeurs sont des **secrets**. Le veilleur ne doit jamais les
> imprimer, les logger, ni les recopier dans un rapport. Au runtime on construit
> l'en-tête ainsi (exemple, à NE PAS afficher en clair) :
>
> ```
> AUTH=$(printf '%s:%s' "$DATAFORSEO_LOGIN" "$DATAFORSEO_PASSWORD" | base64 -w0)
> curl -s -H "Authorization: Basic $AUTH" -H "Content-Type: application/json" ...
> ```

### 3. Garde-fou coût

DataForSEO facture à l'appel mais les coûts sont minimes (≈ $0.01–0.015 / appel
Labs). **Budget non plafonné côté compte** ; on garde tout de même un cap
anti-emballement :

- **≤ 50 appels DataForSEO par run** (protection runaway, pas contrainte budget).
- Endpoints autorisés (mode `live`, marché FR) :
  - `POST /v3/dataforseo_labs/google/keyword_suggestions/live` — **endpoint
    pivot** : découvre le long-tail porteur de volume autour d'un seed.
  - `POST /v3/dataforseo_labs/google/keyword_overview/live` — volume +
    `keyword_difficulty` + CPC + intention sur une liste de mots-clés.
  - `POST /v3/dataforseo_labs/google/related_keywords/live` — variantes
    « also rank for » (complément ; remonte peu sur termes très nichés).
  - `POST /v3/serp/google/organic/live/advanced` — lire le SERP réel pour
    comprendre l'angle/format dominant (**lecture seule**).
- Localisation : `location_name: "France"`, `language_name: "French"`.
- Si `DATAFORSEO_LOGIN`/`PASSWORD` absents ou si un appel renvoie HTTP 401/402
  → **exit gracieux**, issue idempotente `routine-failure`, **0 article**.

---

## 🚫 RÈGLES ABSOLUES

1. **JAMAIS de nom de concurrent dans le contenu publié.** Kanta, Comptactiv,
   compta-online, experts-comptables.fr ou tout autre nom cité par la routine #5
   servent UNIQUEMENT à la recherche de mots-clés interne. Le markdown publié
   reste éducatif et centré GRIMY. (cf. CLAUDE.md / règle #3 de la routine #5).
2. **PAS de merge sur `main`.** Cette routine ouvre une **Pull Request** vers
   `main` et s'arrête. La publication finale est validée par un humain (le
   contenu marketing engage la marque). Ne jamais `merge_pull_request`.
3. **1 article par run maximum.** Qualité > volume. Pas de fermes de contenu.
4. **Idempotence stricte.** Avant de produire, vérifier qu'aucune PR ouverte ni
   aucun fichier `src/content/blog/<slug>.md` ne couvre déjà la requête cible.
   Si l'issue `geo-opportunity` porte déjà le label `content-drafted` → SKIP.
5. **Branche de travail dédiée** : `routine/content-geo-<slug>`. Jamais de push
   direct sur `main` ni sur la branche d'une autre routine.
6. **Pas de PII, pas de secret** dans le markdown, le titre, la PR ou les logs.
   Re-scanner le markdown final avec une regex secrets avant commit.
7. **Hard cap wallclock : 10 min.** Build inclus.
8. **Le markdown DOIT passer `npm run build`** (le schéma de
   `src/content.config.ts` valide titre ≤ 70 car. et description 50–160 car.).
   Un build rouge = pas de PR.

---

## PHASE 1 — SETUP

```
git fetch origin main
git reset --hard origin/main
npm ci
```

Vérifier que l'infra blog existe (sinon → issue `routine-failure`, exit) :
- `src/content.config.ts` (collection `blog`)
- `src/pages/blog/index.astro` et `src/pages/blog/[...slug].astro`

---

## PHASE 2 — SÉLECTION DE LA CIBLE

1. `mcp__github__list_issues` state=open labels=`geo-opportunity`.
2. Exclure celles déjà labellisées `content-drafted` ou `ready-for-publish`.
3. Exclure celles dont un fichier `src/content/blog/*.md` a déjà
   `targetQuery` == la requête (front-matter).
4. Prioriser par **intent commercial** puis par **nombre de concurrents
   présents** (champ dans le corps de l'issue / snapshot `.geo-reports/`).
   À défaut de signal, prendre la plus ancienne (FIFO) pour éviter la famine.
5. Retenir **UNE** issue. Mémoriser `query`, `issueNumber`.

Si aucune issue éligible → rien à faire, **exit silencieux** (pas de notif, pas
de PR). La boucle est déjà à jour.

---

## PHASE 3 — RECHERCHE MOTS-CLÉS (DataForSEO)

> ⚠️ **Enseignement validé par mesure réelle (2026-06-16, voir Annexe A).**
> Les requêtes long-tail exactes de la routine #5 (ex. « logiciel LCB-FT pour
> expert-comptable ») ont un **volume quasi nul** dans l'index DataForSEO. Cibler
> ces strings à la lettre = articles que personne ne cherche. La stratégie
> gagnante : remonter au **terme-tête porteur** (ex. `lcb-ft` = 5 400/mois,
> KD 2 ; `tracfin` = 14 800/mois, KD 8 ; `kyc` = 6 600/mois, KD 5) et **couvrir
> le long-tail sémantiquement à l'intérieur de l'article**.

Procédure pour l'issue retenue :

1. **Dériver 1–3 seeds** à partir de la `query` (ex. query « registre LCB-FT
   obligatoire » → seeds `lcb-ft`, `registre lcb-ft`, `obligations lcb-ft`).
2. `keyword_suggestions` sur chaque seed → récupérer les variantes avec
   `search_volume > 0`. **C'est ici qu'on trouve le mot-clé principal réel** :
   la variante au meilleur couple (volume élevé × KD bas) qui reste fidèle à
   l'intention de l'issue.
3. `keyword_overview` sur le mot-clé principal retenu + 5–10 secondaires →
   confirmer volume, `keyword_difficulty`, CPC (un CPC élevé = fort intent
   commercial, ex. `logiciel lcb-ft` CPC ≈ 64 $) et `search_intent`.
4. `serp/google/organic/live/advanced` sur le mot-clé principal → lire les 10
   premiers résultats pour caler l'**angle** (définition / guide / how-to) et le
   **format**. **Lecture seule** ; ne jamais copier ni citer un domaine
   concurrent dans l'article.

Règles d'arbitrage :
- Si **tous** les seeds dérivés sont à volume nul → l'article garde quand même
  une valeur **GEO** (citation IA sur question de niche) : autorisé, mais
  signaler « volume SEO faible, valeur surtout GEO » dans la PR.
- Privilégier KD ≤ 30 (terrain réaliste pour un domaine jeune).

Consigner (en mémoire, pas dans un fichier committé) : mot-clé principal réel,
volume, KD, 3–5 secondaires, intention, format cible.

---

## PHASE 4 — RÉDACTION

Créer `src/content/blog/<slug>.md` où `<slug>` est dérivé de la requête
(kebab-case, sans accents). Front-matter conforme au schéma :

```yaml
---
title: "<≤ 70 caractères, contient le mot-clé principal>"
description: "<50–160 car., meta description orientée clic>"
pubDate: <YYYY-MM-DD du jour>
author: "Équipe GRIMY"
tags: ["LCB-FT", ...]
targetQuery: "<la query GEO exacte>"
geoIssue: <issueNumber>
---
```

Exigences rédactionnelles (optimisé **GEO** = être cité par les moteurs IA) :

- **800–1300 mots**, français, ton expert mais accessible.
- Le **mot-clé principal** dans le H1 (= `title`), le premier paragraphe et au
  moins un H2.
- Structure **extractible par un LLM** : un bloc « définition » répondant
  directement à la question dès le début (les AI Overviews citent ces réponses
  directes), des H2/H3 clairs, des listes à puces, une section **FAQ** (Q en
  gras + réponse courte) — c'est le format le plus cité.
- **Aucune affirmation factuelle inventée** : s'en tenir aux obligations
  réelles (norme NPLAB, vigilance, scoring, registre, conservation 5 ans,
  TRACFIN). En cas de doute réglementaire, rester général plutôt que d'inventer
  un chiffre ou un article de loi.
- **CTA GRIMY** discret en fin d'article + lien interne (`/#produit`,
  `/#tarifs` ou `/conformite`).
- **Zéro nom de concurrent.** (re-vérifier avant commit, voir Phase 5).
- Réutiliser le style de l'article-pilote
  `src/content/blog/logiciel-lcb-ft-expert-comptable.md` comme gabarit.

---

## PHASE 5 — CONTRÔLES QUALITÉ (gate, ≥ 12 checks)

| # | Contrôle | Échec = |
|---|----------|---------|
| 1 | `npm run build` vert | bloquant |
| 2 | `/blog/<slug>/index.html` généré | bloquant |
| 3 | JSON-LD `Article` + `BreadcrumbList` présents dans le HTML | bloquant |
| 4 | `title` ≤ 70 car. (sinon le build l'aurait refusé) | bloquant |
| 5 | `description` 50–160 car. | bloquant |
| 6 | Mot-clé principal présent dans title + 1er paragraphe | bloquant |
| 7 | Aucun nom de concurrent (regex sur la liste connue, insensible casse) | bloquant |
| 8 | Aucun secret (regex `sk[-_]`, `eyJ…`, `DATAFORSEO`, `Basic `) dans le md | bloquant |
| 9 | Aucune PII (pas d'e-mail/nom propre client) | bloquant |
| 10 | 800 ≤ mots ≤ 1300 | warning |
| 11 | ≥ 1 lien interne GRIMY | warning |
| 12 | Présence d'une section FAQ (≥ 2 Q/R) | warning |
| 13 | `git status` ne touche QUE `src/content/blog/<slug>.md` (+ rien d'autre) | bloquant |

Un bloquant KO → corriger (≤ 2 itérations) sinon **abandonner** : pas de PR,
commenter l'issue avec le motif, exit. Ne jamais publier un article cassé.

---

## PHASE 6 — PR (PAS DE MERGE)

```
git checkout -b routine/content-geo-<slug>
git add src/content/blog/<slug>.md
git commit -m "content: article GEO « <title> » (closes #<issueNumber> côté contenu)"
git push -u origin routine/content-geo-<slug>
```

Ouvrir la PR vers `main` via `mcp__github__create_pull_request` :

- **Titre** : `content: <title>`
- **Corps** :
  - Requête GEO ciblée + lien vers l'issue `geo-opportunity` (#N).
  - Résumé DataForSEO : volume, difficulté, intention (sans secret).
  - Checklist qualité (Phase 5) cochée.
  - Mention : « Contenu marketing — **relecture humaine requise avant merge**.
    Aucun concurrent nommé (règle CLAUDE.md). »
- **Labels** : `content`, `geo`, `auto-detected`, `routine-4`.
- **Ne pas merger.** `enable_pr_auto_merge` interdit.

Puis sur l'issue `geo-opportunity` source :
- `add_issue_comment` : « Brouillon d'article prêt en PR #<pr> (relecture
  humaine requise). »
- Ajouter le label `content-drafted` (idempotence des prochains runs).

---

## PHASE 7 — RAPPORT & NOTIFICATION

Rapport en clair (titre article, requête, métriques DataForSEO, n° PR, n° issue,
résultats du gate). **Notifier** (push) uniquement si une PR a été ouverte OU si
la routine a échoué (DataForSEO down, build rouge irrécupérable). Si rien à
faire (aucune issue éligible) → **silence**.

---

## COMPORTEMENT EN CAS D'ÉCHEC

| Situation | Action |
|-----------|--------|
| Secrets DataForSEO absents | issue `routine-failure` idempotente, exit |
| HTTP 401/402 DataForSEO (auth/crédit) | idem, exit, **0 article** |
| HTTP 429 DataForSEO | 1 retry après 30 s, sinon exit gracieux |
| `npm run build` rouge après 2 itérations | pas de PR, commenter l'issue, exit |
| Nom de concurrent détecté dans le draft | corriger ou abandonner — **jamais** publier |
| Aucune issue `geo-opportunity` éligible | exit silencieux |

### NE JAMAIS

- Merger sur `main` (relecture humaine obligatoire).
- Publier plus d'un article par run.
- Nommer un concurrent dans le contenu publié.
- Dépasser 15 appels DataForSEO / run.
- Imprimer, logger ou committer `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`.
- Inventer un chiffre réglementaire ou un article de loi.

---

## ANNEXE A — Benchmark DataForSEO validé (mesure réelle 2026-06-16)

Premier appel réel à l'API (compte connecté, marché France/français). Sert de
**baseline** : la routine doit faire mieux que de cibler des strings à volume nul.

### Termes-tête (cibles prioritaires — fort volume, faible difficulté)

| Mot-clé | Volume/mois | KD | CPC ($) | Lecture |
|---------|------------:|---:|--------:|---------|
| expert comptable | 49 500 | 84 | 8.73 | Trop concurrentiel (head générique) |
| tracfin | 14 800 | 8 | 0 | ⭐ Volume énorme, KD très bas |
| kyc | 6 600 | 5 | 7.56 | ⭐ Volume + intent B2B |
| lcb-ft | 5 400 | 2 | 4.46 | ⭐ Cœur de cible, KD quasi nul |
| blanchiment | 3 600 | 20 | 0.81 | Bon volume, intent informationnel |
| logiciel expert comptable | 720 | 62 | 9.20 | Intent commercial, KD élevé |
| logiciel lcb-ft | 50 | — | 64.22 | Volume faible mais **CPC 64 $** = intent achat maximal |

### Long-tail porteur (via `keyword_suggestions` seed `lcb-ft`, top extraits)

| Mot-clé | Volume | KD |
|---------|-------:|---:|
| formation lcb-ft | 390 | 0 |
| lcb-ft def / définition | 320 / 170 | 0–3 |
| obligation(s) lcb-ft | 210 | 16–18 |
| réglementation lcb-ft | 140 | 4–16 |
| dispositif lcb-ft | 110 | 2 |
| analyste lcb-ft | 170 | 0 |

### Requêtes long-tail de la routine #5 → **volume nul** dans l'index

« logiciel LCB-FT pour expert-comptable », « outil anti-blanchiment cabinet
comptable », « registre LCB-FT obligatoire expert-comptable », etc. →
`keyword_overview` ne renvoie **aucune** donnée (0 item). À traiter comme
sous-sections sémantiques d'articles construits autour des termes-tête, pas
comme titres d'articles autonomes.

### Conclusion stratégique pour la routine

1. **Articles-piliers** sur `lcb-ft`, `tracfin`, `kyc`, `déclaration de soupçon`
   (volume réel + KD bas) — c'est là que se gagne la visibilité.
2. À l'intérieur, **couvrir le long-tail** de la routine #5 en H2/H3 + FAQ
   (intention exacte des experts-comptables → citation GEO).
3. Garder une page « logiciel LCB-FT » orientée **conversion** (CPC 64 $ =
   intent achat), même à faible volume.

> Coûts observés : ~$0.01–0.015 par appel Labs. Un run complet (suggestions +
> overview + SERP) ≈ $0.05–0.10. Négligeable.
