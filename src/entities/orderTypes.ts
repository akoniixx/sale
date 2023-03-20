export interface OrderDetailType {
  cancelRemark: string;
  cashDiscount: number;
  coDiscount: number;
  company: string;
  createDate: string;
  customerCompanyId: number;
  customerName: string;
  customerNo: string;
  discount: number;
  navNo: string;
  orderId: string;
  orderNo: string;
  status: string;
  orderProducts: [
    {
      baseUom: string;
      commonName: string;
      marketPrice: number;
      orderId: string;
      orderProductId: string;
      packSize: string;
      packingUom: string;
      productCodeNav: string;
      productId: number;
      productName: string;
      qtySaleUnit: number;
      quantity: number;
      saleUom: string;
      saleUomTh: string;
      shipmentOrder: number;
      totalPrice: number;
      isFreebie: boolean;
    },
  ];
  paymentMethod: string;
  price: number;
  saleCoRemark: string;
  sellerName: string;
  shopName: string;
  soNo: string;
  specialDiscount: number;
  specialRequestRemark: string;
  totalDiscount: number;
  totalPrice: number;
  updateBy: string;
  updateDate: string;
  userStaffId: string;
}
