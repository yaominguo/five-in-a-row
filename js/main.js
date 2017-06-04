(function() {
    var chessBoard = document.getElementById('chessBoard'); //获取棋盘
    var context = chessBoard.getContext('2d');
    var blackChess = true; //黑子先行
    var gameOver = false; //判断游戏是否结束
    var roundOver = false; //判断一方是否下好了
    context.strokeStyle = "#bbb"; //棋盘线条颜色

    var chessList = []; //定义棋子的数组
    var wins = []; //定义胜利的数组
    for (var i = 0; i < 15; i++) { //形成棋子的二维数组
        chessList[i] = [];
        wins[i] = [];
        for (var j = 0; j < 15; j++) {
            chessList[i][j] = 0; //未落子的点为0
            wins[i][j] = [];
        }
    }

    var count = 0; //胜利的方法数目，在15*15中一共会有572种胜利方式
    for (var i = 0; i < 15; i++) { //横向胜利数量
        for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
                wins[i][j + k][count] = true;
            }
            count++;
        }
    }
    for (var i = 0; i < 15; i++) { //纵向胜利数量
        for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
                wins[j + k][i][count] = true;
            }
            count++;
        }
    }
    for (var i = 0; i < 11; i++) { //斜线胜利数量
        for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
                wins[i + k][j + k][count] = true;
            }
            count++;
        }
    }
    for (var i = 0; i < 11; i++) { //反斜线胜利数量
        for (var j = 14; j > 3; j--) {
            for (var k = 0; k < 5; k++) {
                wins[i + k][j - k][count] = true;
            }
            count++;
        }
    }

    var myWins = []; //初始化敌我双方胜利数组
    var enemyWins = [];
    for (var i = 0; i < count; i++) {
        myWins[i] = 0;
        enemyWins[i] = 0;
    }



    var drawChessBoard = function() { //渲染棋盘为横竖15条直线构成
        for (var i = 0; i < 15; i++) {
            context.moveTo(15 + i * 30, 15);
            context.lineTo(15 + i * 30, 435);
            context.stroke();
            context.moveTo(15, 15 + i * 30);
            context.lineTo(435, 15 + i * 30);
            context.stroke();
        }
        console.log('Game Start!');
    };


    var oneStpe = function(x, y, blackChess) { //落子函数
        var chessColor;
        context.beginPath(); //渲染棋子
        context.arc(15 + x * 30, 15 + y * 30, 13, 0, 2 * Math.PI);
        context.closePath();
        if (blackChess) { //判断应为黑子还是白子
            chessColor = "#000";
        } else {
            chessColor = "#fff";
        }
        context.fillStyle = chessColor;
        context.fill();
    };

    chessBoard.onclick = function(event) { //点击棋盘落子
        if (gameOver) {
            return;
        }
        if (!blackChess) {
            return;
        }
        var x = event.offsetX, //获取鼠标点击棋盘时的相对x、y轴位置
            y = event.offsetY,
            step_x = Math.floor(x / 30), //方位取整
            step_y = Math.floor(y / 30);
        if (chessList[step_x][step_y] === 0) { //如果数组中的点为0即落子点为空时则调用落子函数
            oneStpe(step_x, step_y, blackChess);
            chessList[step_x][step_y] = 1;
            roundOver = !roundOver; //确定有落子了才结束我方回合
            console.log('你的落子位置为： (' + step_x + ' , ' + step_y + ')');
            // if(blackChess){
            //  chessList[step_x][step_y]=1;  //下的是黑子则将数组中的棋子点改为1，白子为2
            // }else {
            //  chessList[step_x][step_y]=2;
            // }
        }

        for (var k = 0; k < count; k++) {
            if (wins[step_x][step_y][k]) { //遍历wins数组，如果为true则我方胜率大了一点
                myWins[k]++;
                wins[step_x][step_y][k] = false; //修复连续点击累加胜利的BUG,否则一直点击同一个棋子myWins数组一直加到5就赢了
                enemyWins[k] = false;
                if (myWins[k] === 5) { //当我方胜利数组中有一种方式累计了5个，即5个棋子连成一线即为胜利，游戏结束
                    gameOver = true;
                    alert("You Win!");
                    console.log('Game Over. You Win!');
                }
            }
        }

        if (!gameOver && roundOver) { //如果游戏进行中并且我方回合结束
            blackChess = !blackChess; //黑白轮流下
            alphaGuo(); //调用AI机器人函数下棋
        }
    };

    var alphaGuo = function() { //AI机器人自动下棋函数
        var myScores = []; //敌我的分数数组
        var enemyScores = [];
        var max = 0,
            max_x = 0,
            max_y = 0; //最佳分数和最佳落子坐标

        for (var i = 0; i < 15; i++) { //初始化敌我分数数组，所有落子点为0
            myScores[i] = [];
            enemyScores[i] = [];
            for (var j = 0; j < 15; j++) {
                myScores[i][j] = 0;
                enemyScores[i][j] = 0;
            }
        }
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                if (chessList[x][y] === 0) { //判断落子点是否有棋子，没旗子才可以下
                    for (var z = 0; z < count; z++) {
                        if (wins[x][y][z]) { //落子时判断的依据算法，趋向分数高的行为
                            if (myWins[z] === 1) {
                                myScores[x][y] += 100;
                            } else if (myWins[z] === 2) {
                                myScores[x][y] += 200;
                            } else if (myWins[z] === 3) {
                                myScores[x][y] += 1000;
                            } else if (myWins[z] === 4) {
                                myScores[x][y] += 10000;
                            }
                            if (enemyWins[z] === 1) {
                                enemyScores[x][y] += 120;
                            } else if (enemyWins[z] === 2) {
                                enemyScores[x][y] += 220;
                            } else if (enemyWins[z] === 3) {
                                enemyScores[x][y] += 2000;
                            } else if (enemyWins[z] === 4) {
                                enemyScores[x][y] += 20000; //例如机器人已经连了4个点了，这时应不顾一切连上第5个，故分数比重大！
                            }
                        }
                    }

                    if (myScores[x][y] > max) { //根据敌我双方分数判断最佳落子点
                        max = myScores[x][y];
                        max_x = x;
                        max_y = y;
                    } else if (myScores[x][y] === max) {
                        if (enemyScores[x][y] > enemyScores[max_x][max_y]) {
                            max_x = x;
                            max_y = y;
                        }
                    }
                    if (enemyScores[x][y] > max) {
                        max = enemyScores[x][y];
                        max_x = x;
                        max_y = y;
                    } else if (enemyScores[x][y] === max) {
                        if (myScores[x][y] > myScores[max_x][max_y]) {
                            max_x = x;
                            max_y = y;
                        }
                    }
                }
            }
        }
        oneStpe(max_x, max_y, false); //机器人落子
        roundOver = !roundOver;
        console.log('AlphaGuo的落子位置为： (' + max_x + ' , ' + max_y + ')');
        chessList[max_x][max_y] = 2; //将落子点由0改为2，表明是白子。黑子是1。
        for (var k = 0; k < count; k++) {
            if (wins[max_x][max_y][k]) {
                enemyWins[k]++;
                wins[max_x][max_y][k] = false; //修复连续点击累加胜利的BUG
                myWins[k] = false;
                if (enemyWins[k] === 5) { //累计5个机器人胜利
                    gameOver = true;
                    alert("You Lose!");
                    console.log('Game Over. You Lose!');
                }
            }
        }
        if (!gameOver) {
            blackChess = !blackChess; //黑白轮流下
        }
    };


    window.onload = function() {
        drawChessBoard();
    };

})();
