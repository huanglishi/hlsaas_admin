<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" >
        <template #roleSelect="{model, field}">
          <a-select
            :options="funRoleList"
            mode="multiple"
            v-model:value="model[field]"
            allowClear
          />
        </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './account.data';
  import { saveData,getRoleList} from '/@/api/sys/account';
  import { getParentList, } from '/@/api/sys/dept';
  import { Select } from 'ant-design-vue';
  import md5 from 'md5'
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm , ASelect: Select },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const roleData = ref([]);
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
        roleData.value= await getRoleList();

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
        const treeData = await getParentList();
          updateSchema([
            {
              field: 'deptid',
              componentProps: { treeData },
            },
          ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '????????????' : '????????????'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          // TODO custom api
          //??????????????????
           if(Id.value>0){//??????
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
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      //??????????????????
      const funRoleList =computed(() => unref(roleData));
      return { registerModal, registerForm, getTitle, handleSubmit,funRoleList };
    },
  });
</script>
