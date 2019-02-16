/**
 * Created by Administrator on 2019/2/13/013.
 */
function initPlace() {
    var data = [{value: 1, text: "室外监控"}, {value: 2, text: "室内监控"}];
    $("#place").bootstrapSelect({
        //url: '/tableListPost',
        // type: 'POST',
        data: data,
        valueField: 'value',
        textField: 'text',
        defaultValue: g_item.place
    });
}
function initVideotype() {
    var data = [{value: 1, text: "球机"}, {value: 2, text: "枪机"}];
    $("#videotype").bootstrapSelect({
        //url: '/tableListPost',
        // type: 'POST',
        data: data,
        valueField: 'value',
        textField: 'text',
        defaultValue: g_item.videotype
    });
}
function initOxcver() {
    var data = [{value: 1, text: "海康2.3"}, {value: 2, text: "海康3.0"}];
    $("#oxcver").bootstrapSelect({
        //url: '/tableListPost',
        // type: 'POST',
        data: data,
        valueField: 'value',
        textField: 'text',
        defaultValue: g_item.oxcver
    });
}
function initConnecttype() {
    var data = [{value: 1, text: "硬盘录像机"}, {value: 2, text: "摄像头直连"}];
    $("#connecttype").bootstrapSelect({
        //url: '/tableListPost',
        // type: 'POST',
        data: data,
        valueField: 'value',
        textField: 'text',
        defaultValue: g_item.connecttype
    });
}
function initDatasignal() {
    var data = [{value: 1, text: "网络"}, {value: 2, text: "模拟"}];
    $("#datasignal").bootstrapSelect({
        //url: '/tableListPost',
        // type: 'POST',
        data: data,
        valueField: 'value',
        textField: 'text',
        defaultValue: g_item.datasignal
    });
}
function initIsonline() {
    var data = [{value: 1, text: "是"}, {value: 0, text: "否"}];
    $("#isonline").bootstrapSelect({
        //url: '/tableListPost',
        // type: 'POST',
        data: data,
        valueField: 'value',
        textField: 'text',
        defaultValue: g_item.isonline
    });
}
function initIsshouchu() {
    var data = [{value: 1, text: "是"}, {value: 0, text: "否"}];
    $("#isshouchu").bootstrapSelect({
        //url: '/tableListPost',
        // type: 'POST',
        data: data,
        valueField: 'value',
        textField: 'text',
        defaultValue: g_item.isshouchu
    });
}
function initIsshibie() {
    var data = [{value: 1, text: "是"}, {value: 0, text: "否"}];
    $("#isshibie").bootstrapSelect({
        //url: '/tableListPost',
        // type: 'POST',
        data: data,
        valueField: 'value',
        textField: 'text',
        defaultValue: g_item.isshibie
    });
}
function initFacid() {
    var data = [{value: 1, text: "海康"}, {value: 1, text: "大华"}, {value: 99, text: "其他"}];
    $("#facid").bootstrapSelect({
        //url: '/tableListPost',
        // type: 'POST',
        data: data,
        valueField: 'value',
        textField: 'text',
        defaultValue: g_item.facid
    });
}

function initMaliu() {
    var data = [{value: 1, text: "主码流"}, {value: 2, text: "子码流"}
        , {value: 3, text: "第三码流"}, {value: 4, text: "转码码流"}];
    $("#maliu").bootstrapSelect({
        //url: '/tableListPost',
        // type: 'POST',
        data: data,
        valueField: 'value',
        textField: 'text',
        defaultValue: g_item.maliu
    });
}

function toBack() {
    parent.$.bootstrapBox.dialog.close();
}

function toSave() {
    $("#validation-form").bootstrapValidator('validate');//提交验证
    if ($("#validation-form").data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
        var param = turnArrayToJson($('form').serializeArray());
        if (g_videoid) {
            param.videoid = g_videoid
        }
        $.post("/graindepot-video/video/edit", param, function (result) {
            parent.toSave(result)
        })


    }
}