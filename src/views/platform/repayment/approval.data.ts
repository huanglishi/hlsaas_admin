import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {   h } from 'vue';
import { Tinymce } from '/@/components/Tinymce/index';
export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'title',
    width: 200,
  },
  {
    title: '用户信息',
    dataIndex: 'userinfo',
  },
  {
    title: '订单编号',
    dataIndex: 'orderid',
  },
  {
    title: '价格',
    dataIndex: 'price',
  },
  {
    title: '数量',
    dataIndex: 'number',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: '提交时间',
    dataIndex: 'updatetime',
    width: 180,
    customRender: ({ record }) => {
      const timestamp = record.updatetime;
      if(!timestamp){
          return "---";
      }
      // 计算年月日时分的函数
      var date = new Date(timestamp*1000)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var H = date.getHours() +":" 
      var S= date.getMinutes()  
      return Y + M + D +H +S
    },
  },
  {
    title: '订单备注',
    dataIndex: 'des',
  },
  {
    title: '处理说明',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '等待审批', value: '1' },
        { label: '审批通过', value: '2' },
        { label: '审批未过', value: '3' },
      ],
    },
    colProps: { span: 8 },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'status',
    component: 'RadioGroup',
    label: '处理结果',
    componentProps: {
      options: [
        {
          label: '未支付',
          value: 0,
        },
        {
          label: '已支付',
          value: 1,
        },
      ],
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'remark',
    component: 'InputTextArea',
    label: '说明',
    colProps: {
      span: 24,
    },
  },
];