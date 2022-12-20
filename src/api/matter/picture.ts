import { defHttp } from '/@/utils/http/axios';
import { UploadApiResult } from '../model/uploadModel';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';
enum Api {
  GetList = '/matter/picture/getList',
  Save_url = '/matter/picture/save',
  Del_url = '/matter/picture/del',
  UpLock = '/matter/picture/upLock',
  GetCateTree = '/matter/picture/getCateTree',
  UploadFile = '/matter/picture/uploadFile',
}
const globSetting = useGlobSetting();
/**1.获取数据列表 */
export const getList = (params?: any) => {
  return defHttp.get({ url: Api.GetList , params:params});
};
export const getCateTree = (params?: any) => {
  return defHttp.get({ url: Api.GetCateTree , params:params});
};
//3添加
export const saveData = (params?: object) =>
defHttp.post({ url: Api.Save_url, params:params}, { errorMessageMode: 'message' });

//上传
export function uploadFile(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
  return defHttp.uploadFile<UploadApiResult>({url:globSetting.fileuploadUrl+Api.UploadFile,onUploadProgress}, params); 
}

//4删除
export const delData = (ids: any) =>
defHttp.delete({ url: Api.Del_url, params:{ids:ids}}, { errorMessageMode: 'message' });
//5更新状态
export const upLock = (params?: object) =>
defHttp.post({ url: Api.UpLock, params:params});