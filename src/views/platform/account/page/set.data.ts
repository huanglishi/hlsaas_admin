import { FormSchema } from '/@/components/Table';

export const formSchema: FormSchema[] = [
  {
    field: 'sub_account',
    label: '子账号数',
    helpMessage: ['允许创建子账号个数'],
    component: 'Input',
    componentProps: {
      placeholder: '不填或0时表示不限子账号个数',
      type:"number"
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
  },
  {
    label: '选择套餐',
    field: 'packagedata',
    slot: 'packagedata',
    component: 'Input',
  },
];