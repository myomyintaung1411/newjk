<template>
    <section class="w-full   min-w-[1300px] h-[calc(100vh_-_40px)] relative py-2 overflow-y-hidden ">
        <div class="w-full relative h-full  ">
            <el-table :data="(wholesysmData)" border style="width: 100%"
               max-height="100%"  :header-cell-style="{ textAlign: 'center', padding: 2 + 'px' }"
                :cell-style="{ textAlign: 'center', padding: 1 + 'px' }" v-loading="loading">
                <el-table-column prop="deskname" label="台号" />
                <el-table-column prop="remainTimeCN" label="时间">
                    <template #default="scope">
                        <div v-if="scope.row.state == '1'" class="font-bold text-xl">
                            {{scope.row.remainTimeCN}} 
                            
                        </div>
                        <div v-else class="font-bold text-xl">
                            00
                        </div>
                        <!-- <div v-else>
                                00
                            </div> -->
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="状态">
                    <template #default="scope">
                        <p v-if="scope.row.state == '0'">开局</p>
                        <p v-else-if="scope.row.state == '1'" class="text-green-600 font-bold">开始下注</p>
                        <p v-else-if="scope.row.state == '2'" class="text-red-600 font-bold">停止下注</p>
                        <p v-else-if="scope.row.state == '3'">开牌中</p>
                        <p v-else-if="scope.row.state == '4'">开奖</p>
                        <p v-else-if="scope.row.state == '5'">派彩</p>
                        <p v-else-if="scope.row.state == '-1'" class="text-gray-200">等待操作</p>
                        <p v-else class="text-gray-300">等待操作</p>
                    </template>
                </el-table-column>

                <el-table-column prop="cc" label="局数">
                    <template #default="scope">
                        <div>
                            {{ scope.row?.cc?.split('-')[0] }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="cc" label="口数">
                    <template #default="scope">
                        <div>
                            {{ scope.row?.cc?.split('-')[1] || 0 }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="会 员 下 注">
                    <el-table-column class-name="text-red-500" prop="bet_info" label="庄/龙">
                        <template #default="scope">
                            <div v-if="scope.row.game == 'bjl'">
                                {{ scope.row.bet_info.banker || 0 }}
                            </div>
                            <div v-if="scope.row.game == 'lh'">
                                {{ scope.row.bet_info.dragon || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="text-blue-500" prop="bet_info" label="闲/虎">
                        <template #default="scope">
                            <div v-if="scope.row.game == 'bjl'">
                                {{ scope.row.bet_info.player || 0 }}
                            </div>
                            <div v-if="scope.row.game == 'lh'">
                                {{ scope.row.bet_info.tiger || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive } from 'vue'
import pomelo from "@/socket/pomelo.js";
import global from '@/utils/global';
import { useStore } from 'vuex';

const wholesysmData = ref(null)
const loading = ref(true)
const allTableStateBetInterval = ref(null)
const countDownInterval = ref(null)
const store = useStore()

const User_Info = computed(() => store.getters["app/USER"]);
const token = computed(() => store.getters["app/SET_TOKEN"]);

function timeFormat(times) {
    if (times > 0) {
        // let days = this.addZero(
        //     Math.floor(times / 1000 / 60 / 60 / 24)
        // ); //天
        // let hours = this.addZero(
        //     Math.floor((times / 1000 / 60 / 60) % 24)
        // ); //时
        // let minutes = this.addZero(
        //     Math.floor((times / 1000 / 60) % 60)
        // ); //分
        let seconds = this.addZero(Math.floor((times / 1000) % 60)); //秒
        times--;
        return `${seconds}秒`;
    } else {
        return "0";
    }
   
}

function addZero(d) {
    return parseInt(d) < 10 ? "0" + d : d;
}

// function  daojishi(row) {
//     // console.log(row,"leeeeeeee");
//     // 绑定定时器
//     countDownInterval.value = setInterval(() => {
//         // 计算剩余时间戳
//         let residue = new Date().getTime() - new Date();
//         console.log(residue,"fuckkkkkkkkkkkk")
//         if (residue > 0) {
//             // 对每行的剩余时间进行设置
//             row.time = residue;
//         } else {
//             // 清除定时器
//             clearInterval(countDownInterval.value);
//         }
//     }, 1000);
// }

function countDownTimer() {

    //console.log(times, data, "leeeeeeeeeee");
   
    countDownInterval.value = setInterval(function () {
        for (let index = 0; index < wholesysmData.value?.length; index++) {
            let data = wholesysmData.value[index];
            var day = 0,
            hour = 0,
            minute = 0,
            second = 0;//时间默认值
        if (data?.time > 0) {
            day = Math.floor(data?.time / (60 * 60 * 24));
            hour = Math.floor(data?.time / (60 * 60)) - (day * 24);
            minute = Math.floor(data?.time / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(data?.time) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        // else if(data.time <=0){
        //     clearInterval(countDownInterval.value);
        // }

        if (second <= 9) second = '0' + second;
        data.remainTimeCN = second; //赋值给remainTimeCN显示
        //console.log(data.remainTimeCN,"remainTimeCN *************")
        data.time--;
         
        if(data.time <=0){
            clearInterval(data.time)
        }

        }

    }, 1000);

    // if (times <= 0) {
    //     clearInterval(countDownInterval.value);
    // }
}

 function allTableStateBet() {
    clearInterval(countDownInterval.value)
    // wholesysmData.value = null
    const sendStr = {
        router: 'allTableStateBet',
        JsonData: {}
    }

    pomelo.send(sendStr,  res => {
        loading.value = false
        // console.log("res of getOnlineBet *******", res.JsonData);

        var data = res.JsonData
        //console.log(data, "ddddddddddddddddd");
        var betOrderInquireForm = { tableData: [], totalItemsNum: 0 }
        var tableData = betOrderInquireForm.tableData
        // data.forEach(element => {
        //     daojishi(element)
        // });
        for (var i = 0; i < data.length; i++) {
             data[i].remainTimeCN = '00'
           // countDownTimer(data[i].time,data[i])
            // tableData[i] = {}
            // tableData[i].remainTimeCN = data[i].time
            // countDownTimer(tableData[i].remainTimeCN,data[i])
            // tableData[i].bet_info = data[i].bet_info
            // tableData[i].orderId = i + 1
            // tableData[i].deskname = data[i].deskname
            // tableData[i].state = data[i].state
            // tableData[i].cc = data[i].cc.split('-')[0]
            // tableData[i].cc1 = data[i].cc.split('-')[1]
            // tableData[i].game = data[i].game
        }
        wholesysmData.value = data
        countDownTimer()
       
    })
}

function getRelations() {
    const sendStr = {
        router: 'GetAgentTree',
        JsonData: { Id: User_Info.value?.Id, optioner_name: User_Info.value?.UserName, token: token.value }
    }
    pomelo.send(sendStr, res => {
        //console.log(res, "resssssssssssssss of GetAgentTree");
    })
    //   const en = this.$Global.en
    //   let res = await getAgentTree({ data: AES.encrypt(JSON.stringify({
    //       Id: this.$Global.optioner.Id, optioner_name: this.$Global.optioner.UserName, token: this.token,
    //       proxyname: this.isSub ? this.subInfo.name : ''
    //     }), en) })
    //   let resp = JSON.parse(AES.decrypt(res.data, en))
    //   if (resp.JsonData.code && resp.JsonData.code === 1002) {
    //     this.$message.warning('登录时效已过期，请重新登录！')
    //     setTimeout(() => {
    //       localStorage.clear()
    //       window.location.reload()
    //     }, 1000)
    //     return
    //   }
    //   if (resp.JsonData.result === 'false') return this.$message.error(resp.JsonData.msg)
    //   var treeData = {}
    //   treeData.tableData = resp.JsonData
    //   this.$store.commit('ht/setTreeData', treeData)
    //   // 抽离id, name, gx, pid(用于显示表格里的关系)
    //   this.$store.commit('ht/setAgentAllInfo', resp.JsonData)
    //   // this.getData(treeData)
    //   if (treeData.tableData.length > 0) {
    //     this.getData(treeData)
    //   }
}

onBeforeUnmount(() => {
    clearInterval(allTableStateBetInterval.value)
    clearInterval(countDownInterval.value)
    allTableStateBetInterval.value = null
    countDownInterval.value = null
})

function requestallTableStateBetSec() {
    allTableStateBetInterval.value = setInterval(() => {
        allTableStateBet()
    }, 3000);
}

// function GetSavedInfo() {
//     const sendStr = {
//       router: 'GetSavedInfo',
//       JsonData: {
//         id: User_Info.value?.Id,
//       }
//     }
//     pomelo.send(sendStr, res => {
//       console.log(' GetSavedInfo response', res)
//     })
//   }


onMounted(() => {
    // if(wholesysmData.value){
    //     for (let index = 0; index < wholesysmData.value; index++) {
    //         const data = array[index];
    //         data.remainTimeCN = '0000'
    //         countDownTimer(data.time,data)

    //     }
    // }
    console.log(token.value, "token", User_Info.value, "userinfo")
    allTableStateBet()
    requestallTableStateBetSec()
})

</script>

<style scoped>

</style>