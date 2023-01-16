<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <!-- <a-button type="primary" @click="handleCreate"> 新增角色 </a-button> -->
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="statusFont(record.status,'color')">
               <template #icon>
                <Icon :icon="statusFont(record.status,'icon')"></Icon>
               </template>
                {{statusFont(record.status,'text')}}
             </a-tag>
        </template>
        <template v-if="column.key === 'userinfo'&&record.userinfo"  >
          <div>姓名：{{record.userinfo.name}}</div>
          <div v-if="record.userinfo.mobile">电话：{{record.userinfo.mobile}}</div>
        </template>
        <template v-if="column.key === 'deluser'&&record.deluser"  >
          <div>姓名：{{record.deluser.name}}</div>
          <div v-if="record.deluser.mobile">电话：{{record.deluser.mobile}}</div>
        </template>
        <template v-if="column.key === 'cuid'"  >
          <a-tag color="success" v-if="record.id" style="user-select:none;" @click="previewWenb(record.id,record['title'])">
              <template #icon>
                <Icon icon="icon-park-outline:preview-open"></Icon>
              </template>预览
            </a-tag>
          <div style="margin-top: 5px;">
            <a-popconfirm
                ok-text="关闭"
                :showCancel="false"
              >
              <template  #title>
               <div class="qrodewx">
                  <div class="title">手机微信扫一扫</div>
                  <div class="qrvbox">
                        <QrCode
                          :value="siteqrCodeUrl"
                          class="enter-x flex justify-center xl:justify-start"
                          :width="200"
                          :options="{
                            color: { 
                              dark: '#00BABDFF',
                            },
                          }"
                        />
                  </div>
               </div>
              </template>
              <a-tag color="#2db7f5" v-if="record.id" @click="relphone(record.id)" style="user-select:none;">
                <template #icon>
                  <Icon icon="heroicons-solid:device-phone-mobile"></Icon>
                </template>真机
              </a-tag>
          </a-popconfirm>
          </div>
        </template>
        <template v-if="column.key === 'action'"  >
          <a  @click="onRestore(record)">恢复</a>
        </template>
      </template>
    </BasicTable>
    <!--预览-->
    <s3-layer
      v-model="iframedata.show"
      :content="iframedata.content"
      :type="2"
      :title="iframedata.title"
      :maxmin="false"
      :closeBtn="2"
      :area="['380px', '667px']"
    >
    </s3-layer>
  </div>
</template>
<script lang="ts">
  import { defineComponent,ref,unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  //API
  import { getList,restoreTpl } from '/@/api/platform/webtpldel';
  import { columns, searchFormSchema } from './approval.data';
  import { Icon } from '/@/components/Icon';
  import { Popconfirm ,Tag} from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { QrCode } from '/@/components/Qrcode/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'webtpldel',
    components: { BasicTable, TableAction, Icon,[Popconfirm.name]:Popconfirm,[Tag.name]:Tag,QrCode},
    setup() {
          //提示
          const {
        createConfirm,createMessage
      } = useMessage();
      const siteqrCodeUrl=ref("")//整个站点页面
      const iframedata=ref({
        show:false,
        content:"",
        title:"",
      })
      const [registerTable, { reload }] = useTable({
        title: '轻站模板回收站',
        api: getList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        reload()
      }
      function handleApprovalSuccess() {
        reload()
      }

      function handleEdit(record: Recordable) {
        console.log(record)
      }

      function handleDelete(record: Recordable) {
        console.log(record);
      }
      //恢复
      function onRestore(record: Recordable) {
        createConfirm({
            iconType: "info",
            title: '您确定恢复该模板吗?',
            content: '恢复后将在C端模板库显示。',
            okText:"使用",
            onOk:(async()=>{
              createMessage.loading({ content: '恢复中...', key:"restoreTpl",duration:0});
              const resultdata = await restoreTpl({id:record.id});
              if(resultdata){
                reload()
                createMessage.success({ content: '恢复成功！', key:"restoreTpl", duration: 2 });
              }else {
                createMessage.error({ content: '恢复失败', key:"restoreTpl", duration: 2 });
              }
            }),
          });
      }
      //用户信息
      const userStore = useUserStore();
      const tplpreviewurl = ref(userStore.getUserInfo?.tplpreviewurl || '');
    //预览
    function previewWenb(id,title){
        iframedata.value={
            show:true,
            content:`${unref(tplpreviewurl)}?tplId=${id}`,
            title:title,
          }
      }
    //真机
     function relphone(id){
        siteqrCodeUrl.value=`${unref(tplpreviewurl)}?tplId=${id}`
      }
      //状态
      function statusFont(status,type){
         let text="",color="",icon="";
         if(status==1){
            text="等待审核"
            color="processing"
            icon="line-md:loading-twotone-loop"
         }else if(status==2){
            text="审核已通过"
            color="success"
            icon="line-md:confirm"
         }else if(status==3){
            text="审核未通过"
            color="error"
            icon="line-md:close"
         }
         if(type=="text"){
           return text
         }else if(type=="color"){
           return color
         }else if(type=="icon"){
           return icon
         }
      }
      return {
        registerTable,
        handleCreate,
        handleEdit,
        handleDelete,
        onRestore,
        iframedata,previewWenb,
        siteqrCodeUrl,relphone,
        handleApprovalSuccess,statusFont,
      };
    },
  });
</script>
