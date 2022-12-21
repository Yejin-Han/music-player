const musicWrap=document.querySelector('.wrapper');
const musicAudio=musicWrap.querySelector('#main-audio');
const playBtn=musicWrap.querySelector('#play-btn');
const progress=musicWrap.querySelector('.m-progress');
const progressBar=progress.querySelector('.bar');
const playTime=progress.querySelector('.current');
const totTime=progress.querySelector('.duration');
const playMusic=()=>{
	playBtn.innerHTML="pause";
	musicAudio.play();
}
const pauseMusic=()=>{
	playBtn.innerHTML="play_arrow";
	musicAudio.pause();
}
playBtn.addEventListener('click',()=>{
	let getText=playBtn.innerText;
	(getText=="pause")? pauseMusic() : playMusic();
});
let list_index=0; //musicList[0] ~ musicList[5] 순환 호출
musicAudio.addEventListener('timeupdate',(e)=>{
	let curr=e.target.currentTime;
	let duration=e.target.duration;
	let progressRatio=(curr/duration)*100;
	progressBar.style.width=`${progressRatio}%`;
	//재생시간 표시
	let currMin=Math.floor(curr/60);
	let currSec=Math.floor(curr%60);
	if(currSec<10) currSec=`0${currSec}`;
	playTime.innerHTML=`${currMin}:${currSec}`;
	musicAudio.addEventListener('loadeddata',()=>{
		//전체시간 표시
		let totDuration=musicAudio.duration;
		let totMin=Math.floor(totDuration/60);
		let totSec=Math.floor(totDuration%60);
		if(totSec<10) totSec=`0${totSec}`; //1~9초는 01~09초로 표기
		totTime.innerHTML=`${totMin}:${totSec}`;
	});
});