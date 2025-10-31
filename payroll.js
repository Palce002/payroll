const peso = new Intl.NumberFormat("fil-PH",{style:"currency",currency:"PHP"});
const DEDUCTIONS = { sss:0.05, pagibig:0.03, philhealth:0.02, tax:0.05 };

function $(q,ctx=document){return ctx.querySelector(q);}
function format(n){return peso.format(n);}
function readFormData(form){
  const o=Object.fromEntries(new FormData(form));
  o.rate=parseFloat(o.rate||"0")||0;
  o.days=parseFloat(o.days||"0")||0;
  return o;
}
function computePayroll(o){
  const gross=o.rate*o.days;
  const sss=gross*DEDUCTIONS.sss;
  const pagibig=gross*DEDUCTIONS.pagibig;
  const philhealth=gross*DEDUCTIONS.philhealth;
  const tax=gross*DEDUCTIONS.tax;
  const total=sss+pagibig+philhealth+tax;
  const net=gross-total;
  return {...o,gross,sss,pagibig,philhealth,tax,totalDeduction:total,net};
}
function handleMainPage(){
  const form=$("#payroll-form"); if(!form)return;
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const data=readFormData(form);
    const computed=computePayroll(data);
    sessionStorage.setItem("payrollData",JSON.stringify(computed));
    location.href="payroll-display.html";
  });
}
function handleDisplayPage(){
  const dataRaw=sessionStorage.getItem("payrollData");
  if(!dataRaw){location.replace("payroll-main.html");return;}
  const p=JSON.parse(dataRaw);
  $("#out-id").textContent=p.id;
  $("#out-name").textContent=[p.last_name,p.first_name,p.middle_name? p.middle_name[0]+'.':''].filter(Boolean).join(", ");
  $("#out-position").textContent=p.position;
  $("#out-rate").textContent=format(p.rate);
  $("#out-days").textContent=p.days;
  $("#out-gross").textContent=format(p.gross);
  $("#out-sss").textContent=format(p.sss);
  $("#out-pagibig").textContent=format(p.pagibig);
  $("#out-philhealth").textContent=format(p.philhealth);
  $("#out-tax").textContent=format(p.tax);
  $("#out-totalded").textContent=format(p.totalDeduction);
  $("#out-net").textContent=format(p.net);
  $("#btn-print").addEventListener("click",()=>window.print());
  $("#btn-back").addEventListener("click",()=>history.back());
}
document.addEventListener("DOMContentLoaded",()=>{
  handleMainPage(); handleDisplayPage();
});
