<template>
  
    <div v-if="data" @click="requstMore()"
        class=" overflow-hidden w-[500px] max-w-[500px] min-w-[500px] flex __testbg
         bg-slate-800 h-52  shadow-xl   shadow__  cursor-pointer " :class="routeName === '/bjl' || routeName === '/all' ? 'my-3 mx-5' : 'my-0'">
        <div class="py-3 px-1 text-center relative flex flex-col justify-between   w-[150px] overflow-hidden __bg  bg-slate-500 ">
            <p class="text-white font-medium text-3xl ">{{ data.roomName }}</p>
            <div class="text-white text-lg font-extrabold tracking-wide">
              <p v-if="data.state == '0'">开局</p>
              <p v-else-if="data.state == '1'" class="text-green-400">开始下注</p>
              <p v-else-if="data.state == '2'" class="text-red-500">停止下注</p>
              <p v-else-if="data.state == '3'">开牌中</p>
              <p v-else-if="data.state == '4'">开奖</p>
              <p v-else-if="data.state == '5'">派彩</p>
              <p v-else-if="data.state == '-1'" class="text-gray-200">等待操作</p>
            </div>
            <div class="">
                <h1 class="text-lg font-bold tracking-wide text-white text-center ">局口:{{ data.cc }}</h1>
                <h1 class="text-lg font-bold tracking-wide text-white text-center ">限红:{{ data.xh }}</h1>
            </div>
        </div>

        <div class=" w-[350px] overflow-hidden ">
            <table class="border-collapse  border-none table-fixed w-[350px] overflow-hidden h-[85%] ">
                <thead class="text-center ">
                    <tr class="text-center">
                        <th class="w-8"></th>
                        <th class="border border-slate-600 text-red-400 font-bold">庄</th>
                        <th class="border border-slate-600 text-indigo-200  font-bold">闲</th>
                        <th class="border border-slate-600 text-green-300 font-bold">和</th>
                        <th class="border border-slate-600 text-red-400 font-bold">庄对</th>
                        <th class="border border-slate-600 text-indigo-200 font-bold">闲对</th>
                    </tr>
                </thead>
                <tbody class="text-center  overflow-hidden break-all  ">
                    <tr>
                        <td class="border border-slate-700 text-xl font-bold  "
                            style="writing-mode: vertical-rl;text-orientation: upright;">投注</td>
                        <td class="border border-slate-700  text-red-400  ">{{ data.detail.banker }}</td>
                        <td class="border border-slate-700  text-indigo-200">{{ data.detail.player }}</td>
                        <td class="border border-slate-700  text-green-300">{{ data.detail.tie }}</td>
                        <td class="border border-slate-700  text-red-400">{{ data.detail.b_pair }}</td>
                        <td class="border border-slate-700  text-indigo-200">{{ data.detail.p_pair }}</td>
                    </tr>
                    <tr>
                        <td class="border border-slate-700 text-xl font-bold "
                            style="writing-mode: vertical-rl;text-orientation: upright; ">赔彩</td>
                        <td class="border border-slate-700  text-red-400">{{ seperatedComma(data, 'banker') }}</td>
                        <td class="border border-slate-700  text-indigo-200">{{ seperatedComma(data, 'player') }}</td>
                        <td class="border border-slate-700  text-green-300">{{ seperatedComma(data, 'tie') }}</td>
                        <td class="border border-slate-700  text-red-400">{{ seperatedComma(data, 'bpair') }}</td>
                        <td class="border border-slate-700  text-indigo-200">{{ seperatedComma(data, 'ppair') }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="w-full h-[15%] text-center text-2xl">庄闲差 : {{ greaterThan(data.detail) }}</div>
        </div>
    </div>
    <!-- v-else -->
    <div class="overflow-hidden w-[500px] max-w-[500px] min-w-[500px] flex justify-center items-center " v-else>no data</div>
</template>

<script setup>
import pomelo from "@/socket/pomelo.js";
import { useRouter,useRoute } from "vue-router";
import { useStore } from "vuex";
import {ref,watch} from 'vue'

 const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});
const routeName = ref('')
const route = useRoute()
const store = useStore()
const router = useRouter()
    watch(
      () => route.path,
      () => {
        // console.log(route.path, "watching");
        routeName.value = route.path;
      },
      { immediate: true, deep: true }
    );

 const requstMore = () => {
  router.push({path:'/detail',query:{deskname:props.data.roomId}})
 }

const greaterThan = (data) => {
  if(data.banker > data.player) {
    return data.banker - data.player
  } else{
    return data.player - data.banker
  }
}
 const seperatedComma = (data,name) => {
  var arraylist = data.bl.split(",") ;
  switch (name) {
    case 'banker':
     arraylist = arraylist[2] * data.detail.banker
      break;
    case 'player':
     arraylist = arraylist[0] * data.detail.player
      break;
    case 'tie':
     arraylist = arraylist[1] * data.detail.tie
      break;
    case 'bpair':
     arraylist = arraylist[3] * data.detail.tie
      break;
    case 'ppair':
     arraylist = arraylist[4] * data.detail.tie
      break;
  
    default:
      break;
  }
 // console.log(arraylist);
  return arraylist
 }
</script>


<style  scoped>
.scroll_main{
 @apply w-[calc(100%_-_500px)] min-w-[calc(100%_-_500px)] max-w-[(100%_-_500px)]
 overflow-x-hidden;
}
.r-section{
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
/* .r-section::-webkit-scrollbar { 
    display: none;  
} */
.col{
    display: inline-block;
    letter-spacing: 0;
    vertical-align: top;
    border-right: 1px solid;
    @apply border-slate-700;
    /* height: 100%; */
    position: relative;
    text-align: center;
}
 /* .col.c2 .cell {
	 height: calc(-6.0833333333333vh);
	 width: calc(-5.0833333333333vw);
   background: red;
} */
.cell{
  border-bottom: 1px solid;
 @apply border-slate-700;
  height: calc(208px / 6);
}
.cell:last-child{
  border-bottom: 1px solid transparent;
}
.table_wrap{
  max-height: 50vh;
  overflow-y: scroll;
  display:block;
}
.__table{
  overflow: scroll !important;
}
/* .__bg{
  background-image: url(http://hj111111.com/PC/resource/assets/poke/poke_bg.png);
  background-size: cover;
} */
</style>