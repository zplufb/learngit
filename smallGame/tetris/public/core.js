
var start = {
    x: 0,
    y: 0
}
var end = {
    x: 0,
    y: 0
}

document.addEventListener('touchstart', function (event) {
    start.x = event.touches[0].pageX;
    start.y = event.touches[0].pageY;
});

document.addEventListener('touchmove', function (event) {
    event.preventDefault();
},{passive:false});

document.addEventListener('touchend', function (event) {
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
               KeyHanderLeft()
        }
    } else {
        if (deltaY > 0) {
               KeyHanderDown();
        } else {
               KeyHanderUp()
        }
    }
});


function Counter(){

	if(typeof(Storage)!=="undefined"){
		
		var num = localStorage.getItem("pageviews");

		if (num != null){
			localStorage.setItem("pageviews", Number(num) + 1);
		}else{
			localStorage.setItem("pageviews", 1);
			num = 1;
		}

		document.getElementById("counter").innerHTML="PageViews: " + num;
	}else{
		document.getElementById("counter").innerHTML="Sorry, Your browser is unable to support web storage";
	}
}

function ShowRecordsList(){

	
	var userNameList="";
	var scoreList="";
	var localStorageArr = [];
	var sortedArr = [];

	
	for(var i = 0; i < localStorage.length - 2; i++){
		if(localStorage.getItem(i) != null){
			var str= localStorage.getItem(i);
			var obj = JSON.parse(str);

			localStorageArr.push(obj);
		}
	}

	if(localStorageArr.length >= 2){
		sortedArr = sortForObj(localStorageArr);
	}else{
		sortedArr = localStorageArr;
	}

	var maxNubmer = sortedArr.length < 20 ? sortedArr.length : 20;
	for(var i = 0; i < maxNubmer; i++){
		userNameList += sortedArr[i].userName+"<br>";
		scoreList += sortedArr[i].score+"<br>";
	}

	//$("#nameScore").html(content);	
	$("#_name").html(userNameList);
	$("#_score").html(scoreList); 
}

function sortForObj(objArr){

	for (var i = 0; i < objArr.length ; i++) {
		for (var j = i + 1; j < objArr.length; j++) {
			var score = parseInt(objArr[j].score);
			if(parseInt(objArr[i].score) < score){
				var tmp = {};
				tmp.key = objArr[j].key;
				tmp.score =  objArr[j].score;
				tmp.userName = objArr[j].userName;

				objArr[j].key = objArr[i].key;
				objArr[j].score =  objArr[i].score;
				objArr[j].userName = objArr[i].userName;

				objArr[i].key = tmp.key;
				objArr[i].score =  tmp.score;
				objArr[i].userName = tmp.userName;
			}
		}
		
	}

	return objArr;


}

function RecordSave(){ 

        var records = new Object;
       
        records.key = getNumber();
        var userName = $("#userName").val();
        if(userName == ''){
			records.userName = "Player";
		}else{
			records.userName =  userName;
	    }
        
        records.score = $('#score').text();
       
        var str = JSON.stringify(records); 
        localStorage.setItem(records.key,str);  
        
    }

function getNumber()
{
	var lastUserId = localStorage.getItem("lastUserId"); 
	var num = lastUserId == null ? 0 : Number(lastUserId) + 1;
	
	localStorage.setItem("lastUserId", num);
	
	return num; 
} 

function saveUserName(){

	var userName = $('#userName').val();
	if(userName != ""){
		sessionStorage.userName = $('#userName').val();
	}
}

function InitLocalOrSessionData(){

	var userName = sessionStorage.userName;
	if(typeof userName != 'undefined'){
		$('#userName').val(sessionStorage.userName);
	}
	//
	ShowRecordsList();
	Counter();

	//Save UserName in one session
	var currKey;
	$('#userName').keypress(function(){
		currKey = event.keyCode || event.which || event.charCode;
		if(currKey == 13){
			//var userName = $('#userName').val();
			saveUserName();
			$(this).blur();
			//console.log("blur Press enter");
		}else{

		}
	});

	$('#userName').blur(function(){
		if(currKey != 13){
			saveUserName();
			//console.log("blur saveUserName");
		}
	});


}

$(document).ready(function(){

	InitUI();
	InitData();
	InitVK();
	//ShowCandidateType();
	//Start();
	InitLocalOrSessionData();



});

function InitData(){

 curTypeArr = null;
 nextTypeArr = null;
 pos = {x:0,y:Int(width/2)};
 curTypeObjIndex = 0;
 curTypeArrPos = [];
 flagIsBoundary = false;
 curTypeArrPosNextStatus = [];
 curTypeArrPosForCubeStatus = [];
 AllCubeStatusArr =[];
 speed = 1;
 score = 0;
 clearRowsNum = 0;
 nextTypeObjIndex = 0;
 stopFlag = false;
 firstStart = true;

 $("#level").html("0"+ speed);
 $("#score").html(score);
 //$("#textStatus").html("No Start");
 TextSatutsTimeOut(3,"No Start");
	
 clearInterval(timeInterval);
 InitAllCubeStatusArr();
 Types();
 //ShowCandidateType();
 //updateLeaderboardsHeihgt();
}

function InitUI(){
	DrawMainUI();
	DrawCandidateZoneUI();
	DrawOperationZoneUI();
}

var typeObj = new Object();
var curTypeArr = null;
var nextTypeArr = null;
var width = 10;
var height = 20;
var model_width = width + 2;
var model_height = height + 1;
var pos = {x:0,y:Int(width/2)};
var curTypeObjIndex = 0;
var typeObjAttrList = [["aa","ab"],["ba"],["ca","cb"],["da","db"],["ea","eb","ec","ed"],["fa","fb","fc","fd"],["ga","gb","gc","gd"]];

var curTypeArrPos = [];
var flagIsBoundary = false;
var curTypeArrPosNextStatus = [];
var curTypeArrPosForCubeStatus = [];
var AllCubeStatusArr =[];

var speed = 1;
var score = 0;
var clearRowsNum =0;
var nextTypeObjIndex = 0;
var timeInterval = null;
var stopFlag = false;
var PauseFlag = false;
var firstStart = true;
var mainbgcolor = "#94C6DD";


function InitAllCubeStatusArr(){
	//U type, Arr is (width +2 )*(height+1)
	
	//reset AllCubeStatusArr
	AllCubeStatusArr = [];
	for (var j = height  ; j >= 0; j--) {
		AllCubeStatusArr[j] = new Array([0]);
	for (var i = width + 1 ; i >= 0; i--) {
		AllCubeStatusArr[j][i] = 0;
		}
		
	}
	
	for (var j = height ; j >= 0; j--) {
		AllCubeStatusArr[j][0] = 1;
		AllCubeStatusArr[j][width +1] = 1;
	}
	for (var i = width ; i >= 0; i--) {
		AllCubeStatusArr[height][i] = 1;
	}

	//RefreshDrawUI();
}

function printAllCubeStatusArr(){
	
	var content = "";
	var row = AllCubeStatusArr.length;
	var col = AllCubeStatusArr[0].length;
	for (var j =0 ; j < row; j++) {
		for (var i = 0 ; i < col; i++) {
		 content +=(" "+AllCubeStatusArr[j][i]);
		}
		//console.log("row="+j+":"+content+"\n");
		content = "";
	}
	
}

function UpdateAllCubeStatusArr(){
	//last type done will execute the function
	
	for (var i = curTypeArrPosForCubeStatus.length - 1; i >= 0; i--) {
		var row = Int(curTypeArrPosForCubeStatus[i] / model_width);
		var col = Int(curTypeArrPosForCubeStatus[i] % model_width);
		//if(row < height){
			AllCubeStatusArr[row][col] = 1;
			$("#mtd_"+ curTypeArrPosForCubeStatus[i]).attr("flag","1");
			//console.log("i="+i+" 1 = AllCubeStatusArr["+row+"]["+col+"]");
		//}
		
	}
	//console.log("UpdateAllCubeStatusArr() Complete");
	
}

function RefreshDrawUI(){


	for(var i = 0; i < model_height -1; i++){
		for(var j = 1; j < model_width -1; j++){
		
			var curId = $("#mtd_"+ (i*model_width+j));
			if(AllCubeStatusArr[i][j] == 1){
				curId.css("background-color","#f00");
				////console.log("showCurTypeInMainBoard->red,curId= "+(i*model_width+j ));
			}else{
				curId.css("background-color", mainbgcolor);
				////console.log("showCurTypeInMainBoard->white,curId= "+(i*model_width+j ));
			}	
		}
	}
	//console.log("RefreshDrawUI() Complete");

}


function CheckRemoveRowInline(){
	var count = 0;
	var clearRow = 0;
	for(var i = 0; i < model_height - 1; i++){
		for(var j = 1; j < model_width - 1; j++){
			if(AllCubeStatusArr[i][j] ==1){
				count ++;
			}		
		}
		if (count == width) {
			clearRow = i;
			clearRowsNum ++;
			RemoveRowInline(clearRow);
			RefreshDrawUI();			
		}

		count = 0;

	}
	UpdateScore();
	
}

function RemoveRowInline(row){
	
	for(var i = row ; i > 0; i--){
		for(var j = 1; j < model_width - 1; j++){	
			
			AllCubeStatusArr[i][j] = AllCubeStatusArr[i-1][j];
		
		}

	}
	$("#textStatus").html("<div style='color:red'>remove "+clearRowsNum+" row!");
	TextSatutsTimeOut();
	//console.log("RemoveRowInline row="+row);
}


function UpdateScore(){
	var lastScore =	score;
	if(clearRowsNum == 1){
		score += 1;
	}else if(clearRowsNum == 2){
		score += 3;
	}else if(clearRowsNum == 3){
		score += 6;
	}else if(clearRowsNum == 4){
		score += 10;
	}else{// when clearRowsNum = 0, it will not happen
		//score += 0;
	}

	//reset
	clearRowsNum = 0;

	if(score >= 20 && lastScore < 20){
		UpdateLevel();	
	}else if(score >= 40 && lastScore < 40){
		UpdateLevel();	
	}else if(score >= 60 && lastScore < 60){
		UpdateLevel();
	}else if(score >= 80 && lastScore < 80){
		UpdateLevel();	
	}else if(score >= 100 && lastScore < 100){
		UpdateLevel();
	}else if(score >= 120 && lastScore < 120){
		UpdateLevel();
	}else if(score >= 140 && lastScore < 140){
		UpdateLevel();
	}else if(score >= 147){
		score = 147;
		$("#textStatus").html("<div style='color:green'><b>Win</b>");
		
		RecordSave();
		ShowRecordsList();
		
		firstStart = true;
		
		var t =setInterval(function(){
			
			for(var i = height -1 ; i > 0; i--){
			for(var j = 1; j < model_width - 1; j++){					
				AllCubeStatusArr[i][j] = AllCubeStatusArr[i-1][j];		
				}
			}

			RefreshDrawUI();	
			},500);

		setTimeout(function(){
			clearInterval(t);
			$("#reset").trigger("click");
			},500*height);	
	}

	$("#score").html(score);
}

function UpdateLevel(){
	// speed value from  1 to 6, Max is 6
	speed = Int(score / 20);
	$("#level").html("0"+ speed);
	if ( score >= 20 ) {
		$("#textStatus").html("<div style='color:green'>Congratulation! You have arrived "+speed+" Level");
		TextSatutsTimeOut(5);
	}

}

function CheckGameOver(){
	for(var i=0; i<curTypeArrPos.length;i++)
	
		if(CheckNextStatusIsBoundary()){
			if (Int(curTypeArrPos[i] / model_width) == 0) {

			//console.log("Game Over! Your Score is="+$("#score").text());
			$("#textStatus").html("<div style='color:red'><b>Game over</b>");
			$('#score').html('<b style="color:green">'+$('#score').text()+'</b>');
			
			clearInterval(timeInterval);

			setTimeout(function(){
				RecordSave();
				ShowRecordsList();
				$('#reset').trigger('click');
			},3000);

			break;

		}
	}

}

function TextSatutsTimeOut(seconds,msg){
	if (typeof seconds == 'undefined') {
		seconds = 3;
	}
	if (typeof msg == 'undefined') {
		msg="playing";
	}
	setTimeout(function(){
		$("#textStatus").html(msg);			
		},seconds*1000);

}

function Int(number){

	return Math.floor(number);

}

function CheckNextStatusIsBoundary(reCheck){
	
	for (var i = curTypeArrPos.length - 1; i >= 0; i--) {

			if(curTypeArrPosNextStatus[i] >= model_width * (model_height-1)){
					return true;
				}

			if (reCheck == true ) {
				UpdatePosNextStatus(KEY_DOWN);
				if(CubeInBlock(curTypeArrPosNextStatus[i])){
					return true;
				}
				//console.log("reCheck i="+i);
			}
			else if(CubeInBlock(curTypeArrPosNextStatus[i])){
				//console.log("CheckNextStatusIsBoundary_i_val_ret="+i+" "+curTypeArrPosNextStatus[i]+" true");
				return true;
			}
		}
		//console.log("CheckNextStatusIsBoundary_i_val_ret="+i+" "+false);
	return false;
}

/*function CheckCurTypeStatusIsBottomBoundary(){

for (var i = curTypeArrPosNextStatus.length - 1; i >= 0; i--) {
		//bottom check boundary when first start 
		if(curTypeArrPosNextStatus[i] >= model_width * (model_height-1)){
			//console.log("CheckCurTypeStatusIsBottomBoundary0="+curTypeArrPosNextStatus[i]);
			return true;
		}

		//If NextStatus is Boundary, then NextNextStatus will be in CubeInBlock
		if(CubeInBlock(curTypeArrPosNextStatus[i] + model_width)){
			//console.log("CheckCurTypeStatusIsBottomBoundary1="+curTypeArrPosNextStatus[i]);
			return true;
		}
	}
	return false;

}
*/

function CubeInBlock(number){

	var row = Int(number / model_width);
	var col = Int(number % model_width);
	//console.log("CubeInBlock_num_row_col="+ number+" "+row+" "+col);
	if (AllCubeStatusArr[row][col] == 1){
		//console.log("CubeInBlock_num is in block="+ number);
		return true;
	}
	
	return false;
}



function Types(){
//five type
typeObj.aa = [[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]];//----
typeObj.ab = [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]];//clockwise rotate 90 degree

typeObj.ba = [[1,1,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]];//田

typeObj.ca = [[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]];//z
typeObj.cb = [[0,1,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]];//clockwise rotate 90 degree

typeObj.da = [[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]];//mirror z
typeObj.db = [[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]];//clockwise rotate 90 degree

typeObj.ea = [[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,0,0,0]];//mirror L
typeObj.eb = [[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]];//clockwise rotate 90 degree
typeObj.ec = [[1,1,0,0],[1,0,0,0],[1,0,0,0],[0,0,0,0]];//clockwise rotate 180 degree
typeObj.ed = [[1,1,1,0],[0,0,1,0],[0,0,0,0],[0,0,0,0]];//anticlockwise rotate 90 degree

typeObj.fa = [[1,0,0,0],[1,0,0,0],[1,1,0,0],[0,0,0,0]];//L
typeObj.fb = [[1,1,1,0],[1,0,0,0],[0,0,0,0],[0,0,0,0]];//clockwise rotate 90 degree
typeObj.fc = [[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]];//
typeObj.fd = [[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]];//

typeObj.ga = [[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]];//I---
typeObj.gb = [[1,0,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]];
typeObj.gc = [[1,1,1,0],[0,1,0,0],[0,0,0,0],[0,0,0,0]];
typeObj.gd = [[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]];

}


$(window).keypress(function(event){
	
	var currKey = event.keyCode || event.which || event.charCode;
    var keyName = String.fromCharCode(currKey); 
    //console.log("keyCode: " + currKey + " charCode: " + keyName); 
  
  switch(currKey) {
    case 119:
    case 87:
    	KeyHanderUp();
    	break;
    case 115:
    case 83:
    	KeyHanderDown();
    	break;
    case 97:
    case 65:
    	KeyHanderLeft();
    	break;
    case 100:
    case 68:
    	KeyHanderRight();
    	break;
    }
    //console.log("pos(x,y)=["+pos.x+","+pos.y+"]");
});

function KeyHanderUp(){

if (!flagIsBoundary && !PauseFlag && !firstStart) {
	eraseCurTypeUI();
	//default rotate dir is right
	var curTypeArrRotate = null;
	var nextAttr = null;
	//console.log("curIndex ="+(curTypeObjIndex));

	if(curTypeObjIndex == 0){
		nextAttr = typeObjAttrList[0][1];
		curTypeObjIndex = 1;
	}else if(curTypeObjIndex == 1 ){
		nextAttr = typeObjAttrList[0][0];
		curTypeObjIndex = 0;
	}else if(curTypeObjIndex == 2){
		nextAttr = typeObjAttrList[1][0];
		curTypeObjIndex = 2;
	}else if(curTypeObjIndex == 3){
		nextAttr = typeObjAttrList[2][1];
		curTypeObjIndex = 4;
	}else if(curTypeObjIndex == 4 ){
		nextAttr = typeObjAttrList[2][0];
		curTypeObjIndex = 3;
	}else if(curTypeObjIndex == 5){
		nextAttr = typeObjAttrList[3][1];
		curTypeObjIndex = 6;
	}else if(curTypeObjIndex == 6 ){
		nextAttr = typeObjAttrList[3][0];
		curTypeObjIndex = 5;
	}else if(curTypeObjIndex >= 7){
		//first four rows number is 2+1+2+2 = 7, add 9 is 4 * 4 = 16
		var index = curTypeObjIndex + 9;
		var row =Math.floor(index / 4);
		var col =Math.floor(index % 4);
		//var curAttr = typeObjAttrList[row][col];
		
		if (col < 3) {
			nextAttr = typeObjAttrList[row][col+1];
			curTypeObjIndex ++;
		}else{
			col = 0;
			nextAttr = typeObjAttrList[row][col];
			
			if ((curTypeObjIndex+9) % 4 == 3) {
				curTypeObjIndex -= 3;
			};
		}
				
	}

	curTypeArrRotate = typeObj[nextAttr];

	curTypeArrPosNextStatus = [];
	for(var i = 0; i < 4; i++){
	for(var j = 0; j < 4-i; j++){
		if (curTypeArrRotate[i][j] == 1) {
			var id = (i+pos.x)*model_width+j+(pos.y)
			curTypeArrPosNextStatus.push(id);
			}
		}
			
	}

	if(! CheckNextStatusIsBoundary()){
		curTypeArr = typeObj[nextAttr];
	}else{
		curTypeObjIndex --;
		//Fix Type aa -> ab
		if (curTypeObjIndex < 0) {
			curTypeObjIndex = 1;
		};
	}
	
	showCurTypeInMainBoard();
	}
}


function KeyHanderDown(){
	
	if (!flagIsBoundary && !PauseFlag && !firstStart) {
		eraseCurTypeUI();
		pos.x ++;
        //Remember last status before conflict check 

		UpdatePosNextStatus(KEY_DOWN);
		if(CheckNextStatusIsBoundary()){
			pos.x --;

			flagIsBoundary =true;
		
		setTimeout(function(){
			
			//Remember last status before conflict check 
			for (var i = curTypeArrPosNextStatus.length - 1; i >= 0; i--) {
        		curTypeArrPosForCubeStatus[i] = curTypeArrPosNextStatus[i];
        	}

        	if(!CheckNextStatusIsBoundary(true)){
        		flagIsBoundary = false;
        	}else{

				PauseFlag = true;
				UpdateAllCubeStatusArr();
				RefreshDrawUI();
				CheckRemoveRowInline();
				if(!CheckGameOver()){
					PauseFlag = false;
					Next();
				}
			}
			
		},300);
	}
	
	showCurTypeInMainBoard();
	}


}

//var KEY_UP = 0;
var KEY_DOWN = 1;
var KEY_LEFT = 2;
var KEY_RIGHT = 3;

function UpdatePosNextStatus(keyStatus){
	var offset =0;
	if (keyStatus == KEY_LEFT){
		offset = -1;
	}else if (keyStatus == KEY_RIGHT) {
		offset = 1;
	}else if (keyStatus == KEY_DOWN){ //KEY_DOWN 
		offset = model_width;
	}else{//KEY_UP
		offset = -model_width;
	}

	for (var i = curTypeArrPosNextStatus.length - 1; i >= 0; i--) {
		curTypeArrPosNextStatus[i] += offset;
	}
}

function KeyHanderLeft(){
	
	if(!PauseFlag && !firstStart){
	eraseCurTypeUI();
	pos.y --;
		
	UpdatePosNextStatus(KEY_LEFT);

	if (CheckNextStatusIsBoundary()) {
		
		//curTypeArrPosForCubeStatus = curTypeArrPosNextStatus;
		pos.y ++;
		
		}
	showCurTypeInMainBoard();
	}

}

function KeyHanderRight(){
	
	if(!PauseFlag && !firstStart){
	eraseCurTypeUI();
	pos.y ++;
		
	UpdatePosNextStatus(KEY_RIGHT);
	if (CheckNextStatusIsBoundary()) {
		//curTypeArrPosForCubeStatus = curTypeArrPosNextStatus;
		pos.y --;
	}

	showCurTypeInMainBoard();
	}
}


function showCurTypeInMainBoard(){
	// reset curTypeArrPos data
	curTypeArrPos = [];
	curTypeArrPosNextStatus = [];
	for(var i = 0; i < 4; i++){
	for(var j = 0; j < 4-i; j++){
		if (curTypeArr[i][j] == 1) {
			var id = (i+pos.x)*model_width+j+(pos.y);
			$("#mtd_"+ id).css("background-color","#f00");
			////console.log("showCurTypeInMainBoard->red,id="+curTypeArr[i][j] +" "+id );
			curTypeArrPos.push(id);
			curTypeArrPosNextStatus.push(id);
			}
		}
			
	}
	
}

function GetRandType(){
	var type = null;
	var i =0;
	var randNum =Math.floor(Math.random()*19);
	for (x in typeObj) {
		type = typeObj[x];

		if (randNum == i) {
			break;
		};
		i++;
	};
	nextTypeObjIndex = randNum;
	//console.log("GetRandType_curTypeObjIndex=" + curTypeObjIndex);
	
	return type;
}


function ShowCandidateType(){

	nextTypeArr = GetRandType();
	//nextTypeObjIndex =  curTypeObjIndex;
	//reset color to white
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4-i; j++){	
		$("#ctd_"+(i*4+j)).css("background-color", mainbgcolor);			
		}
			
	}

	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4-i; j++){
		if (nextTypeArr[i][j] == 1) {
				$("#ctd_"+(i*4+j)).css("background-color","#f00");
			}
		}
			
	}
}

function DrawMainUI(){

	//reset div
	$("#left").html("");
	var table = $("<table>").appendTo($("#left"));
	for(var i = 0; i < model_height - 1; i++){
		var row = $("<tr>").appendTo(table);
	for(var j = 1; j < model_width - 1 ; j++){
	 //row.append("<td>null</td>");
		$("<td id=mtd_"+(i*model_width+j)+" style='width:20px;height:20px'></td>").appendTo(row); 
	
		}
			
	}
}

function DrawCandidateZoneUI(){
	//reset div
	$("#candidateZone").html("");
	var table = $("<table>").appendTo($("#candidateZone"));
	for(var i = 0; i < 4; i++){
	var row = $("<tr>").appendTo(table);
	for(var j = 0; j < 4; j++){
	 //row.append("<td>null</td>");
	$("<td id=ctd_"+(i*4+j)+" style='width:20px;height:20px'></td>").appendTo(row); 
	
		}
			
	}
}

function DrawOperationZoneUI(){


	var content ="";

	var div_custom = $("<div>").appendTo($("#custom"));
		content = "<div><b>Custom</b></div><div>width :<input id='width' style='width:40px' placeholder='5-20'/></div>"
				+ "<div>height:<input id='height' style='width:40px' placeholder='5-20'/></div>"
				+ "<button id='customOk'>OK</button>"
				+ "&nbsp;"
				+ "<button id='customClear'>Clear</button>";
	div_custom.html(content);

	var div_debug = $("<div>").appendTo($("#debugZone"));
		content = "<button id='refresh'>RefreshUI</button>"	
				+ "<button id='printAllCubeStatusArr'>printStatusArr</button>"
				+ "<div>SetLevel :<input id='setLevel' style='width:20px' placeholder='1-7'/></div>"
				+ "<div>SetScore :<input id='setScore' style='width:20px' placeholder='147'/></div>"
				+ "<button id='debugOk'>OK</button>"
				+ "&nbsp;"
				+ "<button id='debugClear'>Clear</button>"
				+ "<button id='debugHide' style='width:100%'>Hide</button>";
	div_debug.html(content);

	var div_manual = $("<div>").appendTo($("#manual"));
		content = "<div>Manual:Press WSAD is for UP DOWN LEFT RIGHT or Using below virtual nav key or <span style='color:red'>gesture</div>";
	div_manual.html(content);

	var div_score = $("<div style='float: left;background-color:#77ff77; width:100%; font-size:larger'>").appendTo($("#scoreZone"));
	 	content = "<b>Level:</b><span id='level'>01</span>"
				+ "<b style='padding-left:95px'>Score:</b><span id='score'>0</span>";
	div_score.html(content);

	var div_play = $("<div>").appendTo($("#playZone"));
	 	content = "<button id='play' >Play</button>"
				+ "<button id='reset' class='float-right'>Reset</button>";
	div_play.html(content);

	var div_text = $("<div>").appendTo($("#textStatusZone"));
	 	content = "<div>Status: </div>"
	 			+ "<div id='textStatus'>No Start</div>";
	div_text.html(content);

	var div_nav = $("<div>").appendTo($("#virtualNav"));
	 	content = "<button id='v_up' style='width:100%'>Up</button>"
				+ "<button id='v_left' class='float-left'>Left</button>"
				+ "<button id='v_right' class='float-right'>Right</button>"
				+ "<button id='v_down' style='width:100%'>Down</button>";
	div_nav.html(content);
}

function InitVK(){

	//custom
	$("#customOk").click(function(){
		var cwidth = parseInt($("#width").val());
		var cheight =parseInt($("#height").val());
		if (cwidth >= 5 && cheight >=5 && cwidth <= 20 &&cheight <=20) {
			width = cwidth;
			height =cheight;
			model_width = width + 2;
			model_height = height + 1;
			$("#textStatus").html("custom setting done");
			$("#reset").trigger('click');
			//$("#main").css('width',width/10*260+112+154+'px');
			//$("#scoreZone > div").css('width',width/10*260+112+'px');


		}else{
			$("#textStatus").html("width or height size both is among <b>5-20</b>");
			
		}
		TextSatutsTimeOut(3,"No Start");

		//open debugZone
		if (cwidth == "520" || cheight =="520") {
			$("#debugZone").removeClass("none");
			$("#debugZone").css("border","1px solid #0f0");
		}

		//auto set height of leaderboards 
		//updateLeaderboardsHeihgt();

	});

	$("#customClear").click(function(){
			
		if($("#width").val() == "" && $("#height").val() == ""){
			$("#textStatus").html("Don't Press Clear button when no value");
			 
			 setTimeout(function(){
				$("#textStatus").html("No Start");			
			 },2000);
		
		}else{
			 $("#width").val("");
			 $("#height").val("");
			 $("#textStatus").html("Clear Custom width and height");
			
			 setTimeout(function(){
				$("#textStatus").html("No Start");			
			 },2000);
		 }
		 
	});
	
	//debugZone
	$("#printAllCubeStatusArr").click(function(){
		printAllCubeStatusArr();
	});

	$("#refresh").click(function(){
		RefreshDrawUI();
	});
	
	$("#debugOk").click(function(){
		var dlevel = parseInt($("#setLevel").val());
		var dScore =parseInt($("#setScore").val());
		if (dlevel <= 7 && dlevel >=1) {
			speed = dlevel -1;	
			$("#level").html("0"+dlevel);
			
		}else{
			$("#textStatus").html("level is among <b>1-7</b>");	
		}

		if (dScore <= 147 && dScore >= 0) {
			score = dScore;
			$("#score").html(dScore);
			//$("#textStatus").html("setScore done");
		}else{
			$("#textStatus").html("level is among <b>1-7</b> and Score is among <b>0-147</b>");	
		}	

		setTimeout(function(){
			$("#textStatus").html("No Start");			
		},5000);

	});

	$("#debugClear").click(function(){
			
		if($("#width").val() == "" && $("#height").val() == ""){
			$("#textStatus").html("Don't Press Clear button when no value");
			 
			 setTimeout(function(){
				$("#textStatus").html("No Start");			
			 },2000);
		
		}else{
			 $("#setLevel").val("");
			 $("#setScore").val("");
			 $("#textStatus").html("Clear Level and Score");
			
			 setTimeout(function(){
				$("#textStatus").html("No Start");			
			 },2000);
		 }
		 
	});

	$("#debugHide").click(function(){

		$("#debugZone").addClass("none");
			$("#textStatus").html("Debug Zone has hided");		 
			 setTimeout(function(){
				$("#textStatus").html("No Start");			
			 },2000);	 
	});
	
	//playZone
	$("#play").click(function(){
	
		if($("#play").text() == "Pause"){
			clearInterval(timeInterval);
			$("#play").html("<b>Play<b>");
			PauseFlag = true;
			$("#textStatus").html("game is paused");
		}else{//$("#play").text() == "Play"
			Play();
			if(firstStart){
				//init nextTypeArr show CandidateType
				ShowCandidateType();
				Start();
				firstStart = false;
			}

			$("#play").text("Pause");
			PauseFlag = false;
			$("#textStatus").html("playing");
		}		

	});

	$("#reset").click(function(){
		DrawMainUI();
		DrawCandidateZoneUI();
		InitData();
		//firstStart = true;
		clearInterval(timeInterval);
		$("#play").text("Play");

		
	});

	//nav
	$("#v_up").click(function(){
		KeyHanderUp();
	});

	$("#v_down").click(function(){
		KeyHanderDown();
	});

	$("#v_left").click(function(){
		KeyHanderLeft();
	});

	$("#v_right").click(function(){
		KeyHanderRight();
	});

}


function Start(){
	//ShowCandidateType();
	curTypeArr = nextTypeArr;
	var lastTypeObjIndex = nextTypeObjIndex;
	ShowCandidateType();
	curTypeObjIndex = lastTypeObjIndex;
	showCurTypeInMainBoard();
}



function Next(){
	
	if(flagIsBoundary){
		flagIsBoundary = false;
		pos = {x:0,y:Int(width/2)};
		Start();
	}
	//console.log("Next() Complete");

}
function Play(){
	timeInterval = setInterval(function(){
		KeyHanderDown();
	},(8-speed)*70);
}

function eraseCurTypeUI(){
	for(var i = 0; i < 4; i++){
		$("#mtd_"+curTypeArrPos[i]).css("background-color", mainbgcolor);
	}

}