import { useGlobSetting } from '/@/hooks/setting';

export function ReplaceUrl(url: string) {
  if(url){
    if (url.indexOf('http') > -1) {
      return url
   } else{
     const { uploadUrl} = useGlobSetting();
     return uploadUrl+url
   }
  }else{
    return ""
  }
}
