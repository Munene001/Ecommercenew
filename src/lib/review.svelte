<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";

  export let product_id;
  export let average_rating;
  export let review_count;
  export let productname;
  let rating = 5;
  let comment = "";
  let replyComments = {};
  let reviews = [];
  let error = "";
  let submitting = false;
  let submittingReply = {};
  let activeTab = "";

  function toggleReplies(review_id) {
    if (activeTab === review_id) {
      activeTab = ""; // Hide if already showing
    } else {
      activeTab = review_id; // Show if hidden
    }
  }

  onMount(async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${product_id}/reviews`
      );
      if (response.ok) {
        const data = await response.json();
        reviews = data.reviews;
      } else {
        error = "Failed to load reviews";
      }
    } catch (error) {
      error = "Error fetching reviews";
    }
  });

  async function submitReview() {
    if (!$page.data.isAuthenticated) {
      goto("/login?redirect = /product/${product_id}");
      return;
    }
    submitting = true;
    error = "";
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://127.0.0.1:8000/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id, rating, comment }),
      });
      if (response.ok) {
        const newReview = (await response.json()).review;
        reviews = [newReview, ...reviews];
        comment = "";
        rating = 5;
      } else {
        const data = await response.json();
        error = data.error || "Failed to submit review";
      }
    } catch (error) {
      error = "Error submitting Review";
    } finally {
      submitting = false;
    }
  }

  async function submitReply(review_id) {
    if (!$page.data.isAuthenticated) {
      goto("/login?redirect = /product/${product_id}");
      return;
    }
    submittingReply[review_id] = true;
    error = "";
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://127.0.0.1:8000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parent_id: review_id,
          comment: replyComments[review_id],
        }),
      });
      if (response.ok) {
        const newReply = (await response.json()).review;
        reviews = reviews.map((review) =>
          review.review_id === review_id
            ? { ...review, replies: [...review.replies, newReply] }
            : review
        );
        replyComments[review_id] = "";
      } else {
        const data = await response.json();
        error = data.error || "Failed to submit reply";
      }
    } catch (error) {
      error = "Error submitting reply";
    } finally {
      submittingReply[review_id] = false;
    }
  }

  $: fullStars = Math.floor(average_rating);
  $: partialStar = average_rating - fullStars;

 
</script>

<div class="review-section" id="review">
  <div class="title">{review_count} reviews for {productname}</div>
  <div class="rating-container">
    <div class="rating-row">
      <div class="rating-number">{Number(average_rating).toFixed(1)}</div>
      <div class="rating-stars">
        {#each Array(5) as _, i}
          {#if i < fullStars}
            <Icon
              icon="ic:round-star"
              class="star full"
              style="color:#fcc419; font-size:15px"
            />
          {:else if i === fullStars && partialStar > 0}
            <Icon
              icon="ic:round-star-half"
              class="star partial"
              style="color:#fcc419; font-size:15px"
            />
          {:else}
            <Icon
              icon="ic:round-star-outline"
              class="star empty"
              style="font-size:15px"
            />
          {/if}
        {/each}
      </div>
    </div>
    <div class="rating-bars">
      {#each [5, 4, 3, 2, 1] as num}
        <div class="bar-row">
          <span class="bar-number">{num}</span>
          <div
            class="bar"
            style:background={num === Math.floor(average_rating) &&
            average_rating % 1 !== 0
              ? `linear-gradient(to right, #f5c518 ${(average_rating % 1) * 100}%, #ccc ${(average_rating % 1) * 100}%)`
              : num === Math.ceil(average_rating) && average_rating % 1 !== 0
                ? `linear-gradient(to right, #f5c518 ${(1 - (average_rating % 1)) * 100}%, #ccc ${(1 - (average_rating % 1)) * 100}%)`
                : num <= average_rating
                  ? "#f5c518"
                  : "#ccc"}
          ></div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Reviews list moved up -->
  <div class="reviews-list">
    {#if reviews.length === 0}
      <p>No reviews yet.</p>
    {:else}
      {#each reviews as review}
      {@const derivedStars = Math.floor(review.rating)}
      {@const derstar = review.rating - derivedStars}
      <div class="review-sect">
        <div class="review-top">
        <div class="reviewname"><Icon icon="carbon:user-avatar-filled" style = "font-size: 40px"/><div><strong>{review.user.username}</strong></div></div>
        <div class="rating-stars">
          {#each Array(5) as _, i}
            {#if i < derivedStars}
              <Icon
                icon="ic:round-star"
                class="star full"
                style="color:#fcc419; font-size:15px"
              />
            {:else if i === derivedStars && derstar> 0}
              <Icon
                icon="ic:round-star-half"
                class="star partial"
                style="color:#fcc419; font-size:15px"
              />
            {:else}
              <Icon
                icon="ic:round-star-outline"
                class="star empty"
                style="font-size:15px"
              />
            {/if}
            
          {/each}
          </div>
        </div>
        <div>
          <p>{review.comment}</p>
          <p class="date">{new Date(review.created_at).toLocaleDateString()}</p>

          <!-- Toggle button - shows/hides both replies and reply form -->
          <button
            class="reply-btn"
            class:active={activeTab === review.review_id}
            on:click={() => toggleReplies(review.review_id)}
          >
            {activeTab === review.review_id ? "Hide Replies" : "Show Replies"}
          </button>

          <!-- Only show replies and reply form when this review is active -->
          {#if activeTab === review.review_id}
            {#if review.replies.length > 0}
              <div class="replies">
                {#each review.replies as reply}
                  <div class="reply">
                    <p><strong>{reply.user.username}</strong> (Reply):</p>
                    <p>{reply.comment}</p>
                    <p class="date">
                      {new Date(reply.created_at).toLocaleDateString()}
                    </p>
                  </div>
                {/each}
              </div>
            {/if}

            {#if $page.data.isAuthenticated}
              <form
                on:submit|preventDefault={() => submitReply(review.review_id)}
              >
                <textarea
                  bind:value={replyComments[review.review_id]}
                  placeholder="Write a reply..."
                  rows="2"
                ></textarea>
                <button
                  type="submit"
                  disabled={submittingReply[review.review_id] ||
                    !replyComments[review.review_id]}
                >
                  {submittingReply[review.review_id]
                    ? "Submitting..."
                    : "Submit Reply"}
                </button>
              </form>
            {:else}
              <p>
                <a href={`/login?redirect=/product/${product_id}`}>Log in</a> to
                reply.
              </p>
            {/if}
          {/if}
        </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Review submission form moved down -->
  {#if $page.data.isAuthenticated}
    <form on:submit|preventDefault={submitReview}>
      <h3>Write a Review</h3>
      <label>
        Rating:
        <select bind:value={rating}>
          {#each [5, 4, 3, 2, 1] as r}
          <option value={r}>{r} Star{r !== 1 ? "s" : ""}</option>
          {/each}
        </select>
      </label>
      <textarea bind:value={comment} placeholder="Write your review..." rows="4"
      ></textarea>
      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  {:else}
    <p>
      Please <a href={`/login?redirect=/product/${product_id}`}>log in</a> to write
      a review.
    </p>
  {/if}

  {#if error}
    <p class="error">{error}</p>
  {/if}
</div>

<style>
  .review-section {
    padding: 10px 10px;
    box-sizing: border-box;
  }
  .title {
    font-size: 20px;
    font-weight: 400;
    line-height: 24px;
    color: rgb(0, 0, 0);
    margin-bottom: 1rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 4px;
  }
  select,
  textarea {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
  .error {
    color: red;
  }
  .reviews-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .review-top{
    display: flex;
    flex-direction: row;
    gap: 9px;
    align-items: center;
   
  }
  
  .reviewname{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
  }
  .review-sect{
    border-bottom: 1px solid gray;
    display: flex;
    flex-direction: column;
    
  }
  .replies {
    margin-left: 2rem;
    border-left: 2px solid #ccc;
    padding-left: 1rem;
    margin-top: 0.5rem;
  }
  .date {
    font-size: 0.8rem;
    color: #666;
    margin: 0.5rem 0;
  }
  .rating-container {
    display: flex;
    flex-direction: row;
    gap: 40px;
    margin-bottom: 2rem;
   
  }
  .rating-stars{
    display: flex;
    align-items: center;
  }
  .rating-row {
    display: flex;
    align-items: center;
  }
  .rating-number {
    font-size: 72px;
    font-weight: 400;
    line-height: 57.6px;
  }
  .rating-bars {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: fit-content;
  }
  .bar-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .bar-number {
    width: 1.5rem;
    text-align: right;
  }
  .bar {
    width: 160px;
    height: 8px;
    background-color: #ccc;
  }
</style>
