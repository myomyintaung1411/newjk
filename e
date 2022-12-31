function getSummaries({ columns, data }) {
    const sums = [];
    columns.forEach((column, index) => {
        //  if (index === 0) {
        //     sums[index] = '合计';//可更改合计行的名称 The name of the total row can be changed
        //     return;
        //  }
        if (column.label === '台号') {
            sums[index] = '合计';//可更改合计行的名称 The name of the total row can be changed
            return;
        }

        const values = data.map(item => {
            return Number(item[column.property])//property为表头的prop值 property is the prop value of the header
        });
        //  console.log(values,"valllllllll");
        // every() 方法用于检测values数组所有元素是否都符合指定条件（通过函数提供）
        //The method is used to detect whether all elements of the values array meet the specified conditions (provided by the function)
        if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
                const value = (curr);//Number转换为数值 Number converted to a numeric value
                let sum = Number(Number(prev) + Number(curr)).toFixed(2);//toFixed(2)数据项保留两位小数
                if (!isNaN(value)) {
                    return sum;
                } else {
                    return prev;
                }
            }, 0);
            sums[index] += '元';//给合计项添加单位元 add units to totals
        } else {
            sums[index] = '';
        }
    });
    return sums;//返回sums数组,sums数组中各项就会显示在合计行的各列中 Return the sums array, and the items in the sums array will be displayed in the columns of the total row
}