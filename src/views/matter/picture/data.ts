import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { upLock} from  '/@/api/matter/picture';
import { useMessage } from '/@/hooks/web/useMessage';
export const columns: BasicColumn[] = [
  {
    title: '图片',
    dataIndex: 'url',
    width: 120,
  },
  {
    title: '名称',
    dataIndex: 'title',
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: ({ record }) => {
      return record.type==1?"插图":"素材图"
    },
  },
  {
    title: '分类',
    dataIndex: 'catename',
  },
  {
    title: '大小',
    dataIndex: 'filesize',
    customRender: ({ record }) => {
      return prettyPrintSize(record.filesize)
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      return h(Switch, {
        checked: record.status== 0,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        onChange(checked: boolean) {
          const { createMessage } = useMessage();
          upLock({ids:[record.id],status:checked?0:1})
            .then(() => {
              record.status = checked?0:1;
              createMessage.success({ content: checked?`已启用成功`:`已禁用成功`, key:"upLock", duration: 2 });
            })
            .catch(() => {
              createMessage.error('修改失败');
            })
        },
      });
    },
  },
  {
    title: '上传时间',
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
];
function clamp(v, min, max) {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

const suffix = ['B', 'KB', 'MB', 'GB', 'TB'];
function prettyPrintSize(size) {
  const base = Math.floor(Math.log2(size) / 10);
  const index = clamp(base, 0, 4);
  return (size / 2 ** (10 * index)).toFixed(2) + suffix[index];
}
export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '禁用', value: '1' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: 2 },
        { label: '素材图', value: 0 },
        { label: '插图', value: 1 },
      ],
    },
    colProps: { span: 6 },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'type',
    component: 'RadioGroup',
    label: '图片类型',
    required: true,
    componentProps: {
      options: [
        {
          label: '素材图',
          value: 0,
        },
        {
          label: '插图',
          value: 1,
        },
      ],
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'cid',
    label: '分组',
    slot: 'cid',
    component: 'Input',
    required: true,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'url',
    label: '附件',
    slot: 'url',
    component: 'Input',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'title',
    label: '图片名称',
    component: 'Input',
    required: true,
    colProps: {
      span: 15,
    },
  }
];