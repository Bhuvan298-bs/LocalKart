export const MOCK_USERS = [
  {
    id: 'user-cust-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9845012345',
    role: 'CUSTOMER',
    address: 'Flat 302, Green Glen Apartments, 12th Main, Indiranagar',
    locality: 'Indiranagar',
    landmark: 'Opposite Coffee Day'
  },
  {
    id: 'user-seller-1',
    name: 'Ramesh Patel',
    email: 'ramesh.patel@shrikrishna.demo',
    phone: '9845122340',
    role: 'SELLER',
    shopId: 'shop-1',
    shopName: 'Shri Krishna Kirana & Provisions'
  },
  {
    id: 'user-admin-1',
    name: 'Vikramaditya Sen',
    email: 'admin@localkart.demo',
    phone: '9900011223',
    role: 'ADMIN',
    department: 'City Operations & Merchant Quality'
  }
];

export const MOCK_DELIVERY_PERSONNEL = [
  { id: 'del-1', name: 'Manjunath Gowda', phone: '+91 97420 11992', vehicle: 'EV Scooter (KA-03-EK-1294)', activeOrdersCount: 1 },
  { id: 'del-2', name: 'Rahul Verma', phone: '+91 98801 44321', vehicle: 'Motorcycle (KA-05-MN-8841)', activeOrdersCount: 2 },
  { id: 'del-3', name: 'Siddharth Rao', phone: '+91 99160 55883', vehicle: 'EV Scooter (KA-04-AB-3392)', activeOrdersCount: 0 }
];
