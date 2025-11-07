# kvnbbg.fr API

Squelette d'API pour `kvnbbg.fr` incluant les rubriques App Console, Announcement, Documentation et Ticket & Punish ainsi que la proxification des principaux endpoints AliExpress Affiliate.

## Démarrage

```bash
npm install
npm run dev
```

Configurer les variables d'environnement via `.env` (voir `.env.example`). Le service écoute par défaut sur le port `3000`.

## Proxy HTTP/3

Le fichier [`Caddyfile`](./Caddyfile) fournit la configuration recommandée pour exposer l'API via Caddy avec support HTTP/3/QUIC.
