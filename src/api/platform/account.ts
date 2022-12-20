import { defHttp } from '/@/utils/http/axios';
import { ParentParams,RebackData }  from '/@/api/model/commonModel';

enum Api {
  GetList = '/platform/account/getList',
  GetGroupList = '/platform/account/getGroupList',
  Save_url = '/platform/account/save',
  Del_url = '/platform/account/del',
  UpLock = '/platform/account/upLock',
  //获取全账号
  IsAccountExist = '/platform/account/isAccountExist',
  GetAccount = '/platform/account/getAccount',
  GetLoginLogList = '/platform/account/getLoginLogList',
  //获取菜单
  GetMenuList= '/platform/account/getMenuList',
  SaveSetting= '/platform/account/saveSetting',
}


/**1.获取数据列表 */
export const getList = (params?: any) => {
  return defHttp.get({ url: Api.GetList , params:params});
};
//2选择父级数据
export const getGroupList = (params?: ParentParams) => defHttp.get({ url: Api.GetGroupList, params });
//3添加
export const saveData = (params?: object) =>
defHttp.post({ url: Api.Save_url, params:params}, { successMessageMode: 'message',errorMessageMode : 'message' });
//4删除
export const delData = (ids: any) =>
defHttp.delete<RebackData>({ url: Api.Del_url, params:{ids:ids}}, { successMessageMode: 'message' });
//5更新状态
export const upLock = (ids?: any,status?:number) =>
defHttp.post({ url: Api.UpLock, params:{ids:ids,status:status}});
//账号
export type RoleParams = {
  roleName?: string;
  status?: string;
};
export interface RoleListItem {
  id: string;
  roleName: string;
  roleValue: string;
}
export type RoleListGetResultModel = RoleListItem[];

//检查账号是否存在
export const isAccountExist = (account: string,id: any) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account,id } }, { errorMessageMode: 'none' });
//获取账号信息
export const getAccount = (id?:any) =>
  defHttp.get({ url: Api.GetAccount,params:{id:id}}, { errorMessageMode: 'none'});
//获取登录操作日志
export const getLoginLogList = (params?: any) =>
  defHttp.get({ url: Api.GetLoginLogList,params:params}, { errorMessageMode: 'message'});


//获取菜单
export const getMenuList = (id?:any) =>
defHttp.get({ url: Api.GetMenuList,params:{id:id}}, { errorMessageMode: 'none'});   

//保存设置
export const saveSetting = (params?: object) =>
  defHttp.post({ url: Api.SaveSetting, params:params }, { errorMessageMode: 'message' });
