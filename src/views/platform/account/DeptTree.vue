<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="全部分类"
      titlecolor="#0960bd"
      @clicktitle="handleTitleclick"
      toolbar
      search
      :clickRowToExpand="false"
      :treeData="treeList"
      :fieldNames="{ key: 'id', title: 'name' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';

  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { getGroupList } from '/@/api/platform/account';

  export default defineComponent({
    name: 'DeptTree',
    components: { BasicTree },

    emits: ['select'],
    setup(_, { emit }) {
      const treeList = ref<TreeItem[]>([]);

      async function fetch() {
       treeList.value= (await getGroupList()) as unknown as TreeItem[];
      }

      function handleSelect(keys) {
        emit('select', keys[0]);
      }
      //点击标题
      function handleTitleclick() {
          emit('select', 0);
      }
      onMounted(() => {
        fetch();
      });
      return { treeList, handleSelect ,handleTitleclick};
    },
  });
</script>
