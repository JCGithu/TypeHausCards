<script>
  export let itemData;
  export let winSize = false;
  export let id = 0;

  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  function entered(event) {
    dispatch("entered", event);
  }

  let observer,
    isIntersecting = "";
  const callback = (entries, observer) => {
    entries.forEach((entry) => {
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
    observer.observe(target);
  });
</script>

<div class="item" on:click id={id.toString()} class:inViewport={isIntersecting}>
  <img loading="lazy" src={itemData.img} alt={itemData.name} on:mouseenter={entered} />
  <div>
    <h2>
      {#if itemData.name}
        {winSize ? itemData.name : itemData.name.replace(".", " .")}
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
