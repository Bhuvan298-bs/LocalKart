export const MOCK_PRODUCTS = [
  // Shop 1: Shri Krishna Kirana (Indiranagar)
  {
    id: 'prod-101',
    shopId: 'shop-1',
    name: 'Aashirvaad Superior Sharbati Shudh Atta',
    brand: 'Aashirvaad',
    category: 'groceries',
    unit: '5 kg',
    price: 295,
    stockQuantity: 18,
    lowStockThreshold: 5,
    isActive: true,
    description: '100% pure MP Sharbati whole wheat grains made with traditional chakki process for softer and fluffier rotis.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-102',
    shopId: 'shop-1',
    name: 'Tata Salt Vaccum Evaporated Iodized Salt',
    brand: 'Tata',
    category: 'groceries',
    unit: '1 kg',
    price: 28,
    stockQuantity: 42,
    lowStockThreshold: 10,
    isActive: true,
    description: 'Purity guaranteed with vacuum evaporation technology. Essential dietary iodine for mental development.',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-103',
    shopId: 'shop-1',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    brand: 'Fortune',
    category: 'groceries',
    unit: '1 L Pouch',
    price: 135,
    stockQuantity: 3, // Low stock demo
    lowStockThreshold: 5,
    isActive: true,
    description: 'Light and healthy cooking oil enriched with vitamins A & D for everyday Indian delicacies.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-104',
    shopId: 'shop-1',
    name: 'Toor Dal / Arhar Dal Unpolished',
    brand: 'Local Premium',
    category: 'groceries',
    unit: '1 kg',
    price: 165,
    stockQuantity: 0, // OUT OF STOCK for backup shop demonstration!
    lowStockThreshold: 4,
    isActive: true,
    description: 'Naturally cultivated unpolished toor dal rich in protein. Cooks quickly with rich aromatic flavour.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    // Alternative participating shops for the distinctive feature
    alternativeShops: [
      {
        shopId: 'shop-4',
        shopName: 'Annapurna Daily Supermarket',
        locality: 'Jayanagar 4th Block',
        price: 160,
        unit: '1 kg',
        stockQuantity: 24,
        distance: '3.2 km away'
      },
      {
        shopId: 'shop-5',
        shopName: 'Kaveri Organic Mart',
        locality: 'HSR Layout Sector 2',
        price: 185,
        unit: '1 kg (Organic)',
        stockQuantity: 12,
        distance: '4.8 km away'
      }
    ]
  },
  {
    id: 'prod-105',
    shopId: 'shop-1',
    name: 'Haldiram\'s Bhujia Sev Special',
    brand: 'Haldiram\'s',
    category: 'snacks',
    unit: '400 g',
    price: 110,
    stockQuantity: 15,
    lowStockThreshold: 5,
    isActive: true,
    description: 'Crispy moth bean and gram flour spicy noodles seasoned with cardamom, cloves, and black pepper.',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-106',
    shopId: 'shop-1',
    name: 'Surf Excel Quick Wash Detergent Powder',
    brand: 'Surf Excel',
    category: 'household',
    unit: '1 kg',
    price: 155,
    stockQuantity: 8,
    lowStockThreshold: 3,
    isActive: true,
    description: 'Superior stain removal technology with less water consumption and fabric conditioning.',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-107',
    shopId: 'shop-1',
    name: 'Everest Royal Garam Masala Powder',
    brand: 'Everest',
    category: 'spices',
    unit: '100 g',
    price: 92,
    stockQuantity: 20,
    lowStockThreshold: 5,
    isActive: true,
    description: 'Finely ground aromatic blend of 13 authentic whole spices for vegetable and paneer curries.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-108',
    shopId: 'shop-1',
    name: 'Taj Mahal Fine Tea Leaves',
    brand: 'Brooke Bond Taj Mahal',
    category: 'beverages',
    unit: '500 g',
    price: 340,
    stockQuantity: 11,
    lowStockThreshold: 4,
    isActive: true,
    description: 'Precious tea leaves grown in Assam with rich golden liquor and unmatched aroma.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80'
  },

  // Shop 2: Lakshmi Fresh Farm Produce (Koramangala)
  {
    id: 'prod-201',
    shopId: 'shop-2',
    name: 'Fresh Country Red Tomatoes (Nati Tomato)',
    brand: 'Farm Fresh',
    category: 'produce',
    unit: '1 kg',
    price: 42,
    stockQuantity: 35,
    lowStockThreshold: 8,
    isActive: true,
    description: 'Tangy local country tomatoes bursting with juice, hand-picked from Hoskote farms this morning.',
    image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-202',
    shopId: 'shop-2',
    name: 'Crisp Green Lady Finger / Bhindi / Okra',
    brand: 'Farm Fresh',
    category: 'produce',
    unit: '500 g',
    price: 32,
    stockQuantity: 20,
    lowStockThreshold: 5,
    isActive: true,
    description: 'Tender tender young lady finger without fibers, perfect for crispy bhindi fry or sambar.',
    image: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-203',
    shopId: 'shop-2',
    name: 'Palak / Spinach Fresh Bunches',
    brand: 'Farm Fresh',
    category: 'produce',
    unit: '2 Bunches',
    price: 25,
    stockQuantity: 15,
    lowStockThreshold: 4,
    isActive: true,
    description: 'Vibrant green pesticide-free spinach leaves rich in iron and dietary fiber, thoroughly rinsed.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-204',
    shopId: 'shop-2',
    name: 'Yellaki Bananas (Chitrali)',
    brand: 'Farm Fresh',
    category: 'produce',
    unit: '1 kg (approx 10 pcs)',
    price: 75,
    stockQuantity: 28,
    lowStockThreshold: 6,
    isActive: true,
    description: 'Sweet, small aromatic table bananas sourced from Channapatna orchards.',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-205',
    shopId: 'shop-2',
    name: 'Pomegranate / Anar Kesar Variety',
    brand: 'Farm Fresh',
    category: 'produce',
    unit: '1 kg (3-4 pcs)',
    price: 190,
    stockQuantity: 2, // Low stock demo
    lowStockThreshold: 4,
    isActive: true,
    description: 'Ruby red sweet arils with soft seeds, high antioxidant content.',
    image: 'https://images.unsplash.com/photo-1541344999736-83eca872f241?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-206',
    shopId: 'shop-2',
    name: 'Coriander Leaves & Green Chillies Combo',
    brand: 'Farm Fresh',
    category: 'produce',
    unit: '1 Bunch + 100g Chillies',
    price: 20,
    stockQuantity: 0, // OUT OF STOCK for backup demo
    lowStockThreshold: 5,
    isActive: true,
    description: 'Daily Indian kitchen essentials — freshly harvested fragrant coriander with fiery green chillies.',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80',
    alternativeShops: [
      {
        shopId: 'shop-1',
        shopName: 'Shri Krishna Kirana & Provisions',
        locality: 'Indiranagar 12th Main',
        price: 22,
        unit: '1 Bunch + 100g Chillies',
        stockQuantity: 18,
        distance: '2.4 km away'
      }
    ]
  },

  // Shop 3: Iyengar Bakery & Sweets (Malleshwaram)
  {
    id: 'prod-301',
    shopId: 'shop-3',
    name: 'Classic Potato Masala Puff (Veg Puff)',
    brand: 'Iyengar Special',
    category: 'bakery',
    unit: '2 Pieces',
    price: 45,
    stockQuantity: 30,
    lowStockThreshold: 8,
    isActive: true,
    description: 'Flaky golden puff pastry filled with spiced potato onion masala and baked fresh every morning.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-302',
    shopId: 'shop-3',
    name: 'Traditional Butter Sponge Cake (Eggless)',
    brand: 'Iyengar Special',
    category: 'bakery',
    unit: '300 g Loaf',
    price: 90,
    stockQuantity: 12,
    lowStockThreshold: 4,
    isActive: true,
    description: 'Soft melt-in-the-mouth tea cake with subtle vanilla and cardamom flavours, made without eggs.',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-303',
    shopId: 'shop-3',
    name: 'Crispy Benne / Butter Biscuits',
    brand: 'Iyengar Special',
    category: 'bakery',
    unit: '250 g Box',
    price: 85,
    stockQuantity: 22,
    lowStockThreshold: 5,
    isActive: true,
    description: 'Authentic Bangalore bakery style butter biscuits. Crunchy outside with a rich buttery crumb.',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-304',
    shopId: 'shop-3',
    name: 'Fresh Soft Milk Pav Buns',
    brand: 'Iyengar Special',
    category: 'bakery',
    unit: 'Pack of 6',
    price: 35,
    stockQuantity: 40,
    lowStockThreshold: 10,
    isActive: true,
    description: 'Super soft, pillow-textured pav buns ideal for pav bhaji, vada pav, or evening maska pav.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-305',
    shopId: 'shop-3',
    name: 'Spicy Congress Kadlekai (Peanuts)',
    brand: 'Iyengar Special',
    category: 'snacks',
    unit: '200 g',
    price: 55,
    stockQuantity: 0, // OUT OF STOCK
    lowStockThreshold: 5,
    isActive: true,
    description: 'Split roasted peanuts tossed in asafoetida, curry leaves, turmeric and red chilli powder.',
    image: 'https://images.unsplash.com/photo-1569460275916-2485e9ee9b57?w=600&auto=format&fit=crop&q=80',
    alternativeShops: [
      {
        shopId: 'shop-1',
        shopName: 'Shri Krishna Kirana & Provisions',
        locality: 'Indiranagar 12th Main',
        price: 50,
        unit: '200 g',
        stockQuantity: 10,
        distance: '4.1 km away'
      }
    ]
  },

  // Shop 4: Annapurna Daily Supermarket (Jayanagar)
  {
    id: 'prod-401',
    shopId: 'shop-4',
    name: 'India Gate Basmati Rice Feast Rozzana',
    brand: 'India Gate',
    category: 'groceries',
    unit: '5 kg',
    price: 460,
    stockQuantity: 14,
    lowStockThreshold: 4,
    isActive: true,
    description: 'Aged basmati rice grains with distinct aroma and non-sticky texture for daily biryanis and pulao.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-402',
    shopId: 'shop-4',
    name: 'Maggi 2-Minute Noodles Masala Pack',
    brand: 'Nestle Maggi',
    category: 'snacks',
    unit: '420 g (6 Pack)',
    price: 88,
    stockQuantity: 25,
    lowStockThreshold: 6,
    isActive: true,
    description: 'India\'s favourite instant noodles fortified with iron and signature authentic tastemaker spices.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-403',
    shopId: 'shop-4',
    name: 'Vim Dishwash Gel Lemon Fragrance',
    brand: 'Vim',
    category: 'household',
    unit: '750 ml Bottle',
    price: 180,
    stockQuantity: 19,
    lowStockThreshold: 5,
    isActive: true,
    description: 'Power of 100 lemons dissolves grease effortlessly without scratching expensive cookware.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-404',
    shopId: 'shop-4',
    name: 'Parle-G Original Gluco Biscuits',
    brand: 'Parle',
    category: 'snacks',
    unit: '800 g Family Pack',
    price: 75,
    stockQuantity: 30,
    lowStockThreshold: 8,
    isActive: true,
    description: 'Classic wholesome tea-time biscuits enriched with good nutrition of wheat and milk.',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-405',
    shopId: 'shop-4',
    name: 'Bru Instant Coffee Powder',
    brand: 'Bru',
    category: 'beverages',
    unit: '200 g Jar',
    price: 260,
    stockQuantity: 16,
    lowStockThreshold: 4,
    isActive: true,
    description: 'Roasted robusta and chicory blend bringing aromatic South Indian filter coffee punch instantly.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
  },

  // Shop 6: Balaji Dairy (Indiranagar)
  {
    id: 'prod-601',
    shopId: 'shop-6',
    name: 'Nandini Toned Fresh Pasteurized Milk',
    brand: 'Nandini (KMF)',
    category: 'dairy',
    unit: '1 L (2 x 500ml)',
    price: 44,
    stockQuantity: 60,
    lowStockThreshold: 15,
    isActive: true,
    description: 'Fresh local Karnataka milk pasteurized and packed with 3.0% fat and 8.5% SNF.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-602',
    shopId: 'shop-6',
    name: 'Amul Fresh Malai Paneer Block',
    brand: 'Amul',
    category: 'dairy',
    unit: '200 g Block',
    price: 95,
    stockQuantity: 24,
    lowStockThreshold: 6,
    isActive: true,
    description: 'Rich, soft, and moist paneer made from real cow and buffalo milk for delicious curries.',
    image: 'https://images.unsplash.com/photo-1528732263440-4dd1a18a4cc2?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-603',
    shopId: 'shop-6',
    name: 'Farm Fresh White Eggs (Graded)',
    brand: 'Poultry Fresh',
    category: 'dairy',
    unit: 'Crate of 6 Eggs',
    price: 48,
    stockQuantity: 50,
    lowStockThreshold: 10,
    isActive: true,
    description: 'Cleaned, hygienic, nutritious protein-rich eggs from verified local poultry farms.',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-604',
    shopId: 'shop-6',
    name: 'Nandini Thick Curd / Dahi Pouch',
    brand: 'Nandini (KMF)',
    category: 'dairy',
    unit: '500 g Pouch',
    price: 28,
    stockQuantity: 32,
    lowStockThreshold: 8,
    isActive: true,
    description: 'Thick, creamy set curd with pleasant mild sourness, ideal for curd rice and raita.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-605',
    shopId: 'shop-6',
    name: 'Amul Salted Table Butter',
    brand: 'Amul',
    category: 'dairy',
    unit: '100 g',
    price: 60,
    stockQuantity: 0, // OUT OF STOCK
    lowStockThreshold: 5,
    isActive: true,
    description: 'Utterly butterly delicious creamy pasteurized butter loved across Indian breakfast tables.',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',
    alternativeShops: [
      {
        shopId: 'shop-1',
        shopName: 'Shri Krishna Kirana & Provisions',
        locality: 'Indiranagar 12th Main',
        price: 60,
        unit: '100 g',
        stockQuantity: 14,
        distance: '0.8 km away'
      },
      {
        shopId: 'shop-4',
        shopName: 'Annapurna Daily Supermarket',
        locality: 'Jayanagar 4th Block',
        price: 58,
        unit: '100 g',
        stockQuantity: 20,
        distance: '3.9 km away'
      }
    ]
  },

  // Shop 5: Kaveri Organic Mart (HSR Layout)
  {
    id: 'prod-501',
    shopId: 'shop-5',
    name: 'Unpolished Foxtail Millet (Navane)',
    brand: 'Kaveri Organic',
    category: 'groceries',
    unit: '1 kg',
    price: 130,
    stockQuantity: 16,
    lowStockThreshold: 4,
    isActive: true,
    description: 'Nutritious ancient grain with low glycemic index, rich in dietary fiber and essential minerals.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-502',
    shopId: 'shop-5',
    name: 'Wood Pressed Cold Pressed Groundnut Oil',
    brand: 'Kaveri Organic',
    category: 'groceries',
    unit: '1 L Bottle',
    price: 290,
    stockQuantity: 9,
    lowStockThreshold: 3,
    isActive: true,
    description: 'Extracted using traditional wooden chekku machine without heat treatment to preserve natural nutrients.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-503',
    shopId: 'shop-5',
    name: 'Organic Chemical-Free Jaggery Cubes (Bella)',
    brand: 'Kaveri Organic',
    category: 'groceries',
    unit: '1 kg',
    price: 95,
    stockQuantity: 21,
    lowStockThreshold: 5,
    isActive: true,
    description: 'Natural unrefined sugarcane jaggery with mineral-rich dark amber color and authentic sweetness.',
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=600&auto=format&fit=crop&q=80'
  }
];
