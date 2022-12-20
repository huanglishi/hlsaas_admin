import { defHttp } from '/@/utils/http/axios';
import { MenuParams,RebackData } from './model/menuModel';

enum Api {
  menuList = '/platform/menu/getlist',
  ParentList = '/platform/menu/getParentList',
  SaveMenu = '/platform/menu/saveMenu',
  DelMenu = '/platform/menu/delMenu',
  UpMenuLock = '/platform/menu/upMenuLock',
}


/**2.系统管理 */
export const menuList = () => {//不设置返回数据类型
  return defHttp.get({ url: Api.menuList}, { errorMessageMode: 'none'});
};
//2.1选择父级数据
export const getParentList = (params?: MenuParams) => defHttp.get({ url: Api.ParentList, params });
//2.2添加
export const saveMenu = (params?: MenuParams) =>
defHttp.post({ url: Api.SaveMenu, params:params}, { errorMessageMode: 'showmsg' });
//2.3删除
export const delMenu = (ids: any) =>
defHttp.delete<RebackData>({ url: Api.DelMenu, params:{ids:ids}}, { errorMessageMode: 'showmsg' });
//2.3更新状态
export const upMenuLock = (ids?: any,status?:number) =>
defHttp.post({ url: Api.UpMenuLock, params:{ids:ids,status:status==1?0:1}});