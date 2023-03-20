import { request } from '../../config/request';

const postUserProfile = async (data: any) => {
  return await request
    .post('/auth/user-staff/update-profile', data)
    .then(res => res.data);
};
const updateProfileNotification = async (payload: {
  notiStatus: boolean;
  userStaffId: string;
}) => {
  return await request
    .patch(
      `/auth/user-staff?userStaffId=${payload.userStaffId}&notiStatus=${payload.notiStatus}`,
    )
    .then(res => res.data);
};
const getUserProfile = async (userStaffId: string) => {
  return await request
    .get(`/auth/user-staff/${userStaffId}`)
    .then(res => res.data);
};

export const userServices = {
  postUserProfile,
  updateProfileNotification,
  getUserProfile,
};
