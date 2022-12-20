<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="设计套餐"
    width="700px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" :model="model" >
      <template #dataSwitch="{model, field}">
        <a-switch v-model:checked="model[field]" checked-children="启用" :checkedValue="0" un-checked-children="禁用" :unCheckedValue="1"/>
      </template>
      <template #masterckeckSwitch="{model, field}">
        <a-switch v-model:checked="model[field]" checked-children="必选套餐" :checkedValue="0" un-checked-children="选择性套餐" :unCheckedValue="1"/>
      </template>
      <template #funKey="{model, field}">
        <a-radio-group v-model:value="model[field]">
          <a-radio value="roles">基础权限</a-radio>
          <a-radio value="microweb">轻站</a-radio>
        </a-radio-group>
      </template>
      <template #typeRadio="{model, field}">
        <a-radio-group v-model:value="model[field]">
          <a-radio value="1">无限制</a-radio>
          <a-radio value="2">数量限制</a-radio>
        </a-radio-group>
      </template>
      <!--支付预设包-->
      <template #paylistbox="{model, field}">
       <div class="paylistbox">
          <div class="payitem" v-for="(item,i) in model[field]" :key="i">
              <div class="field">
                <div class="label">名称：</div>
                <div class="text">
                  <a-input v-model:value="item.name" placeholder="请输入包名" size="small"/>
                </div>
              </div>
              <div class="field">
                <div class="label">数量：</div>
                <div class="text">
                  <a-input-number style="width:100%" v-model:value="item.number" :min="1" size="small" placeholder="输入数量">
                    <template #addonBefore><Icon class="iconbtn" icon="line-md:minus-circle" v-if="item.number>model['count']" @click="()=>{item.number=item.number-parseInt(model['count'])}"></Icon></template>
                    <template #addonAfter><Icon class="iconbtn" icon="line-md:plus-circle" @click="()=>{item.number=item.number+parseInt(model['count'])}"></Icon></template>
                  </a-input-number>
                </div>
              </div>
              <div class="timestext">合计金额：{{item.price=((item.number/model['count'])*(parseFloat(model['price']))).toFixed(2)}}</div>
              <span class="delbtn" @click="()=>{model[field].splice(i,1)}"><Icon class="iconbtn" icon="line-md:close" size="18"/></span>
          </div>
          <div class="payitem payitem_add" @click="()=>{model[field].push({name:'',number:0,price:0})}">
            <div class="textbtb">
                <div>
                    <div class="icons"><Icon  icon="line-md:plus" size="25"/></div>
                    <div>新增包</div>
                </div>
            </div>
          </div>
       </div>
      </template>
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'menuName', key: 'id' }"
          checkable
          toolbar
          :checkStrictly="true"
          title="选择菜单"
          ref="treeRef"
        />
      </template>
      <template #Upload="{model, field}">
        <a-upload
            :accept="['image/*']"
            :multiple="false"
            :before-upload="beforeUpload"
            :show-upload-list="false"
          >
            <div class="upbox">
              <img v-if="model[field]" :src="ReplaceUrl(model[field])" alt="avatar" />
              <div v-else class="addbtn">
                <Icon icon="line-md:loading-alt-loop" v-if="loading" :size="28"></Icon>
                <Icon icon="line-md:cloud-upload-loop" v-else :size="28"></Icon>
                <div class="ant-upload-text">上传封面</div>
              </div>
            </div>
          </a-upload>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref,unref,nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Switch,Upload,RadioGroup,Radio,InputNumber} from 'ant-design-vue';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  //Api
  import { saveData } from '/@/api/platform/packagedesign';
  import { getMenuList } from '/@/api/platform/account';
  import { Icon } from '/@/components/Icon/index';
  import {  uploadApi } from '/@/api/common/upload';
  import { useMessage } from '/@/hooks/web/useMessage';
  //工具
  import { ReplaceUrl } from '/@/utils/imgurl';
  //数据
  import { schemas } from './design.data';
  export default defineComponent({
    components: { 
      BasicModal, 
      BasicForm,
      [Switch.name]:Switch,
      [Upload.name]:Upload,
      [RadioGroup.name]:RadioGroup,
      [Radio.name]:Radio,
      BasicTree,Icon,
      [InputNumber.name]:InputNumber,
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
      const treeData = ref<TreeItem[]>([]);
       //操作tree节点
      const treeRef = ref<Nullable<TreeActionType>>(null);
      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('操作tree节点：tree is null!');
        }
        return tree;
      }
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
        getTree().setCheckedKeys([]);//初始化
        setModalProps({ confirmLoading: false });
        if (unref(treeData).length === 0) {
          treeData.value = (await getMenuList()) as any as TreeItem[];
        }
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
          Id.value=data.record.id
           //展开
            nextTick(()=>{
              if(data.record.menu){
                getTree().setCheckedKeys(data.record.menu);
              }
            })
        }else{
          Id.value=0
        }
        nextTick(()=>{
            getTree().expandAll(true);
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
           }else{
           }
           if(values.menu&&values.menu.checked){
             values.menu=values.menu.checked
           }
          const result= await saveData(values);
          if(result){
            closeModal();
            emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: Id.value } });
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      //上传图片
      async function beforeUpload(file) {
        const maxSize = 2;
        // 设置最大值，则判断
        if (maxSize && file.size / 1024 / 1024 >= maxSize) {
          createMessage.error(`上传文件大于${maxSize}M`);
          return false;
        }
        //开始手动上传
        const filename=""
        loading.value=true
        const upres= await uploadApi({ name: 'file', file: file, filename })
        if(upres.status==200&&upres.data.status){
          setFieldsValue({
            image:upres.data.url
          });
          loading.value=false
        }
        return false;
      }
      return { 
        register, schemas, registerForm, model: modelRef,handleSubmit,
        treeData,treeRef,beforeUpload,loading,ReplaceUrl,
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
