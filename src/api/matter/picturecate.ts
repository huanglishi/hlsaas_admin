import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetList = '/matter/picturecate/getList',
  Save_url = '/matter/picturecate/save',
  Del_url = '/matter/picturecate/del',
  UpLock = '/matter/picturecate/upLock',
}

/**1.获取数据列表 */
export const getList = (params?: any) => {
  return defHttp.get({ url: Api.GetList , params:params});
};
//3添加
export const saveData = (params?: object) =>
defHttp.post({ url: Api.Save_url, params:params}, { errorMessageMode: 'message' });
//4删除
export const delData = (ids: any) =>
defHttp.delete({ url: Api.Del_url, params:{ids:ids}}, { errorMessageMode: 'message' });
//5更新状态
export const upLock = (ids?: any,status?:number) =>
defHttp.post({ url: Api.UpLock, params:{ids:ids,status:status==1?0:1}});