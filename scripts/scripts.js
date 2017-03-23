/*#############
  ELEMENTS
#############*/


var startBtn = document.querySelector('.start');
var stopBtn = document.querySelector('.stop');
var logBtn = document.querySelector('.log');
var taskInput = document.querySelector('.task-input');
var taskContain = document.querySelector('.task-container');
var timeElement = document.querySelector('.timer');
var buttonsTop = document.querySelector('.buttons-top');

var listElement = '<li class="task-item"><div class="timer-object">';
    listElement += '<h3 class="task-desc">Task</h3><h4 class="task-time">Time</h4>';
    listElement += '<h4 class="task-edit"><i class="fa fa-pencil task-pencil" ';
    listElement += 'aria-hidden="true"></i></h4></div></li>';

/*#############
  GLOBAL VARS
#############*/

var clockInterval;
var intervalActive = false
var clockTime = 0;
var taskList = [];

//Constructor for tasks
function Task(desc, time) {
  this.desc = desc;
  this.time = time;
  // this.startTime = startTime;
  // this.stopTime = stopTime;
}

/*#############
  HELPER FUNCTIONS
#############*/

function clearTask() {
  clockTime = 0;
  taskInput.value = '';
  writeTime(convertToHHMMSS(clockTime));
}

//check if characters in input
function isInputComplete() {
  return taskInput.value === '' ? false : true;
}

//returns user input from form
function getUserTask() {
  return taskInput.value;
}

//converts seconds to hh:mm:ss
function convertToHHMMSS(inpTime) {
  var clockSeconds = inpTime % 60;
  var clockMins = Math.floor(inpTime / 60) % 60;
  var clockHours = Math.floor(inpTime / 3600);
  var clockString = '';

  if (clockHours < 10) {
    clockString += '0' + clockHours;
  } else {
    clockString += clockHours;
  }

  if (clockMins < 10) {
    clockString += ':0' + clockMins;
  } else {
    clockString += ':' + clockMins;
  }

  if (clockSeconds < 10) {
    clockString += ':0' + clockSeconds;
  } else {
    clockString += ':' + clockSeconds;
  }
  //timeElement.textContent = clockString;
  return clockString;
}

function writeTime(time) {
  timeElement.textContent = time;
}

/*#############
  EVENT HANDLERS
#############*/

//disables a given button
function disableButton(btn) {
  btn.disabled = true;
  btn.classList.add('btn-disabled');
}

//enables a given button
function enableButton(btn) {
  btn.disabled = false;
  btn.classList.remove('btn-disabled');
}

function disableInputField() {
  taskInput.disabled = true;
}

function enableInputField() {
  taskInput.disabled = false;
}

//callback for input event
//enables start button when
//text is inputted
function inputCallback() {
  if (taskInput.value !== '') {
    enableButton(startBtn);
  } else {
    disableButton(startBtn);
  }
  console.log(taskList)
}

function addStopButton() {
  startBtn.classList.add('hide');
  stopBtn.classList.remove('hide');
}

function addStartButton() {
  stopBtn.classList.add('hide');
  startBtn.classList.remove('hide');
}

//starts clock and disables log button
function startClock() {
  if (!intervalActive){
    intervalActive = true;
    clockInterval = setInterval(incrementClockTime, 1000);
    addStopButton();
    disableInputField();
    disableButton(logBtn);
  }
}

//stops clock and enables log button
function stopClock() {
  if (intervalActive) {
    intervalActive = false;
    window.clearInterval(clockInterval);
    addStartButton();
    enableInputField();
  }
  if (clockTime > 0) {
    enableButton(logBtn);
  }
}

//creates HTML list item to log
function createHtmlListItem(taskObj){
  var taskContainer = document.querySelector('.task-container');
  var desc = taskObj.desc;
  var time = convertToHHMMSS(taskObj.time);
  var listElement = '<li class="task-item" data-itemnum="' + (taskList.length - 1) + '">';
      listElement += '<div class="timer-object"><h3 class="task-desc">'+ desc +'</h3>';
      listElement += '<h4 class="task-time">' + time +'</h4><h4 class="task-edit">';
      listElement += '<ul class="sub-menu"><li class="menu-item"><i class="fa fa-refresh" aria-hidden="true">';
      listElement += '</i></li><li class="menu-item"><i class="fa fa-times" aria-hidden="true"></i></li>';
      listElement += '</ul></div></li>';

  
  taskContainer.insertAdjacentHTML('afterbegin', listElement);
}

//callback for log button
function logCallback() {
  //rewrite in future to be clockTime, rewrite writeTime() so it outputs HH:MM:SS string.  is reusable
  var taskTime = clockTime;
  var givenTask = taskInput.value;
  var newTask = new Task(givenTask, taskTime);
  //adds the new task to front of array
  taskList.push(newTask);
  //disable buttons
  disableButton(logBtn);
  disableButton(startBtn);
  //add to list creates html list element for last item in list
  createHtmlListItem(taskList[taskList.length - 1]);
  clearTask();
}

//callback for clockInterval.  adds to clocktime
//then writes the time to html
function incrementClockTime() {
  clockTime++;
  writeTime(convertToHHMMSS(clockTime));
}

//removes item from DOM and taskList
function removeListItem(itemIndex) {
  var removeEl = document.querySelector('.task-item[data-itemnum="' + itemIndex + '"]');
  taskList.splice(itemIndex);
  taskContain.removeChild(removeEl);
}

//callback function for either edit button (refresh and delete)
function editTaskItem(e){
  var boxMenu = document.querySelector('.edit-menu');
  var target = e.target;
  if ( !intervalActive && clockTime === 0) {
    var thisBox = target.parentNode.parentNode.parentNode.parentNode.parentNode;
    var itemNum = thisBox.getAttribute('data-itemnum');
    var workingItem = taskList[itemNum];

    if (target.classList.contains('fa-refresh')) {
      taskInput.value = workingItem.desc;
      clockTime = workingItem.time;
      writeTime(convertToHHMMSS(clockTime));
      enableButton(startBtn);
      enableButton(logBtn);
      removeListItem(itemNum);
      console.log(taskList);
    } else if (target.classList.contains('fa-times')) {
      removeListItem(itemNum);
    }
  }
}




/*#############
  EVENT LISTENERS
#############*/

startBtn.addEventListener('click', startClock); 
stopBtn.addEventListener('click', stopClock);
taskInput.addEventListener('input', inputCallback);
logBtn.addEventListener('click', logCallback);//adds task to list
taskContain.addEventListener('click', editTaskItem);






