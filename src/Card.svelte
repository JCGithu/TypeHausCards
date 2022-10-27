<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  export let clicked;
  let styling = { background: "hsla(0, 0%, 14%, 0)" };
  let winRatio;
  let flipped = false;

  let initialTilt = 0;
  let tiltStart = 0;

  onMount(() => {
    styling.left = clicked.left + "px";
    styling.top = clicked.top + "px";
    styling.height = clicked.height + "px";
    styling.width = clicked.width + "px";
    winRatio = window.innerWidth / window.innerHeight;
    console.log(winRatio);
    setTimeout(() => {
      let cardHeight = 65;
      if (winRatio < 0.9) cardHeight = 100 * winRatio;
      let cardWidth = cardHeight * clicked.ratio;
      let vhRatio = cardWidth / 2;
      //if (clicked.winRatio > 1) vhRatio = cardHeight / clicked.ratio / clicked.winRatio / 2;
      styling.left = `calc(50vw - ${vhRatio}vh)`;
      styling.top = "10vh";
      styling.width = "";
      styling.height = `${cardHeight}vh`;
      styling.background = "hsla(0, 0%, 14%, 70%)";
      console.log(styling);
    }, 100);
  });

  let mousePercentX = 0;
  let mousePercentY = 0;
  let mouseSheen = 0;

  function cardMove(e) {
    //console.log(e);
    let cardPosition = e.target.getBoundingClientRect();
    let cardCenterX = cardPosition.left + cardPosition.width / 2;
    let cardCenterY = cardPosition.top + cardPosition.height / 2;
    let mouseX = cardCenterX - e.clientX;
    let mouseY = cardCenterY - e.clientY;
    mousePercentX = (mouseX / (cardPosition.width / 2)) * 15;
    mousePercentY = (mouseY / (cardPosition.height / 2)) * -10;
    //console.log(mousePercentX, mousePercentY);
    mouseSheen = ((e.clientY - cardPosition.top) / (cardPosition.bottom - cardPosition.top)) * 100;
  }

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (ev) => {
      // ev.alpha -- steering wheel, ev.beta -- tilt, ev.gamma -- spin 0 is front;
      initialTilt++;
      if ((initialTilt = 30)) {
        tiltStart = ev.beta;
      }
      let spin = ev.gamma / 3;
      if (spin > 15) spin = 15;
      if (spin < -15) spin = -15;
      mousePercentX = spin * -1;
      //console.log(ev.beta);
      let tilt = tiltStart - ev.beta;
      if (tilt > tiltStart + 35) tilt = 35;
      if (tilt < tiltStart - 35) tilt = -35;
      console.log(tiltStart, tilt);
      mousePercentY = tilt / 3;
      //mouseSheen = Math.abs(tilt) * 3.33;
    });
  }

  function cardClick(e) {
    flipped = !flipped;
    //styling.z = flipped ? 21 : 19;
  }

  function mouseLeave(e) {
    mousePercentX = 0;
    mousePercentY = 0;
    mouseSheen = 0;
  }

  const dispatch = createEventDispatcher();

  function close() {
    dispatch("close");
  }
</script>

<section out:fade class="cardContainer" style="background-color:{styling.background};">
  <p id="closer" on:click={close}>X</p>
  <div on:click={cardClick} class="card" style:transform={`perspective(400px) rotateY(${mousePercentX + (flipped ? 180 : 0)}deg) rotateX(${mousePercentY}deg)`} style:--degree={`${(mousePercentX - mousePercentY) / 2}deg`} style:--p1="{Math.round(mouseSheen) - 10}%" style:--p2="{Math.round(mouseSheen)}%" style:--p3="{Math.round(mouseSheen) + 10}%" style:left={styling.left} style:top={styling.top} on:mousemove={cardMove} on:mouseleave|self={mouseLeave}>
    <img id="cardBack" style={`z-index:${styling.z}; width:${styling.width}; height:${styling.height}`} src="/images/Card_Back.png" alt={clicked.alt} />
    <img id="cardFront" style:width={styling.width} style:height={styling.height} src={clicked.src} alt={clicked.alt} />
  </div>
  {#if flipped}
    <p id="backCredit" style:--height={styling.height}>Brady<br />@bradyc.design</p>
  {/if}
  <div id="fill" on:click={close} />
</section>
