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
