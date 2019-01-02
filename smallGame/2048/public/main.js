/**
 * Created by zplufb on 18/12/28.
 */

//global var
let width = col = 4;
let height = row = 4;
let AllCubeDataArr = [];
let AllCubeDataArrRotate = [];
let blankArr = [];
let len_blankArr = col * row;
let score = 0;

let start = {
	x: 0,
	y: 0
}
let end = {
	x: 0,
	y: 0
}

$(document).ready(function() {
	newGame();
	//init();
	//initData();
});

document.addEventListener('touchstart', function(event) {
	start.x = event.touches[0].pageX;
	start.y = event.touches[0].pageY;
});

document.addEventListener('touchmove', function(event) {
	event.preventDefault();
}, {
	passive: false
});

document.addEventListener('touchend', function(event) {
	end.x = event.changedTouches[0].pageX;
	end.y = event.changedTouches[0].pageY;

	var deltaX = end.x - start.x;
	var deltaY = end.y - start.y;
	if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
		return;
	}

	if (Math.abs(deltaX) >= Math.abs(deltaY)) {
		if (deltaX > 0) {
			KeyHanderRight();
		} else {
			KeyHanderLeft();
		}
	} else {
		if (deltaY > 0) {
			KeyHanderDown();
		} else {
			KeyHanderUp();
		}
	}
	//prepareForMobile();
	drawRefreshUI();
	next();
});




function getNumberBackgroundColor(number) {
	switch (number) {
		case 2:
			return "#eee4da";
			break;
		case 4:
			return "#ede0c8";
			break;
		case 8:
			return "#f2b179";
			break;
		case 16:
			return "#f59563";
			break;
		case 32:
			return "#f67c5f";
			break;
		case 64:
			return "#f65e3b";
			break;
		case 128:
			return "#edcf72";
			break;
		case 256:
			return "#edcc61";
			break;
		case 512:
			return "#9c0";
			break;
		case 1024:
			return "#33b5e5";
			break;
		case 2048:
			return "#09c";
			break;
		case 4096:
			return "#a6c";
			break;
		case 8192:
			return "#93c";
			break;
	}

	return 'black'
}


function setNumberCellStyle(obj, num) {
	obj.css("background-color", getNumberBackgroundColor(num));
}

function clearNumberCellStyle(obj) {
	obj.css("background-color", "#ccc0b3");
}

//document.onkeydown = keyevent;
document.onkeydown = function() {

	var currKey = event.keyCode || event.which || event.charCode;
	var keyName = String.fromCharCode(currKey);
	//console.log("keyCode: " + currKey + " charCode: " + keyName);
	//键盘上下左右 方向键的键码(keyCode)是38、40、37和39
	switch (currKey) {
		case 119:
		case 87:
		case 38:
			KeyHanderUp();
			break;
		case 115:
		case 83:
		case 40:
			KeyHanderDown();
			break;
		case 97:
		case 65:
		case 37:
			KeyHanderLeft();
			break;
		case 100:
		case 68:
		case 39:
			KeyHanderRight();
			break;
	}
	drawRefreshUI();
	next();

};

function next() {
	let blankArr = getBlankArr();
	//let len_blankArr = blankArr.length;
	//使用全局变量
	//如果还有剩余空间放才能执行,否则不执行
	if (len_blankArr > 0) {
		setTimeout(() => {
			loopGame();
		}, 100);
	} else if (len_blankArr == 0) {
		if (checkGameOver()) {
			gameOver();
		}
		//没位置且还没结束,继续操作另外方向合并数字
		return;
	}
}


function KeyHanderUp() {
	mergeByDirectory(0);
	//console.log("up");
}

function KeyHanderDown() {
	mergeByDirectory(1);
	//console.log("down");

}

function KeyHanderLeft() {
	mergeByDirectory(2);
	//console.log("left");
}

function KeyHanderRight() {
	mergeByDirectory(3);
	//console.log("right");
}


//up down left right=>0,1,2,3
function mergeByDirectory(type) {


	if (type == 0 || type == 1) {
		Rotate90();

		for (let i = 0; i < col; i++) {
			AllCubeDataArrRotate[i] = removeZero(AllCubeDataArrRotate[i], type % 2);
			AllCubeDataArrRotate[i] = mergeNum(AllCubeDataArrRotate[i], type % 2);
			AllCubeDataArrRotate[i] = removeZero(AllCubeDataArrRotate[i], type % 2);
		}
		RotateR90();

	} else if (type == 2 || type == 3) {
		for (let i = 0; i < col; i++) {
			AllCubeDataArr[i] = removeZero(AllCubeDataArr[i], type % 2);
			AllCubeDataArr[i] = mergeNum(AllCubeDataArr[i], type % 2);
			AllCubeDataArr[i] = removeZero(AllCubeDataArr[i], type % 2);
		}
	}



}

function Rotate90() {

	for (var j = 0; j < row; j++) {
		for (var i = 0; i < col; i++) {
			AllCubeDataArrRotate[j][i] = AllCubeDataArr[i][j];
		}


	}
}

function RotateR90() {

	for (var j = 0; j < row; j++) {
		for (var i = 0; i < col; i++) {
			AllCubeDataArr[j][i] = AllCubeDataArrRotate[i][j];
		}


	}
}





function removeZero(arr, type) {
	//default len = 4
	let len = arr.length;
	let arr_ret = [];

	for (let i = 0; i < len; i++) {
		if (arr[i] > 0) {
			arr_ret.push(arr[i]);
		}
	}

	//补充0
	let len_arr_ret = arr_ret.length;

	//1,3 down right  
	if (type == 1) {
		for (let j = 0; j < len - len_arr_ret; j++) {
			arr_ret.unshift(0);
		}
	} else {
		for (let j = 0; j < len - len_arr_ret; j++) {
			arr_ret.push(0);
		}
	}

	//console.log("removeZero arr", arr_ret);
	return arr_ret;

}


//
function mergeNum(arr, type) {
	//default = 4
	let len = arr.length;
	let arr_ret = [].concat(arr);
	for (let i = 0; i < len; i++) {
		if (arr_ret[i] == 0) {
			continue;
		}
		if (arr_ret[i] == arr_ret[i + 1]) {
			arr_ret[i] *= 2;
			arr_ret[i + 1] = 0;
			//update score
			score += arr_ret[i];
		} else {
			continue;
		}
	}

	//console.log("mergeNum arr", arr_ret);
	return removeZero(arr_ret, type);

}

//init
function init() {
	//init var			
	drawMainUI();
	showScore();
	changeStyle();

}

function initData() {
	score = 0;
	resetTableData();
	InitAllCubeDataArr();

}


function resetTableData() {
	$("table td").html("");
}

function newGame() {
	init();
	initData();
	//初始化两个随机位置
	loopGame();
	loopGame();

}


function loopGame() {
	let num = getRandNumInit();

	drawCandidateUI(num);

}

function gameOver() {

	alert("game over！your score is 	" + score);
	return;
}

function checkGameOver() {
	//变量数组是否相邻的数字有相同的,就可以继续
	for (var j = 0; j < row; j++) {
		for (var i = 0; i < col - 1; i++) {
			if ((AllCubeDataArr[i][j] == AllCubeDataArr[i + 1][j])) {
				return false;
			}
		}
	}

	for (var j = 0; j < row - 1; j++) {
		for (var i = 0; i < col; i++) {
			if (AllCubeDataArr[i][j] == AllCubeDataArr[i][j + 1]) {
				return false;
			}
		}
	}

	return true;
}

function drawCandidateUI(num) {
	if (len_blankArr > 0) {
		let pos_index = getRandNum(len_blankArr);
		drawSpecialGridUI(num, blankArr[pos_index]);
	}
}

function drawSpecialGridUI(num, pos_randNum) {


	let i = parseInt(pos_randNum / col);
	let j = pos_randNum % col;
	AllCubeDataArr[i][j] = num;
	drawRefreshUI();
	//add show animation	
	$("#mtd_" + (i * width + j)).css({
		'transition': '.9s ease all 0s',
		'opacity': '1'
	});


}

function drawRefreshUI() {

	for (var j = 0; j < row; j++) {
		for (var i = 0; i < col; i++) {
			if (AllCubeDataArr[i][j] > 0) {
				let number = AllCubeDataArr[i][j];
				let data = "<span class='number-cell'>" + AllCubeDataArr[i][j] + "</span>"
				setNumberCellStyle($("#mtd_" + (i * width + j)), number);
				$("#mtd_" + (i * width + j)).html(data);
			} else {
				let data = "<span class='number-cell'></span>";
				clearNumberCellStyle($("#mtd_" + (i * width + j)));
				$("#mtd_" + (i * width + j)).html(data);

			}
		}

	}
	showScore();

}

function drawMainUI() {

	//reset div
	$("#grid-container").html("");
	var table = $("<table>").appendTo($("#grid-container"));
	for (var i = 0; i < col; i++) {
		var rowData = $("<tr>").appendTo(table);
		for (var j = 0; j < row; j++) {
			//row.append("<td>null</td>");
			$("<td id=mtd_" + (i * width + j) + " class='grid-cell'></td>").appendTo(rowData);

		}
	}
	prepareForMobile();
}

function getRandNumInit() {
	return Math.random(1) > 0.5 ? 2 : 4;
}

function getRandNum(size) {
	return Math.floor(Math.random(1) * size);
}

function getBlankArr() {

	blankArr = [];
	for (var j = 0; j < row; j++) {
		for (var i = 0; i < col; i++) {
			if (AllCubeDataArr[j][i] == 0) {
				blankArr.push(j * col + i);
			}
		}

	}
	len_blankArr = blankArr.length;
	//console.log("blankArr", blankArr);
	return blankArr;
}



function InitAllCubeDataArr() {


	for (var j = height - 1; j >= 0; j--) {
		AllCubeDataArr[j] = new Array([0]);
		AllCubeDataArrRotate[j] = new Array([0]);
		for (var i = width - 1; i >= 0; i--) {
			AllCubeDataArr[j][i] = 0;
			AllCubeDataArrRotate[j][i] = 0;
			blankArr[i * col + j] = i * col + j;
		}

	}

}

function printAllCubeDataArr() {


	var content = "";
	for (var j = 0; j < row; j++) {
		for (var i = 0; i < col; i++) {
			content += (" " + AllCubeDataArr[j][i]);
		}
		console.log("row=" + j + ":" + content + "\n");
		content = "";
	}

}


function printAllCubeDataArrRotate() {
	var content = "";
	for (var j = 0; j < row; j++) {
		for (var i = 0; i < col; i++) {
			content += (" " + AllCubeDataArrRotate[j][i]);
		}
		console.log("row=" + j + ":" + content + "\n");
		content = "";
	}
}


function showScore() {

	$("#score").text(score);
}

function changeStyle() {
	let boarderStyle = $("#changeStyle").val();
	//console.log(val);
	$("table td.grid-cell").css("border-style", boarderStyle);
}

function changeLevel() {
	let changeLevel = $("#changeLevel").val();
	//console.log(val);
	width = height = col = row = changeLevel;
	newGame();
}

function prepareForMobile() {
	
	let documentWidth = window.screen.availWidth;
	let gridContainerWidth = 0.92 * documentWidth * width/4;
	let cellSideLength = 0.18 * documentWidth;
	let cellSpace = 0.04 * documentWidth;
	
	if (documentWidth > 500) {
		gridContainerWidth = 500 * width/4;
		cellSpace = 20;
		cellSideLength = 100;
	}


	$('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
	$('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
	$('#grid-container').css('padding', cellSpace);
	$('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

	$('.grid-cell').css('width', cellSideLength);
	$('.grid-cell').css('height', cellSideLength);
	// $('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}


