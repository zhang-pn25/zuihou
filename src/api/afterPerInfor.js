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
  afterUpdatePersonnel:{
    method:'PUT',
    url:`/nucleic/afterPersonnel`
  },
  afterPage:{
    method:'POST',
    url:`/nucleic/afterPersonnel/queryPage`
  },
  afterStatisticalPage:{
    method:'POST',
    url:`/nucleic/afterPersonnel/findStatisticsInfo`
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
  },
  afterUpdatePersonnel(data){
    return axiosApi({
      ...apiList.afterUpdatePersonnel,
      data
    })
  },
  afterStatisticalPage(data){
    return axiosApi({
      ...apiList.afterStatisticalPage,
      data
    })
  },
}
