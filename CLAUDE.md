# Contexte projet — kvnbbg.fr API

## Objectifs
- Fournir une API Express pour App Console, Announcement, Documentation, Support et proxification AliExpress.
- Maintenir une documentation claire et des chemins d'exécution simples (local + déploiement Vercel).

## Règles de contribution
- Documenter les décisions clés dans ce fichier et, si nécessaire, dans des CLAUDE.md plus proches du code.
- Garder les routes HTTP stables et ajouter des versions si une rupture est nécessaire.
- Préserver les performances (latence et mémoire) et la sécurité (sanitisation, secrets via variables d'env).

## Pratiques agentiques recommandées
- **CLAUDE.md** : conserver le contexte projet et l'historique des décisions.
- **Échap** : intervenir en temps réel pour corriger la trajectoire d'un agent.
- **Sous-agents** : paralléliser l'exploration, les tests et la refactorisation.

## Déploiement Vercel (express)
- Utiliser `vercel.json` pour router l'ensemble du trafic vers l'app Express.
- En runtime Vercel, l'app ne doit pas écouter un port (`app.listen` désactivé).
- Configurer les variables d'environnement dans le dashboard Vercel.
