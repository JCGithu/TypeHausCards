<script lang="ts">
  import { cardData } from "$lib/cards";
  import type { CardItem, Clicked } from "$lib/types";
  import Card from "../components/Card.svelte";

  import GridItem from "../components/GridItem.svelte";
  import { innerWidth } from "svelte/reactivity/window";

  let cardList = Object.keys(cardData);

  let winSize = $derived(innerWidth.current ? (innerWidth.current > 1127 ? true : false) : false);

  let on = $state(false);

  let target = $state<HTMLImageElement | null>(null);
  let clicked: Clicked = $derived.by(() => {
    let rect = target?.getBoundingClientRect();
    return {
      left: rect?.left || 0,
      top: rect?.top || 0,
      width: rect?.width || 0,
      height: rect?.height || 0,
      ratio: (rect?.width || 1) / (rect?.height || 1),
      src: target?.src || "",
      alt: target?.alt || "Card",
    };
  });

  function listHover(event: MouseEvent) {
    target = event.currentTarget as HTMLImageElement;
  }

  let targetData = $state(cardData[cardList[0] as keyof typeof cardData]);

  function openCard(card: CardItem) {
    targetData = card;
    on = true;
  }
</script>

<main>
  <header style:-webkit-filter={on ? "blur(5px)" : "blur(0px)"}>
    <h1>Haus of Cards</h1>
    <p>Click on cards to display them, and again to flip</p>
  </header>
  {#if on}
    <Card onclose={() => (on = false)} cardData={targetData} {clicked} />
  {/if}
  <div class="grid" id="cardGrid" style:-webkit-filter={on ? "blur(5px)" : "blur(0px)"}>
    {#each cardList as card, id}
      <GridItem itemData={cardData[card]} {id} {winSize} onclick={() => openCard(cardData[card])} onentered={listHover} />
    {/each}
    <div id="buffer"></div>
  </div>
</main>

<style lang="scss">
  main {
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-x: auto;
    width: 90vw;
    margin: 0 auto;
    padding: 0;
    text-align: center;
    @media screen and (max-width: 540px) {
      width: 100vw;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-column-gap: 0px;
    grid-row-gap: 2rem;
    margin-top: 1vh;
    height: 84vh;
    width: 80vw;
    filter: blur(0px);
    -webkit-filter: blur(0px);
    transition: all ease 1s;
    overflow: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
    padding-top: 3rem;
    padding-bottom: 100vh;
    @media screen and (max-width: 540px) {
      width: 92vw;
      grid-template-columns: repeat(2, 50%);
      padding-top: 1rem;
    }
    mask-image: linear-gradient(0deg, rgba(2, 0, 36, 0) 0%, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 100%);
    -webkit-mask-image: linear-gradient(0deg, rgba(2, 0, 36, 0) 0%, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 100%);
  }

  #buffer {
    height: 100px;
    width: 100px;
    opacity: 0;
  }

  header {
    height: 15vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all ease 1s;
    filter: blur(0px);
    -webkit-filter: blur(0px);

    p {
      padding: 0;
      margin: 0;
      font-weight: bold;
      line-height: 0.7rem;
      font-size: 0.7rem;
    }
  }

  h1 {
    font-size: 3.2em;
    @media screen and (max-width: 540px) {
      font-size: 2em;
    }
    line-height: 1.1;
    color: #ff1616;
    margin: 0rem;
    transition: all ease 1s;
  }
</style>
