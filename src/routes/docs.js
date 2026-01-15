import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    title: 'API Documentation',
    contact: 'contact@techandstream.com',
    sections: [
      'System Tool',
      'AE-Affiliate',
      'AE-Logistics',
      'AE-Aliexpress-Direct-Product',
      'AE-Settlement',
      'AE-Custmize',
      'AE-KoreanCrossborder-Product',
      'AE-Dropshipper',
      'AE-Image',
      'AE-Seller',
      'AE-Category&Attributes',
      'AE-Refund&return',
      'AE-Freight (Shipment)',
      'AE-Order & Transaction',
      'AliExpress Direct Logistic',
      'AE-Product Management',
      'AE_DSA',
      'AE-UIC-IPAY',
      'CSP-Seller'
    ],
    agentic_workflow: {
      summary:
        "Les pratiques recommandées (fichiers CLAUDE.md, intervention en temps réel via Échap, sous-agents pour le parallèle) s'alignent avec les recommandations officielles d'Anthropic.",
      claude_md: {
        purpose:
          'Conserver le contexte projet, les conventions, et les décisions clés à proximité du code.',
        location:
          'Placer un CLAUDE.md à la racine et des fichiers spécifiques dans les sous-dossiers critiques.'
      },
      realtime_intervention: {
        shortcut: 'Échap',
        goal:
          'Interrompre ou réorienter rapidement un agent lors de dérives, pour maintenir la qualité et la sécurité.'
      },
      parallel_agents: {
        goal:
          'Paralléliser la recherche, la refactorisation, et les tests pour réduire le temps global.',
        guardrails:
          'Définir un périmètre clair et des points de synchronisation pour éviter les conflits.'
      }
    },
    vercel_deploy: {
      goal:
        'Déploiement Vercel simplifié via vercel.json et runtime serverless pour Express.',
      steps: [
        'Configurer les variables .env dans Vercel.',
        'Déployer via `vercel` ou le dashboard.',
        'Vérifier /docs pour la checklist agentique.'
      ]
    },
    affiliate: {
      endpoints: [
        'aliexpress.affiliate.product.shipping.get',
        'aliexpress.affiliate.product.sku.detail.get',
        '/aliexpress/xinghe/merchant/license/get',
        'aliexpress.affiliate.link.generate',
        'aliexpress.affiliate.category.get',
        'aliexpress.affiliate.featuredpromo.get',
        'aliexpress.affiliate.featuredpromo.products.get',
        'aliexpress.affiliate.hotproduct.download',
        'aliexpress.affiliate.hotproduct.query',
        'aliexpress.affiliate.order.get',
        'aliexpress.affiliate.order.list',
        'aliexpress.affiliate.order.listbyindex',
        'aliexpress.affiliate.productdetail.get',
        'aliexpress.affiliate.product.query',
        'aliexpress.affiliate.product.smartmatch'
      ],
      latest_update: '2022-06-07 14:08:09'
    }
  });
});

export default router;
