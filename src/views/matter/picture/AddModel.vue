<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
     width="920px" 
    :minHeight="550"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" :model="model" >
      <template #cid="{model, field}">
        <a-select
              v-model:value="model[field]"
              show-search
              allowClear
              placeholder="选择分组"
              style="width: 300px"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="searchGroup"
            >
            <template v-for="item in grouplist" >
              <a-select-option v-if="item['type']==model.type||item['type']==2" :value="item['id']+''" >{{item['name']}}</a-select-option>
            </template>
          </a-select>
      </template>
      <!--附件-->
      <template #url="{model,field}">
          <div class="updragbox">
            <a-upload-dragger
                    accept="image/*"
                    :multiple="false"
                    :before-upload="(file)=>{beforeUpload(file,model,field)}"
                    :show-upload-list="false"
                    :disabled="!model.cid||model.cid==0"
                >
                <div class="myupbox">
                  <div class="imgprev" v-if="model[field]">
                    <img :src="ReplaceUrl(model[field])"/>
                  </div>
                  <div class="uptig" v-else>
                        <div class="icon">
                        <Icon icon="line-md:cloud-upload-outline-loop" size="55" color="#a8abb2"></Icon>
                      </div>
                      <div class="text">将文件放在此处或单击上传</div>
                  </div>
               </div>
              </a-upload-dragger>
          </div>
          <div style="color: #409eff;font-size:12px;">上传图片前，请先选择分组。</div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref,unref,reactive,toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Select,Upload} from 'ant-design-vue';
  //Api
  import { saveData,getCateTree ,uploadFile} from '/@/api/matter/picture';
  import { Icon } from '/@/components/Icon/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  //工具
  import { ReplaceUrl } from '/@/utils/imgurl';
  //数据
  import { schemas } from './data';
  export default defineComponent({
    components: { 
      BasicModal, 
      BasicForm,
       ASelect:Select,ASelectOption:Select.Option,AUploadDragger:Upload.Dragger,
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
      const grouplist = ref([]);
      //数据
      const pagedata=reactive({
        upLoading:false,//上传文件
        url:"",
        title:"",
      })
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
            ...data.record,
          });
          Id.value=data.record.id
        }else{
          Id.value=0
          setFieldsValue({
            type:0,
          });
        }
        getGroupList("")
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
          const result= await saveData(values);
          if(result){
            createMessage.success({ content: '提交成功！', key:"saveTpl", duration: 2 });
            closeModal();
            emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: Id.value } });
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      //搜索分组
      function searchGroup(val) {
          getGroupList(val)
      }
      //获取分组数据
      async function getGroupList(keyword){
        grouplist.value= await getCateTree({keyword:keyword})
        if(!unref(isUpdate)&&grouplist.value){
          setFieldsValue({
            cid:grouplist.value[0].id
          });
        }
      }
      //上传附件
      const {fileMaxSize } = window["globalConfig"];
      async function beforeUpload(file,model,field) {
          // 设置最大值，则判断
          if (fileMaxSize && file.size / 1024 / 1024 >= fileMaxSize) {
            createMessage.error(`上传文件大小不能超出${fileMaxSize}M`);
            return false;
          }
          createMessage.loading({ content: '上传中...', key:"uploadFile",duration:0});
          //开始手动上传
          const filename=file?.name||""
          const upres= await uploadFile({ name: 'file', file: file, filename,data:{cid:model['cid'],type:model['type'],id:Id.value}}, (progressEvent) => {
                // 原生获取上传进度的事件
                if (progressEvent.lengthComputable) {
                  createMessage.loading({ content: '开始上传...', key:"uploadFile",duration:0});
                }
            })
          if(upres.status==200&&upres.data){
            model[field]=upres.data.result.url
            model.title=upres.data.result.title
            if (!unref(isUpdate)) {
              Id.value=upres.data.result.id
            }
            createMessage.success({ content: '上传成功！', key:"uploadFile", duration: 2 });
            //更新数据
          }else{
            createMessage.destroy("saveData");
          }
          return false;
        }
      return { 
        ...toRefs(pagedata),
        register, schemas, registerForm, model: modelRef,handleSubmit,
        loading,ReplaceUrl,
        searchGroup,grouplist,
        beforeUpload,
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
  .updragbox{
    width: 250px;
    overflow: hidden;
    .myupbox{
      height: 212px;
      display: flex;
      justify-content: center;
      align-items: center;
      .imgprev{
        height: 180px;
        img{
          height: 100%;
        }
      }
      .text{
      color: #a8abb2;
    }
    }
  }
</style>
