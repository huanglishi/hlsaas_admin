import { FormSchema } from '/@/components/Table';
export const schemas: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: '套餐名称',
    required: true,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'image',
    component: 'Upload',
    label: '封面图',
    colProps: {
      span: 24,
    },
    slot: 'Upload',
  },
  {
    field: 'status',
    component: 'Input',
    label: '状态',
    slot: 'dataSwitch',
    colProps: {
      span: 6,
    },
  },
  {
    field: 'masterckeck',
    component: 'Input',
    label: '包类型',
    slot: 'masterckeckSwitch',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'funkey',
    component: 'Input',
    label: '功能标识',
    slot: 'funKey',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'type',
    component: 'Input',
    label: '使用类型',
    slot: 'typeRadio',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'price',
    component: 'Input',
    label: '单价',
    colProps: {
      span: 8,
    },
    show: ({ values }) => {
      return values.type=="2";
    },
  },
  {
    field: 'count',
    component: 'Input',
    label: '-单价数量',
    colProps: {
      span: 8,
    },
    show: ({ values }) => {
      return values.type=="2";
    },
  },
  {
    field: 'paylist',
    component: 'Input',
    label: '支付预设包',
    defaultValue:[],
    slot: 'paylistbox',
    colProps: {
      span: 24,
    },
    show: ({ values }) => {
      return values.type=="2";
    },
  },
  {
    label: '套餐权限',
    field: 'menu',
    slot: 'menu',
    component: 'Input',
    colProps: {
      span: 24,
    },
  },
];