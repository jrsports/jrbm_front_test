// import ElementUI from 'element-ui'
// import axios from 'axios'
// import router from '../router/router'

// axios.interceptors.response.use(
//     response => {
//         return response
//     },
//     error => {
//             if (error.response.status === 401) {
//                 ElementUI.Message({
//                     message: error.response.data.message,
//                     type: "warning",
//                     onClose:()=>{
//                         // localStorage.removeItem("userToken");
//                         // sessionStorage.removeItem("teamToken");
//                         console.log(router.currentRoute.path);
//                         // if(router.currentRoute.path !== '/'){
//                         //     router.replace({
//                         //         path: '/',
//                         //         query: { redirect: router.currentRoute.path },
//                         //     })
//                         // }else{
//                         //     location.reload();
//                         // }
//
//                     }
//                 });
//
//
//             }
//         return Promise.reject(error.response.data)
//     },
// );

// export default axios
