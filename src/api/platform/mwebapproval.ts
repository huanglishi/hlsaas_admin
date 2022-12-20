/**
 * 轻站审批
 */
import { defHttp } from '/@/utils/http/axios';
enum Api {
  GetList = '/platform/mwebapproval/getList',
  ApprovalMweb = '/platform/mwebapproval/approvalMweb',
}


/**1.获取数据列表 */
export const getList = (params) => {
  return defHttp.get({ url: Api.GetList, params:params });
};
//2审批
export const approvalMweb = (params?: object) =>
defHttp.post({ url: Api.ApprovalMweb, params:params}, { errorMessageMode: 'showmsg' });
