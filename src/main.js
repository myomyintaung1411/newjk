import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import store from './store'
import router from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
// import Paginate from "vuejs-paginate-next";
import i18n from './config/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ElTableInfiniteScroll from "el-table-infinite-scroll";

const app = createApp(App)

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// })

app.use(router)
app.use(store)
app.use(i18n)
app.use(ElementPlus)
app.use(ElTableInfiniteScroll);

// app.use(Paginate)
app.mount('#app')
