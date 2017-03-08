/**
 *  by Leestar54
 *  简易弹幕插件 V1.0
 */
;
(function($) {
    $.fn.danmu = function(options) {
        //默认参数
        var defaults = {
            fontSize: 16,
            color: 'black',
            showTime: 10000
        }

        //使用jQuery.extend 覆盖插件默认参数
        var options = $.extend(defaults, options);


        var hideTime = defaults.showTime + 500;
        //弹幕的行数
        var dm_lines = Math.floor($(this).height() / 16);

        //当前弹幕行是否有空间进行显示
        var dm_line_empty = Array(dm_lines);
        for (var i = 0; i < dm_line_empty.length; i++) {
            dm_line_empty[i] = true;
        }

        //中文和英文的宽度要分别算
        function getDivWidth(txt, fontSize) {
            var len = 0;
            var charRatio = fontSize * 5 / 8;
            for (var i = 0; i < txt.length; i++) {
                if (txt[i].match(/[^\x00-\xff]/ig) != null) //全角中文
                    len += fontSize;
                else
                    len += charRatio; //非中文经过测试得出比例
            }
            return len;
        }

        //公开函数
        this.add = function(txt, id, line, color, fontSize) {
            if (txt === undefined || txt === '') {
                //抛出异常
                throw 'txt should not be null';
            }
            if (line === undefined || line === '') {
                for (var i = 0; i < dm_line_empty.length; i++) {
                    if (dm_line_empty[i]) {
                        dm_line_empty[i] = false;
                        line = i;
                        break;
                    }
                }
                //如果都满了，就随机覆盖了
                if (line === undefined || line === '') {
                    line = Math.floor(Math.random() * dm_lines);
                }
            }
            if (color === undefined || color === '') {
                color = defaults.color;
            }
            if (fontSize === undefined || fontSize === '') {
                fontSize = defaults.fontSize;
            }
            if (id === undefined || id === '') {
                id = Math.floor(Math.random() * 100000000);
            }
            //使用dom构造单个弹幕div
            var div = document.createElement("div");
            div.id = 'txt_dm' + id;
            div.innerHTML = txt;
            div.style.webkitAnimation = 'run 1s 8s linear forwards';
            div.style.position = 'absolute';
            div.style.top = line * fontSize + 'px';
            div.style.left = $(this).width() + 'px';
            //设置宽度，否则字体会自适应换行，影响显示
            div.style.width = getDivWidth(txt, fontSize) + 'px';
            div.style.fontSize = fontSize + 'px';
            div.style.color = color;
            $(this).append(div);
            $(div).velocity({
                    translateX: '-' + ($(this).width() + $(div).width()) + 'px'
                },
                defaults.showTime,
                'linear');

            //屏幕完全显示完弹幕，就可以添加下一条了, +1为了用一定缓冲距离
            var fullShowTime = Math.floor($(div).width() / $(this).width() * defaults.showTime);
            setTimeout(function() {
                dm_line_empty[line] = true;
            }, fullShowTime);

            //删除显示完的弹幕
            setTimeout(function() {
                $('#txt_dm' + id).remove();
            }, hideTime);
        }

        return this;
    }
})(jQuery);
