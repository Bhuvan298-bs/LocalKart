export const MOCK_ORDERS = [
  {
    id: 'ord-801',
    orderNumber: 'LK-2026-801',
    customerId: 'user-cust-1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98450 12345',
    shopId: 'shop-1',
    shopName: 'Shri Krishna Kirana & Provisions',
    shopLocality: 'Indiranagar 12th Main',
    fulfillmentType: 'DELIVERY',
    deliveryAddress: 'Flat 302, Green Glen Apartments, 12th Main, Indiranagar, Bengaluru - 560038',
    landmark: 'Opposite Coffee Day',
    status: 'PLACED',
    items: [
      { productId: 'prod-101', name: 'Aashirvaad Superior Sharbati Shudh Atta', brand: 'Aashirvaad', unit: '5 kg', unitPrice: 295, quantity: 1, totalPrice: 295 },
      { productId: 'prod-102', name: 'Tata Salt Vaccum Evaporated Iodized Salt', brand: 'Tata', unit: '1 kg', unitPrice: 28, quantity: 2, totalPrice: 56 }
    ],
    itemSubtotal: 351,
    deliveryFee: 25,
    totalAmount: 376,
    paymentMethod: 'Cash / UPI on Delivery',
    placedAt: '2026-10-25T08:15:00.000Z',
    statusHistory: [
      { status: 'PLACED', timestamp: '2026-10-25T08:15:00.000Z', note: 'Order received by store' }
    ]
  },
  {
    id: 'ord-802',
    orderNumber: 'LK-2026-802',
    customerId: 'user-cust-1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98450 12345',
    shopId: 'shop-1',
    shopName: 'Shri Krishna Kirana & Provisions',
    shopLocality: 'Indiranagar 12th Main',
    fulfillmentType: 'DELIVERY',
    deliveryAddress: 'Flat 302, Green Glen Apartments, 12th Main, Indiranagar, Bengaluru - 560038',
    landmark: 'Opposite Coffee Day',
    status: 'ACCEPTED',
    items: [
      { productId: 'prod-105', name: 'Haldiram\'s Bhujia Sev Special', brand: 'Haldiram\'s', unit: '400 g', unitPrice: 110, quantity: 2, totalPrice: 220 },
      { productId: 'prod-108', name: 'Taj Mahal Fine Tea Leaves', brand: 'Brooke Bond Taj Mahal', unit: '500 g', unitPrice: 340, quantity: 1, totalPrice: 340 }
    ],
    itemSubtotal: 560,
    deliveryFee: 25,
    totalAmount: 585,
    paymentMethod: 'Cash / UPI on Delivery',
    placedAt: '2026-10-25T07:45:00.000Z',
    statusHistory: [
      { status: 'PLACED', timestamp: '2026-10-25T07:45:00.000Z', note: 'Order received' },
      { status: 'ACCEPTED', timestamp: '2026-10-25T07:50:00.000Z', note: 'Store accepted order' }
    ]
  },
  {
    id: 'ord-803',
    orderNumber: 'LK-2026-803',
    customerId: 'user-cust-1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98450 12345',
    shopId: 'shop-2',
    shopName: 'Lakshmi Fresh Farm Produce',
    shopLocality: 'Koramangala 4th Block',
    fulfillmentType: 'DELIVERY',
    deliveryAddress: 'Flat 302, Green Glen Apartments, 12th Main, Indiranagar, Bengaluru - 560038',
    landmark: 'Opposite Coffee Day',
    status: 'PREPARING',
    items: [
      { productId: 'prod-201', name: 'Fresh Country Red Tomatoes (Nati Tomato)', brand: 'Farm Fresh', unit: '1 kg', unitPrice: 42, quantity: 2, totalPrice: 84 },
      { productId: 'prod-202', name: 'Crisp Green Lady Finger / Bhindi / Okra', brand: 'Farm Fresh', unit: '500 g', unitPrice: 32, quantity: 1, totalPrice: 32 },
      { productId: 'prod-204', name: 'Yellaki Bananas (Chitrali)', brand: 'Farm Fresh', unit: '1 kg (approx 10 pcs)', unitPrice: 75, quantity: 1, totalPrice: 75 }
    ],
    itemSubtotal: 191,
    deliveryFee: 20,
    totalAmount: 211,
    paymentMethod: 'Cash / UPI on Delivery',
    placedAt: '2026-10-25T07:10:00.000Z',
    statusHistory: [
      { status: 'PLACED', timestamp: '2026-10-25T07:10:00.000Z', note: 'Order received' },
      { status: 'ACCEPTED', timestamp: '2026-10-25T07:12:00.000Z', note: 'Store confirmed fresh harvest items' },
      { status: 'PREPARING', timestamp: '2026-10-25T07:20:00.000Z', note: 'Weighing and packing fresh greens' }
    ]
  },
  {
    id: 'ord-804',
    orderNumber: 'LK-2026-804',
    customerId: 'user-cust-1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98450 12345',
    shopId: 'shop-3',
    shopName: 'Iyengar Bakery & Sweets',
    shopLocality: 'Malleshwaram 8th Cross',
    fulfillmentType: 'PICKUP',
    deliveryAddress: 'Store Pickup Counter, Malleshwaram 8th Cross',
    status: 'READY_FOR_PICKUP',
    items: [
      { productId: 'prod-301', name: 'Classic Potato Masala Puff (Veg Puff)', brand: 'Iyengar Special', unit: '2 Pieces', unitPrice: 45, quantity: 2, totalPrice: 90 },
      { productId: 'prod-302', name: 'Traditional Butter Sponge Cake (Eggless)', brand: 'Iyengar Special', unit: '300 g Loaf', unitPrice: 90, quantity: 1, totalPrice: 90 }
    ],
    itemSubtotal: 180,
    deliveryFee: 0,
    totalAmount: 180,
    paymentMethod: 'Pay at Store Counter',
    placedAt: '2026-10-25T06:30:00.000Z',
    statusHistory: [
      { status: 'PLACED', timestamp: '2026-10-25T06:30:00.000Z', note: 'Order placed for store pickup' },
      { status: 'ACCEPTED', timestamp: '2026-10-25T06:35:00.000Z', note: 'Bakery accepted' },
      { status: 'PREPARING', timestamp: '2026-10-25T06:40:00.000Z', note: 'Freshly baked and boxed' },
      { status: 'READY_FOR_PICKUP', timestamp: '2026-10-25T06:55:00.000Z', note: 'Waiting at pickup counter' }
    ]
  },
  {
    id: 'ord-805',
    orderNumber: 'LK-2026-805',
    customerId: 'user-cust-1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98450 12345',
    shopId: 'shop-6',
    shopName: 'Balaji Dairy & Morning Needs',
    shopLocality: 'Indiranagar Defence Colony',
    fulfillmentType: 'DELIVERY',
    deliveryAddress: 'Flat 302, Green Glen Apartments, 12th Main, Indiranagar, Bengaluru - 560038',
    landmark: 'Opposite Coffee Day',
    assignedDeliveryPerson: 'Manjunath Gowda',
    deliveryPersonPhone: '+91 97420 11992',
    status: 'OUT_FOR_DELIVERY',
    items: [
      { productId: 'prod-601', name: 'Nandini Toned Fresh Pasteurized Milk', brand: 'Nandini (KMF)', unit: '1 L (2 x 500ml)', unitPrice: 44, quantity: 2, totalPrice: 88 },
      { productId: 'prod-602', name: 'Amul Fresh Malai Paneer Block', brand: 'Amul', unit: '200 g Block', unitPrice: 95, quantity: 1, totalPrice: 95 },
      { productId: 'prod-603', name: 'Farm Fresh White Eggs (Graded)', brand: 'Poultry Fresh', unit: 'Crate of 6 Eggs', unitPrice: 48, quantity: 1, totalPrice: 48 }
    ],
    itemSubtotal: 231,
    deliveryFee: 15,
    totalAmount: 246,
    paymentMethod: 'Cash / UPI on Delivery',
    placedAt: '2026-10-25T06:15:00.000Z',
    statusHistory: [
      { status: 'PLACED', timestamp: '2026-10-25T06:15:00.000Z', note: 'Order received' },
      { status: 'ACCEPTED', timestamp: '2026-10-25T06:18:00.000Z', note: 'Dairy confirmed stock' },
      { status: 'PREPARING', timestamp: '2026-10-25T06:22:00.000Z', note: 'Chilled items packed in insulation' },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-10-25T06:40:00.000Z', note: 'Partner Manjunath picked up package' }
    ]
  },
  {
    id: 'ord-806',
    orderNumber: 'LK-2026-806',
    customerId: 'user-cust-1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98450 12345',
    shopId: 'shop-4',
    shopName: 'Annapurna Daily Supermarket',
    shopLocality: 'Jayanagar 4th Block',
    fulfillmentType: 'DELIVERY',
    deliveryAddress: 'Flat 302, Green Glen Apartments, 12th Main, Indiranagar, Bengaluru - 560038',
    landmark: 'Opposite Coffee Day',
    assignedDeliveryPerson: 'Rahul Verma',
    status: 'DELIVERED',
    items: [
      { productId: 'prod-401', name: 'India Gate Basmati Rice Feast Rozzana', brand: 'India Gate', unit: '5 kg', unitPrice: 460, quantity: 1, totalPrice: 460 },
      { productId: 'prod-403', name: 'Vim Dishwash Gel Lemon Fragrance', brand: 'Vim', unit: '750 ml Bottle', unitPrice: 180, quantity: 1, totalPrice: 180 }
    ],
    itemSubtotal: 640,
    deliveryFee: 25,
    totalAmount: 665,
    paymentMethod: 'Cash / UPI on Delivery',
    placedAt: '2026-10-24T14:20:00.000Z',
    deliveredAt: '2026-10-24T15:15:00.000Z',
    statusHistory: [
      { status: 'PLACED', timestamp: '2026-10-24T14:20:00.000Z', note: 'Order received' },
      { status: 'ACCEPTED', timestamp: '2026-10-24T14:23:00.000Z', note: 'Store accepted' },
      { status: 'PREPARING', timestamp: '2026-10-24T14:30:00.000Z', note: 'Order packed' },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-10-24T14:50:00.000Z', note: 'Out for delivery' },
      { status: 'DELIVERED', timestamp: '2026-10-24T15:15:00.000Z', note: 'Handed over at doorstep' }
    ]
  },
  {
    id: 'ord-807',
    orderNumber: 'LK-2026-807',
    customerId: 'user-cust-1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98450 12345',
    shopId: 'shop-1',
    shopName: 'Shri Krishna Kirana & Provisions',
    shopLocality: 'Indiranagar 12th Main',
    fulfillmentType: 'DELIVERY',
    deliveryAddress: 'Flat 302, Green Glen Apartments, 12th Main, Indiranagar, Bengaluru - 560038',
    landmark: 'Opposite Coffee Day',
    status: 'REJECTED',
    items: [
      { productId: 'prod-104', name: 'Toor Dal / Arhar Dal Unpolished', brand: 'Local Premium', unit: '1 kg', unitPrice: 165, quantity: 2, totalPrice: 330 }
    ],
    itemSubtotal: 330,
    deliveryFee: 25,
    totalAmount: 355,
    paymentMethod: 'Cash / UPI on Delivery',
    placedAt: '2026-10-23T11:00:00.000Z',
    statusHistory: [
      { status: 'PLACED', timestamp: '2026-10-23T11:00:00.000Z', note: 'Order received' },
      { status: 'REJECTED', timestamp: '2026-10-23T11:15:00.000Z', note: 'Store was out of unpolished dal' }
    ]
  },
  {
    id: 'ord-808',
    orderNumber: 'LK-2026-808',
    customerId: 'user-cust-1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98450 12345',
    shopId: 'shop-3',
    shopName: 'Iyengar Bakery & Sweets',
    shopLocality: 'Malleshwaram 8th Cross',
    fulfillmentType: 'PICKUP',
    deliveryAddress: 'Store Pickup Counter, Malleshwaram 8th Cross',
    status: 'CANCELLED',
    items: [
      { productId: 'prod-304', name: 'Fresh Soft Milk Pav Buns', brand: 'Iyengar Special', unit: 'Pack of 6', unitPrice: 35, quantity: 3, totalPrice: 105 }
    ],
    itemSubtotal: 105,
    deliveryFee: 0,
    totalAmount: 105,
    paymentMethod: 'Pay at Store Counter',
    placedAt: '2026-10-22T09:00:00.000Z',
    statusHistory: [
      { status: 'PLACED', timestamp: '2026-10-22T09:00:00.000Z', note: 'Order placed' },
      { status: 'CANCELLED', timestamp: '2026-10-22T09:10:00.000Z', note: 'Cancelled by customer' }
    ]
  }
];
