var $ = function(id) {
    return document.getElementById(id)
}
window.onload = function() {
    //实例，初始化对象
    var hotChat = new HotChat();
    hotChat.init();
};
//定义 hotChat雷
var HotChat = function() {
    this.socket = null;
};
//向原形添加业务方法
HotChat.prototype = {
    init: function() {
        var that = this;
        //建立到服务器的socket连接
        that.socket = io.connect();
        //监听socket的connect事件，此事件表示连接已建立
        that.socket.on('connect', function() {
            // 连接到服务器后，显示昵称输入框
            $('info').textContent = 'get yourself a nickname :)';
            $('nickWrapper').style.display = 'block';
            $('nicknameInput').focus();
        })
    }
}