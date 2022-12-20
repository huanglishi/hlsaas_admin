<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" >
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './account.data';
  import { saveData,getGroupList} from '/@/api/platform/account';
  import { Select } from 'ant-design-vue';
  import md5 from 'md5'
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm , ASelect: Select },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      let Id = ref(0);

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });
        
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });
          Id.value=data.record.id
          sessionStorage.setItem("accountID", data.record.id) 
        }else{
          sessionStorage.removeItem("accountID")
          Id.value=0
        }
        const treeData = await getGroupList();
          updateSchema([
            {
              field: 'groupid',
              componentProps: { treeData },
            },
          ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          // TODO custom api
          //提交到数据库
           if(Id.value>0){//修改
             values.id=Id.value
           }else{
            if(!values["password"]){
              values["password"]="123456"
            }
           }
           if(values["password"]){
            values["password"]=md5(values["password"])
           }
          await saveData(values);
          closeModal();
           emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
           resetFields();
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      //处理角色数据
      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
