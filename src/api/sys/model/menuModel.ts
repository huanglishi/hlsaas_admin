import type { RouteMeta } from 'vue-router';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}
//菜单请求参数
export type MenuParams = {
  menuName?: string;
  status?: string;
};
//返回数据
export interface RebackData {
  code: number;
  message: string;
  result: null;
  exdata: null;
  time: string;
}
/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];
