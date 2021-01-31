import axiosApi from './AxiosApi.js'

const apiList = {
  page: {
    url: `/nucleic/task/page`,
    method: 'POST'
  },
  save: {
    url: `/nucleic/task`,
    method: 'POST'
  },
  update: {
    url: `/nucleic/task`,
    method: 'PUT'
  },
  delete: {
    url: `/nucleic/task`,
    method: 'DELETE'
  },
}

export default {
  page (data) {
    return axiosApi({
      ...apiList.page,
      data
    })
  },
  save (data) {
    return axiosApi({
      ...apiList.save,
      data
    })
  },
  update(data) {
    return axiosApi({
      ...apiList.update,
      data
    })
  },
  delete(data) {
    return axiosApi({
      ...apiList.delete,
      data
    })
  }
}
