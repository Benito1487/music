// ВАЖЛИВО: заміни videoId на ID потрібних відео з YouTube.
// ID — це частина посилання після v=, наприклад youtube.com/watch?v=XXXXXXXXXXX
// Використовуй відео, для яких дозволене вбудовування. Не кожен ролик це підтримує.
const songs = [
  { title:"Spin", artist:"JoJo SBR", category:"game-other", videoId:"6UF_qprQiu0", start:35 },
  { title:"I Really Want to Stay At Your House", artist:"Rosa Walton", category:"game-other", videoId:"", start:40 },
  { title:"Карпато-русинська сколомийка", artist:"unknow", category:"classic", videoId:"6xO3RA1AmVk", start:35 },
  { title:"Піду втоплюся", artist:"Андрій Миколайчук", category:"classic", videoId:"eMCJKclUvWQ", start:30 },
  { title:"Сірожене пірожине", artist:"TIK", category:"classic", videoId:"6wJVb32lhJE", start:25 },
  { title:"Сон", artist:"Степан Гіга", category:"classic", videoId:"2eqMmPBvXQo", start:35 },
  { title:"Юний орел", artist:"Михайло Поплавський", category:"classic", videoId:"EaWN0bu-94o", start:35 },
  { title:"А липи цвітуть", artist:"Іво Бобул", category:"classic", videoId:"fLbqSGm8OzQ", start:30 },
  { title:"Excuse me sir", artist:"Charlie's Inferno", category:"game-other", videoId:"UbR_cocya4Q", start:51 },
  { title:"What Is Love", artist:"Haddaway", category:"classic", videoId:"HEXWRTEbj1I", start:35 },
  { title:"Crazy Frog", artist:"Axel F", category:"classic", videoId:"TabKdopSn_Q", start:43 },
  { title:"Stand Proud", artist:"Jin Hashimoto", category:"game-other", videoId:"dOQWNEv4_6U", start:25 },
  { title:"Blue", artist:"Eiffel 65", category:"classic", videoId:"68ugkg9RePc", start:25 },
  { title:"Підпільник кіндрат", artist:"Андрій Миколайчук", category:"classic", videoId:"E9U3y1T7hXg", start:60 },
  { title:"Red Sun in the sky", artist:"unknown", category:"game-other", videoId:"bBSUVgU4iNg", start:1 },
  { title:"There is nothing we can do", artist:"Armour plastique", category:"classic", videoId:"F0Gkr4MBEO0", start:25 },
  { title:"Charlie Charlie Kirky", artist:"unknown", category:"game-other", videoId:"LZsl4zf-GiI", start:30 },
  { title:"Megalovania", artist:"Toby Fox", category:"game-other", videoId:"0FCvzsVlXpQ", start:25 },
  { title:"The Only Thing They Fear Is You", artist:"Doom Eternal OST", category:"game-other", videoId:"kpnW68Q8ltc", start:35 },
  { title:"Snake Eater", artist:"MGS3 OST", category:"game-other", videoId:"roqkaqOuNZE", start:30 },
  { title:"The Only Think I Know For Real", artist:"JetStream Sam OST", category:"game-other", videoId:"FhHeGZoWl0g", start:48 },
  { title:"Bury The Light", artist:"Casey Edwards", category:"game-other", videoId:"pvy9km7g6fw", start:30 },
  { title:"Vordt of the Boreal Valley", artist:"Dark Souls3 OST", category:"game-other", videoId:"wKPZMc0FpXo", start:25 },
  { title:"GTA SA Theme", artist:"GTA SA OST", category:"game-other", videoId:"6VewzN781wQ", start:25 },
  { title:"Swort of Destiny", artist:"Wild Hunt OST", category:"game-other", videoId:"viM0-3PXef0", start:30 },
  { title:"зомбе", artist:"PVZ OST", category:"game-other", videoId:"ssZoq1eUK-s", start:25 }
];


const categoryNames = {all:"ВСЕ ПІДРЯД",classic:"КЛАСИКА", "game-other":"GAME OST / OTHER"};
let selectedCategory="all", deck=[], round=0, score=0, correct=0, answered=0, current=null, player=null;
let countdown=null, progressTimer=null, seconds=15, isPlaying=false, soundOn=true, playerReady=false;
let selectedDuration=15, clipDuration=15;
const $=id=>document.getElementById(id);
function showScreen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(id).classList.add("active");}
function shuffle(a){return [...a].sort(()=>Math.random()-.5);}
function availableSongs(){return songs.filter(s=>(selectedCategory==="all"||s.category===selectedCategory)&&s.videoId.trim());}
function onYouTubeIframeAPIReady(){
  player=new YT.Player("youtubePlayer",{height:"113",width:"200",videoId:"",playerVars:{playsinline:1,rel:0,controls:1,modestbranding:1},events:{onReady:()=>{playerReady=true;player.setVolume(Number($("volumeControl").value));},onStateChange:onPlayerStateChange,onError:()=>{ $("playerStatus").textContent="Це відео не вдалося відтворити. Перевір Video ID або вибери інше відео.";stopTimers();}}});
}
function onPlayerStateChange(e){if(e.data===YT.PlayerState.PLAYING){isPlaying=true;$("playBtn").textContent="Ⅱ";$("playState").textContent="ЗАРАЗ ГРАЄ";if(selectedDuration===0){const fullLength=Math.floor(player.getDuration()-current.start);if(fullLength>0&&fullLength!==clipDuration){clipDuration=fullLength;$("timeLeft").textContent=formatTime(fullLength);startTimers(Math.max(0,player.getCurrentTime()-current.start));}}}else if(e.data===YT.PlayerState.PAUSED||e.data===YT.PlayerState.ENDED){isPlaying=false;$("playBtn").textContent="▶";if(e.data===YT.PlayerState.ENDED){stopTimers();$("progressFill").style.width="100%";}}}
function startGame(){
  const pool=availableSongs();
  if(pool.length<4){alert("Поки що в цій категорії недостатньо налаштованих пісень. Додай YouTube Video ID щонайменше для 4 треків у файлі script.js. Інструкція — у README.");return;}
  deck=shuffle(pool).slice(0,Math.min(15,pool.length));round=0;score=0;correct=0;answered=0;updateStats();showScreen("gameScreen");nextRound();
}
function nextRound(){
  stopTimers();
  if(round>=deck.length){finishGame();return;}
  current=deck[round];round++;clipDuration=selectedDuration===0?Math.max(1,Math.floor((player?.getDuration()||current.start+180)-current.start)):selectedDuration;seconds=clipDuration;
  $("roundNumber").textContent=String(round).padStart(2,"0");$("sideRound").textContent=round;$("categoryLabel").textContent=categoryNames[selectedCategory];
  $("playerStatus").textContent=current.videoId?"Натисни ▶, щоб послухати фрагмент":"Для цього треку ще не додано YouTube Video ID";
  $("playState").textContent="ГОТОВИЙ ДО СТАРТУ";$("timeLeft").textContent=formatTime(clipDuration);$("gameClipDuration").value=selectedDuration===0?"full":String(selectedDuration);$("progressFill").style.width="0%";
  $("feedback").textContent="";$("feedback").className="feedback";$("nextBtn").disabled=true;
  if(playerReady){player.stopVideo();player.cueVideoById({videoId:current.videoId,startSeconds:current.start,...(selectedDuration===0?{}:{durationSeconds:clipDuration})});}
  const distractors=shuffle(songs.filter(s=>s!==current)).slice(0,3);
  const options=shuffle([current,...distractors]);
  $("answers").innerHTML="";
  options.forEach((s,i)=>{const b=document.createElement("button");b.className="answer-btn";b.innerHTML=`<span class="answer-key">${String.fromCharCode(65+i)}</span><span>${escapeHtml(s.title)}</span>`;b.addEventListener("click",()=>chooseAnswer(s,b));$("answers").appendChild(b);});
  $("nextBtn").textContent=round===deck.length?"Побачити результат →":"Наступна пісня →";
}
function escapeHtml(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function playClip(){
  if(!current||!playerReady)return;
  if(!current.videoId){$("playerStatus").textContent="Додай Video ID для цієї пісні у script.js";return;}
  if(isPlaying){player.pauseVideo();return;}
  player.loadVideoById({videoId:current.videoId,startSeconds:current.start,...(selectedDuration===0?{}:{endSeconds:current.start+clipDuration})});
  $("playerStatus").textContent="Фрагмент відтворюється у YouTube-плеєрі нижче праворуч";
  startTimers();
}
function formatTime(value){const total=Math.max(0,Math.floor(value));return Math.floor(total/60)+":"+String(total%60).padStart(2,"0");}
function setClipDuration(value){
  selectedDuration=value==="full"?0:Number(value);
  $("clipDuration").value=value;$("gameClipDuration").value=value;
  if(!current)return;
  const position=playerReady?player.getCurrentTime():current.start;
  const elapsed=Math.max(0,position-current.start);
  const fullLength=playerReady?Math.floor(player.getDuration()-current.start):clipDuration;
  clipDuration=selectedDuration===0?Math.max(elapsed+1,fullLength):selectedDuration;
  const remaining=clipDuration-elapsed;
  $("timeLeft").textContent=formatTime(Math.max(0,remaining));
  if(isPlaying&&playerReady){
    if(remaining<=0){player.stopVideo();stopTimers();$("progressFill").style.width="100%";return;}
    player.loadVideoById({videoId:current.videoId,startSeconds:position,...(selectedDuration===0?{}:{endSeconds:position+remaining})});
    startTimers(elapsed);
  }
}
function startTimers(elapsedOffset=0){
  stopTimers();const startedAt=player?.getCurrentTime()||current.start;
  progressTimer=setInterval(()=>{const elapsed=elapsedOffset+Math.max(0,(player?.getCurrentTime()||startedAt)-startedAt);$("progressFill").style.width=Math.min(100,elapsed/clipDuration*100)+"%";},200);
  countdown=setInterval(()=>{const elapsed=elapsedOffset+Math.max(0,(player?.getCurrentTime()||startedAt)-startedAt);seconds=Math.max(0,Math.ceil(clipDuration-elapsed));$("timeLeft").textContent=formatTime(seconds);if(seconds===0&&selectedDuration!==0){stopTimers();$("progressFill").style.width="100%";}},250);
}
function stopTimers(){clearInterval(countdown);clearInterval(progressTimer);countdown=null;progressTimer=null;}
function chooseAnswer(song,button){
  if(answered>=round)return;
  answered++;stopTimers();player?.pauseVideo();
  document.querySelectorAll(".answer-btn").forEach(b=>b.disabled=true);
  const isCorrect=song.title===current.title;
  if(isCorrect){score+=100;correct++;button.classList.add("correct");$("feedback").textContent="Правильно! +100 балів 🎉";$("feedback").className="feedback good";}
  else{button.classList.add("wrong");$("feedback").textContent=`Не зовсім! Правильна відповідь: ${current.title} — ${current.artist}`;$("feedback").className="feedback bad";document.querySelectorAll(".answer-btn").forEach(b=>{if(b.textContent.includes(current.title))b.classList.add("correct");});}
  $("playerStatus").textContent=`${current.title} — ${current.artist}`;$("nextBtn").disabled=false;updateStats();
}
function updateStats(){
  $("score").textContent=score;$("sideScore").textContent=score;$("correctCount").textContent=correct;
  $("accuracy").textContent=answered?Math.round(correct/answered*100)+"%":"—";
}
function finishGame(){
  stopTimers();player?.stopVideo();showScreen("resultScreen");
  const pct=answered?Math.round(correct/answered*100):0;
  $("finalScore").textContent=score;$("finalCorrect").textContent=correct;$("finalTotal").textContent=answered;$("finalAccuracy").textContent=pct+"%";
  $("resultTitle").textContent=pct>=80?"Ти музичний геній!":pct>=50?"Гарний результат!":"Є куди прокачуватись!";
  $("resultText").textContent=pct>=80?"Ти знаєш українську музику на відмінно.": "Послухай ще трохи хітів і спробуй знову!";
}
document.querySelectorAll(".category-card").forEach(card=>card.addEventListener("click",()=>{document.querySelectorAll(".category-card").forEach(c=>c.classList.remove("selected"));card.classList.add("selected");selectedCategory=card.dataset.category;}));
$("startBtn").addEventListener("click",startGame);$("modalStart").addEventListener("click",()=>{$("howModal").classList.add("hidden");startGame();});
$("howBtn").addEventListener("click",()=>$("howModal").classList.remove("hidden"));$("closeModal").addEventListener("click",()=>$("howModal").classList.add("hidden"));
$("backBtn").addEventListener("click",()=>{stopTimers();player?.stopVideo();showScreen("homeScreen");});
$("nextBtn").addEventListener("click",nextRound);$("playBtn").addEventListener("click",playClip);$("replayBtn").addEventListener("click",()=>{if(current&&playerReady){player.seekTo(current.start,true);player.playVideo();startTimers();}});
$("againBtn").addEventListener("click",startGame);$("homeBtn").addEventListener("click",()=>showScreen("homeScreen"));
$("soundToggle").addEventListener("click",()=>{soundOn=!soundOn;if(playerReady){if(soundOn)player.unMute();else player.mute();}$("soundToggle").textContent=soundOn?"🔊":"🔇";});
$("volumeControl").addEventListener("input",e=>{if(playerReady)player.setVolume(Number(e.target.value));});
$("clipDuration").addEventListener("change",e=>setClipDuration(e.target.value));
$("gameClipDuration").addEventListener("change",e=>setClipDuration(e.target.value));
