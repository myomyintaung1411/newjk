

<template>
  <div class="w-full h-screen relative">
    <div class="  h-screen w-full  ">
      <!-- header -->
      <div class="w-full bg-slate-600 min-w-[800px]">
        <div
          class="h-[40px] px-6  bg-[#13121b]  text-sm text-white w-full  flex  items-center justify-between overflow-x-auto">
          <section class="flex items-center">
            <div @click="clickTab(0)"
              class="px-5 py-1 tracking-widest cursor-pointer border-slate-500 whitespace-nowrap border-r border-dashed "
              :class="activeTab == 0 ? 'bg-white text-black' : 'bg-gray-700'">全台监控</div>
            <div @click="clickTab(1)"
              class="px-5 py-1 cursor-pointer tracking-widest whitespace-nowrap border-slate-500 border-r border-dashed"
              :class="activeTab == 1 ? 'bg-white text-black' : 'bg-gray-700'">单台监控</div>
            <div @click="clickTab(3)"
              class="px-5 py-1 cursor-pointer tracking-widest whitespace-nowrap border-slate-500 border-r border-dashed"
              :class="activeTab == 3 ? 'bg-white text-black' : 'bg-gray-700'">投注对比</div>
            <div @click="clickTab(4)" class="px-5 py-1 cursor-pointer tracking-widest whitespace-nowrap "
              :class="activeTab == 4 ? 'bg-white text-black' : 'bg-gray-700'">输赢汇总</div>
          </section>
          <section class="flex items-center space-x-4">



            <div class="flex items-center space-x-2">
              <span>本地网路状态 </span>
              <span :class="isOnline ? 'rounded-full h-3 w-3 bg-green-500 ' : 'rounded-full h-3 w-3 bg-red-500'"></span>

            </div>

            <p>{{ User_Info?.name }}</p>

            <div @click="logout"
              class="px-2 py-1 text-sm rounded bg-red-700 cursor-pointer flex items-center space-x-2 ">
              <p>登出</p>
              <LogoutIcon class="w-5 h-5 text-white "></LogoutIcon>
            </div>

          </section>
        </div>
      </div>
      <div class="main-content w-full     relative  px-5 overflow-y-hidden  ">
        <el-config-provider :locale="locale">
          <router-view />
        </el-config-provider>
      </div>
    </div>
  </div>
</template>
<script setup>
import singleBjl from "../components/singleBjl.vue";
import ModalDialog from "@/components/ModalDialog.vue";
import pomelo from "@/socket/pomelo.js";
import { onMounted, ref, computed, reactive, toRefs, watch,onBeforeUnmount } from "vue";
import BjlModal from "@/components/BjlModal.vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n/index";
import { useStore } from "vuex";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { useNetwork } from '@vueuse/core'
import { ElNotification } from 'element-plus'
import {
  LogoutIcon,
} from "@heroicons/vue/outline";

const network = reactive(useNetwork())
const { isSupported,
  isOnline,
  saveData,
  offlineAt,
  onlineAt,
  downlink,
  downlinkMax,
  effectiveType,
  rtt,
  type } = toRefs(network)



const modal = ref(false);
const locale = ref(zhCn)
const activeTab = ref(0)
const router = useRouter()
const route = useRoute()
const store = useStore();

const { t } = useI18n();
const lang = ref(localStorage.getItem("l") || "cz");

// login userinfo
const User_Info = computed(() => store.getters["app/USER"]);
 const s_timer = ref(null)

// watch(
//   () => isOnline.value,
//   (val) => {
//     console.log(val,"valllllllll")
//     if (!val) {
//       startTimer()
//     }
//   },
//   { immediate: true, deep: true }
// );

function showModal() {
  console.log("llllllllllllllllllemittttttttttttt");
  modal.value = true;
}

 

function startTimer() {
  if(isOnline.value) return 
 return ElNotification.warning({
        title: '警告',
        message: '本地网路已中断！！',
        offset: 100,
        duration: 5000,
        type: 'error',
    })
}

function everyFiveSecTimer(){
  s_timer.value = setInterval(() => {
    startTimer()
        }, 5000);
}

const logout = () => {
  window.location.reload();
  router.push('/login')
}

onBeforeUnmount(() => {
    clearInterval(s_timer.value)
    s_timer.value = null
})



const changeLanguage = () => {
  console.log("l;ee");
  localStorage.setItem("l", lang.value);
  window.location.reload();
};

const clickTab = (number) => {
  activeTab.value = number;
  switch (number) {
    case 0:
      router.push('/wholesysm')
      break;
    case 1:
      router.push('/hjSystem')
      break;
    case 2:
      router.push('/winLoseQuery')
      break;
    case 3:
      router.push('/betCompare')
      break;
    case 4:
      router.push('/summeryData')
      break;

    default:
      break;
  }
}
 
//get all tables Desk
function getAllDesk() {
  const sendStr = {
    router: 'getAllDesk',
    JsonData: {}
  }
  pomelo.send(sendStr, res => {
    let list = res.JsonData
    store.commit('app/GET_ALL_DESK', list)
    console.log(' getAllDesk response', res)
  })
};

// get user save information
function GetSavedInfo() {
  const sendStr = {
    router: 'GetSavedInfo',
    JsonData: {
      id: User_Info.value?.Id,
    }
  }
  console.log(' GetSavedInfo sendStr ********', sendStr)
  pomelo.send(sendStr, res => {
    if (res?.msg == 'ok') {
      if (res?.JsonData?.isSave == 1) {
        store.commit('app/SAVEDATA', true)
      } else {
        store.commit('app/SAVEDATA', false)
      }
      if (res?.JsonData?.jkData == null) {
        store.commit('app/HJAGENT_ARRAY', [])
        store.commit('app/HJUSER_ARRAY', [])
        store.commit('app/BET_COMPARE_USERARRAY', [])
        return
      } else {
        let data = JSON.parse(res?.JsonData?.jkData)
        store.commit('app/HJAGENT_ARRAY', data?.hjagent)
        store.commit('app/HJUSER_ARRAY', data?.hjuser)
        store.commit('app/BET_COMPARE_USERARRAY', data?.betcompare_user)
      }

    }
    console.log(' GetSavedInfo response', res)
  })
}

window.addEventListener("load", (event) => {
  console.log(event, "ddddddddd");
  const statusDisplay = document.getElementById("status");
  statusDisplay.textContent = navigator.onLine ? "Online" : "OFFline";
});

function setAllInfo() {
    const sendStr = {
        router: 'setAllInfo',
        JsonData: {
          force:true
        }
    }
    pomelo.send(sendStr, res => {
        console.log('resp of setAllInfo ', res)
    })
};

onMounted(() => {
  console.log(User_Info.value, 'qqqqqqqqqqqqq');
  setAllInfo()
  getAllDesk()
  GetSavedInfo()
  everyFiveSecTimer()
})
</script>
<style scoped>
.main-content {
  height: calc(100vh - 40px);
}

.drawer_bg {
  background: url("@/assets/bg_active.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}

.bg__info_img {
  background-image: url("https://template.viserlab.com/casinous/demo/assets/images/game/shape.png");
  background-size: cover;
  background-repeat: no-repeat;

}

.shadow__ {
  box-shadow: -3.828px -3.828px 6px 0px rgba(5, 4, 0, 0.801), 3px 5px 8px 0px rgba(24, 13, 8, 0.2);
}

.scroll_main {
  @apply w-[calc(100%_-_500px)] min-w-[calc(100%_-_500px)] max-w-[(100%_-_500px)] overflow-x-hidden;
}

.r-section {
  overflow-y: hidden;
  position: relative;
  @apply w-full;
  will-change: transform;
  user-select: none;
  cursor: grabbing;
  overflow-x: hidden;
  /* -ms-overflow-style: none; 
    scrollbar-width: none;   */

  /* width: calc((100vw - 198px)); */
}

.col {
  display: inline-block;
  letter-spacing: 0;
  vertical-align: top;
  border-right: 1px solid;
  @apply border-slate-700;
  /* height: 100%; */
  position: relative;
  text-align: center;
}

.cell {
  border-bottom: 1px solid;
  @apply border-slate-700;
  height: calc(208px / 6);
}

.cell:last-child {
  border-bottom: 1px solid transparent;
}

.table_wrap {
  max-height: 50vh;
  overflow-y: scroll;
  display: block;
}

.__table {
  overflow: scroll !important;
}

.__activeColor {
  background-color: rgb(100 116 139 / 1);
  color: #debd6b;
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  background: url("@/assets/bg_active.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}

.__bgItem {
  background: url("@/assets/bgItem.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
