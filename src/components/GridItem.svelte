<script lang="ts">
  import { onMount } from "svelte";

  let { itemData, winSize = false, id = 0, onclick, onentered } = $props();

  function entered(event: any) {
    onentered?.(event);
  }

  let observer: IntersectionObserver;
  let isIntersecting = $state("");

  const callback = (entries: any, observer: any) => {
    entries.forEach((entry: any) => {
      isIntersecting = entry.isIntersecting;
    });
  };

  onMount(() => {
    let options = {
      root: document.getElementById("cardGrid"),
      rootMargin: "0px 0px",
      threshold: 0.8,
    };
    observer = new IntersectionObserver(callback, options);
    const target = document.getElementById(id.toString());
    if (target) {
      observer.observe(target);
    }
  });
</script>

<div class="item" {onclick} onkeydown={(e) => (e.key === "Enter" || e.key === " " ? onclick?.(e) : null)} id={id.toString()} class:inViewport={isIntersecting} role="button" tabindex="0" aria-label={`View ${itemData.name || "card"}`}>
  <img loading="lazy" src={itemData.img} alt={itemData.name} onmouseenter={entered} />
  <div>
    <h2>
      {#if itemData.name}
        {itemData.name}
        <!-- {winSize ? itemData.name : itemData.name.replace(".", " .")} -->
      {/if}
      {#if itemData.pronouns}
        <i>{itemData.pronouns}</i>
      {/if}
    </h2>
    {#if itemData.handle}
      <h4>{itemData.handle}</h4>
    {/if}
    {#if itemData.info}
      <i>{itemData.info}</i>
    {/if}
  </div>
</div>

<style lang="scss">
  .item {
    height: max-content;
    width: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    transition:
      all 5s ease-in-out,
      opacity ease-in-out 1s;
    text-align: left;
    opacity: 0.2;
    padding-bottom: 1.5rem;

    div {
      margin-top: clamp(0rem, -0.2632rem + 1.0526vw, 1rem);
      width: 95%;
      align-items: flex-start;
    }

    img {
      width: 85%;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.4s;
      background-color: rgba(255, 255, 255, 0.5);
      &:hover {
        transform: scale(1.02);
      }
    }
  }

  .inViewport {
    opacity: 1;
  }

  h2 {
    padding: 0.2rem 0;
    margin: 0;
    font-size: clamp(1rem, 0.4737rem + 2.1053vw, 1.5rem);
  }

  h4 {
    padding: 0.2rem 0;
    margin: 0;
    font-size: clamp(0.6rem, 0.1158rem + 0.7368vw, 1rem);
    line-height: clamp(0.6rem, 0.1158rem + 0.7368vw, 1rem);
  }

  i {
    display: block;
    font-size: clamp(0.6rem, 0.1158rem + 0.7368vw, 1rem);
    font-style: italic;
    margin-top: 0.2rem;
    line-height: clamp(0.6rem, 0.1158rem + 0.7368vw, 1rem);
  }
</style>
