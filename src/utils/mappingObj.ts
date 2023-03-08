import { colors } from '../assets/colors/colors';

export const statusHistory = {
  WAIT_APPROVE_ORDER: 'รออนุมัติคำสั่งซื้อ',
  REJECT_ORDER: 'ยกเลิกคำสั่งซื้อ',
  WAIT_CONFIRM_ORDER: 'รอยืนยันคำสั่งซื้อ',
  CONFIRM_ORDER: 'ร้านยืนยันคำสั่งซื้อแล้ว',
  SHOPAPP_CANCEL_ORDER: 'ร้านยกเลิกคำสั่งซื้อ',
  OPEN_ORDER: 'เปิดคำสั่งซื้อ',
  IN_DELIVERY: 'กำลังจัดส่ง',
  DELIVERY_SUCCESS: 'ลูกค้ารับสินค้าแล้ว',
  COMPANY_CANCEL_ORDER: 'ยกเลิกคำสั่งซื้อโดยบริษัท',
};
export const statusHistoryColor = {
  WAIT_APPROVE_ORDER: 'waiting',
  WAIT_CONFIRM_ORDER: 'warning',
  CONFIRM_ORDER: 'primary',
  SHOPAPP_CANCEL_ORDER: 'error',
  OPEN_ORDER: 'warning',
  IN_DELIVERY: 'warning',
  DELIVERY_SUCCESS: 'current',
  COMPANY_CANCEL_ORDER: 'error',
};
export const statusHistoryBGColor = {
  WAIT_APPROVE_ORDER: 'rgba(255, 136, 36, 0.16)',
  WAIT_CONFIRM_ORDER: 'rgba(244, 191, 0, 0.16)',
  CONFIRM_ORDER: 'rgba(76, 149, 255, 0.16)',
  SHOPAPP_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
  OPEN_ORDER: 'rgba(244, 191, 0, 0.16)',
  IN_DELIVERY: 'rgba(244, 191, 0, 0.16)',
  DELIVERY_SUCCESS: 'rgba(58, 174, 73, 0.16)',
  COMPANY_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
};