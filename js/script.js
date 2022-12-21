const musicWrap=document.querySelector('.wrapper');
const musicAudio=musicWrap.querySelector('#main-audio');
const playBtn=musicWrap.querySelector('#play-btn');
const prevBtn=musicWrap.querySelector('#prev-btn');
const nextBtn=musicWrap.querySelector('#next-btn');
const repeatBtn=musicWrap.querySelector('#repeat-btn');
let list_index=0; //musicList[0] ~ musicList[5] 순환 호출
const albumArt=musicWrap.querySelector('.m-img>img');
const musicName=musicWrap.querySelector('.name');
const musicArtist=musicWrap.querySelector('.artist');
const progress=musicWrap.querySelector('.m-progress');
const progressBar=progress.querySelector('.bar');
const playTime=progress.querySelector('.current');
const totTime=progress.querySelector('.duration');

//음악 재생
const playMusic=()=>{
	playBtn.innerHTML="pause";
	musicAudio.play();
}
//음악 일시정지
const pauseMusic=()=>{
	playBtn.innerHTML="play_arrow";
	musicAudio.pause();
}
//재생(일시정지)버튼 클릭 시
playBtn.addEventListener('click',()=>{
	let getText=playBtn.innerText;
	(getText=="pause")? pauseMusic() : playMusic();
});
//음악 및 음악 정보 불러오기(music_list.js 활용)
const loadMusic=(num)=>{
	albumArt.src=`images/${musicList[num].img}.jpg`;
	musicAudio.src=`songs/${musicList[num].audio}.mp3`;
	musicName.innerHTML=musicList[num].name;
	musicArtist.innerHTML=musicList[num].artist;
}
//loadeddata를 인식하기 위함.
window.addEventListener('load',()=>{
	loadMusic(list_index);
});
//재생시간, 전체시간 표시 및 재생바
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
//이전 곡 버튼 클릭 시
const prevMusic=()=>{
	list_index--;
	if(list_index<0){ list_index=musicList.length-1; }
	loadMusic(list_index);
	playMusic();
}
//다음 곡 버튼 클릭 시
const nextMusic=()=>{
	list_index++;
	list_index=list_index%musicList.length;
	loadMusic(list_index);
	playMusic();
}
nextBtn.addEventListener('click',()=>{ nextMusic(); });
prevBtn.addEventListener('click',()=>{ prevMusic(); });
//재생 바 특정 위치 클릭 시
progress.addEventListener('click',(e)=>{
	let maxWidth=progress.clientWidth;
	let clickXpos=e.offsetX;
	let totDuration=musicAudio.duration;
	musicAudio.currentTime=(clickXpos/maxWidth)*totDuration;
	playMusic();
});
musicAudio.addEventListener('ended',()=>{
	let getText=repeatBtn.innertext;
	if(getText=='repeat'){ nextMusic(); } //repeat, repeat-one, shuffle 등 구분용 조건문 -> switch로 하기
});