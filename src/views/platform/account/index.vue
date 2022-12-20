<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" v-bind:style="{'max-width':'230px'}"/>
    <BasicTable @register="registerTable" class="w-3/4 xl:w-5/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" v-auth="'100'" @click="handleCreate">新增账号</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'line-md:text-box-multiple-twotone',
                tooltip: '套餐设置',
                onClick: handleSetting.bind(null, record),
              },
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑用户资料',
                onClick: handleEdit.bind(null, record),
              },
               {
                icon: 'line-md:alert-circle',
                tooltip: '查看用户详情',
                onClick: handleView.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此账号',
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
    <AccountModal @register="registerModal" @success="handleSuccess" />
    <SetModel @register="registerDrawer" @success="handleSetSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive,computed} from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getList ,delData} from '/@/api/platform/account';
  import { PageWrapper } from '/@/components/Page';
  import DeptTree from './DeptTree.vue';

  import { useModal } from '/@/components/Modal';
  import AccountModal from './AccountModal.vue';

  import { columns, searchFormSchema } from './account.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { useUserStore } from '/@/store/modules/user';
  import SetModel from './page/setModel.vue';
 import { useDrawer } from '/@/components/Drawer';

  export default defineComponent({
    name: 'AccountPlatform',
    components: { BasicTable, PageWrapper, DeptTree, AccountModal, TableAction,SetModel},
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const userStore = useUserStore();
      const getUserInfo = computed(() => {
        const {userId,roles, realName = '', avatar, desc } = userStore.getUserInfo || {};
        return {userId,roles, realName, avatar: avatar , desc };
      });
      const go = useGo();
      const [registerModal, { openModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const [registerTable, { reload, updateTableDataRecord }] = useTable({
        title: '账号列表',
        api: getList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        handleSearchInfoFn(info) {
          console.log('handleSearchInfoFn', info);
          return info;
        },
        actionColumn: {
          width: 145,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }
      //设置套餐
      function handleSetting(record: Recordable) {
         if(record.menu&&record.menu!=""&&typeof record.menu=="string"){
          record.menu=JSON.parse(record.menu)
        }
        openDrawer(true, {
          record,
        });
      }
      //设置提交返回
      function handleSetSuccess() {
        console.log("设置提交成功")
      }
      //删除数据
      async function handleDelete(record: Recordable) {
         await delData([record.id]);
          reload();
      }

      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
           updateTableDataRecord(values.id, values);
        } else {
          reload();
        };
      }

      function handleSelect(deptId = '') {
        searchInfo.cid = deptId;
        reload();
      }

      function handleView(record: Recordable) {
        go('/platform/account_detail/' + record.id);
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleSetting,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleSelect,
        handleView,
        searchInfo,
        getUserInfo,
        registerDrawer,
        handleSetSuccess,
      };
    },
  });
  // {
  //   field: 'roleid',
  //   label: '角色',
  //   component: 'ApiTreeSelect',
  //   componentProps: {
  //     api: getAllRoleList,
  //     resultField: 'list',
  //   },
  //   required: true,
  // },
</script>
