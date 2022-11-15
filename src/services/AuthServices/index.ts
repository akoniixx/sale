import { request } from '../../config/request';

const requestOtp = (tel: string) => {
  return request.post('/auth/auth/sale/request-login-otp', {
    telephoneNo: tel,
  });
};
const verifyOtp = ({
  telephoneNo,
  otpCode,
  refCode,
  token,
}: {
  telephoneNo: string;
  otpCode: string;
  refCode: string;
  token: string;
}) => {
  return request.post('/auth/auth/sale/verify-otp', {
    telephoneNo,
    otpCode,
    refCode,
    token,
  });
};

export const AuthServices = {
  requestOtp,
  verifyOtp,
};
