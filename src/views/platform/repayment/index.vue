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
        <template v-if="column.key === 'action'"  >
          <a  @click="onApproval(record)">处理状态</a>
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
  //Api
  import { getList } from '/@/api/platform/repayment';
  import { columns, searchFormSchema } from './approval.data';
  import { Icon } from '/@/components/Icon';
  import { Popconfirm ,Tag} from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { QrCode } from '/@/components/Qrcode/index';
  import { useModal } from '/@/components/Modal';
  import ApprovalModel from './approvalModel.vue';
  export default defineComponent({
    name: 'repayment',
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
        title: '订单数据列表',
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
            // content:`${mwurl.value}web?id=${id}`,
            content:`http://localhost:9090/#/web?id=${id}&type=spiframe`,
            title:title,
          }
      }
    //真机
     function relphone(id){
        id= encodeURLS(id) // 加密
        siteqrCodeUrl.value=`${unref(mwurl)}web?id=${id}`
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
         if(status==0){
            text="未支付"
            color="error"
            icon="line-md:question-circle"
         }else if(status==1){
            text="已支付"
            color="success"
            icon="line-md:confirm"
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
