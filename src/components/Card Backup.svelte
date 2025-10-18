<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { ElementRect } from "runed";
  import type { CardItem, Clicked } from "$lib/types";
  import { innerWidth, innerHeight } from "svelte/reactivity/window";
  type CardProps = {
    clicked: Clicked;
    onclose: () => void;
    cardData: CardItem;
  };
  let { clicked, onclose, cardData }: CardProps = $props();

  let pageX: number,
    pageY: number = $state(0);

  let left = $state(clicked.left + "px");
  let top = $state(clicked.top + "px");
  let height = $state(clicked.height + "px");
  let width = $state(clicked.width + "px");
  let z = $state(19);
  let background = $state("hsla(0, 0%, 14%, 0)");

  let flipped = $state(false);
  let mouseOn = $state(false);

  let winRatio = $derived((innerWidth.current || 1) / (innerHeight.current || 1));

  let cardHeight = $derived(winRatio < 0.9 ? 100 * winRatio : 65);
  let cardWidth = $derived(cardHeight * clicked.ratio);

  onMount(() => {
    setTimeout(() => {
      let vhRatio = cardWidth / 2;
      left = `calc(50vw - ${vhRatio}vh)`;
      top = "10vh";
      width = "";
      height = `${cardHeight}vh`;
      background = "hsla(0, 0%, 14%, 70%)";
    }, 100);
  });

  // function cardMove(e) {
  //   //console.log(e);
  //   let cardPosition = e.target.getBoundingClientRect();
  //   let cardCenterX = cardPosition.left + cardPosition.width / 2;
  //   let cardCenterY = cardPosition.top + cardPosition.height / 2;
  //   let mouseX = cardCenterX - e.clientX;
  //   let mouseY = cardCenterY - e.clientY;
  //   mousePercentX = (mouseX / (cardPosition.width / 2)) * 15;
  //   mousePercentY = (mouseY / (cardPosition.height / 2)) * -10;
  //   //console.log(mousePercentX, mousePercentY);
  //   mouseSheen = ((e.clientY - cardPosition.top) / (cardPosition.bottom - cardPosition.top)) * 100;
  // }

  let cardEl = $state<HTMLElement>();
  let cardRect = new ElementRect(() => cardEl);

  let mousePercent = $derived.by(() => {
    if (!mouseOn) return { x: 0, y: 0 };
    let mouseX = cardRect.left + cardRect.width / 2 - pageX;
    let mouseY = cardRect.top + cardRect.height / 2 - pageY;
    return {
      x: mouseX / (cardRect.width / 2) + (flipped ? 180 : 0),
      y: mouseY / (cardRect.height / 2),
    };
  });
  let mouseSheen = $derived(((pageY - cardRect.top) / (cardRect.bottom - cardRect.top)) * 100);

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (ev) => {
      // ev.alpha -- steering wheel, ev.beta -- tilt, ev.gamma -- spin 0 is front;
      if (ev.gamma !== null) {
        let spin = ev.gamma / 3;
        if (spin > 15) spin = 15;
        if (spin < -15) spin = -15;
        //mousePercent.x = spin * -1;
      }
      //console.log(ev.beta);
      if (ev.beta !== null) {
        let tilt = 45 - ev.beta;
        if (tilt > 40) tilt = 40;
        if (tilt < -40) tilt = -40;
        //mousePercent.y = tilt / 3;
        ////mouseSheen = Math.abs(tilt) * 3.33;
      }
    });
  }

  function cardClick(e: any) {
    flipped = !flipped;
    //styling.z = flipped ? 21 : 19;
  }

  function close() {
    onclose?.();
  }

  function cardMove(e: MouseEvent) {
    console.log(e);
  }
</script>

<section out:fade|global class="cardContainer" style="background-color:{background};">
  <button id="closer" onclick={close} aria-label="Close card view">X</button>
  <div
    bind:this={cardEl}
    onclick={cardClick}
    onkeydown={(e) => (e.key === "Enter" || e.key === " " ? cardClick(e) : null)}
    class="card"
    role="button"
    tabindex="0"
    aria-label="Flip card"
    style:transform={`perspective(400px) rotateY(${mousePercent.x}deg) rotateX(${mousePercent.y}deg)`}
    style:--degree={`${(mousePercent.x - mousePercent.y) / 2}deg`}
    style:--p1="{Math.round(mouseSheen) - 10}%"
    style:--p2="{Math.round(mouseSheen)}%"
    style:--p3="{Math.round(mouseSheen) + 10}%"
    style:left
    style:top
    onmousemove={(e) => ({ pageX, pageY } = e)}
    onmouseenter={() => (mouseOn = true)}
    onmouseleave={() => (mouseOn = false)}
  >
    <img id="cardBack" loading="lazy" style={`z-index:${z}; width:${width}; height:${height}`} src="images/Card_Back.png" alt={clicked.alt} />
    <img id="cardFront" loading="lazy" style:width style:height src={clicked.src} alt={clicked.alt} />
  </div>
  {#if flipped}
    <p id="backCredit" style:--height={height}>{cardData.name}<br />{cardData.handle}</p>
  {/if}
  <div id="fill" onclick={close} onkeydown={(e) => (e.key === "Enter" || e.key === " " ? close() : null)} role="button" tabindex="0" aria-label="Close card view"></div>
</section>

<style lang="scss">
  .cardContainer {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    margin: 0;
    padding: 0;
    position: absolute;
    display: flex;
    top: 0%;
    z-index: 19;
    background-color: hsla(0, 0%, 14%, 0);
    transition: all ease 1s;

    p {
      position: absolute;
      right: 2rem;
      height: 2rem;
      display: block;
      color: #e9e3d3;
      font-weight: bold;
    }

    #closer {
      position: absolute;
      right: 2rem;
      height: 2rem;
      line-height: 2rem;
      background: none;
      border: none;
      color: #e9e3d3;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.15);
        color: white;
      }
    }

    #backCredit {
      --height: 50vh;
      bottom: calc(50vh - (var(--height) / 2) - 3rem);
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      animation: fadeIn 0.5s;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .card {
    transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 2s;
    position: absolute;
    z-index: 20;
    width: max-content;
    height: max-content;
    object-fit: cover;
    --degree: 40deg;
    --p1: 0%;
    --p2: 0%;
    --p3: 0%;
    transform: perspective(400px) rotateX(50deg);
    transform-style: preserve-3d !important;

    img {
      position: relative;
      height: auto;
      transition: all 1s;
      border-radius: 1rem;
      cursor: pointer;
    }

    #cardFront {
      transform-style: preserve-3d;
      backface-visibility: hidden;
      z-index: -1;
    }

    #cardBack {
      transform: translateZ(-40px) scale(1);
      position: absolute;
      left: 0%;
    }

    &::before {
      transition: all 1s;
      z-index: 1;
      border-radius: 1rem;
      transform: scale(0.95);
      background-position: 50% 50%;
      background-size: 300% 300%;
      background-repeat: no-repeat;
      content: "";
      mix-blend-mode: luminosity;
      position: absolute;
      --highColour: white;
      background-image: linear-gradient(40deg, rgba(0, 0, 0, 0) var(--p1), var(--highColour) var(--p2), rgba(0, 0, 0, 0) var(--p3));
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      opacity: 0.3;
    }
  }

  #fill {
    width: 100vw;
    height: 100vh;
  }
</style>
