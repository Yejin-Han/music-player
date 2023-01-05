const musicWrap=document.querySelector('.wrapper');
const musicAudio=musicWrap.querySelector('#main-audio');
const albumArt=musicWrap.querySelector('.m-img>img');
const musicName=musicWrap.querySelector('.name');
const musicArtist=musicWrap.querySelector('.artist');
const playBtn=musicWrap.querySelector('#play-btn');
const prevBtn=musicWrap.querySelector('#prev-btn');
const nextBtn=musicWrap.querySelector('#next-btn');
const repeatBtn=musicWrap.querySelector('#repeat-btn');
const shuffleBtn=musicWrap.querySelector('#shuffle-btn');
const progress=musicWrap.querySelector('.m-progress');
const progressBar=progress.querySelector('.bar');
const playTime=progress.querySelector('.current');
const totTime=progress.querySelector('.duration');
const listBtn=musicWrap.querySelector('#list-btn');
const playList=musicWrap.querySelector('#play-list');
const playListUl = musicWrap.querySelector('#play-list>ul');
const favoriteBtn=musicWrap.querySelector('#favorite-btn');
const volumeBtn=musicWrap.querySelector('#volume-btn');
const volumeCtrl=musicWrap.querySelector('#volume-ctrl');
const slider=musicWrap.querySelector('.slider');
const volumeProg=musicWrap.querySelector('.prog');
let list_index=0; //musicList[0] ~ musicList[5] 순환 호출

//음악 및 음악 정보 불러오기(music_list.js 활용)
const loadMusic=(num)=>{
	albumArt.src=`images/${musicList[num].img}.jpg`;
	musicAudio.src=`songs/${musicList[num].audio}.mp3`;
	musicName.innerHTML=musicList[num].name;
	musicArtist.innerHTML=musicList[num].artist;
}
//음악 재생
const playMusic=()=>{
	playBtn.innerHTML="pause";
	let playPromise=musicAudio.play();
	if (playPromise !== undefined) { playPromise.then((_) => {}).catch((error) => {}); }
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
//이전 곡 버튼 클릭 시
const prevMusic=()=>{
	list_index--;
	if(list_index<0){ list_index=musicList.length-1; }
	loadMusic(list_index);
	playMusic();
	playListMusic();
}
//다음 곡 버튼 클릭 시
const nextMusic=()=>{
	list_index++;
	list_index=list_index%musicList.length;
	loadMusic(list_index);
	playMusic();
	playListMusic();
}
nextBtn.addEventListener('click',()=>{ nextMusic(); });
prevBtn.addEventListener('click',()=>{ prevMusic(); });
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
//재생 바 특정 위치 클릭 시
progress.addEventListener('click',(e)=>{
	let maxWidth=progress.clientWidth;
	let clickXpos=e.offsetX;
	let totDuration=musicAudio.duration;
	musicAudio.currentTime=(clickXpos/maxWidth)*totDuration;
	playMusic();
});
//반복버튼 클릭 시
repeatBtn.addEventListener('click',()=>{
	let getTextRepeat=repeatBtn.innerText;
	switch(getTextRepeat){
		case 'repeat':
			repeatBtn.innerText='repeat_one';
			repeatBtn.setAttribute('title','한곡 반복');
			break;
		case 'repeat_one':
			repeatBtn.innerText='repeat';
			repeatBtn.setAttribute('title','전체 반복');
			break;
	}
});
//셔플버튼 클릭 시
shuffleBtn.addEventListener('click',()=>{
	let getTextShuffle=shuffleBtn.innerText;
	switch(getTextShuffle){
		case 'shuffle':
			shuffleBtn.innerText='shuffle_on';
			shuffleBtn.setAttribute('title','랜덤 반복');
			break;
		case 'shuffle_on':
			shuffleBtn.innerText='shuffle';
			shuffleBtn.setAttribute('title','순서대로 반복');
			break;
	}
});
//음악 재생 끝날 때
musicAudio.addEventListener('ended',()=>{
	let getTextRepeat=repeatBtn.innerText;
	switch(getTextRepeat){
		case 'repeat':
			nextMusic();
			break;
		case 'repeat_one': //shuffle이 켜져 있을 때만 작동됨.. 왜지
			loadMusic(list_index);
			playMusic();
			break;
	}
	let getTextShuffle=shuffleBtn.innerText;
	switch(getTextShuffle){
		case 'shuffle':
			nextMusic();
			break;
		case 'shuffle_on':
			let randomIndex=Math.floor(Math.random()*musicList.length);
			do{
				randomIndex=Math.floor(Math.random()*musicList.length);
			} while(list_index==randomIndex);
			list_index=randomIndex;
			loadMusic(list_index);
			playMusic();
			break;
	}
	playListMusic();
});
//볼륨 조절 (드래그 때문에 모르겠다. 허허)
volumeBtn.addEventListener('click',()=>{
	volumeBtn.classList.toggle('open');
	volumeCtrl.classList.toggle('hidden');
});
let pin=slider.querySelector('.pin');
slider.addEventListener('click',window[pin.dataset.method]);
musicAudio.addEventListener('volumechange',()=>{
	volumeProg.style.height = musicAudio.volume*100+'%';
});
const draggable=()=>{

}

//플레이리스트 버튼 클릭 시
listBtn.addEventListener('click',function(){
	this.classList.toggle('active');
});
for (let i=0; i<musicList.length; i++) {
	let li=`
			<li data-index="${i}">
					<strong>${musicList[i].name}</strong>
					<em>${musicList[i].artist}</em>
					<audio class="${musicList[i].audio}" src="songs/${musicList[i].audio}.mp3"></audio>
					<span class="audio-duration" id="${musicList[i].audio}">재생시간</span>
			</li>
	`;
	playListUl.insertAdjacentHTML('beforeend', li);

	//플레이리스트에 재생시간 불러오기
	let liAudioDuration = playListUl.querySelector(`#${musicList[i].audio}`);
	let liAudio = playListUl.querySelector(`.${musicList[i].audio}`);
	liAudio.addEventListener('loadeddata',()=>{
			let totDuration = liAudio.duration;
			let totMin = Math.floor(totDuration/60);
			let totSec = Math.floor(totDuration%60);
			if(totSec<10) totSec=`0${totSec}`;
			liAudioDuration.innerHTML=`${totMin}:${totSec}`;
			liAudioDuration.setAttribute('data-duration',`${totMin}:${totSec}`);
	});
}
// 플레이리스트 안 리스트 하나 클릭 시
const playListMusic=()=>{
	const playListAll=playListUl.querySelectorAll('li');
	for(let i=0; i<playListAll.length; i++){
		let audioTag=playListAll[i].querySelector('.audio-duration');
		//클릭시 active class 주기
		if(playListAll[i].classList.contains('active')){
			playListAll[i].classList.remove('active');
			let audioDur=audioTag.getAttribute('data-duration');
			audioTag.innerHTML=audioDur;
		}
		if(playListAll[i].getAttribute('data-index')==list_index){
			playListAll[i].classList.add('active');
			audioTag.innerHTML='Playing';
		}
		/* playListAll[i].addEventListener('click',(e)=>clicked(e.target)); */
		playListAll[i].setAttribute('onclick','clicked(this)');
	}
}
const clicked=(elem)=>{
	let getliIndex = elem.getAttribute('data-index');
	list_index = getliIndex;
	loadMusic(list_index);
	playMusic();
	playListMusic();
}
//loadeddata를 인식하기 위함.
window.addEventListener('load',()=>{
	loadMusic(list_index);
	playListMusic();
});