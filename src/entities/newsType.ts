interface NewsInterface {
    newsId: string;
    company: string;
    topic: string;
    image: string;
    content: string;
    isShowOnSaleApp: boolean;
    isShowOnShopApp: boolean;
    type: 'NEWS'|'INFO';
    publishTime: string ;
    status: string;
    isDelete: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    viewSaleApp: number;
    viewShopApp: number;
    imageUrl: string;
  }
  interface Pined {
    company: string;
    createdAt: string;
    createdBy: string;
    imageUrl: string;
    isDelete: boolean;
    newsId: string;
    order: number;
    page: 'MAIN_PAGE'|'NEWS_PAGE';
    pinedNewsId: string;
    topic: string;
    updatedAt: string;
    updatedBy: string;
   
  }
  interface NewsDetail {
   
      newsId: string;
      company: string;
      topic: string;
      image: string;
      content: string;
      isShowOnSaleApp: boolean;
      isShowOnShopApp: boolean;
      type: string;
      publishTime: string | null;
      status: string;
      isDelete: boolean;
      createdAt: string;
      updatedAt: string;
      createdBy: string;
      updatedBy: string;
      viewSaleApp: number;
      viewShopApp: number;
      imageUrl: string;
      contentFile: string;
    
  }  