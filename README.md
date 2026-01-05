# kvnbbg.fr API

Squelette d'API pour `kvnbbg.fr` incluant les rubriques App Console, Announcement, Documentation et Ticket & Punish ainsi que la proxification des principaux endpoints AliExpress Affiliate.

## Démarrage

```bash
npm install
npm run dev
```

Configurer les variables d'environnement via `.env` (voir `.env.example`). Le service écoute par défaut sur le port `3000`.

Variables clés pour la connexion Open Service AliExpress :

| Variable | Description |
| --- | --- |
| `ALIEXPRESS_APP_KEY` / `ALIEXPRESS_APP_SECRET` | Identifiants du projet AliExpress Open Platform. |
| `ALIEXPRESS_ACCESS_TOKEN` | Jeton d'accès OAuth2 (optionnel selon les opérations). |
| `ALIEXPRESS_ROUTER_PATH` | Chemin du routeur TOP (par défaut `/router/rest`). |
| `ALIEXPRESS_TRACKING_ID` | Tracking ID utilisé pour les endpoints Affiliate. |

## SDK TypeScript recommandé (DRY)

Le dépôt TypeScript le plus adapté est un SDK non officiel mais complet pour la nouvelle Open Platform AliExpress : **`ae_sdk`**.

### Répo GitHub recommandé

- **ae_sdk** – SDK AliExpress en **TypeScript**, typé de bout en bout, qui supporte les APIs System Auth, Dropshipping et Affiliate (produits, détails, commandes, liens affiliés, etc.).

### Points clés du SDK

- Entièrement en **TypeScript** (100% du code) avec types pour les paramètres et réponses de toutes les méthodes.
- Gère la signature des requêtes, les tokens d’authentification et les erreurs de façon centralisée.
- Couvre les principaux cas d’usage : récupération de produits, détails, calcul shipping, dropshipping, affiliation (recherche, liens, commissions).

### Exemple d’utilisation rapide

Initialisation d’un client dropshipping (Node / TS) avec `ae_sdk` :

```ts
import { DropshipperClient } from "ae_sdk";

const client = new DropshipperClient({
  app_key: "YOUR_APP_KEY",
  app_secret: "YOUR_APP_SECRET",
  session: "ACCESS_TOKEN_FROM_AUTH_FLOW",
});

const product = await client.productDetails({
  product_id: 1005004043442825,
  ship_to_country: "US",
  target_currency: "USD",
  target_language: "en",
});

console.log(product.data);
```

## Proxy HTTP/3

Le fichier [`Caddyfile`](./Caddyfile) fournit la configuration recommandée pour exposer l'API via Caddy avec support HTTP/3/QUIC.

## Modernisation & Gouvernance

Le document [**Senior Architect's Modernization Briefing**](./MODERNIZATION_BRIEFING.md) décrit l'état actuel, la feuille de route de modernisation et les artefacts générés (`./artifacts/`). Utilisez-le comme point de départ pour mettre en place CI/CD, sécurité et observabilité.
