/**
 * 轻站审批
 */
import { defHttp } from '/@/utils/http/axios';
enum Api {
  GetList = '/platform/webtpldel/getList',
  RestoreTpl = '/platform/webtpldel/restoreTpl',
}


/**1.获取数据列表 */
export const getList = (params) => {
  return defHttp.get({ url: Api.GetList, params:params });
};
//2 恢复
export const restoreTpl = (params?: object) =>
defHttp.post({ url: Api.RestoreTpl, params:params}, { errorMessageMode: 'message' });
