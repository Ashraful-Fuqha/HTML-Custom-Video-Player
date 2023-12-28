/* Get Our Elements */
const body = document.body
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('.fullscreen')
const volumeButton = player.querySelector('.volumeButton');
const nextButton = player.querySelector('.nextButton')
const previousButton = player.querySelector('.lastButton')
let videoFile = document.querySelector('#videoFile')

var url;
var videoArray = ['../../assets/videos/v1.mp4', '../../assets/videos/v2.mp4', '../../assets/videos/v3.mp4', '../../assets/videos/v4.mp4', '../../assets/videos/v5.mp4']
let videoIndex = 0;

/* Build out functions */
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

function updateButton() {
  const icon = this.paused ? './assets/images/icons8-play-50.png' : './assets/images/icons8-pause-50.png';
  while(toggle.firstChild){
    toggle.removeChild(toggle.firstChild)
  }

  const img = document.createElement('img');
  img.src = icon;
  img.style.width = '2rem';
  toggle.appendChild(img)
}

function skip() {
 video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function handleFullScreen(){
    if(this.requestFullscreen){
      video.requestFullscreen()
    } else if (this.webkitRequestFullscreen){
      video.webkitRequestFullscreen()
    } else if (this.msRequestFullscreen){
      video.msRequestFullscreen()
    }/* Close fullscreen */
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
}

function playNextVideo(){
  videoIndex++;
  if(videoIndex >= videoArray.length)
    videoIndex = 0; // Loop back to the first video

  video.src = videoArray[videoIndex]
  video.play()
}

function playPreviousVideo(){
  videoIndex--;
  if(videoIndex < 0)
    videoIndex = videoArray.length - 1 // Loop back to the last video

  video.src = videoArray[videoIndex]
  video.play()
}

//Funtion for playing user video
function playUserVideo(e){
  var file = e.target.files[0];
  url = URL.createObjectURL(file)
  video.src = url;
  video.play()
}

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
window.addEventListener('keyup', e => { 
  if(e.key === ' ' ){
    togglePlay()
  }
})
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
volumeButton.addEventListener('click', () =>{
  video.muted = !video.muted
})

nextButton.addEventListener('click', playNextVideo);
window.addEventListener('keyup', (e) =>{
  if(e.key === 'ArrowRight')
    playNextVideo(e)
})
previousButton.addEventListener('click',playPreviousVideo);
window.addEventListener('keyup', (e) =>{
  if(e.key === 'ArrowLeft')
    playPreviousVideo(e)
})

video.addEventListener('dblclick', handleFullScreen)
fullscreen.addEventListener('click', handleFullScreen)

videoFile.addEventListener('change', playUserVideo)

window.addEventListener('load', () => {
  video.src = videoArray[0]  
})
