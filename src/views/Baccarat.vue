<template>
    <div class="w-full  flex flex-wrap ">
        <singleBjl v-for="data in bjlData" :key="data.roomId" :data="data" ></singleBjl>
    </div>
</template>

<script setup>
import singleBjl from "@/components/singleBjl.vue";
import pomelo from "@/socket/pomelo.js";
import { ref, onMounted,computed,onBeforeUnmount,reactive } from 'vue'
import { useStore } from "vuex";

const timing = ref(null)

//const bjlData = ref(null)
const store = useStore();
const bjlData = computed(() => store.getters["app/All_Table_Info"]);


function getBjlLists(type) {
    console.log(type);
    const sendStr = {
        router: 'getDeskLists',
        JsonData: {
            type: type,
            findname: '',
            deskname: ''
        }
    }
    pomelo.send(sendStr, res => {
        console.log(res.JsonData?.result + 'res ************') ;
        if (res.JsonData.result == 'ok' && res.JsonData?.data.length > 0) {
            console.log('resp ', res.JsonData.data)
            //bjlData.value = res.JsonData.data
            store.commit('app/ALL_TABLE_INFO',res.JsonData.data)
            // console.log('bjlData data ', bjlData.value)
            console.log("rrrrrrrr");
        }
    })
}

function requestDataEveryFiveSec() {
        timing.value = setInterval(() => {
            getBjlLists('bjl')
            console.log("5 log second");
        }, 5000);
}

onBeforeUnmount(() => {
    clearInterval(timing.value)
})

store.commit('app/ALL_TABLE_INFO',null)
onMounted(() => {
    getBjlLists('bjl')
    requestDataEveryFiveSec()
})
</script>

<style>
</style>