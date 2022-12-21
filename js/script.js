const musicWrap=document.querySelector('.wrapper');
const musicAudio=musicWrap.querySelector('#main-audio');
const playBtn=musicWrap.querySelector('#play-btn');
const playMusic=()=>{
	playBtn.innerHTML="pause";
}
const pauseMusic=()=>{
	playBtn.innerHTML="play_arrow";
}
playBtn.addEventListener('click',()=>{
	let getText=playBtn.innerText;
	(getText=="pause")? pauseMusic() : playMusic();
});