<template>
   <div>
      <CardList :params="params" :api="getList" @get-method="getMethod" @delete="handleDel" @edit="handleEdit">
        <template #header>
          <Button type="primary" preIcon="line-md:plus" @click="addData"> 添加套餐 </Button>
        </template>
      </CardList>
      <editDataModel @register="registerEditData" @success="handleSetSuccess"/>
   </div>
</template>
<script lang="ts" setup>
  import { CardList } from '/@/components/CardList';
  import { Button } from '/@/components/Button';
  //Api
  import { getList,delData } from '/@/api/platform/packagedesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import editDataModel from './editDataModel.vue';
  import { useModal } from '/@/components/Modal';
  const { notification } = useMessage();
  // 请求api时附带参数
  const params = {};

  let reload = () => {};
  // 获取内部fetch方法;
  function getMethod(m: any) {
    reload = m;
  }
  //编辑
  function handleEdit(record) {
    if(typeof record.menu=="string"){
      record.menu=JSON.parse(record.menu)
    }
    openEditData(true, {
      record,
      isUpdate: true,
    });
  }
  //删除按钮事件
  async function handleDel(id) {
    await delData([id]);
    notification.success({ message: `成功删除` });
    reload();
  }
  const [registerEditData, { openModal: openEditData }] = useModal();
  //添加数据
  function addData() {
    openEditData(true, {
      isUpdate: false,
    });
  }
  //修改成功返回
  function handleSetSuccess() {
    reload();
  }
</script>
