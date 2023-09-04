import { request } from "../../config/request";
  const getNotilist = async(
    page: number,
    take: number,
    sortDirection: 'ASC' | 'DESC',
    userStaffId:string,
    search?: string,
   
  ) => {

    return await request
    .get(`/fcm/notification?page=${page}&take=${take}&sortDirection=${sortDirection}&userStaffid=${userStaffId}`)
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
  }
  
  
  export const notiListServices = {
    getNotilist,
   
  };