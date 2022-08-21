<script>
  import cardData from "./cards.json";
  import Card from "./Card.svelte";
  let cardList = Object.keys(cardData);
  let clicked = { on: false };

  console.log(cardData);

  function listClick(e) {
    clicked.on = !clicked.on;
  }

  function listHover(e, cardStuff) {
    let target = e.target.getBoundingClientRect();
    clicked = {
      left: target.left,
      top: target.top,
      width: target.width,
      height: target.height,
      ratio: target.width / target.height,
      on: clicked.on,
      src: e.target.src,
      alt: e.target.alt,
    };
  }

  function closeCard() {
    clicked.on = !clicked.on;
  }
</script>

<main>
  <h1 style:-webkit-filter={clicked.on ? "blur(5px)" : "blur(0px)"}>Haus of Cards</h1>
  {#if clicked.on}
    <Card on:close={closeCard} {clicked} />
  {/if}
  <div class="grid" style:-webkit-filter={clicked.on ? "blur(5px)" : "blur(0px)"}>
    {#each cardList as card}
      <div class="item" on:click={listClick}>
        <img loading="lazy" src={cardData[card].img} alt={cardData[card].name} on:mouseenter={listHover} />
        <div>
          <h2>
            {#if cardData[card].name}
              {cardData[card].name}
            {/if}
            {#if cardData[card].pronouns}
              <i>{cardData[card].pronouns}</i>
            {/if}
          </h2>
          {#if cardData[card].handle}
            <h4>{cardData[card].handle}</h4>
          {/if}
          {#if cardData[card].info}
            <i>{cardData[card].info}</i>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</main>
