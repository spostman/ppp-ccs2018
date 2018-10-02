function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var test_iframe = document.getElementById('test_area');
var test_result = document.getElementsByTagName('tbody')[0];
var test_count  = document.getElementById('success_count');
var test_status = document.getElementById('status');
var timeout_input = document.getElementById('timeoutInput');

test_count.innerText = 0;
function increaseTotal() {
  test_count.innerText = parseInt(test_count.innerText) + 1;
}

function Task(url, timeout) {
  this.url = url;
  this.result = undefined;
  this.iframe = undefined;
  this.interval = undefined;
  this.outter = undefined;
  this.timeout = timeout;

  this.start();
}

Task.prototype.addTableItem = function() {
  var tr = document.createElement('tr');

  var td;
  td = document.createElement('td');
  td.innerText = this.url;
  tr.appendChild(td);

  td = document.createElement('td');
  td.innerText = '';
  tr.appendChild(td);

  this.result = td;

  test_result.appendChild(tr);
};

Task.prototype.addIframe = function() {
  if (this.iframe !== undefined) return;

  var div = document.createElement('div');
  var iframe = document.createElement('iframe');
  iframe.onload = (e) => {
    increaseTotal();
    this.setResult(true);
    this.delete();
  };

  div.appendChild(iframe);
  div.style.display = 'inline-block';

  this.iframe = iframe;
  this.outter = div;
  test_iframe.appendChild(div);

  this.iframe.src = this.url;
}

Task.prototype.setResult = function(flag) {
  if (this.result === undefined) return;
  if (flag === undefined) flag = 'undefined';
  this.result.innerHTML = flag?
    '<span class="text-success">O</span>':
    '<span class="text-danger">X</span>';
};

Task.prototype.start = function() {
  this.addTableItem();
  this.addIframe();
  this.interval = setTimeout(() => {
    this.setResult(false);
    this.delete();
  }, this.timeout * 1000);
}

Task.prototype.delete = function() {
  test_iframe.removeChild(this.outter);
  this.iframe = undefined;

  if (this.interval !== undefined) clearInterval(this.interval);
  this.interval = undefined;
}

var tasks = [];

function getTargets() {
  var targets = document.getElementById('targets');
  var targets_value = targets.value;

  if (targets_value == '') return [];

  var targets_array = targets_value.split('\n');

  var result = [];
  for (var i = 0; i < targets_array.length; ++i) {
    var target = targets_array[i].trim();
    if (target == '') continue;
    result.push(target);
  }

  return result;
}

function startExp() {
  var targets = getTargets();
  var timeout = timeout_input.value;
  timeout = isNumeric(timeout)? parseInt(timeout): 30;
  timeout_input.value = timeout;

  for (; targets.length != 0;) {
    tasks.push(new Task(targets.shift(), timeout));
  }
}

function clearExp() {
  test_result.innerHTML = '';
  test_count.innerText = 0;

  for (; tasks.length != 0;) {
    var task = tasks.shift();
    task.delete();
    delete task;
  }
}

document.getElementById('startBtn').onclick = startExp;
document.getElementById('clearBtn').onclick = clearExp;
