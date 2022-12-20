import {
  getParams,
  }  from './model/baseModel';
  
  import { defHttp } from '/@/utils/http/axios';
  
  enum Api {
    AccountList = '/equipment.signreceiving/index',
  }
  export const getlist = (params: getParams) =>
    defHttp.get({ url: Api.AccountList, params}, { errorMessageMode: 'none'});
  
  