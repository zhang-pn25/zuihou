import axiosApi from './AxiosApi.js'

const apiList = {
  export:{
    method:'POST',
    url:`/nucleic/afterPersonnel/exportExcelReWrite`
  },
  stencilExport:{
    method:'POST',
    url:`/nucleic/beforPersonnel/exportExcelReWrite`
  },
  beforeImport:{
    method:'POST',
    url:`/nucleic/beforPersonnel/import`
  },
  preview:{
    method:'POST',
    url:`/nucleic/afterPersonnel/previewReWiter`
  },
  afterPersonnel:{
    method:'POST',
    url:`/nucleic/afterPersonnel`
  },
  beforeUpdatePersonnel:{
    method:'PUT',
    url:`/nucleic/beforPersonnel`
  },
  beforePage:{
    method:'POST',
    url:`/nucleic/beforPersonnel/queryPage`
  },
  updatePersonnel:{
    method:'PUT',
    url:`/nucleic/afterPersonnel/updatePersonnel`
  },
  afterStatisticalPage:{
    method:'POST',
    url:`/nucleic/afterPersonnel/findStatisticsInfo`
  },
  // 上传的临时表确认按钮
  determineSaveBach:{
    method:'POST',
    url:`/nucleic/beforPersonnel/determineSaveBach`
  },
  // 上传的临时表取消按钮
  cancelSaveBach:{
    method:'POST',
    url:`/nucleic/beforPersonnel/cancelSaveBach`
  },
  // 调整
  updateAndSave:{
    method:'PUT',
    url:`/nucleic/afterPersonnel/updateAndSave`
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
  stencilExport(data){
    return axiosApi({
      ...apiList.stencilExport,
      responseType: "blob",
      data
    })
  },
  beforeImport(data){
    return axiosApi({
      ...apiList.beforeImport,
      data
    })
  },
  preview(data){
    return axiosApi({
      ...apiList.preview,
      data
    })
  },
  updatePersonnel(data){
    return axiosApi({
      ...apiList.updatePersonnel,
      data
    })
  },
  afterPersonnel(data){
    return axiosApi({
      ...apiList.afterPersonnel,
      data
    })
  },
  beforeUpdatePersonnel(data){
    return axiosApi({
      ...apiList.beforeUpdatePersonnel,
      data
    })
  },
  beforePage(data){
    return axiosApi({
      ...apiList.beforePage,
      data
    })
  },
  afterStatisticalPage(data){
    return axiosApi({
      ...apiList.afterStatisticalPage,
      data
    })
  },
  determineSaveBach(data){
    return axiosApi({
      ...apiList.determineSaveBach,
      data
    })
  },
  cancelSaveBach(data){
    return axiosApi({
      ...apiList.cancelSaveBach,
      data
    })
  },
  updateAndSave(data){
    return axiosApi({
      ...apiList.updateAndSave,
      data
    })
  }
}
