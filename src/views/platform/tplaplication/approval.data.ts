import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {   h } from 'vue';
import { Tinymce } from '/@/components/Tinymce/index';
export const columns: BasicColumn[] = [
  {
    title: '标题',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      const status = record.status;
      if(status==0){
          return "未处理";
      }else if(status==1){
          return "已处理";
      }
    },
  },
  {
    title: '提交时间',
    dataIndex: 'createtime',
    width: 180,
    customRender: ({ record }) => {
      const timestamp = record.createtime;
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
    componentProps: {
      options: [
        { label: '未处理', value: '0' },
        { label: '已处理', value: '1' },
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
          label: '未处理',
          value: 0,
        },
        {
          label: '已处理',
          value: 1,
        },
      ],
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'tpl_id',
    label: '推荐模板',
    slot: 'tpl_id',
    component: 'Input',
  },
  {
    field: 'backcontent',
    component: 'Input',
    label: '处理说明',
    colProps: {
      span: 24,
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