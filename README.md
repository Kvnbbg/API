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

## Proxy HTTP/3

Le fichier [`Caddyfile`](./Caddyfile) fournit la configuration recommandée pour exposer l'API via Caddy avec support HTTP/3/QUIC.

## Modernisation & Gouvernance

Le document [**Senior Architect's Modernization Briefing**](./MODERNIZATION_BRIEFING.md) décrit l'état actuel, la feuille de route de modernisation et les artefacts générés (`./artifacts/`). Utilisez-le comme point de départ pour mettre en place CI/CD, sécurité et observabilité.
