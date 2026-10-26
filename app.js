let sections=[],active=0,answers={},checked={};const $=id=>document.getElementById(id);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const key=()=>`mg2u4_demo_${$('student').value.trim()}_${$('classroom').value}`;function save(){try{localStorage.setItem(key(),JSON.stringify({answers,checked}))}catch(e){}}function getAnswer(k){return answers[k]??''}function render(){const sec=sections[active];$('tabs').innerHTML=sections.map((s,i)=>`<button class="${i===active?'active':''}" data-tab="${i}">${i+1}. ${esc(s.title)}</button>`).join('');$('tabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{active=+b.dataset.tab;render()});$('content').innerHTML=`<div class="eyebrow">SECTION ${active+1} / ${sections.length}</div><h2>${esc(sec.title)}</h2>`+sec.questions.map((q,i)=>{let k=sec.id+'_'+i,v=getAnswer(k);let control=q.type==='text'?`<textarea data-key="${k}" placeholder="Write your answer here...">${esc(v)}</textarea>`:q.type==='fill'?`<input data-key="${k}" value="${esc(v)}" placeholder="Type your answer">`:q.type==='match'?`<select data-key="${k}"><option value="">Choose the meaning...</option>${q.options.map(o=>`<option value="${esc(o)}" ${v===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`:`<div class="options">${q.options.map((o,j)=>`<label class="option"><input type="radio" name="${k}" data-key="${k}" value="${j}" ${String(v)===String(j)?'checked':''}>${'ABC'[j]}. ${esc(o)}</label>`).join('')}</div>`;let feedback='';if(checked[sec.id]&&q.type!=='text'){let ok=q.type==='mc'?String(v)===String(q.answer):String(v).trim().toLowerCase()===String(q.answer).trim().toLowerCase();feedback=`<div class="feedback ${ok?'correct':'wrong'}">${ok?'✓ Correct!':'✗ Try again'}</div>`}return `<div class="question"><h3>${i+1}. ${esc(q.prompt)}</h3>${control}${feedback}</div>`}).join('');$('content').querySelectorAll('input,textarea,select').forEach(el=>el.addEventListener('change',e=>{answers[e.target.dataset.key]=e.target.value;delete checked[sec.id];save();updateProgress()}));$('content').querySelectorAll('textarea,input:not([type=radio])').forEach(el=>el.addEventListener('input',e=>{answers[e.target.dataset.key]=e.target.value;delete checked[sec.id];save();updateProgress()}));$('result').textContent='';updateProgress()};function updateProgress(){let total=0,done=0;sections.forEach(s=>s.questions.forEach((q,i)=>{total++;if(String(getAnswer(s.id+'_'+i)).trim())done++}));$('progressbar').style.width=(done/total*100)+'%';$('progresslabel').textContent=`${done} of ${total} activities answered · ${Math.round(done/total*100)}% complete`};$('check').onclick=()=>{let sec=sections[active];checked[sec.id]=true;let qs=sec.questions.filter(q=>q.type!=='text'),correct=0;sec.questions.forEach((q,i)=>{if(q.type==='text')return;let v=getAnswer(sec.id+'_'+i);if(q.type==='mc'?String(v)===String(q.answer):String(v).trim().toLowerCase()===String(q.answer).trim().toLowerCase())correct++});save();render();$('result').textContent=qs.length?`Auto-graded score: ${correct} / ${qs.length}. Written responses require teacher review.`:'Your written responses are saved in this browser. Teacher review is required.'};$('next').onclick=()=>{active=Math.min(active+1,sections.length-1);render();window.scrollTo({top:0,behavior:'smooth'})};$('changeStudent').onclick=()=>{if(confirm('Return to student login? Your draft stays in this browser.')){$('workbook').hidden=true;$('welcome').hidden=false}};$('startForm').onsubmit=e=>{e.preventDefault();let data;try{data=JSON.parse(localStorage.getItem(key())||'{}')}catch(e){data={}}answers=data.answers||{};checked=data.checked||{};$('greeting').textContent=`Welcome, ${$('student').value.trim()}! · ${$('classroom').value}`;$('welcome').hidden=true;$('workbook').hidden=false;active=0;render()};fetch('questions.json').then(r=>r.json()).then(d=>{sections=d}).catch(()=>{$('welcome').insertAdjacentHTML('beforeend','<p>Unable to load activities. Open through a local web server or GitHub Pages.</p>')});const RESULTS_URL = "https://script.google.com/macros/s/AKfycbynO3wtmlayKCQ8InCXHU4ZZo9zMXO_U0oyJB63DxxboajAGX7pM-ysDHesPOlSCbF9/exec";

async function submitResults() {
   let unanswered = 0;

  sections.forEach(section => {
    section.questions.forEach((q, i) => {
      const key = section.id + "_" + i;
      if (!String(answers[key] ?? "").trim()) {
        unanswered++;
      }
    });
  });

  if (unanswered > 0) {
    alert(
      "Please complete all workbook activities before submitting.\n" +
      "You still have " + unanswered + " unanswered questions."
    );
    return;
  } const studentName = document.getElementById("student").value.trim();
  const classroom = document.getElementById("classroom").value;

  if (!studentName || !classroom) {
    alert("Please enter your name and class.");
    return;
  }

  let score = 0;
  let totalQuestions = 0;

  sections.forEach(section => {
    section.questions.forEach((q, i) => {
      if (q.type === "text") return;

      totalQuestions++;
      const answer = String(answers[section.id + "_" + i] ?? "");
      const correct = String(q.answer);

      if (answer.trim().toLowerCase() === correct.trim().toLowerCase()) {
        score++;
      }
    });
  });

  const data = {
    studentName,
    studentClass: classroom,
    unit: "MG2 Unit 4",
    section: "Complete Workbook",
    score,
    totalQuestions,
    percentage: totalQuestions
      ? Math.round((score / totalQuestions) * 100)
      : 0,
    answers
  };

  try {
    await fetch(RESULTS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    });

    alert("Submission request sent. Please ask your teacher to confirm receipt.");
  } catch (error) {
    alert("Could not send results. Please try again.");
  }
}

