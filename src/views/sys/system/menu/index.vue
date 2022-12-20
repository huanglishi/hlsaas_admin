<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button color="success" @click="refreshMenu" preIcon="mdi:page-next-outline"> 更新菜单 </a-button>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
           <Tag :color="record.status==0?'green' : 'red'" @click="uplock(record.id,record.status)" style="user-select: none;">{{record.status==0?"启用":"停用"}}</Tag>
        </template>
        <template v-if="column.key === 'action'">
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
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { menuList,delMenu,upMenuLock } from '/@/api/sys/menu';

  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';

import { columns, searchFormSchema } from './menu.data';
import { usePermission } from '/@/hooks/web/usePermission';
import { Tag } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'MenuManagement',
    components: { BasicTable, MenuDrawer, TableAction,Tag },
    setup() {
      const { refreshMenu } = usePermission();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, expandAll }] = useTable({
        title: '菜单列表',
        api: menuList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        isTreeTable: true,
        pagination: false,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      //删除操作
      async function handleDelete(record: Recordable) {
          await delMenu([record.id]);
          reload();
          // 更改菜单的实现需要自行去修改
          refreshMenu();
      }

      function handleSuccess() {
        reload();
        // 更改菜单的实现需要自行去修改
          // refreshMenu();
      }
      function refreshMenuFUN(){
        refreshMenu();
      }
      function onFetchSuccess() {
        // 演示默认展开所有表项
        nextTick(expandAll);
      }
      //修改字段
      async function uplock(id,status) {
        const { createMessage } = useMessage();
        createMessage.loading({
          content:"更新状态中...",
          duration: 1,
        });
        try {
           await upMenuLock([id],status);
          reload();
        } finally {
          setTimeout(()=>{
            createMessage.destroy()
          },800)
        }
      }
      return {
        registerTable,
        registerDrawer,
        handleCreate,
        refreshMenuFUN,
        refreshMenu,
        handleEdit,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
        uplock,
      };
    },
  });
</script>
