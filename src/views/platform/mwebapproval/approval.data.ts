import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {   h } from 'vue';
import { Tinymce } from '/@/components/Tinymce/index';
export const columns: BasicColumn[] = [
  {
    title: '微站名称',
    dataIndex: 'title',
    width: 200,
  },
  {
    title: '用户信息',
    dataIndex: 'userinfo',
  },
  {
    title: '预览',
    dataIndex: 'id',
    width: 90,
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
    title: '备注',
    dataIndex: 'des',
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
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '等待审批', value: 1 },
        { label: '审批通过', value: 2 },
        { label: '审批未过', value: 3 },
      ],
    },
    colProps: { span: 8 },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'status',
    label: '审批状态',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '等待审核', value:1 },
        { label: '审核通过(发布)', value: 2 },
        { label: '审核失败(未发布)', value: 3 },
      ],
    },
    required: true,
  },
  {
    field: 'approval_err',
    component: 'Input',
    label: '失败原因',
    colProps: {
      span: 24,
    },
    show: ({ values }) => {
      return values.status==3;
    },
    render: ({ model, field }) => {
      return h(Tinymce, {
        value: model[field],
        toolbar:"fontsizeselect fontselect lineheight bold italic alignleft aligncenter alignright outdent indent forecolor backcolor hr bullist numlist link",
        onChange: (value: string) => {
          model[field] = value;
        },
      });
    },
  },
];