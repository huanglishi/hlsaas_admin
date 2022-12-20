import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {   h } from 'vue';
import { Tinymce } from '/@/components/Tinymce/index';

export const columns: BasicColumn[] = [
  {
    title: '标题',
    dataIndex: 'title',
    align:"left"
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: ({ text }) => {
      if(text=="th"){
       return "微站教程"
      }else if(text=="agree"){
        return "协议"
       }
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
    colProps: { span: 8 },
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    required: true,
  },
  {
    field: 'des',
    label: '描述',
    component: 'InputTextArea',
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
    required: true,
  },
  {
    field: 'type',
    label: '类型',
    component: 'RadioGroup',
    defaultValue: "th",
    componentProps: {
      options: [
        { label: '微站教程', value: "th"},
        { label: '协议', value: "agree" },
      ],
    },
    required: true,
  },
  {
    field: 'content',
    component: 'Input',
    label: '内容',
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
