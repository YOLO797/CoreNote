---
title: 垃圾 BootStrap
order: 3
---

# 垃圾 BootStrap

##垃圾 BootStrapTable 插件：

#### 转义表格值的坑一：

传入 table 中的 columns 可见以下进行格式化：

    columns: [{
    		field: 'alarm_class',
            formatter: function(value, row, index){...}
    	},{

其中 formatter 的 function 可以用如下方式改写，来配合当前页面的查找与筛选：

    canst alarm_class = {"1": "lang.xx.xx"}

    formatter: function(value, row, index， this.field, alarm_class){...}

    export function formatterField(value, row, index, field, map_value) {
      if (map_value && map_value.hasOwnProperty(value)){
        row[field] = $.i18n.prop(map_value[row[field]])
      }
      return row[field]
    }
    field：即上文的field，传入this.field 即可
    map_value：对应转义的const值

但是若遇见前端查询或筛选时，若有分页，只能筛选出一页的数据，因此废弃，考虑渲染表格前，将数据整体转义

#### 转义表格值的坑二：

通过 responseHandler 方法来弄

    export const tableEscape = {
      "alarmList": {"alarm_level": alarm_level, "alarm_class": alarm_class, "alarm_info": alarm_info},
      "iscsi": {"use_chap": use_chap, "use_mutal_chap": use_mutal_chap, "export_mode": export_mode}
    }

    export function formatterTableData(data, escapeMap) {
      data.filter(function (row) {
        $.each(escapeMap, function (field, map_value) {
          row[field] = $.i18n.prop(map_value[row[field]])
        })
      })
    }

    responseHandler: function(data) {
            if (tableEscape.hasOwnProperty(tid)) {
                formatterTableData(data, tableEscape[tid])
            }
            return data
        },

    tid： 可以是表格唯一id

找 const 中对应转义列，将表格整体数据在渲染前进行转义，后续分页和查找筛选，均不会受到影响
