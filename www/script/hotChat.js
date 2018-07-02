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
        this.socket = io.connect();
        //监听socket的connect事件，此事件表示连接已建立
        this.socket.on('connect', function() {
            // 连接到服务器后，显示昵称输入框
            $('info').textContent = 'get yourself a nickname :)';
            $('nickWrapper').style.display = 'block';
            $('nicknameInput').focus();
        });
        this.socket.on('nickExisted', function() {
            $('info').textContent = 'nickname is taken choose another pls';
        });
        this.socket.on('loginSuccess', function() {
            document.title = 'hotchat |' + $('nicknameInput').value;
            $('loginWrapper').style.display = 'none';
            $('sendMessage').focus();
        });
        this.socket.on('system', function(nickName, userCount, type) {
            //判断用户是连接还是离开以显示不同的信息
            if (nickName) {
                var msg = nickName + (type == 'login' ? ' joined' : ' left');
                that._displayNwMsg('system', msg, 'red')
                $('status').textContent = userCount + (userCount > 1 ? 'users' : 'user') + ' online';
            }
        });
        this.socket.on('newMsg', function(user, msg, color) {
            that._displayNwMsg(user, msg, color)
        });
        this.socket.on('newImg', function(user, imgData) {
            that._displayNwImg(user, imgData);
        })
        $('sendBtn').addEventListener('click', function() {
            var msg = $('sendMessage').value;
            $('sendMessage').value = "";
            $('sendMessage').focus();
            if (msg.trim().length != 0) {
                that.socket.emit('postMsg', msg);
                that._displayNwMsg('me', msg);
            }
        }, false);
        $('imgFile').addEventListener('change', function() {
            if (this.files.length != 0) {
                var File = this.files[0];
                var reader = new FileReader();
                if (!reader) {
                    that._displayNwMsg('system', '!your browser doesn\'t support fileReader', 'red');
                    this.value = "";
                    return
                }
                reader.onload = function(e) {
                    this.value = "";
                    that.socket.emit('postImg', e.target.result);
                    that._displayNwImg('me', e.target.result);
                }
                reader.readAsDataURL(File);
            }
        })
        $('loginBtn').addEventListener('click', function() {
            var nickName = $('nicknameInput').value;
            //检查昵称输入框是否为空
            if (nickName.trim().length != 0) {
                //不为空，则发起一个login事件并将输入的昵称发送到服务器
                that.socket.emit('login', nickName);
            } else {
                //否则输入框获得焦点
                $('nicknameInput').focus();
            }
        }, false);
    },
    _displayNwMsg: function(user, msg, color) {
        var container = $('content'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + "<span class='timespan'>(" + date + ")：</span>" + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _displayNwImg: function(user, imgData) {
        var msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.innerHTML = user + "<span class='timespan'>(" + date + "): </span> <br/><a href='" + imgData + "' target='_blank'>" +
            "<img src='" + imgData + "'/></a>"
        $('content').appendChild(msgToDisplay);
        $('content').scrollTop = $('content').scrollHeight;
    }
}