export type Notification = {
    notificationId: string;
    userStaffId: string;
    userShopId: string | null;
    customerCompanyId: number;
    type: string;
    isRead: boolean;
    detail: any;  // Could be more specific if we knew the possible structure/values
    data: any;  // Same as above for `detail`
    customerNo: string;
    customerName: string;
    orderId: string;
    orderNo: string;
    orderStatus: string;
    qtyItem: number;
    createdAt: string;
    updatedAt: string;
    product: Product[];
  };
  
  type Product = {
    productId: string;
    productImage: string;
  };
  
 export type NotificationList = {
    count: number;
    data: Notification[];
  };
  