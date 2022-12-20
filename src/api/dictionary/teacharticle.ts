/**
 * 教程引导文章
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetList = '/dictionary/teacharticle/getList',
    GetArticle = '/dictionary/teacharticle/getArticle',
    SaveData = '/dictionary/teacharticle/saveArticle',
    Del = '/dictionary/teacharticle/del',
    UpLock = '/dictionary/teacharticle/upLock',
 }
 
 
//1.获取列表
export const getList = (params) => {
return defHttp.get({ url: Api.GetList,params:params });
};
//详情页数据
export const getArticle = (params) => {
return defHttp.get({ url: Api.GetArticle,params:params });
};
//2.保存
export const saveData = (params?: object) =>
defHttp.post({ url: Api.SaveData, params:params}, { errorMessageMode: 'message' });
 
//3.删除
export const del = (params?: object) =>
defHttp.delete({ url: Api.Del, params:params}, { errorMessageMode: 'message' });

//4.更新状态
export const upLock = (params: object) =>
defHttp.post({ url: Api.UpLock, params:params}, { errorMessageMode: 'message' });