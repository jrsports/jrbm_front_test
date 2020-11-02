import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getUserToken,getTeamToken } from '@/utils/tokenUtil'

// create an axios instance
const axiosPost = axios.create({
  baseURL: "http://www.jrsports.com/api",
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})


axiosPost.interceptors.request.use(
  config => {
    if (store.getters.userToken) {
      config.headers['userToken'] = getUserToken()
    }
    if (store.getters.teamToken) {
      config.headers['teamToken'] = getTeamToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)


axiosPost.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 0) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 3 * 1000
      })
      // return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: '请求错误',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default axiosPost
