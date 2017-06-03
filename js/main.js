var chessBoard=document.getElementById('chessBoard');//获取棋盘
var context=chessBoard.getContext('2d');
var blackChess=true;//黑子先行
context.strokeStyle="#bbb";//棋盘线条颜色

var chessList=[];//定义棋子的数组
for(var i=0;i<15;i++){ //形成棋子的二维数组
	chessList[i]=[];
	for(var j=0;j<15;j++){
		chessList[i][j]=0; //未落子的点为0
	}
}

var drawChessBoard=function(){  //渲染棋盘为横竖15条直线构成
	for (var i = 0; i < 15; i++) {
	    context.moveTo(15 + i * 30, 15);
	    context.lineTo(15 + i * 30, 435);
	    context.stroke();
	    context.moveTo(15, 15 + i * 30);
	    context.lineTo(435, 15 + i * 30);
	    context.stroke();
	}
};

 
var oneStpe=function(x,y,blackChess){  //落子函数
	var chessColor;
	context.beginPath();    //渲染棋子
	context.arc(15+x*30,15+y*30,13,0,2*Math.PI);
	context.closePath();
	if(blackChess){   //判断应为黑子还是白子
		chessColor="#000";
	}else {
		chessColor="#fff";
	}
	context.fillStyle=chessColor;
	context.fill();
};

chessBoard.onclick=function(event){ //点击棋盘落子
	var x=event.offsetX,    //获取鼠标点击棋盘时的相对x、y轴位置
		y=event.offsetY,
		step_x=Math.floor(x/30),   //取整
		step_y=Math.floor(y/30);
	 if(chessList[step_x][step_y]===0){   //如果数组中的点为0即落子点为空时则调用落子函数
	 	oneStpe(step_x,step_y,blackChess);
	 	if(blackChess){
	 		chessList[step_x][step_y]=1;  //下的是黑子则将数组中的棋子点改为1，白子为2
	 	}else {
	 		chessList[step_x][step_y]=2;
	 	}
	 }
	
	blackChess=!blackChess;    //黑白轮流下

};


window.onload=function(){
	drawChessBoard();
};