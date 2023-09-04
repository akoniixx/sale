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
const updateFcmToken = async (payload: {
  userStaffId: string;
  deviceToken: string;
  token: string;
}) => {
  return await request
    .post('/fcm/user-device', payload, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${payload.token}`,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log('err', err);
      throw err;
    });
};
const removeDeviceToken = async (token: string) => {
  return await request.delete(`/fcm/user-device/${token}`)
  .then(res=>{
    return res.data
  })
  .catch(err => {
    console.log('err',err)
    throw err;
  })
};

export const userServices = {
  postUserProfile,
  updateProfileNotification,
  getUserProfile,
  updateFcmToken,
  removeDeviceToken,
};
