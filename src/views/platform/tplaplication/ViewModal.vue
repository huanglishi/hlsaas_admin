<template>
  <BasicModal 
  v-bind="$attrs" 
  @register="registerModal" 
  @ok="handleSubmit" 
  title="查看详情" 
  width="920px" 
  :minHeight="550"
  :showCancelBtn="false"
  okText="关闭"
  >
   <div class="readarticle">
     <div class="title">
       {{pagedata.name}}
     </div>
     <div class="content_box">
       <div class="content_veiw" v-bind:innerHTML="pagedata.content">
       </div>
     </div>
   </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // import { useMessage } from '/@/hooks/web/useMessage';
  //API
  import { getDetail } from '/@/api/platform/tplaplication';
  export default defineComponent({
    name: 'ViewArticleModal',
    components: { BasicModal},
    emits: ['success', 'register'],
    setup( ) {
      const pagedata = ref({name:"",content:""});
      // const {createMessage,createSuccessModal} = useMessage();
      const [registerModal, { setModalProps ,closeModal}] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        pagedata.value = await getDetail({id:data.id});
      });
      function handleSubmit(){
        closeModal();
      }
      return { 
         registerModal, 
         handleSubmit,
         pagedata
        };
    },
  });
</script>
<style lang="less" scoped>
 .readarticle{
  padding: 15px;
  .title{
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
  .content_box{
    margin-top: 15px;
    .content_veiw{

    }
  }
 }
</style>
