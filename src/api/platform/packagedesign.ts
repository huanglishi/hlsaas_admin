import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetList = '/platform/packagedesign/getList',
  SaveData = '/platform/packagedesign/saveData',
  DelData = '/platform/packagedesign/delData',
  UseList = '/platform/packagedesign/useList',
}


/**1.获取数据列表 */
export const getList = () => {
  return defHttp.get({ url: Api.GetList });
};
//2添加
export const saveData = (params?: object) =>
defHttp.post({ url: Api.SaveData, params:params}, { errorMessageMode: 'message' });

//3删除
export const delData = (ids: any) =>
defHttp.delete({ url: Api.DelData, params:{ids:ids}}, { errorMessageMode: 'message' });
//4获取使用列表
export const useList = (params?: object) => {
  return defHttp.get({ url: Api.UseList, params:params });
};