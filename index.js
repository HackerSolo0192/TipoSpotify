const songName = document.getElementById("song-name");
const banda = document.getElementById("band-name")
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const proximo = document.getElementById("proximo");
const Antes = document.getElementById("Antes");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const playlistshuffle = document.getElementById("playlist");
const repeatButton = document.getElementById("repetir");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");
const likeButton = document.getElementById("like");

  const ComeAsYouAre = {
    songName: "Come As You Are",
    file: "Nirvana - Come As You Are",
    artist: "Nirvana",
    liked: false,
  };
  const SmellsLikeTeenSpirit = {
    songName: "Smells Like Teen Spirit",
    file: "Nirvana - Smells Like Teen Spirit",
    artist: "Nirvana",
    liked: false,
  };

  const DoIWannaKnow = {
    songName: "Do I Wanna Know",
    file: " Arctic Monkeys - Do I Wanna Know",
    artist: "Arctic Monkeys ",
    liked: false,
  };

  let isPlaying = false;
  let isShuffled = false;
  let repeatOn = false;
  const originalPlaylist = JSON.parse(localStorage.getItem("playlist"))??[ComeAsYouAre,SmellsLikeTeenSpirit,DoIWannaKnow];
  let sortedPlaylist = [...originalPlaylist];
  let Oi = 0;
  
  function playSong() {
    isPlaying = true;
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");
    song.play();
  }
  
  function pauseSong() {
    isPlaying = false;
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
    song.pause();
  }

  

function playPauseDecider(){
    if(isPlaying === true){
        pauseSong();
}
else{
    playSong();
}
}
function likeButtonRender(){
  if (sortedPlaylist[Oi].liked === true){
     likeButton.querySelector(".bi").classList.remove("bi-heart");
     likeButton.querySelector(".bi").classList.add("bi-heart-fill");
     likeButton.classList.add("button-active"); 
    }
    else{
      likeButton.querySelector(".bi").classList.add("bi-heart");
      likeButton.querySelector(".bi").classList.remove("bi-heart-fill");
      likeButton.classList.remove("button-active"); 
    }
}

function initializeSong(){
    cover.src=`${sortedPlaylist[Oi].file}.jpeg`;
    song.src= `${sortedPlaylist[Oi].file}.mp3`; 
    songName.innerText = sortedPlaylist[Oi].songName;
    banda.innerText = sortedPlaylist[Oi].artist;
    likeButtonRender();
} 
function proximoSong() {
  if(Oi === sortedPlaylist.length -1){
      Oi = 0;
  }
  else {
      Oi += 1;
  }
  initializeSong();
  playSong();
}

function AntesSong() {
  if(Oi === 0){
      Oi = sortedPlaylist.length - 1;
  }
  else {
      Oi -= 1;
  }
  initializeSong();
  playSong();
}

function updateProgress(){
  const barWidth = (song.currentTime/song.duration)*100;
  currentProgress.style.setProperty('--progress', `${barWidth}%`);
  songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event){
  const width = progressContainer.clientWidth;
  const clickPosition = event.offsetX ;
  const jumpToTime = (clickPosition/width)* song.duration;
  song.currentTime = jumpToTime;
}

function ShuffleArray(preShuffleArray){
      const size = preShuffleArray.length;
      let currentOi = size - 1; 
      while(currentOi > 0){
      let randomOi = Math.floor(Math.random()* size);
      let aux = preShuffleArray[currentOi];
      preShuffleArray[currentOi] = preShuffleArray[randomOi];
      preShuffleArray[randomOi] = aux;
      currentOi -=1;
      }
    }

function playlistshuffleclick(){
  if(isShuffled === false){
  isShuffled = true;
  ShuffleArray(sortedPlaylist);
  playlistshuffle.classList.add("button-active");
  }
  else {
    isShuffled =false;
    sortedPlaylist = [...originalPlaylist];
    playlistshuffle.classList.remove("button-active");
  }
}
function repeatButtonClicked() {
if (repeatOn === false){
  repeatOn = true;
  repeatButton.classList.add ("button-active"); 
}else {
  repeatOn = false ; 
  repeatButton.classList.remove("button-active");
 }
}

function nextOrRepeat(){
if(repeatOn === false) {
  proximoSong();
}
else {
  playSong();
}
}

function toHHMMSS(originalNUmber){
let hours = Math.floor(originalNUmber/3600);
let min = Math.floor((originalNUmber - hours * 3600)/60);
let secs = Math.floor(originalNUmber - hours * 3600 - min * 60);

return `${hours.toString().padStart(2,"0")}:${min
         .toString()
         .padStart(2,"0")}:${secs.toString().padStart(2,"0")}`;
        }           

function updateTotalTime(){
  totalTime.innerText = toHHMMSS(song.duration);

}

function likeButtonClicked(){
  if(sortedPlaylist[Oi].liked === false){
  sortedPlaylist[Oi].liked = true;
  }
  else{
    sortedPlaylist[Oi].liked = false ;
  }
  likeButtonRender();
  localStorage.setItem("playlist",JSON.stringify(originalPlaylist));
}

initializeSong();

song.addEventListener("timeupdate",updateProgress);
play.addEventListener("click",playPauseDecider);
proximo.addEventListener("click",proximoSong);
Antes.addEventListener("click",AntesSong);
song.addEventListener("loadmetadata", updateTotalTime);
song.addEventListener("ended",nextOrRepeat);
progressContainer.addEventListener("click",jumpTo);
playlistshuffle.addEventListener("click",playlistshuffleclick);
repeatButton.addEventListener("click",repeatButtonClicked);
likeButton.addEventListener("click", likeButtonClicked);