var WIDGETS = {
    imgSmoothCheck: undefined, 
}
var _widgets = { default: { noop: function () { } } }
WIDGETS.imgSmoothCheck = function (options) {
    options = $.extend({
        selector: ".widgets__img_check_box",
        imgSrc: [],
        imgWidth: undefined,
        imgHeight: undefined,
        imgFragmentW: undefined,
        imgFragmentH: undefined,
        allowableErrorValue: 4,
        success: _widgets.default.noop,
        error: _widgets.default.noop,
    }, options || {});

    var $sel = $(options.selector);
    if (!$sel) return;
    var _data = options.data[0];


    function _getRandomChoosingImg(imgData) {
        var index = Math.floor(imgData.length * Math.random());
        return imgData[index];
    }


    function _initImgSrc($srcImg, strSrc) {
        $srcImg.attr("src", strSrc);
        if (options.imgWidth)
            $srcImg.attr("width", options.imgWidth);
        if (options.imgHeight)
            $srcImg.attr("height", options.imgHeight);
    }

    function _getRandomStartPosition(numW, numH, numClipW, numClipH, numCurveR) {
        var minX = numClipW + numCurveR;
        var maxX = numW - numClipW - 20;
        var minY = numCurveR, maxY = numH - numClipH - numCurveR;
        var position = {};
        position.x = Math.random() * (maxX - minX) + minX;
        position.y = Math.random() * (maxY - minY) + minY;
        return position;
    }

    function _calBestClipWidth(numW) {
        return numW / 6;
    }

    function _canvasDrawPath(ctx, numStartX, numStartY, numClipWidth, numClipHeight, numCurveR) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,0,0)";

        ctx.moveTo(numStartX, numStartY);
        ctx.lineTo(numStartX + (numClipWidth / 2) - numCurveR, numStartY);
        ctx.bezierCurveTo(numStartX + (numClipWidth / 2) - numCurveR, numStartY - numCurveR, numStartX + (numClipWidth / 2) + numCurveR, numStartY - numCurveR, numStartX + (numClipWidth / 2) + numCurveR, numStartY);
        ctx.lineTo(numStartX + numClipWidth, numStartY);

        ctx.lineTo(numStartX + numClipWidth, numStartY + (numClipHeight / 2) - numCurveR);
        ctx.bezierCurveTo(numStartX + numClipWidth - numCurveR, numStartY + (numClipHeight / 2) - numCurveR, numStartX + numClipWidth - numCurveR, numStartY + (numClipHeight / 2) + numCurveR, numStartX + numClipWidth, numStartY + (numClipHeight / 2) + numCurveR);
        ctx.lineTo(numStartX + numClipWidth, numStartY + numClipHeight);

        ctx.lineTo(numStartX, numStartY + numClipHeight);
        ctx.closePath();
    }

    function _drawCanvas(canvasOption) {

        var numClipWidth = canvasOption.clipW, numClipHeight = canvasOption.clipH;
        var numCurveR = numClipWidth / 3 / 2; 
        var position = canvasOption.position;
        var numStartX = position.x, numStartY = position.y;
        var sImgSrc = canvasOption.img

        var $cavImgFramentHollow = $sel.find("canvas.widgets__img_fragment_hollow");
        var $cavImgFramentContent = $sel.find("canvas.widgets__img_fragment_content");
        var $cavImgFramentShadow = $sel.find("canvas.widgets__img_fragment_shadow");
        var ctxImgFramentHollow = $cavImgFramentHollow[0].getContext("2d");
        var ctxImgFramentContent = $cavImgFramentContent[0].getContext("2d");
        var ctxImgFramentShadow = $cavImgFramentShadow[0].getContext("2d");
        $cavImgFramentHollow.attr("width", numImgWidth + "px");
        $cavImgFramentHollow.attr("height", numImgHeight + "px");
        $cavImgFramentContent.attr("width", numImgWidth + "px");
        $cavImgFramentContent.attr("height", numImgHeight + "px");
        $cavImgFramentShadow.attr("width", numImgWidth + "px");
        $cavImgFramentShadow.attr("height", numImgHeight + "px");
        $sel.find(".widgets__img_cnt").css("width", numImgWidth + "px"); 
        $sel.find(".widgets__img_display").css("width", numImgWidth + "px");
        $sel.find(".widgets__smooth_cnt").css("width", numImgWidth + "px");

        _canvasDrawPath(ctxImgFramentHollow, numStartX, numStartY, numClipWidth, numClipHeight, numCurveR);
        ctxImgFramentHollow.globalCompositeOperation = "xor";
        ctxImgFramentHollow.shadowBlur = 10;
        ctxImgFramentHollow.shadowColor = "#fff";
        ctxImgFramentHollow.shadowOffsetX = 3;
        ctxImgFramentHollow.shadowOffsetY = 3;
        ctxImgFramentHollow.strokeStyle = "rgba(0,0,0,0.5)";
        ctxImgFramentHollow.fillStyle = "rgba(0,0,0,0.3)";
        ctxImgFramentHollow.fill();
        ctxImgFramentHollow.stroke();

        $sel.find(".widgets__img_fragment_cnt").css("left", -position.x);

        _canvasDrawPath(ctxImgFramentContent, numStartX, numStartY, numClipWidth, numClipHeight, numCurveR);
        ctxImgFramentContent.stroke();
        ctxImgFramentContent.clip();

        _canvasDrawPath(ctxImgFramentShadow, numStartX, numStartY, numClipWidth, numClipHeight, numCurveR);
        ctxImgFramentShadow.shadowBlur = 18;
        ctxImgFramentShadow.shadowColor = "black";
        ctxImgFramentShadow.fill();
        ctxImgFramentShadow.stroke();

        var img = new Image();
        img.onload = function (e) {
            ctxImgFramentContent.drawImage(img, 0, 0, numImgWidth, numImgHeight);
        }
        img.src = sImgSrc;
        return position;
    }

    var $srcImg = $sel.find("img.widgets__img_src");//ԭͼ
    var sSrcImgSrc = _getRandomChoosingImg(options.data);
    _initImgSrc($srcImg, sSrcImgSrc);
    var numImgWidth = $srcImg.width();
    var numImgHeight = $srcImg.height();

    var numClipWidth = options.imgFragmentW === undefined ? _calBestClipWidth(numImgWidth) : options.imgFragmentW;//���еĿ���
    var numClipHeight = options.imgFragmentW === undefined ? _calBestClipWidth(numImgWidth) : options.imgFragmentH;
    var numCurveR = numClipWidth / 3 / 2;  
    var position = _getRandomStartPosition(numImgWidth, numImgHeight, numClipWidth, numClipWidth, numCurveR);
    var numStartX = position.x, numStartY = position.y;      
    var canvasOption = {
        position: position,
        clipW: numClipWidth,
        clipH: numClipHeight,
        width: numImgWidth,
        height: numImgHeight,
        img: sSrcImgSrc
    };

    _drawCanvas(canvasOption);
    var blnIsMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

    var $smoothCir = $sel.find(".widgets__smooth_circle");
    var $imgFragmentCnt = $sel.find(".widgets__img_fragment_cnt");
    var flag = false;
    var strDefualtLeft = $smoothCir.css("left");
    var numDefaultLeft = parseFloat(strDefualtLeft.substring(0, strDefualtLeft.lastIndexOf("px")));
    var strImgFragmentCntDefaultLeft = $imgFragmentCnt.css("left");
    var numImgFragmentCntDefaultLeft = parseFloat(strImgFragmentCntDefaultLeft.substring(0, strImgFragmentCntDefaultLeft.lastIndexOf("px")));
    var numStartPointLeft = -1;

    var sSmoothStart = "mousedown";
    var sSmoothMove = "mousemove";
    var sSmoothEnd = "mouseup";
    if (blnIsMobile) {
        sSmoothStart = "touchstart";
        sSmoothMove = "touchmove";
        sSmoothEnd = "touchend";
    }


    var _numMoveLength = -1;
    $smoothCir.on(sSmoothStart, function () {
        var strLeft = $smoothCir.css("left");
        var numCurrentLeft = parseFloat(strLeft.substring(0, strLeft.lastIndexOf("px")));
        if (flag === false && numCurrentLeft == numDefaultLeft)
            flag = true;
    });

    $smoothCir.on(sSmoothEnd, function () {
        _dealAfterSmoothEnd();
    });

    var $smoothCnt = $sel.find(".widgets__smooth_cnt");
    $smoothCnt.on(sSmoothMove, function (evt) {
        evt.preventDefault();
        var strLeft = $smoothCir.css("left");
        var numCurrentLeft = parseFloat(strLeft.substring(0, strLeft.lastIndexOf("px")));//��ȡ������ť��߾���
        if (flag === true) {

            var numPageX = blnIsMobile ? evt.targetTouches[0].pageX : evt.pageX;
            var numMoveLength = 0;
            if (numCurrentLeft === numDefaultLeft) {
                numStartPointLeft = numPageX;
                numMoveLength = numDefaultLeft + 0.1;//��һ�δ����ƶ���Ĭ�ϻ���0.1������,��ֹÿ�λ�ȡ��ǰ����߾඼����Ĭ�������
            } else {
                numMoveLength = numPageX - numStartPointLeft;
            }
            _numMoveLength = numMoveLength;
            if (numMoveLength < numDefaultLeft) return;//��������Ĭ��ֵ
            if (numMoveLength + numClipWidth>= numImgWidth) {//�ƶ����벻�ܴ�����Ƭ
                _dealAfterSmoothEnd();
                return;
            }
            $smoothCir.css("left", numMoveLength + "px");
            $imgFragmentCnt.css("left", numMoveLength + numImgFragmentCntDefaultLeft + "px");
        }
    });
    $smoothCnt.on("mouseleave", function () {
        _dealAfterSmoothEnd();
    });
    $smoothCnt.on("mouseup", function () {
        _dealAfterSmoothEnd();
    });

    //ˢ��
    $sel.find(".widgets__icon_refresh").on("click", function () {
        _refresh();
    });

    function _dealAfterSmoothEnd() {
        if (flag === true) {
            flag = false;
            if (_checkImgCheckIsSuccess())
                options.success();
            else if(_numMoveLength > 1) {//
                options.error("��֤ʧ��");
                _refresh();
                //$imgFragmentCnt.animate({ left: -position.x }, 300);
                //$smoothCir.animate({ left: numDefaultLeft }, 300);
            } else {
                $imgFragmentCnt.css("left", -position.x);
                $smoothCir.css("left", numDefaultLeft + "px");
                numImgFragmentCntDefaultLeft = -position.x;
            }
        }
    }
    function _checkImgCheckIsSuccess() {//���ͼƬ��֤�Ƿ�ɹ�
        var numAllowableError = options.allowableErrorValue;//�������
        var sLeft = $imgFragmentCnt.css("left");
        var numLeft = parseFloat(sLeft.substring(0, sLeft.lastIndexOf("px")));
        if (numLeft < numAllowableError && numLeft > -numAllowableError)
            return true;
        return false;
    }
    function _refresh() {
        var $srcImg = $sel.find("img.widgets__img_src");//ԭͼ
        var strImgSrc = _getRandomChoosingImg(options.data);
        $srcImg.attr("src", strImgSrc);
        position = _getRandomStartPosition(numImgWidth, numImgHeight, numClipWidth, numClipHeight, numCurveR)
        canvasOption.img = strImgSrc;
        canvasOption.position = position;
        _drawCanvas(canvasOption);//��ͼ
        $imgFragmentCnt.css("left", -position.x);
        $smoothCir.css("left", numDefaultLeft + "px");
        numImgFragmentCntDefaultLeft = -position.x;
        flag = false;
    }

    this.refresh = function () {
        _refresh();
    }
    return this;

};