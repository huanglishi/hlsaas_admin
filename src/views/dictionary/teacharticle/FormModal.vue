<template>
  <BasicModal v-bind="$attrs" 
  @register="registerModal" 
  :title="getTitle" 
  @ok="handleSubmit" 
  width="920px" 
  :minHeight="550"
  >
    <div class="oldformbox">
      <BasicForm @register="registerForm" >
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Select} from 'ant-design-vue';
  import { formSchema } from './data';
  //API
  import { saveData,getArticle } from '/@/api/dictionary/teacharticle';
  export default defineComponent({
    name: 'FormModal',
    components: { BasicModal, BasicForm, ASelect:Select,ASelectOption:Select.Option  },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const {createMessage,} = useMessage();
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          const bigdata = await getArticle({id:data.record.id});
          if(bigdata){
            setFieldsValue({
            ...bigdata,
          });
          }
        }
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增文章' : '编辑文章'));
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if(unref(isUpdate)){//更新
            values.id=rowId.value
          }
          try {
            createMessage.loading({ content: '提交中...', key:"saveArticle",duration:0});
            const resultdata = await saveData(values);
            closeModal();
            if(resultdata){
              createMessage.success({ content: '提交成功！', key:"saveArticle", duration: 2 });
              emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
            }else if(resultdata==0){
              createMessage.success({ content: '已提交！', key:"saveArticle", duration: 2 });
            }
          } catch {
            createMessage.destroy("saveArticle");
          }
         
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit};
    },
  });
</script>
<style lang="less" scoped>
  :deep(.tox .tox-tbtn--bespoke .tox-tbtn__select-label){
    width: auto;
  }
  :deep(.ant-row){
    margin-bottom:10px;
  }
</style>
