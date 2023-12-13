import { request } from "../../config/request";

const getNewsList = async (company: string, page: number,take: number,sortingType:'MOST_READ'|'NEWEST',type:string) => {
    return await request
      .get(
        `/news/news?company=${company}&status=PUBLISHED&application=SALE&page=${page}&take=${take}&sortingType=${sortingType}&sortingDirection=DESC&type=${type}`,
      )
      .then(res => res.data.responseData.data)
      .catch(err => console.log(err));
  };

  const getPined = async (company: string, ) => {
    return await request
      .get(
        `/news/pined?company=${company}`
      )
      .then(res => res.data.responseData)
      .catch(err => console.log(err));
  };

  const getNews = async (company: string, newsId:string) => {
    return await request
      .get(
        `/news/news/get?company=${company}&newsId=${newsId}`,
      )
      .then(res => res.data.responseData)
      .catch(err => console.log(err));
  };
  const postView = async (newsId:string,viewedBy:string) => {
    const payload = {
      newsId:newsId,
      viewedBy:viewedBy,
      app:'SALE'
    }
    return await request
      .post(`/news/news/view`, payload)
      .then(res => res.data)
      .catch(err => console.log(JSON.stringify(err.response.data, null, 2)));
  };

  export const NewsService = {
    getNewsList,
    getPined,
    getNews,
    postView
  }