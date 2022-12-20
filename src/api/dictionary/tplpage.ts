import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetList = '/dictionary/tplpage/getList',
  Save_url = '/dictionary/tplpage/save',
  Del_url = '/dictionary/tplpage/del',
  UpLock = '/dictionary/tplpage/upLock',
}

/**1.获取数据列表 */
export const getList = (params?: any) => {
  return defHttp.get({ url: Api.GetList , params:params});
};
//3添加
export const saveData = (params?: object) =>
defHttp.post({ url: Api.Save_url, params:params}, { errorMessageMode: 'showmsg' });
//4删除
export const delData = (ids: any) =>
defHttp.delete({ url: Api.Del_url, params:{ids:ids}}, { errorMessageMode: 'showmsg' });
//5更新状态
export const upLock = (ids?: any,status?:number) =>
defHttp.post({ url: Api.UpLock, params:{ids:ids,status:status==1?0:1}});