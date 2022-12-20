/**
 * 续费缴费
 */
 import { defHttp } from '/@/utils/http/axios';
 enum Api {
   GetList = '/platform/repayment/getList',
   DoResult = '/platform/repayment/doResult',
 }
 
 
 /**1.获取数据列表 */
 export const getList = (params) => {
   return defHttp.get({ url: Api.GetList, params:params });
 };
 //2处理结果
 export const doResult = (params?: object) =>
 defHttp.post({ url: Api.DoResult, params:params}, { errorMessageMode: 'showmsg' });
 