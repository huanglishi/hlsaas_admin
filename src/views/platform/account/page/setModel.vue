<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
     width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #packagedata="{}">
         <div class="carbox">
          <!-- <a-checkbox-group v-model:value="packageJSON.pids" style="width: 100%"> -->
            <div class="carlist" v-for="item in packageData" :key="item['id']">
              <div class="carinfo">
                  <!--顶部信息-->
                  <div class="topinfo">
                      <div class="imgbox">
                        <img class="preview_img" :src="ReplaceUrl(item['image'])" />
                      </div>
                      <div class="title">{{item['name']}}</div>
                  </div>
                  <div class="fieldbox">
                    <div class="field">
                      <div class="label">选择该套餐</div>
                      <div class="text">
                        <a-checkbox v-model:checked="item.jsondata.checks"></a-checkbox>
                        </div>
                    </div>
                    <template v-if="item['type']==2">
                     <div class="field" >
                        <div class="label">当前可使用数量：</div>
                        <div class="text">
                           {{item['number']}}
                        </div>
                      </div>
                      <div class="field" >
                        <div class="label">更新数量</div>
                        <div class="text">
                          <a-input-number style="width:100%" v-model:value="item.jsondata.number" :min="1" size="small">
                            <template #addonBefore><Icon class="iconbtn" icon="line-md:minus-circle" v-if="item.jsondata.number>item['count']" @click="()=>{item.jsondata.number=item.jsondata.number-item['count']}"></Icon></template>
                            <template #addonAfter><Icon class="iconbtn" icon="line-md:plus-circle" @click="()=>{item.jsondata.number=item.jsondata.number+item['count']}"></Icon></template>
                          </a-input-number>
                        </div>
                      </div>
                      <div class="field" >
                        <div class="label">总金额：</div>
                        <div class="text">
                           {{((item.jsondata.number/item['count'])*(parseFloat(item['price']))).toFixed(2)}} 元
                        </div>
                      </div>
                    </template>
                  </div>
              </div>
            </div>
          <!-- </a-checkbox-group> -->
         </div>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './set.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Icon } from '/@/components/Icon';

  import { saveSetting } from '/@/api/platform/account';
  import { useList } from '/@/api/platform/packagedesign';
  //工具
  import { ReplaceUrl } from '/@/utils/imgurl';
  import { Checkbox,InputNumber} from 'ant-design-vue';
  export default defineComponent({
    name: 'setModel',
    components: { BasicDrawer, BasicForm,
      [Checkbox.name]:Checkbox,
      [InputNumber.name]:InputNumber,
      Icon,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      let Id = ref(0);
      const packageData = ref([]);
      const packageJSON = ref({
        pids:[],
        number:"",
      });

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
         //赋值
        const record=data.record
        const plist= await useList({userid:record.id});
        let nplist=[];
        plist.forEach((res) => {
          let ischecks=false
          if(res.masterckeck==0||res.checks==1){
            ischecks=true
          }
          let numberdata=""
          if(res.checks==1){
            numberdata=res.number
          }
          nplist.push({...res,jsondata:{pid:res.id,type:res.type,checks:ischecks,number:numberdata}})
        })
        packageData.value = nplist
        setFieldsValue({
            sub_account:record.sub_account,
            status:record.status,
          });
          Id.value=record.id
      });
      const getTitle = computed(() => ("购买套餐"));
      //提交数据
      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          //提交到数据库
          values.id=Id.value
          if(values.menu&&values.menu.checked){
             values.menu=values.menu.checked
           }
           //处理套餐数据
          let pdatas=[];
          packageData.value.forEach((item) => {
             if(item.jsondata.checks){
               pdatas.push(item.jsondata)
             }
          })
          values["pdatas"]=pdatas;
          const resultdata = await saveSetting(values);
           console.log("提交结果：",resultdata); 
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }
      
      return {
        registerDrawer,
        registerForm,
        getTitle,ReplaceUrl,packageData,
        handleSubmit,packageJSON,
      };
    },
  });
</script>
<style lang="less" scoped>
  .carbox{
    width: 100%;
    .carlist{
      display: inline-block;
      vertical-align: top;
      margin: 0 30px 20px 0;
      .carinfo{
        display: inline-block;
        vertical-align: top;
        border-radius: 8px;
        position: relative;
        transition: transform .3s ease,box-shadow .3s ease;
        width: 200px;
        height: 317px;
        box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 15%);
        &:hover{
          box-shadow:0px 10px 20px -5px rgba(0,0,0,.25);
        }
        .preview_img{
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 8px;
          position: relative;
        }
        .title{
          padding: 10px;
          border-bottom: 1px dashed #d9d9d9;
        }
        .fieldbox{
          padding:5px;
          .field{
              display: flex;
              margin-bottom: 10px;
              .label{
                padding-right: 5px;
                display: block;
              }
              .text{
                flex:1;
              }
            }
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
