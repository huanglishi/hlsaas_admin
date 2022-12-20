/**
 * 续费缴费
 */
 import { defHttp } from '/@/utils/http/axios';
 enum Api {
   GetList = '/platform/tplaplication/getList',
   GetDetail = '/platform/tplaplication/getDetail',
   DoResult = '/platform/tplaplication/doResult',
   GetTplList = '/platform/tplaplication/getTplList',
 }
 
 
 /**1.获取数据列表 */
 export const getList = (params) => {
   return defHttp.get({ url: Api.GetList, params:params });
 };
 /**2.获取详情*/
 export const getDetail = (params) => {
   return defHttp.get({ url: Api.GetDetail, params:params });
 };
 /**3.获取模板*/
 export const getTplList = (params) => {
   return defHttp.get({ url: Api.GetTplList, params:params });
 };
 //3处理结果
 export const doResult = (params?: object) =>
 defHttp.post({ url: Api.DoResult, params:params}, { errorMessageMode: 'message' });
 