(function(){
var day_ja = ['日', '月', '火', '水', '木', '金', '土'];
// 外から見えるメソッドを定義
function JCalendar(parent){
  if (typeof parent === 'string') {
    parent = document.getElementById(parent);
  }
  this.parent = parent;
}
window.JCalendar = JCalendar;

JCalendar.prototype = {
  create: create,
  update: update,
  remove: remove,
  set_caption: set_caption,
  set_body: set_body,
  set_date: set_date,
  onclick_date: onclick_date,
  onclick_month: onclick_month
};
// 上記のメソッドの中身
function onclick_date(id, year, month, date){
  return false;
}
function onclick_month(id, year, month){
  this.update(+year, +month);
  return false;
}
function remove(){
  this.parent.removeChild(this.table);
}
function update(year, month){
  this.remove();
  this.create(year, month);
}
function set_date(year, month){
  var today = new Date();
  this.month =parseInt(month, 10)|| (today.getMonth()+1);
  this.year = parseInt(year, 10) || today.getFullYear();
}
function set_caption(year, month){
  var caption = document.createElement('caption');
  var div = document.createElement('div');
  var next = document.createElement('a');
  next.href = '#month-' + ((month === 11) ? year+1 : year)
              + '-' + (month===11?1:month+1);
  next.className = 'next';
  next.innerHTML = '→';
  var prev = document.createElement('a');
  prev.href = '#month-' + ((month === 1) ? year-1 : year)
              + '-' + (month===1?12:month-1);
  prev.className = 'prev';
  prev.innerHTML = '←';
  var current = document.createElement('span');
  var text = document.createTextNode(year + '/' + month);
  current.appendChild(text);
  div.appendChild(prev);
  div.appendChild(current);
  div.appendChild(next);
  caption.appendChild(div);
  this.table.appendChild(caption);
}
function set_body(year, month){
  var tbody = document.createElement('tbody');
  var first = new Date(year, month - 1, 1);
  var last = new Date(year, month, 0);
  var first_day = first.getDay();
  var last_date = last.getDate();
  var date = 1;
  var skip = true;
  for (var row = 0; row < 7; row++) {
    var tr = document.createElement('tr');
    for (var col = 0; col < 7; col++){
      if (row === 0){
        var th = document.createElement('th');
        var day = day_ja[col];
        th.appendChild(document.createTextNode(day));
        th.className = 'calendar day-head day' + col;
        tr.appendChild(th);
      } else {
        if (row === 1 && first_day === col){
          skip = false;
        }
        if (date > last_date) {
          skip = true;
        }
        var td = document.createElement('td');
        td.className = 'calendar day' + col;
        if (!skip) {
          var a = document.createElement('a');
          a.href = '#day-' +year+ '-' +month+ '-' +date;
          a.appendChild(document.createTextNode(date));
          td.appendChild(a);
          date++;
        } else {
          td.innerHTML='<span class="blank">&nbsp;</span>';
        }
        tr.appendChild(td);
      }
    }
    tbody.appendChild(tr);
  }
  this.table.appendChild(tbody);
}
function create(year, month){
  var that = this;
  var table = document.createElement('table');
  table.className = 'js_calendar';
  this.table = table;
  table.onclick = function(e){
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    if (target.tagName === 'A' &&
        target.hash.indexOf('#day-') === 0) {
      return that.onclick_date.apply(that,
             target.hash.match(/day-(\d+)-(\d+)-(\d+)/));
    } else if (target.tagName === 'A' &&
               target.hash.indexOf('#month-') === 0) {
      return that.onclick_month.apply(that,
             target.hash.match(/month-(\d+)-(\d+)/));
    }
  };
  this.set_date(year, month);
  this.set_caption(this.year, this.month);
  this.set_body(this.year, this.month);
  this.parent.appendChild(table);
}
})();
new JCalendar('j-calendar2').create();
