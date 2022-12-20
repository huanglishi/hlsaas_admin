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
        <template v-if="column.key === 'userinfo'"  >
          <div>姓名：{{record.userinfo.name}}</div>
          <div v-if="record.userinfo.mobile">电话：{{record.userinfo.mobile}}</div>
        </template>
        <template v-if="column.key === 'webhomeid'"  >
          <a-tag color="success" v-if="record.webhomeid" style="user-select:none;" @click="previewWenb(record['webhomeid'],record['title'])">
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
              <a-tag color="#2db7f5" v-if="record.webhomeid" @click="relphone(record['webhomeid'])" style="user-select:none;">
                <template #icon>
                  <Icon icon="heroicons-solid:device-phone-mobile"></Icon>
                </template>真机
              </a-tag>
          </a-popconfirm>
          </div>
        </template>
        <template v-if="column.key === 'action'"  >
          <a  @click="onApproval(record)">审批</a>
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
    <!--审批弹框-->
    <ApprovalModel @register="registerModal" @success="handleApprovalSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent,ref,unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getList } from '/@/api/platform/mwebapproval';
  import { columns, searchFormSchema } from './approval.data';
  import { Icon } from '/@/components/Icon';
  import { Popconfirm ,Tag} from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { QrCode } from '/@/components/Qrcode/index';
  import { useModal } from '/@/components/Modal';
  import ApprovalModel from './approvalModel.vue';
  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, TableAction, Icon,[Popconfirm.name]:Popconfirm,[Tag.name]:Tag,QrCode,ApprovalModel},
    setup() {
      const siteqrCodeUrl=ref("")//整个站点页面
      const iframedata=ref({
        show:false,
        content:"",
        title:"",
      })
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '审批数据列表',
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
        showIndexColumn: true,
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
      //审批
      function onApproval(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }
      //用户信息
      const userStore = useUserStore();
      const mwurl = ref(userStore.getUserInfo?.mwurl || '');
    //预览
    function previewWenb(id,title){
        id= encodeURLS(id) // 加密
        iframedata.value={
            show:true,
            content:`${mwurl.value}web?id=${id}&type=spiframe`,
            // content:`http://localhost:9090/#/web?id=${id}&type=spiframe`,
            title:title,
          }
      }
    //真机
     function relphone(id){
        id= encodeURLS(id) // 加密
        siteqrCodeUrl.value=`${unref(mwurl)}web?id=${id}&type=spiframe`
      }
      function encodeURLS(str) {
          return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
              function toSolidBytes(match, p1) {
                  return String.fromCharCode('0x' + p1);
              }));
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
        onApproval,
        iframedata,previewWenb,
        siteqrCodeUrl,relphone,
        handleApprovalSuccess,registerModal,statusFont,
      };
    },
  });
</script>
