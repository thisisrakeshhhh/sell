export interface StoreDTO {
  id: string;
  name: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  phone: string;
  whatsappNumber: string;
  upiId: string;
  address: string | null;
  instagramUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OperationalMetricsDTO {
  todaysOrders: number;
  pendingCalls: number;
  pendingPayments: number;
  readyToShip: number;
  deliveredThisMonth: number;
  lowStockAlerts: Array<{
    productCode: string;
    productName: string;
    variantName: string;
    size: string;
    availableStock: number;
  }>;
}
