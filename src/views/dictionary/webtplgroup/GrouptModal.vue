<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
    <div style="padding-left:50px;font-size:13px;color: #108ee9;">目前仅支持二级分类，请勿添加三级分类</div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './dept.data';

  import { getParentList ,saveData} from '/@/api/dictionary/webtplgroup';
  export default defineComponent({
    name: 'GrouptModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      let Id = ref(0);
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
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
          setFieldsValue({
            ...data.record,
          });
          Id.value=data.record.id
        }else{
          Id.value=0
          setFieldsValue({
             pid:data.pid
          });
        }
        var treeData = await getParentList();
        if(!treeData) treeData=[]
        var parntList : any=[{id: 0,name: "一级菜单",pid: 0}];
        // if(treeData){
           treeData = parntList.concat(treeData)
        // }else{
        //   treeData = parntList
        // }
        updateSchema({
          field: 'pid',
          componentProps: { treeData },
        });

      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增分组' : '编辑分组'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          //提交到数据库
           if(Id.value>0){
             values.id=Id.value
           }
          const resultdata = await saveData(values);
           console.log("提交结果：",resultdata); 
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
