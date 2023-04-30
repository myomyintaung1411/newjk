<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive } from 'vue'
import pomelo from "@/socket/pomelo.js";
import global from '@/utils/global';
import { ElMessage } from 'element-plus'

import moment from 'moment'
import { useStore } from "vuex";
const store = useStore();

const pagination = reactive({
    pageSize: 10,
    currentPage: 1,
    total: 0,
});

const playerTableData = ref(null)//table 2 of player

const userDD = ref(null) //table 1

const loading = ref(true)

const showTable = ref('all') //for select_radio 1
const showUserTable = ref('date') //for select_radio 2

//summeryData
const summeryData = ref(null)
const summerDataInterval = ref(null)
const sumData = ref(null)
const topTotal = ref(null)
//btn condition
const dataBtnCondition = ref(false)

const defaultTime = ref([
    new Date(2021, 10, 10, 0, 0, 0, 0),
    new Date(),
])


const Datevalue = ref('')
const accountNum = ref('')
//getAllDesk
const select_value = ref('')
const options = computed(() => store.getters["app/GetAlllDesk"])

const defaultOption = ref(['', '', ''])

//
const lhOrBaccarat = ref('')

const select_round = ref('')
const roundData = reactive([])

const block_ratio = ref('')
const blockData = reactive([
    {
        value: '111',
        label: '111'
    },
    {
        value: '222',
        label: '222'
    }
])
//
const select_dd = ref('')
const ddData = reactive([

])

const mul_select = ref('')
const multiOption = reactive([
    {
        value: '10%',
        label: '10%',
    },
    {
        value: '20%',
        label: '20%',
    },
    {
        value: '30%',
        label: '30%',
    },
    {
        value: '40%',
        label: '40%',
    },
    {
        value: '50%',
        label: '50%',
    },
    {
        value: '60%',
        label: '60%',
    },
    {
        value: '70%',
        label: '70%',
    },
    {
        value: '80%',
        label: '80%',
    },
    {
        value: '90%',
        label: '90%',
    },
    {
        value: '100%',
        label: '100%',
    },
])

const tableData = reactive([
    {
        1: '12987122',
        2: 'Tom',
        3: '234',
        4: '3.2',
        5: 10,
        6: 10,
        7: 10,
        8: 10,
        9: 10,
        10: 10,
    },
])

const showTestColumn = ref(false)
//select type
const select_type = ref(1)
//radio
const select_radio = ref(1)

const datePicked = ($event) => {
    if ($event == null) {
        console.log($event, 'leeeeeeeeeeenulllll');
        defaultTime.value = [
            new Date(2021, 10, 10, 0, 0, 0, 0),
            new Date()
        ]
    } else {
        defaultTime.value = $event
    }
    console.log($event, "lllllllllllllllll");
}
function transGameStr(strGame) {
    // 游戏类型转换
    var msg = {
        bjl: '百家乐',
        lh: '龙虎',
        nn: '牛牛',
        xjh: '炸金花',
        dx: '大小',
        tts: '推筒子',
        ssc: '时时彩',
        jsk3: '江苏快3',
        bjcs: '北京赛车',
        all: '全部'
    }
    return msg[strGame]
}
const gameTypeChange = (data) => {
    let gameInfo = data.split(',')
    defaultOption.value = gameInfo
    // lhOrBaccarat.value = gameInfo[2]
    console.log(gameInfo, "dffsvft4ew");
}

const selectChange = (val) => {
    console.log(val, 'radio &&&');
}

const disable_ddData = computed(() => {
    if (!select_round.value) {
        select_dd.value = ''
        return true
    } else {
        return false
    }
})

//show table two
function showtableTwo() {
    if (select_type.value == 2 && (select_value.value || select_round.value)) {
        // console.log("ddd yes");
        return true
    } else {
        //console.log("false");
        return false
    }
}
//show table three
function showtableThree() {
    if (select_type.value == 2 && (select_value.value && select_round.value)) {
        // console.log("ddd yes");
        return true
    } else {
        //console.log("false");
        return false
    }
}
//show table four
function showtableFour() {
    if (select_type.value == 2 && (select_value.value && select_round.value && select_dd.value && accountNum.value)) {
        // console.log("ddd yes");
        return true
    } else {
        //console.log("false");
        return false
    }
}

function transTime(times) {
    moment.suppressDeprecationWarnings = true;
    return moment(times).format('YYYY-MM-DD HH:mm:ss')
}
function currentRow(row) {
    console.log(row, "lesersdf")
}

function getSummaries(param) {
    const { columns, data } = param;
    /*   console.log(1234)
     console.log(param)   */
    const sums = [];

    columns.forEach((column, index) => {
        if (column.label === '台号') {
            sums[index] = '合计';//可更改合计行的名称 The name of the total row can be changed
            return;
        }

        const values = data?.map(item => {
            return Number(item[column.property])//property为表头的prop值 property is the prop value of the header
        });
        if (column.property === 'bet_info') {
            switch (column.label) {
                case "庄/龙":
                    sums[index] = sumData.value?.banker
                    break;
                case "闲/虎":
                    sums[index] = sumData.value?.player
                    break;
                case "庄对":
                    sums[index] = sumData.value?.b_pair
                    break;
                case "和":
                    sums[index] = sumData.value?.tie
                    break;
                case "闲对":
                    sums[index] = sumData.value?.p_pair
                    break;
                default:
                    break;
            }
        } else if (column.property === 'betMoney') {
            sums[index] = values?.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                    return prev + curr;
                } else {
                    return prev;
                }
            }, 0);
            sums[index];

        }

    });


    return sums;
}
//for user table merge
function objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    const span = column['property'] + '-span'
    console.log(column['property'])
    if (row[span]) {
        console.log('咧咧咧');
        console.log(row[span])
        console.log(rowIndex + '行' + '----' + columnIndex + '列')
        return row[span]
    }
}

function mergeTableRow(data, merge) {
    if (!merge || merge?.length === 0) {
        return data
    }
    // m为需要合并的字段名
    merge.forEach((m) => {
        const mList = {}
        //遍历表格数据 v为一行的数据 
        data = data?.map((v, index) => {
            //当前遍历行对应合并字段的值 
            const rowVal = v[m]
            if (mList[rowVal] && mList[rowVal]?.newIndex === index) {
                //当前行与上一行的项目编码相同时才设置
                if (data[index]['itemCode'] == data[index - 1]['itemCode']) {
                    mList[rowVal]['num']++;
                    mList[rowVal]['newIndex']++;
                    data[mList[rowVal]['index']][m + '-span'].rowspan++;
                    data[mList[rowVal]['index']]['select-span'].rowspan++;
                    v[m + '-span'] = {
                        rowspan: 0,
                        colspan: 0
                    }
                    v['select-span'] = {
                        rowspan: 0,
                        colspan: 0
                    }
                } else {
                    mList[rowVal] = { num: 1, index: index, newIndex: index + 1 }
                    v[m + '-span'] = {
                        rowspan: 1,
                        colspan: 1
                    }
                    v['select-span'] = {
                        rowspan: 1,
                        colspan: 1
                    }
                }

            } else {
                mList[rowVal] = { num: 1, index: index, newIndex: index + 1 }
                v[m + '-span'] = {
                    rowspan: 1,
                    colspan: 1
                }
                v['select-span'] = {
                    rowspan: 1,
                    colspan: 1
                }
            }
            return v
        })
    })
    return data
}

// function mergeTableRow(data, merge) {
//     console.log(data,"leeeeeee");
//     if (!merge || merge.length === 0) {
//         return data
//     }
//     merge.forEach((m) => {
//         const mList = {}
//         data = data.map((v, index) => {
//             const rowVal = v[m]
//             if (mList[rowVal]) {
//                 mList[rowVal]++
//                 data[index - (mList[rowVal] - 1)][m + '-span'].rowspan++
//                 v[m + '-span'] = {
//                     rowspan: 0,
//                     colspan: 0
//                 }
//             } else {
//                 mList[rowVal] = 1
//                 v[m + '-span'] = {
//                     rowspan: 1,
//                     colspan: 1
//                 }
//             }
//             return v
//         })
//     })
//     return data
// }

//   function  handleSpanMethod({ row, column, rowIndex, columnIndex }) {
//       if (columnIndex === 0) {
//         // 第一列 column1
//         const _row_1 = column1Arr.value[rowIndex]
//         const _col_1 = _row_1 > 0 ? 1 : 0
//         return {
//           rowspan: _row_1,
//           colspan: _col_1
//         }
//       } else if (columnIndex === 1) {
//         // 第二列 column2
//         const _row_2 = column2Arr.value[rowIndex]
//         const _col_2 = _row_2 > 0 ? 1 : 0
//         return {
//           rowspan: _row_2,
//           colspan: _col_2
//         }
//       } else if (columnIndex === 2) {
//         // 第二列 column2
//         const _row_3 = column3Arr.value[rowIndex]
//         const _col_3 = _row_3 > 0 ? 1 : 0
//         return {
//           rowspan: _row_3,
//           colspan: _col_3
//         }
//       } 
//     }



function getTotalInfo() {
    let sendStr = ''
    if (showTable.value == 'all') {
        sendStr = {
            router: 'getAllDeskTotalInfo',
            JsonData: {
                deskNum: 'all',
                roomId: '',
                rType: '',
                startTime: moment(new Date(defaultTime.value[0])).startOf('day').format("YYYY-MM-DD HH:mm:ss"),
                endTime: moment(new Date(defaultTime.value[1])).endOf('day').format("YYYY-MM-DD HH:mm:ss"),
                isSettlement: 1 // only 1
            }
        }
    } else if (showTable.value == 'user') {
        sendStr = {
            router: 'getDeskUserTotalInfo',
            JsonData: {
                deskNum: defaultOption.value[2] || 'all',
                roomId: defaultOption.value[0] || '',
                rType: defaultOption.value[1] || '',
                jc: select_dd.value,
                cc: select_round.value || '',
                zc: JSON.stringify(mul_select.value),
                //account:  accountNum.value || '',
                startTime: moment(new Date(defaultTime.value[0])).startOf('day').format("YYYY-MM-DD HH:mm:ss"),
                endTime: moment(new Date(defaultTime.value[1])).endOf('day').format("YYYY-MM-DD HH:mm:ss"),
                isSettlement: 1 // only 1
            }
        }
    }
    else {
        sendStr = {
            router: 'getTotalInfo',
            JsonData: {
                deskNum: defaultOption.value[2] || 'all',
                roomId: defaultOption.value[0] || '',
                rType: defaultOption.value[1] || '',
                jc: select_dd.value,
                cc: select_round.value || '',
                zc: JSON.stringify(mul_select.value),
                account: accountNum.value || '',
                startTime: moment(new Date(defaultTime.value[0])).startOf('day').format("YYYY-MM-DD HH:mm:ss"),
                endTime: moment(new Date(defaultTime.value[1])).endOf('day').format("YYYY-MM-DD HH:mm:ss"),
                isSettlement: 1 // only 1
            }
        }
    }
    console.log(sendStr, "sendingData of getTotalInfo");
    pomelo.send(sendStr, res => {
        loading.value = false
        console.log('resp of getTotalInfo', res)
        sumData.value = res?.summary
        topTotal.value = res?.top_total
        var data = res.JsonData
        var betOrderInquireForm = { tableData: [], totalItemsNum: 0 }
        var tableData = betOrderInquireForm.tableData

        for (var i = 0; i < data?.length; i++) {
            tableData[i] = {}
            tableData[i].bet_info = data[i].bet_info
            // console.log(typeof tableData[i].bet_info.banker);
            tableData[i].orderId = i + 1
            tableData[i].name = data[i].name
            tableData[i].userName = data[i].userName

            tableData[i].rType = data[i].rType
            tableData[i].gameType = global.transGameStr(data[i].rType)
            // tableData[i].betTime = data[i].time
            tableData[i].tableNum = data[i].roomName
            tableData[i].upperzc = data[i].upper_zc
            tableData[i].stime = transTime(data[i].stime)
            tableData[i].betTime = transTime(data[i].betTime)
            tableData[i].kj = data[i].kj
            tableData[i].ye = data[i].ye
            tableData[i].cc = data[i].cc.split('-')[0]
            tableData[i].cc1 = data[i].cc.split('-')[1]
            tableData[i].memberName = data[i].reference_name
            tableData[i].betOrderInfo = global.trasBetResult(data[i].rType, data[i].xzmx)
            tableData[i].betMoney = data[i].xz
            tableData[i].betMoney = data[i].xz
            tableData[i].xmf = data[i].xmf?.toFixed(2)
            tableData[i].ip = data[i].ip // 权限表
            tableData[i].terminal = data[i].terminal
            tableData[i].winlose = (data[i].yl).toFixed(2)
            tableData[i].table_diff = data[i].table_diff?.toFixed(2)
            tableData[i].company_diff = data[i].company_diff?.toFixed(2)
            tableData[i].table_winlose = (data[i].table_winlose).toFixed(2)
            tableData[i].company_winlose = (data[i].company_winlose).toFixed(2)

            let resultData = global.betInfoData(data[i].xzmx, tableData[i].rType)
            tableData[i].niuniu = resultData[0]
            tableData[i].niuniuBet = resultData[1]
            tableData[i].showResult = tableData[i].niuniu.map((item, index) => {
                return item + ':' + tableData[i].niuniuBet[index]
            })
            tableData[i].tablePara = global.getTablePara(
                data[i].rType,
                tableData[i].betOrderInfo
            )
        }
        // if(showTable == 'user'){
        //     getRowSpan()
        // }
        betOrderInquireForm.totalItemsNum = res?.totalItem
        pagination.total = res?.totalItem //pagination total
        summeryData.value = betOrderInquireForm
        userDD.value = mergeTableRow(betOrderInquireForm?.tableData, ['tableNum', 'cc', 'cc1'])

    })
}

function getPlayerTotalInfo() {
    let sendStr
    if (showUserTable.value == 'date') {
        sendStr = {
            router: 'getPlayerTotalInfoPerDay',
            JsonData: {
                deskNum: defaultOption.value[2] || 'all',
                startTime: moment(new Date(defaultTime.value[0])).startOf('day').format("YYYY-MM-DD HH:mm:ss"),
                endTime: moment(new Date(defaultTime.value[1])).endOf('day').format("YYYY-MM-DD HH:mm:ss"),
                isSettlement: 1, // only 1
                pageSize: pagination.pageSize,
                currentPage: pagination.currentPage
            }
        }
    } else if (showUserTable.value == 'user') {
        if (accountNum.value == '') {
            return ElMessage.error('Oops, 请输入账户名.')
        }
        sendStr = {
            router: 'getOnePlayerTotalInfoPerDay',
            JsonData: {
                account: accountNum.value,
                deskNum: defaultOption.value[2] || 'all',
                startTime: moment(new Date(defaultTime.value[0])).startOf('day').format("YYYY-MM-DD HH:mm:ss"),
                endTime: moment(new Date(defaultTime.value[1])).endOf('day').format("YYYY-MM-DD HH:mm:ss"),
                isSettlement: 1,// only 1
                pageSize: pagination.pageSize,
                currentPage: pagination.currentPage
            }
        }
    } else {
        if (accountNum.value == '' && select_value.value == '') {
            return ElMessage.error('Oops, 请输入用户名并选择表格.')
        }
        sendStr = {
            router: 'findOnePlayerOneDeskInfo',
            JsonData: {
                account: accountNum.value,
                deskNum: defaultOption.value[2] || 'all',
                roomId: defaultOption.value[0] || '',
                rType: defaultOption.value[1] || '',
                startTime: moment(new Date(defaultTime.value[0])).startOf('day').format("YYYY-MM-DD HH:mm:ss"),
                endTime: moment(new Date(defaultTime.value[1])).endOf('day').format("YYYY-MM-DD HH:mm:ss"),
                isSettlement: 1,// only 1
                pageSize: pagination.pageSize,
                currentPage: pagination.currentPage
            }
        }
    }
    console.log(sendStr, 'lllllllllllllllll');

    pomelo.send(sendStr, res => {
        console.log('resp player data ', res)
        sumData.value = res?.summary
        topTotal.value = res?.top_total
        var data = res.JsonData
        var betOrderInquireForm = { tableData: [], totalItemsNum: 0 }
        var tableData = betOrderInquireForm.tableData

        for (var i = 0; i < data?.length; i++) {
            tableData[i] = {}
            tableData[i].bet_info = data[i].bet_info
            // console.log(typeof tableData[i].bet_info.banker);
            tableData[i].orderId = i + 1
            tableData[i].name = data[i].name
            tableData[i].userName = data[i].userName
            tableData[i].userId = data[i].userId
            tableData[i].gameType = data[i].gameType

            tableData[i].top_zc = data[i].top_zc
            tableData[i].tzcs = data[i].tzcs
            // tableData[i].gameType = global.transGameStr(data[i].rType)
            // tableData[i].betTime = data[i].time
            tableData[i].tableNum = data[i].roomName
            tableData[i].cc = data[i].cc?.split('-')[0]
            tableData[i].cc1 = data[i].cc?.split('-')[1]
            tableData[i].upperzc = data[i].upper_zc
            tableData[i].stime = transTime(data[i].stime)
            tableData[i].betTime = transTime(data[i].time)
            tableData[i].kj = data[i].kj
            tableData[i].ye = data[i].ye
            tableData[i].memberName = data[i].reference_name
            // tableData[i].betOrderInfo = global.trasBetResult(data[i].rType, data[i].xzmx)
            tableData[i].betMoney = data[i].xz
            tableData[i].betMoney = data[i].xz
            tableData[i].xml_s = data[i].xml_s
            tableData[i].xmf = data[i].xmf?.toFixed(2)
            tableData[i].xmType = data[i].xmType
            tableData[i].xml_d = data[i].xml_d
            tableData[i].ip = data[i].ip // 权限表
            tableData[i].terminal = data[i].terminal
            tableData[i].winlose = (data[i].yl).toFixed(2)
            tableData[i].table_diff = data[i].table_diff?.toFixed(2)
            tableData[i].company_diff = data[i].company_diff?.toFixed(2)
            tableData[i].company_winlose = data[i].company_winlose?.toFixed(2)
            // tableData[i].table_winlose = (data[i].table_winlose).toFixed(2)
            // tableData[i].company_winlose = (data[i].company_winlose).toFixed(2)
        }
        betOrderInquireForm.totalItemsNum = res?.totalItem
        pagination.total = res?.totalItem //pagination total
        playerTableData.value = betOrderInquireForm
    })
}

// const changeRadio = (val) => {
//     pagination.pageSize = 10
//     pagination.currentPage = 1
//     pagination.total = 0
//     console.log(val);
//     if (val == 2) {
//         getPlayerTotalInfo()
//     }
// }
const changeRadio = (val) => {
    select_radio.value = val
    pagination.pageSize = 10
    pagination.currentPage = 1
    pagination.total = 0
    console.log(val);
    if (val == 2) {
        getPlayerTotalInfo()
    }
}


function Time(times) {
    moment.suppressDeprecationWarnings = true;
    return moment(times).format('YYYY-MM-DD')
}

function ccSplit(data, index) {
    let num = data.split('-')
    if (index == 0) {
        return num[0]
    } else {
        return num[1]
    }
}

function reqData(txt) {
    showTable.value = txt
    pagination.pageSize = 10
    pagination.currentPage = 1
    pagination.total = 0
    if (select_radio.value == 2) return
    console.log(showTable.value);
    switch (txt) {
        case 'all':
            summeryData.value = null
            userDD.value = null
            // getTotalInfo()
            break;
        case 'only':
            summeryData.value = null
            userDD.value = null
            // getTotalInfo()
            break;
        case 'time':

            summeryData.value = null
            userDD.value = null
            // getTotalInfo()
            break;
        case 'user':
            userDD.value = null
            summeryData.value = null
            // getTotalUserInfo()

            break;
        default:
            break;
    }
    getTotalInfo()

}
const handleSizeChange = (val) => {
    pagination.pageSize = val
    handleCurrentChange(1);
}

const handleCurrentChange = (val) => {
    pagination.currentPage = val
    var size = pagination.pageSize
    if (select_radio.value == 1) {
        getTotalInfo()
    } else {
        playerTableData.value = getPlayerTotalInfo()
    }
    // onlineBetData.value = getOnlineBet()
}
function reqTableData2(txt) {
    showUserTable.value = txt
    pagination.pageSize = 10
    pagination.currentPage = 1
    pagination.total = 0

    if (select_radio.value == 1) return
    console.log(showUserTable.value);
    switch (txt) {
        case 'date':
            playerTableData.value = null
            break;
        case 'user':
            playerTableData.value = null
            break;
        case 'all':
            playerTableData.value = null
            break;

        default:
            break;
    }
    getPlayerTotalInfo()
}
function reqapiData() {
    getTotalInfo()
}
function reqapiData2() {
    // getTotalInfo()
    getPlayerTotalInfo()
}

function requestsummerDataFiveSec() {
    summerDataInterval.value = setInterval(() => {
        getTotalInfo()
        console.log("3 log second");
    }, 3000);
    // }
}

onBeforeUnmount(() => {
    clearInterval(summerDataInterval.value)
    summerDataInterval.value = null
})

function roundDataPush() {
    if (roundData.length == 0) {
        for (let index = 0; index < 101; index++) {
            if (index == 0) {
                roundData.push({ value: 'all', label: '全部' })
            } else {

                roundData.push({ value: index, label: index })
            }
        }
    }
}
function ddDataPush() {
    if (ddData.length == 0) {
        for (let index = 0; index < 40; index++) {
            if (index == 0) {
                ddData.push({ value: 'all', label: '全部' })
            } else {

                ddData.push({ value: index, label: index })
            }
        }
    }
}

onMounted(() => {
    roundDataPush()
    ddDataPush()
    getTotalInfo()
    //requestsummerDataFiveSec()
})
</script>

<template>
    <section class="w-full min-w-[1300px]">
        <div class="flex items-center px-3 justify-start py-2 bg-slate-800 mt-2">
            <!-- <div class="text-xl  font-bold tracking-[3px]">
                输赢汇总
            </div> -->

            <div v-if="select_radio == 1" class="btn flex cursor-pointer text-sm tracking-widest">
                <div @click="reqData('all')" class="py-1 text-center px-5  whitespace-nowrap border-r border-slate-400"
                    :class="showTable == 'all' ? 'bg-slate-600' : 'bg-blue-500'">全部台桌</div>
                <div @click="reqData('only')" class="py-1 text-center px-5  whitespace-nowrap border-r border-slate-400"
                    :class="showTable == 'only' ? 'bg-slate-600' : 'bg-blue-500'">单台监控</div>
                <div @click="reqData('time')" class="py-1 text-center px-5  whitespace-nowrap border-r border-slate-400"
                    :class="showTable == 'time' ? 'bg-slate-600' : 'bg-blue-500'">单台选时间</div>
                <div @click="reqData('user')" class="py-1 text-center px-5  whitespace-nowrap border-r border-slate-400"
                    :class="showTable == 'user' ? 'bg-slate-600' : 'bg-blue-500'">会员信息查询</div>
                <div @click="reqapiData()" class="px-5 py-1  whitespace-nowrap bg-blue-500">请求数据</div>
            </div>

            <div v-if="select_radio == 2" class="btn flex cursor-pointer text-sm tracking-widest">
                <div @click="reqTableData2('date')"
                    class="py-1 text-center px-5  whitespace-nowrap border-r border-slate-400"
                    :class="showUserTable == 'date' ? 'bg-slate-600' : 'bg-blue-500'">总会员/天</div>
                <div @click="reqTableData2('user')"
                    class="py-1 text-center px-5  whitespace-nowrap border-r border-slate-400"
                    :class="showUserTable == 'user' ? 'bg-slate-600' : 'bg-blue-500'">单会员/台/天</div>
                <div @click="reqTableData2('all')"
                    class="py-1 text-center px-5  whitespace-nowrap border-r border-slate-400"
                    :class="showUserTable == 'all' ? 'bg-slate-600' : 'bg-blue-500'">输赢明细</div>
                <div @click="reqapiData2()" class="px-5 py-1  whitespace-nowrap bg-blue-500">请求数据</div>
            </div>

        </div>
        <section class="w-full bg-slate-800 px-3 h-[160px]  flex">
            <section v-if="select_radio == 1 && showTable == 'user'" class="flex flex-col w-[300px]  space-y-1">
                <div class="w-full text-white  flex items-center space-x-3">
                    <div class="w-[100px]">
                        <span class="text-sm">选择类型</span>
                    </div>

                    <div class="w-[200px] flex items-center  py-0 cursor-pointer  ">
                        <div @click="changeRadio(1)" class="w-[100px] text-sm py-[5px] rounded-l  text-center"
                         :class="(select_radio == 1) ? 'bg-blue-500 text-white' : 'text-black bg-white'"
                        >台桌</div>
                        <div @click="changeRadio(2)" class="w-[100px] py-[5px] text-sm text-center rounded-r"
                        :class="(select_radio == 2) ? 'bg-blue-500 text-white' : 'text-black bg-white'"
                        >会员</div>
                    </div>
                </div>
               
               
                <div class=" w-full flex items-center">
                    <div class="w-[100px]">
                        <span class="text-sm ">时间</span>
                    </div>
                    <div class="w-[200px]     ">
                        <div class="demo-date-picker ">
                            <div class="block w-full">

                                <el-date-picker v-model="Datevalue" type="daterange" start-placeholder="开始日期"
                                    @change="datePicked($event)" end-placeholder="结束日期" :default-time="defaultTime"
                                    class="max-w-full" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full  flex items-center  whitespace-nowrap">
                    <div class="w-[100px]">
                        <span class="text-sm">屏蔽占股比例</span>
                    </div>

                    <div class="w-[200px]    max-h-[50px] z-10  ">
                        <el-select v-model="mul_select" multiple filterable :reserve-keyword="false" clearable
                            default-first-option collapse-tags placeholder="屏蔽占成比例"
                            class="max-h-[100px] overflow-y-auto w-full">
                            <el-option v-for="item in multiOption" :key="item.label" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>



                <div class="w-full flex  items-center space-x-3">
                    <div class="w-[100px]">
                        <span class="text-sm">账号输入</span>
                    </div>
                    <div class="w-[230px]">
                        <el-input v-model="accountNum" clearable placeholder="账号输入" />
                    </div>
                </div>
            </section>
            <section v-else class="flex flex-col w-[300px]  space-y-1">

                <div class=" w-full flex items-center">
                    <div class="w-[100px]">
                        <span class="text-sm ">时间</span>
                    </div>
                    <div class="w-[200px]     ">
                        <div class="demo-date-picker ">
                            <div class="block w-full">

                                <el-date-picker v-model="Datevalue" type="daterange" start-placeholder="开始日期"
                                    @change="datePicked($event)" end-placeholder="结束日期" :default-time="defaultTime"
                                    class="max-w-full" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full  flex items-center  whitespace-nowrap">
                    <div class="w-[100px]">
                        <span class="text-sm">屏蔽占股比例</span>
                    </div>

                    <div class="w-[200px]    max-h-[50px] z-10  ">
                        <el-select v-model="mul_select" multiple filterable :reserve-keyword="false" clearable
                            default-first-option collapse-tags placeholder="屏蔽占成比例"
                            class="max-h-[100px] overflow-y-auto w-full">
                            <el-option v-for="item in multiOption" :key="item.label" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="w-full text-white  flex items-center space-x-3">
                    <div class="w-[100px]">
                        <span class="text-sm">选择类型</span>
                    </div>

                    <div class="w-[200px] flex items-center  py-0 cursor-pointer  ">
                        <div @click="changeRadio(1)" class="w-[100px] text-sm py-[5px] rounded-l  text-center"
                         :class="(select_radio == 1) ? 'bg-blue-500 text-white' : 'text-black bg-white'"
                        >台桌</div>
                        <div @click="changeRadio(2)" class="w-[100px] py-[5px] text-sm text-center rounded-r"
                        :class="(select_radio == 2) ? 'bg-blue-500 text-white' : 'text-black bg-white'"
                        >会员</div>
                    </div>
                </div>



                <div class="w-full flex  items-center space-x-3">
                    <div class="w-[100px]">
                        <span class="text-sm">账号输入</span>
                    </div>
                    <div class="w-[230px]">
                        <el-input v-model="accountNum" clearable placeholder="账号输入" />
                    </div>
                </div>
            </section>

            <!-- 2 -->
            <section class="flex flex-col space-y-1 w-[280px] ml-3   ">
                <!-- <div class="w-[350px]  flex items-center space-x-3 whitespace-nowrap">
                    <span>屏蔽占股比例</span>
                    <div class="w-[200px]   max-h-[50px] z-10  ">
                        <el-select v-model="mul_select" multiple filterable :reserve-keyword="false" clearable
                            default-first-option collapse-tags placeholder="屏蔽占成比例"
                            class="max-h-[100px] overflow-y-auto">
                            <el-option v-for="item in multiOption" :key="item.label" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div> -->
                <div class="w-full flex items-center">
                    <div class="w-[100px]">
                        <span class="text-sm">台桌选择</span>
                    </div>
                    <div class="w-[200px]">
                        <el-select v-model="select_value" @change="gameTypeChange" clearable class="w-[200px]"
                            placeholder="台桌 选择">
                            <el-option v-for="item in options" :key="item.rType"
                                :label="transGameStr(item.rType) + item.roomName"
                                :value="item.roomId + ',' + item.rType + ',' + [item.roomName]">
                                <span style="float:left" class="px-3">{{ transGameStr(item.rType) }}</span>
                                <span style="float:right;color:var(--el-text-color-secondary);
                                font-size:13px;">{{ item.roomName }}</span>
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <!-- <div class="w-full flex items-center">
                    <div class="w-[100px]">
                        <span class="text-sm"> 选择局数</span>
                    </div>
                    <div class="w-[200px]">
                        <el-select v-model="select_round" class="w-[200px]" clearable placeholder="选择局数">
                            <el-option v-for="item in roundData" :key="item.label" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div> -->

                <div class="w-full flex items-center">
                    <div class="w-[100px]">
                        <span class="text-sm"> 选择局数</span>
                    </div>
                    <div class="w-[200px]  py-0">
                        <el-select v-model="select_round" class="w-[200px]" clearable placeholder="选择局数">
                            <el-option v-for="item in roundData" :key="item.label" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="w-full flex items-center">
                    <div class="w-[100px]">
                        <span>选择口数</span>
                    </div>
                    <div class="w-[200px]">
                        <el-select v-model="select_dd" :disabled="disable_ddData" class="w-[200px]" clearable
                            placeholder="选择口数">
                            <el-option v-for="item in ddData" :key="item.label" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </section>
            <!-- 3 -->
            <section class="flex flex-col relative w-[280px] ml-3 space-y-1 ">
                <div class="flex items-center w-full  ">
                    <div class="w-[80px]"><span  class="text-sm">洗码额</span></div>
                    <div class="h-[32px] px-5 font-bold text-xl rounded bg-white w-[200px] text-black">
                        {{ topTotal?.xml.toFixed(2) || 0 }}
                    </div>
                </div>
                <div class="flex items-center  w-full ">
                    <div class="w-[80px]"><span  class="text-sm">代理利润</span></div>
                    <div class="h-[32px] px-5 font-bold text-xl rounded bg-white w-[200px] text-black">
                        {{ topTotal?.agent_winlose.toFixed(2) || 0 }}
                    </div>
                </div>

                <div class="flex items-center  w-full  ">
                    <div class="w-[80px]"><span  class="text-sm">洗码费</span></div>
                    <div class="h-[32px] px-5 font-bold text-xl rounded bg-white w-[200px] text-black">
                        {{ topTotal?.xmf.toFixed(2) || 0 }}
                    </div>
                </div>
                <div class="flex items-center w-full ">
                    <div class="w-[80px]"><span  class="text-sm">公司利润</span></div>
                    <div class="h-[32px] px-5 font-bold text-xl rounded bg-white w-[200px] text-black">
                        {{ topTotal?.company_winlose.toFixed(2) || 0 }}
                    </div>
                </div>
            </section>

            <!-- 4 -->
            <section class="flex flex-col w-[280px] ml-3 space-y-1">
                <div class="flex items-center w-full">
                    <div class="w-[80px]"><span  class="text-sm">投注金额</span></div>
                    <div class="py-[3px] rounded px-4 font-bold text-xl bg-white w-[200px] text-black">
                        {{ topTotal?.xz.toFixed(2) || 0 }}
                    </div>
                </div>
                <div class="flex items-center w-full">
                    <div class="w-[80px]"><span  class="text-sm">客户输赢</span></div>
                    <div class="py-[3px]  px-5 font-bold text-xl rounded bg-white w-[200px] text-black">
                        {{ topTotal?.user_winlose.toFixed(2) || 0 }}
                    </div>
                </div>
            </section>

        </section>

        <section v-if="select_radio == 1 && showTable != 'user'" class="w-full py-3 relative tableHeight">
            <el-table v-if="showTable != 'user'" :data="summeryData?.tableData" show-summary height="100%"
                max-height="100%" :summary-method="getSummaries" v-loading="loading" border
                :header-cell-style="{ textAlign: 'center' }" style="width: 100%">
                <el-table-column v-if="showTable == 'only' || showTable == 'time'" prop="stime" label="日期" width="160"
                    align="center" />
                <el-table-column prop="tableNum" label="台号" align="center" />
                <el-table-column v-if="showTable != 'all'" prop="cc" label="局数" align="center">
                    <template #default="scope">
                        <div>
                            {{ scope.row.cc }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="showTable == 'only'" prop="cc1" label="口数" align="center">
                    <template #default="scope">
                        <div>
                            {{ scope.row.cc1 }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column v-if="showTable == 'only'" prop="betTime" width="160" label="开奖时间" align="center" />
                <el-table-column v-if="showTable == 'only'" prop="kj" label="开奖结果" align="center" />

                <el-table-column label="会 员 下 注">
                    <el-table-column class-name="text-red-500 " prop="bet_info" label="庄/龙" align="center">
                        <template #default="scope">
                            <div v-if="scope.row.rType == 'bjl'">
                                {{ scope.row.bet_info.banker || 0 }}
                            </div>
                            <div v-if="scope.row.rType == 'lh'">
                                {{ scope.row.bet_info.dragon || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="text-blue-500" prop="bet_info" label="闲/虎" align="center">
                        <template #default="scope">
                            <div v-if="scope.row.rType == 'bjl'">
                                {{ scope.row.bet_info.player || 0 }}
                            </div>
                            <div v-if="scope.row.rType == 'lh'">
                                {{ scope.row.bet_info.tiger || 0 }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column class-name="text-red-500" prop="bet_info" label="庄对" align="center">
                        <template #default="scope">
                            <div>
                                {{ scope.row.bet_info.b_pair || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="text-green-500" prop="bet_info" label="和" align="center">
                        <template #default="scope">
                            <div>
                                {{ scope.row.bet_info.tie || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="text-blue-500" prop="bet_info" label="闲对" align="center">
                        <template #default="scope">
                            <div>
                                {{ scope.row.bet_info.p_pair || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <!-- if select type is all -->
                <el-table-column v-if="showTable == 'all' || showTable == 'time'" label="统         计" align="center">
                    <el-table-column prop="betMoney" label="总投注" align="center" />

                    <el-table-column prop="table_diff" label="台面差额" align="center">

                        <template #default="scope">
                            <div :class="scope.row.table_diff < 0 ? 'text-blue-500' : 'text-red-500'">
                                {{ Math.abs(scope.row.table_diff).toFixed(2) }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="company_diff" label="公司差额" align="center">

                        <template #default="scope">
                            <div :class="scope.row.company_diff < 0 ? 'text-blue-500' : 'text-red-500'">
                                {{ Math.abs(scope.row.company_diff).toFixed(2) }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="table_winlose" label="台桌输赢" align="center" />
                    <el-table-column prop="xmf" label="洗码费" align="center" />
                    <el-table-column prop="winlose" label="会员输赢" align="center" />
                    <el-table-column prop="company_winlose" label="公司利润" align="center" />
                </el-table-column>

                <el-table-column v-if="showTable == 'only'" label="统    计   结   果" align="center">
                    <el-table-column prop="betMoney" label="总投注" align="center" />
                    <el-table-column prop="table_diff" label="台面差额" align="center">
                        <template #default="scope">
                            <div :class="scope.row.table_diff < 0 ? 'text-blue-500' : 'text-red-500'">
                                {{ Math.abs(scope.row.table_diff).toFixed(2) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="company_diff" label="公司差额" align="center">
                        <template #default="scope">
                            <div :class="scope.row.company_diff < 0 ? 'text-blue-500' : 'text-red-500'">
                                {{ Math.abs(scope.row.company_diff).toFixed(2) }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="table_winlose" label="台桌输赢" align="center" />
                    <el-table-column prop="xmf" label="洗码费 " align="center" />
                    <el-table-column prop="company_winlose" label="公司利润" align="center" />
                </el-table-column>

            </el-table>

        </section>
        <!-- {{userDD}} -->
        <section v-if="select_radio == 1 && showTable == 'user'" class="w-full py-3 relative tableHeight">
            <el-table v-if="showTable == 'user'" :data="userDD" show-summary :summary-method="getSummaries"
                v-loading="loading" border :header-cell-style="{ textAlign: 'center' }" style="width: 100%"
                :span-method="objectSpanMethod" height="100%" max-height="100%">

                <el-table-column prop="tableNum" label="台号" align="center" />
                <el-table-column prop="cc" label="局数" align="center">
                    <template #default="scope">
                        <div>
                            <!-- {{ ccSplit(scope.row.cc, 0) }} -->
                            {{ scope.row.cc }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="cc1" label="口数" align="center">
                    <template #default="scope">
                        <div>
                            {{ scope.row.cc1 }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="userName" label="会员" align="center"></el-table-column>

                <el-table-column label="会 员 下 注">
                    <el-table-column class-name="text-red-500 " prop="bet_info" label="庄/龙" align="center">
                        <template #default="scope">
                            <div v-if="scope.row.rType == 'bjl'">
                                {{ scope.row.bet_info.banker || 0 }}
                            </div>
                            <div v-if="scope.row.rType == 'lh'">
                                {{ scope.row.bet_info.dragon || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="text-blue-500" prop="bet_info" label="闲/虎" align="center">
                        <template #default="scope">
                            <div v-if="scope.row.rType == 'bjl'">
                                {{ scope.row.bet_info.player || 0 }}
                            </div>
                            <div v-if="scope.row.rType == 'lh'">
                                {{ scope.row.bet_info.tiger || 0 }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column class-name="text-red-500" prop="bet_info" label="庄对" align="center">
                        <template #default="scope">
                            <div>
                                {{ scope.row.bet_info.b_pair || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="text-green-500" prop="bet_info" label="和" align="center">
                        <template #default="scope">
                            <div>
                                {{ scope.row.bet_info.tie || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="text-blue-500" prop="bet_info" label="闲对" align="center">
                        <template #default="scope">
                            <div>
                                {{ scope.row.bet_info.p_pair || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <!-- if select type is all -->
                <el-table-column label="统         计" align="center">
                    <el-table-column prop="betMoney" label="总投注" align="center" />

                    <el-table-column prop="table_diff" label="台面差额" align="center">

                        <template #default="scope">
                            <div :class="scope.row.table_diff < 0 ? 'text-blue-500' : 'text-red-500'">
                                {{ Math.abs(scope.row.table_diff).toFixed(2) }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="company_diff" label="公司差额" align="center">

                        <template #default="scope">
                            <div :class="scope.row.company_diff < 0 ? 'text-blue-500' : 'text-red-500'">
                                {{ Math.abs(scope.row.company_diff).toFixed(2) }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="table_winlose" label="台桌输赢" align="center" />
                    <el-table-column prop="xmf" label="洗码费" align="center" />
                    <el-table-column prop="winlose" label="会员输赢" align="center" />
                    <el-table-column prop="company_winlose" label="公司利润" align="center" />
                </el-table-column>
            </el-table>
        </section>

        <section v-if="select_radio == 2 && showUserTable == 'date'" class="w-full py-3 relative tableHeight">
            <el-table :data="playerTableData?.tableData" border :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }" style="width: 100%" height="100%" max-height="100%">
                <el-table-column prop="orderId" label="序号" align="center" />
                <el-table-column prop="name" label="会员号" align="center" />
                <el-table-column prop="winlose" label="累计输赢" align="center" />
                <el-table-column prop="tzcs" label="有效投注口数" align="center" />
                <el-table-column prop="xmType" label="洗码额" align="center">
                    <template #default="scope">
                        <div>
                            {{ scope.row.xmType == 0 ? scope.row.xml_d : scope.row.xml_s }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="xmf" label="洗码费" align="center" />
                <el-table-column prop="company_winlose" label="公司利润" align="center" />
                <!-- <el-table-column label="明          细" align="center">
                    <el-table-column prop="8" label="30" align="center" />
                    <el-table-column prop="9" label="31" align="center" />
                    <el-table-column prop="10" label="32" align="center" />
                </el-table-column> -->
            </el-table>
        </section>
        <section v-if="select_radio == 2 && showUserTable == 'user'" class="w-full py-3 relative tableHeight">
            <el-table :data="playerTableData?.tableData" border :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }" style="width: 100%" height="100%" max-height="100%">
                <el-table-column prop="stime" label="日期" align="center" />
                <el-table-column prop="winlose" label="累计输赢" align="center" />
                <el-table-column prop="tzcs" label="有效投注口数" align="center" />
                <el-table-column prop="xmType" label="洗码额" align="center">
                    <template #default="scope">
                        <div>
                            {{ scope.row.xmType == 0 ? scope.row.xml_d : scope.row.xml_s }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="xmf" label="洗码费" align="center" />
                <el-table-column prop="company_winlose" label="公司利润" align="center" />
                <!-- <el-table-column label="明          细" align="center">
                    <el-table-column prop="8" label="30" align="center" />
                    <el-table-column prop="9" label="31" align="center" />
                    <el-table-column prop="10" label="32" align="center" />
                </el-table-column> -->
            </el-table>
        </section>
        <section v-if="select_radio == 2 && showUserTable == 'all'" class="w-full py-3 relative tableHeight">
            <el-table :data="playerTableData?.tableData" border :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }" style="width: 100%" height="100%" max-height="100%">

                <el-table-column prop="betTime" label="日期" align="center">
                    <template #default="scope">
                        <div>
                            {{ Time(scope.row.betTime) }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="tableNum" label="台号" align="center" />
                <!-- <el-table-column prop="3" label="局数" align="center" />
                <el-table-column prop="4" label="口数" align="center" /> -->
                <el-table-column prop="cc" label="局数" align="center">
                    <template #default="scope">
                        <div>
                            {{ scope.row.cc }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="cc1" label="口数" align="center">
                    <template #default="scope">
                        <div>
                            {{ scope.row.cc1 }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="betTime" label="投注时间" align="center" />
                <el-table-column prop="terminal" label="投注点" align="center" />
                <el-table-column prop="kj" label="开奖" align="center" />
                <el-table-column prop="stime" label="开奖时间" align="center" />
                <el-table-column prop="winlose" label="输赢" align="center" />
                <el-table-column prop="ye" label="余额" align="center" />
                <el-table-column label="公司本项目" align="center">
                    <el-table-column class-name="text-red-500 " prop="bet_info" label="庄/龙" align="center">
                        <template #default="scope">
                            <div v-if="scope.row.gameType == 'bjl'">
                                {{ scope.row.bet_info.banker || 0 }}
                            </div>
                            <div v-if="scope.row.gameType == 'lh'">
                                {{ scope.row.bet_info.dragon || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="text-blue-500" prop="bet_info" label="闲/虎" align="center">
                        <template #default="scope">
                            <div v-if="scope.row.gameType == 'bjl'">
                                {{ scope.row.bet_info.player || 0 }}
                            </div>
                            <div v-if="scope.row.gameType == 'lh'">
                                {{ scope.row.bet_info.tiger || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="text-green-500" prop="bet_info" label="和" align="center">
                        <template #default="scope">
                            <div>
                                {{ scope.row.bet_info.tie || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="9" label="庄/龙（合计)" align="center" />
                    <el-table-column prop="10" label="闲（合计）" align="center" /> -->
                </el-table-column>
            </el-table>
        </section>
        <!-- <div v-if="select_radio == 2" class="py-0  flex justify-end  overflow-x-hidden   ">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                v-model:current-page="pagination.currentPage" :page-sizes="[20, 40, 60, 80, 100]"
                v-model:page-size="pagination.pageSize" :background="true" layout="prev,pager,next,sizes"
                popper-class="label-popper" :total="pagination.total" class="pagination-control" />
        </div> -->
    </section>
</template>

<style scoped>
.tableHeight {
    height: calc(100vh - 200px - 55px);
    min-height: calc(100vh - 200px - 55px);
}
</style>