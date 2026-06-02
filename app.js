let data=JSON.parse(localStorage.getItem('lottoData')||'[]');

function save(){localStorage.setItem('lottoData',JSON.stringify(data));}

function addResult(){
 const d=document.getElementById('drawDate').value;
 const r=document.getElementById('resultInput').value.trim();
 if(!/^\d{4}$/.test(r)) return alert('กรอกเลข 4 หลัก');
 data.push({date:d,result:r});
 save(); render();
}

function del(i){data.splice(i,1);save();render();}

function render(){
 const tb=document.querySelector('#resultsTable tbody');
 tb.innerHTML='';
 const q=(document.getElementById('searchBox').value||'').trim();
 data.forEach((x,i)=>{
   if(q && !x.result.includes(q)) return;
   tb.innerHTML+=`<tr><td>${x.date}</td><td>${x.result}</td><td><button onclick="del(${i})">ลบ</button></td></tr>`;
 });
 renderStats();
}

function renderStats(){
 const c=Array(10).fill(0);
 data.forEach(x=>x.result.split('').forEach(d=>c[+d]++));
 document.getElementById('stats').innerHTML=c.map((v,i)=>`เลข ${i}: ${v} ครั้ง`).join('<br>');
 const ctx=document.getElementById('digitChart');
 if(window.chart) window.chart.destroy();
 window.chart=new Chart(ctx,{type:'bar',data:{labels:[0,1,2,3,4,5,6,7,8,9],datasets:[{data:c}]}});
}

function exportData(){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const a=document.createElement('a');
 a.href=URL.createObjectURL(blob);
 a.download='lotto-data.json';
 a.click();
}

document.getElementById('importFile').addEventListener('change',e=>{
 const f=e.target.files[0];
 if(!f) return;
 const r=new FileReader();
 r.onload=()=>{data=JSON.parse(r.result);save();render();};
 r.readAsText(f);
});

document.getElementById('searchBox').addEventListener('input',render);
render();
