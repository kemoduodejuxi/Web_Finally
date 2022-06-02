//用Canny算法进行边缘识别
var i = 0;
var imgData=new Array();
var counter = 0; // 5 次相同确认转跳
var imgStr=new String();
var imgStrList = new Array();
var slove = new String();
var toS = new String();
var pre_outputStr = ""




function ajax(opt) {
    /* 封装ajax函数
     * @param {string}opt.type http连接的方式
     * @param {string}opt.url 发送请求的url
     * @param {boolean}opt.async 是否为异步请求
     * @param {object}opt.data 发送的参数
     * @param {function}opt.success ajax发送并
    */
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function () {};
    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }var params = [];
    for (var key in opt.data){
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    }
    else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            opt.success(xmlHttp.responseText);//如果不是json数据可以去掉json转换
        }
    };
}

document.getElementById('play').onclick = () => {
    let constraints = {
        // video属性设置
        video: {
            width: 300,
            height: 300
        },
        // audio属性设置
        audio: false
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(mediaStream => {
            // 成功返回promise对象，接收一个mediaStream参数与video标签进行对接
            document.getElementById('video').srcObject = mediaStream
            document.getElementById('video').play()
        })
    // 失败就失败了
    var int2 = setInterval(take_photo, 1000);
}

function rgbToHsv(arr) {
    var h = 0, s = 0, v = 0;
    var r = arr[0], g = arr[1], b = arr[2];
    arr.sort(function (a, b) {
        return a - b;
    })
    var max = arr[2]
    var min = arr[0];
    v = max / 255;
    if (max === 0) {
        s = 0;
    } else {
        s = 1 - (min / max);
    }
    if (max === min) {
        h = 0;//事实上，max===min的时候，h无论为多少都无所谓
    } else if (max === r && g >= b) {
        h = 60 * ((g - b) / (max - min)) + 0;
    } else if (max === r && g < b) {
        h = 60 * ((g - b) / (max - min)) + 360
    } else if (max === g) {
        h = 60 * ((b - r) / (max - min)) + 120
    } else if (max === b) {
        h = 60 * ((r - g) / (max - min)) + 240
    }
    h = parseInt(h);
    s = parseInt(s * 100);
    v = parseInt(v * 100);
    return [h, s, v]
}
function isSameColor(list1,list2,n) {
    if ((Math.abs(list1[0]-list1[0])<n)&&(Math.abs(list1[1]-list1[1])<n)&&(Math.abs(list1[2]-list1[2])<n)){
    return true;
    }
    else{
        return false;
    }
}
function getColor(data) {
    let rgb = new Array();
    let colorList = new Array();
    let k, sum_R, sum_G, sum_B;
    k = 1;
    let numCounter = 0;
    var n = 130;  // 颜色过滤
    sum_R = 0;
    sum_G = 0;
    sum_B = 0;
    while (k <= 39999) {
        if ((data[k] + data[k + 1] + data[k + 2]) / 3 > n) {    //过滤掉黑（暗）色
            sum_R = sum_R + data[k];
            sum_G = sum_G + data[k + 1];
            sum_B = sum_B + data[k + 2];
            numCounter++;
        }
        k = k + 4;
    }
    colorList[0] = sum_R / numCounter;
    colorList[1] = sum_G / numCounter;
    colorList[2] = sum_B / numCounter;
    console.log(numCounter);
    rgb = rgbToHsv(colorList);
    //rgb = colorList;
    console.log(rgb)
    let s = new String();
    var sideNum = 1;
    var saveList = new Array();
    n = 20;
    /*
        if (Math.abs(rgb[0]-300)==0){
            //对白橙绿黄判断

            if (Math.abs(rgb[1]-45)>Math.abs(rgb[1]-31)){
                if (Math.abs(rgb[1]-41)>Math.abs(rgb[1]-49)){
                    s+="O";
                }
                else {
                    s+="Y";
                }
            }
            else {
                s+="G";
            }
        }
        else {
            if (rgb[1]<=10){
                s+="W";
            }
            else {
            //对蓝色和红色判断
            if (Math.abs(rgb[2]-36)>Math.abs(rgb[2]-63)){
                s+="B";
            }
            else {
                s+="R";
            }
            }
        }
        return s;
    }
    */
    colorVec = rgb

    if ((colorVec[0] >= 0 && colorVec[0] <= 180)
        && (colorVec[1] >= 0 && colorVec[1] <= 43.5)
        && (colorVec[2] >= 46 && colorVec[2] <= 255)) {
        s += "W"
    } else if (((colorVec[0] >= 125 && colorVec[0] <= 255))
        && (colorVec[1] >= 43.6 && colorVec[1] <= 255)
        && (colorVec[2] >= 46 && colorVec[2] <= 255)) {

        s += "R"

    } else if ((colorVec[0] >= 3 && colorVec[0] <= 28)
        && (colorVec[1] >= 43.6 && colorVec[1] <= 255)
        && (colorVec[2] >= 46 && colorVec[2] <= 255)) {
        s += "O"
    } else if ((colorVec[0] >= 28 && colorVec[0] <= 44)
        && (colorVec[1] >= 43 && colorVec[1] <= 255)
        && (colorVec[2] >= 46 && colorVec[2] <= 255)) {

        s += "Y"
    } else if ((colorVec[0] >= 44 && colorVec[0] <= 77)
        && (colorVec[1] >= 43.6 && colorVec[1] <= 255)
        && (colorVec[2] >= 46 && colorVec[2] <= 255)) {

        s += "G"
    } else if ((colorVec[0] >= 80 && colorVec[0] <= 124)
        && (colorVec[1] >= 43 && colorVec[1] <= 255)
        && (colorVec[2] >= 46 && colorVec[2] <= 255)) {
        s += "B"
    }
    console.log(s)
    return s
}
toS = [-1,4,1,0,5,3,2]
function getSolve(){
    slove = "";
    /*
        做对应值转换
     */
    for (var j = 1;j <= 6;j++){
        for (var k = 0; k < 9; k++) {
            switch (imgStrList[toS[j]].charAt(k)) {
                case "O":
                    slove +="L";
                    continue;
                case "Y":
                    slove +="D";
                    continue;
                case "G":
                    slove +="B";
                    continue;
                case "W":
                    slove +="U";
                    continue;
                case "B":
                    slove +="F";
                    continue;
                case "R":
                    slove +="R";
                    continue;
            }
        }
    }
    console.log(slove);
    ajax({
        method: 'GET',

        url: 'http://127.0.0.1:5000/'+"BBURUDBFUFFFRRFUUFLULUFUDLRRDBBDBDBLUDDFLLRRBRLLLBRDDF",
        success: function (OriginalFromActivity) {
            //在这里对获取的数据经常操作
            console.log(OriginalFromActivity);
            //这个是解法，下一步进行可视化。
            location.href="rotation.html?"+OriginalFromActivity;

        }
    })

}

function clearCanvas() {
    var c=document.getElementById("canvas1");
    var cxt=c.getContext("2d");
    cxt.clearRect(0,0,c.width,c.height);
}
function ifjump() {
    if (counter == 5){
        counter =0
        return true
    }
    else{
        return false
    }
}
function take_photo(){
    let ctx = document.getElementById("canvas1").getContext('2d')
    let outputStr = document.getElementById("confirm")
    imgStr = "";
    ctx.drawImage(document.getElementById("video"), 0, 0, 300, 300)
    var b = 10  // boarden
    var r = 0.8
    imgData[1]= ctx.getImageData(b,b,100*r,100*r);
    imgData[2]= ctx.getImageData(100+b,b,100*r,100*r);
    imgData[3]= ctx.getImageData(200+b,b,100*r,100*r);
    imgData[4]= ctx.getImageData(b,100+b,100*r,100*r);
    imgData[5]= ctx.getImageData(100+b,100+b,100*r,100*r);
    imgData[6]= ctx.getImageData(200+b,100+b,100*r,100*r);
    imgData[7]= ctx.getImageData(0+b,200+b,100*r,100*r);
    imgData[8]= ctx.getImageData(100+b,200+b,100*r,100*r);
    imgData[9]= ctx.getImageData(200+b,200+b,100*r,100*r);
    let x=1;
    while (x<=9) {
        imgStr = imgStr + getColor(imgData[x].data);
        x++;
    }
    imgStrList[i] = imgStr;
    console.log(i);
    console.log(imgStr);
    outputStr.value=imgStr;

    if(pre_outputStr == imgStr){
        console.log(pre_outputStr)

        counter++;
    }
    pre_outputStr = imgStr
    if(ifjump()){
        submit();
    }
}
function submit(){
    let sign = document.getElementById("sign");
    let con = document.getElementById("confirm");
    i++;
    imgStrList[i-1] = con.value;
    console.log(imgStrList[i-1]);
    clearCanvas();
    if (i==1){

    }
    if (i <= 3) {
        sign.textContent = "Please turn the cube clockwise"+"("+ i+")"
    }
    else if (i ==4){
        sign.textContent = "Reverse the cube to the top(Go back to the first side and reverse down)"
        window.alert("Remember this top side .This side is the red side ..")
    }
    else if (i ==5){
        sign.textContent = "Reverse the cube to the botton(Go back to the first side and reverse up)"
    }
    else{
        //给出魔方还原步骤
        getSolve();
    }
}

