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
    location.href="display.html";
  });
}
function handleDisplayPage(){
  const dataRaw=sessionStorage.getItem("payrollData");
  if(!dataRaw){location.replace("index.html");return;}
  const p=JSON.parse(dataRaw);
  $("#out-id").textContent=p.id||"—";
  $("#out-name").textContent=[p.last_name,p.first_name,p.middle_name? p.middle_name[0]+'.':''].filter(Boolean).join(", ");
  $("#out-position").textContent=p.position||"—";
  $("#out-rate").textContent=format(p.rate||0);
  $("#out-days").textContent=p.days||0;
  $("#out-gross").textContent=format(p.gross||0);
  $("#out-sss").textContent=format(p.sss||0);
  $("#out-pagibig").textContent=format(p.pagibig||0);
  $("#out-philhealth").textContent=format(p.philhealth||0);
  $("#out-tax").textContent=format(p.tax||0);
  $("#out-totalded").textContent=format(p.totalDeduction||0);
  $("#out-net").textContent=format(p.net||0);
  const bp=$("#btn-print"); if(bp) bp.addEventListener("click",()=>window.print());
  const bb=$("#btn-back"); if(bb) bb.addEventListener("click",()=>history.back());
}

document.addEventListener("DOMContentLoaded",()=>{
  handleMainPage(); 
  handleDisplayPage();
  const bannedLike=/\b(juan|pedro|maria|de guzman|richard|de leon|sample|lorem)\b/i;
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el=>{
    const ph=(el.getAttribute('placeholder')||'').trim();
    if(!ph || bannedLike.test(ph)){
      if(el.type==='number'){
        el.placeholder = el.name?.includes('day') ? 'enter days...' :
                         el.name?.includes('rate') ? 'enter amount...' : 'enter number...';
      }else if(el.type==='email'){ el.placeholder='enter email...';
      }else if(el.type==='tel'){ el.placeholder='enter phone...';
      }else if(el.tagName==='TEXTAREA'){ el.placeholder='type your message...';
      }else{ el.placeholder='type here...'; }
    }
  });
});
