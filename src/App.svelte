<script>
  import cardData from "./cards.json";
  import Card from "./Card.svelte";
  import { onMount } from "svelte";
  import GridItem from "./GridItem.svelte";
  let cardList = Object.keys(cardData);
  let clicked = { on: false };

  let winSize = false;

  console.log(cardData);

  function listClick(e) {
    clicked.on = !clicked.on;
  }

  function listHover({ detail }) {
    let target = detail.target.getBoundingClientRect();
    clicked = {
      left: target.left,
      top: target.top,
      width: target.width,
      height: target.height,
      ratio: target.width / target.height,
      on: clicked.on,
      src: detail.target.src,
      alt: detail.target.alt,
    };
  }

  function closeCard() {
    clicked.on = !clicked.on;
  }

  function winSizeCheck(width) {
    winSize = false;
    if (width > 1127) winSize = true;
  }

  onMount(() => {
    winSizeCheck(window.innerWidth);
    window.addEventListener("resize", () => {
      winSizeCheck(window.innerWidth);
    });
  });
</script>

<svelte:head>
  <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png" />
  <link rel="manifest" href="favicon/site.webmanifest" />
</svelte:head>

<main>
  <header style:-webkit-filter={clicked.on ? "blur(5px)" : "blur(0px)"}>
    <h1>Haus of Cards</h1>
    <p>Click on cards to display them, and again to flip</p>
  </header>
  {#if clicked.on}
    <Card on:close={closeCard} {clicked} />
  {/if}
  <div class="grid" id="cardGrid" style:-webkit-filter={clicked.on ? "blur(5px)" : "blur(0px)"}>
    {#each cardList as card, id}
      <GridItem itemData={cardData[card]} {id} {winSize} on:click={listClick} on:entered={listHover} />
    {/each}
    <span id="buffer" />
  </div>
</main>
