<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="审批"
    width="700px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" :model="model" >
    
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref,unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import {  } from 'ant-design-vue';
  //Api
  import { approvalMweb } from '/@/api/platform/mwebapproval';
  import { Icon } from '/@/components/Icon/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  //工具
  import { ReplaceUrl } from '/@/utils/imgurl';
  //数据
  import { schemas } from './approval.data';
  export default defineComponent({
    components: { 
      BasicModal, 
      BasicForm,
       Icon,
    },
    props: {
      userData: { type: Object },
    },
    emits: ['success'],
    setup(_, { emit }) {
      const {
        createMessage,
      } = useMessage();
      const modelRef = ref({});
      const isUpdate = ref(true);
      const loading = ref(false);
      //表单
      const [
        registerForm,
        {
          setFieldsValue,
          // setProps
          resetFields,
          validate
        },
      ] = useForm({
        labelWidth: 100,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });
      let Id = ref(0);
      const [register, { setModalProps, closeModal }] = useModalInner(async(data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          setFieldsValue({
            status:data.record.status==1?3:data.record.status,
            approval_err:data.record.approval_err,
          });
          Id.value=data.record.id
        }else{
          Id.value=0
        }
      });
      //提交数据
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          //提交到数据库
           if(Id.value>0){//修改
             values.id=Id.value
           }
           if(values.status==1){
             values.status=3
           }
          createMessage.loading({ content: '审批提交中...', key:"saveTpl",duration:0});
          const result= await approvalMweb(values);
          if(result){
            createMessage.success({ content: '审批提交成功！', key:"saveTpl", duration: 2 });
            closeModal();
            emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: Id.value } });
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      return { 
        register, schemas, registerForm, model: modelRef,handleSubmit,
        loading,ReplaceUrl,
      };
    },
  });
</script>
<style lang="less" scoped>
  .upbox{
    width: 128px;
    height: 128px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
    user-select: none;
    cursor: pointer;
    &:hover{
      border: 1px dashed #55D187;
    }
    img{
      width: 100%;
    }
    .addbtn{
      text-align: center;
    }
  }
  /**预设包 */
  .paylistbox{
    .payitem{
        width: 180px;
        background-color: #ffffff;
        border-radius: 3px;
        display: inline-block;
        margin: 0px 10px 10px 0px;
        box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 15%);
        transition: color .15s ease,background-color .15s ease,border-color .15s ease,box-shadow .15s ease;
        padding: 10px;
        position: relative;
        .delbtn{
          position:absolute;
          bottom: 0px;
          right: 0px;
          color: #ffffff;
          background-color: #ff4d4f;
          width: 28px;
          height: 28px;
          border-top-left-radius: 50px;
          .iconbtn{
            position:absolute;
            right: 2px;
            bottom: 2px;
          }
        }
        .timestext{
          padding: 5px;
          font-size: 13px;
        }
        .field{
          display: flex;
          margin-bottom: 14px;
          .label{
            
          }
          .text{
            flex: 1;
          }
        }
      }
      .payitem_add{
        .textbtb{
          text-align: center;
          user-select: none;
          cursor: pointer;h
          .icons{
            text-align: center;
          }
        }
       
      }
  }
  .iconbtn{
    user-select: none;
    cursor: pointer;
    padding: 0px;
    margin: 0px;
  }
  :deep(.ant-input-number-group-addon){
    padding: 0 5px;
  }
</style>
