import axiosApi from './AxiosApi.js'

const apiList = {
  export:{
    method:'POST',
    url:`/nucleic/afterPersonnel/exportExcelReWrite`
  },
  import:{
    method:'POST',
    url:`/nucleic/afterPersonnel/import`
  },
  preview:{
    method:'POST',
    url:`/nucleic/afterPersonnel/previewReWiter`
  },
  afterPersonnel:{
    method:'POST',
    url:`/nucleic/afterPersonnel`
  },
  afterPage:{
    method:'POST',
    url:`/nucleic/afterPersonnel/queryPage`
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
  afterPersonnel(data){
    return axiosApi({
      ...apiList.afterPersonnel,
      data
    })
  },
  afterPage(data){
    return axiosApi({
      ...apiList.afterPage,
      data
    })
  }
}
