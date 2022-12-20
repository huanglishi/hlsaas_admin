import { defHttp } from '/@/utils/http/axios';
import { ParentParams,RebackData }  from '/@/api/model/commonModel';

enum Api {
  GetList = '/platform/group/getList',
  ParentList = '/platform/group/getParentList',
  Save_url = '/platform/group/save',
  Del_url = '/platform/group/del',
  UpLock = '/platform/group/upLock',
}


/**1.获取数据列表 */
export const getList = () => {
  return defHttp.get({ url: Api.GetList });
};
//2选择父级数据
export const getParentList = (params?: ParentParams) => defHttp.get({ url: Api.ParentList, params });
//3添加
export const saveData = (params?: object) =>
defHttp.post({ url: Api.Save_url, params:params}, { errorMessageMode: 'showmsg' });
//4删除
export const delData = (ids: any) =>
defHttp.delete<RebackData>({ url: Api.Del_url, params:{ids:ids}}, { errorMessageMode: 'showmsg' });
//5更新状态
export const upLock = (ids?: any,status?:number) =>
defHttp.post({ url: Api.UpLock, params:{ids:ids,status:status==1?0:1}});