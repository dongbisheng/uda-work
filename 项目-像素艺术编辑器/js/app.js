const setTable = document.querySelector('#set_table');
const widthTable = document.querySelector('#grid_width_input');
const heightTable = document.querySelector('#grid_height_input');
const colorTable = document.querySelector('#color_inputer');
setTable.addEventListener('submit',function(evn){
  evn.preventDefault();
  const preTable = document.getElementById('touch_table');
  if(preTable){
    preTable.remove();
  }
  const table  = document.createElement('table');
  for(let i = 0; i < heightTable.value; i++){
    const tr = document.createElement('tr');
    for(let i = 0; i < widthTable.value; i++){
      const td = document.createElement('td');
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  table.setAttribute("id","touch_table");
  const makeArea = document.querySelector('.make_pixel_area');
  makeArea.appendChild(table);
  table.addEventListener('click',function(evn){
    console.log(evn);
    if(evn.target.nodeName === 'TD'){
      console.log('haha');
      evn.target.style.background = colorTable.value;
    }
  })
});
