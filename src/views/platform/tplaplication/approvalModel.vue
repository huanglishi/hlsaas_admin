<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="处理结果"
    width="820px"
    :minHeight="550"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" :model="model" >
      <template #tpl_id="{model, field}">
        <a-select
              v-model:value="model[field]"
              show-search
              allowClear
              placeholder="选择推荐模板"
              style="width: 400px"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="searchTpl"
            >
            <a-select-option v-for="item in tpllist"  :value="item['id']+''">{{item['title']}}</a-select-option>
          </a-select>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref,unref ,nextTick} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Select } from 'ant-design-vue';
  //Api
  import { doResult,getTplList,getDetail} from '/@/api/platform/tplaplication';
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
      ASelect:Select,ASelectOption:Select.Option
    },
    props: {
      userData: { type: Object },
    },
    emits: ['success'],
    setup(_, { emit }) {
      const {
        createMessage,
      } = useMessage();
      const tpllist = ref([]);
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
         const pagedata  = await getDetail({id:data.id});
          setFieldsValue({
            status:pagedata.status,
            tpl_id:(pagedata.tpl_id>0?pagedata.tpl_id:null),
            backcontent:pagedata.backcontent,
          });
          Id.value=data.id
        }else{
          Id.value=0
        }
        //获取模板
        nextTick(()=>{
          onGetTplList("")
        })
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
          createMessage.loading({ content: '提交中...', key:"saveTpl",duration:0});
          const result= await doResult(values);
          if(result){
            createMessage.success({ content: '提交成功！', key:"saveTpl", duration: 2 });
            closeModal();
            emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: Id.value } });
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      //搜索模板
      function searchTpl(val){
        onGetTplList(val)
      }
      //获取分组数据
      async function onGetTplList(keyword){
        let tplData= await getTplList({keyword:keyword})
        if(!tplData) tpllist.value=[]
        tpllist.value = tplData
      }
      return { 
        register, schemas, registerForm, model: modelRef,handleSubmit,
        loading,ReplaceUrl,
        tpllist,searchTpl,
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
