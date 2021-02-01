import axiosApi from './AxiosApi.js'

const apiList = {
  export:{
    method:'POST',
    url:`/nucleic/beforPersonnel/exportExcelReWrite`
  },
  import:{
    method:'POST',
    url:`/nucleic/beforPersonnel/import`
  },
  preview:{
    method:'POST',
    url:`/nucleic/beforPersonnel/previewReWiter`
  },
  beforPersonnel:{
    method:'POST',
    url:`/nucleic/beforPersonnel`
  },
  beforUpdatePersonnel:{
    method:'PUT',
    url:`/nucleic/beforPersonnel`
  },
  beforPage:{
    method:'POST',
    url:`/nucleic/beforPersonnel/queryPage`
  },
  beforStatisticalPage:{
    method:'POST',
    url:`/nucleic/beforPersonnel/findStatisticsInfo`
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
  beforUpdatePersonnel(data){
    return axiosApi({
      ...apiList.beforUpdatePersonnel,
      data
    })
  },
  beforPage(data){
    return axiosApi({
      ...apiList.beforPage,
      data
    })
  },
  beforStatisticalPage(data){
    return axiosApi({
      ...apiList.beforStatisticalPage,
      data
    })
  },
}
