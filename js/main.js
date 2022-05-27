const choice = document.querySelectorAll('button');
const computerChoice = document.querySelector('#computerChoice')
choice.forEach(elem => elem.addEventListener('click', makeReq));

async function makeReq(){
  if (this.classList.contains("disallowed")) return;
  console.log(this.id);
  choice.forEach(e => {
    e.classList.remove("selected");
    e.classList.add("disallowed");
  });
  this.classList.add("selected");
  const res = await fetch(`/api?choice=${this.id}`);
  const data = await res.json();

  console.log(data);
  document.querySelector("#computerChoicePhoto").src = `img/${data.cpuChoice}.png`;
  const resultText = document.querySelector("#winner");
  if (data.winner === "cpu") {
    resultText.innerText = "Computer wins!"
  } else if (data.winner === "player") {
    resultText.innerText = "Player wins!";
  } else if (data.winner === "tie") {
    resultText.innerText = "Tie!";
  }
  choice.forEach(e => {
    e.classList.remove("disallowed");
  });
}

//winning animation
var textWrapper = document.querySelector('.ml1 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml1 .letter',
    scale: [0.3,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 600,
    delay: (el, i) => 70 * (i+1)
  }).add({
    targets: '.ml1 .line',
    scaleX: [0,1],
    opacity: [0.5,1],
    easing: "easeOutExpo",
    duration: 700,
    offset: '-=875',
    delay: (el, i, l) => 80 * (l - i)
  }).add({
    targets: '.ml1',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });