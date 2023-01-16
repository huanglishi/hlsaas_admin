import { defHttp } from '/@/utils/http/axios';
import { UploadApiResult } from '../model/uploadModel';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';

enum Api {
  Getwxinfo = '/develop/allconfig/getwxinfo',
  SaveWx = '/develop/allconfig/saveWx',
  UploadFile = '/develop/allconfig/uploadFile',
  GetPay = '/develop/allconfig/getPay',
  SavePay = '/develop/allconfig/savePay',

  ParentList = '/develop/allconfig/ParentList',
  SaveMenu = '/develop/allconfig/saveMenu',
  DelMenu = '/develop/allconfig/delMenu',
  UpMenuLock = '/develop/allconfig/upMenuLock',
}


/**获取微信公众号信息 */
export const getwxinfo = (params) => {
  return defHttp.get({ url: Api.Getwxinfo, params:params}, { errorMessageMode: 'none'});
};
//保存微信信息
export const saveWx = (params) =>
defHttp.post({ url: Api.SaveWx, params:params}, { errorMessageMode: 'message' });
//获取支付信息
export const getPay = (params) => {
  return defHttp.get({ url: Api.GetPay, params:params}, { errorMessageMode: 'none'});
};
//保存支付信息
export const savePay = (params) =>
defHttp.post({ url: Api.SavePay, params:params}, { errorMessageMode: 'message' });
//上传附件
const globSetting = useGlobSetting();
export function uploadFile(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
    return defHttp.uploadFile<UploadApiResult>({url:globSetting.fileuploadUrl+Api.UploadFile,onUploadProgress}, params); 
 }


//2.1选择父级数据
export const getParentList = (params) => defHttp.get({ url: Api.ParentList, params });
//2.2添加
export const saveMenu = (params) =>
defHttp.post({ url: Api.SaveMenu, params:params}, { errorMessageMode: 'message' });
//2.3删除
export const delMenu = (ids: any) =>
defHttp.delete({ url: Api.DelMenu, params:{ids:ids}}, { errorMessageMode: 'message' });
//2.3更新状态
export const upMenuLock = (ids?: any,status?:number) =>
defHttp.post({ url: Api.UpMenuLock, params:{ids:ids,status:status==1?0:1}});