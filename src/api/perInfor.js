import axiosApi from './AxiosApi.js'

const apiList = {
  export:{
    method:'POST',
    url:`/nucleic/afterPersonnel/exportExcelReWrite`
    // url:`/performance/standard/export`
  },
  import:{
    method:'POST',
    url:`/nucleic/personnel/import`
  },
  preview:{
    method:'POST',
    url:`/nucleic/afterPersonnel/previewReWiter`
  },
  beforPersonnel:{
    method:'POST',
    url:`/nucleic/beforPersonnel`
  },
  beforPage:{
    method:'POST',
    url:`/nucleic/beforPersonnel/page`
  }
}

export default {
  export(data){
    return axiosApi({
      ...apiList.export,
      responseType: "blob",
      data
    })
  },
  import(data){
    return axiosApi({
      ...apiList.import,
      data
    })
  },
  preview(data){
    return axiosApi({
      ...apiList.preview,
      data
    })
  },
  beforPersonnel(data){
    return axiosApi({
      ...apiList.beforPersonnel,
      data
    })
  },
  beforPage(data){
    return axiosApi({
      ...apiList.beforPage,
      data
    })
  }
}
