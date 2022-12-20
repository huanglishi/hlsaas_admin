<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增图片 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'url'">
          <a-image :height="90" :src="ReplaceUrl(record.url)"/>
        </template>
        <template v-if="column.key === 'action'"  >
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <!--编辑添加-->
    <AddModel @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  //Api
  import { getList,delData } from '/@/api/matter/picture';
  import { columns, searchFormSchema } from './data';
  import { Icon } from '/@/components/Icon';
  import { Popconfirm ,Tag,Image} from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import AddModel from './AddModel.vue';
  import { ReplaceUrl } from '/@/utils/imgurl';
  export default defineComponent({
    name: 'repayment',
    components: { BasicTable, TableAction, Icon,[Popconfirm.name]:Popconfirm,[Tag.name]:Tag,AddModel,AImage:Image},
    setup() {
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '图片列表',
        api: getList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: true,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          fixed: undefined,
        },
      });
      //1.新建
      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }
      //2编辑
      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }
      //添加成功回调
      function handleSuccess() {
        reload()
      }
      //删除
      async function handleDelete(record: Recordable) {
        await delData([record.id]);
          reload();
      }
      //状态
      return {
        registerTable,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,registerModal,ReplaceUrl,
      };
    },
  });
</script>
