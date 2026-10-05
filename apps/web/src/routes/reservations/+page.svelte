<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "@/components/ui/button/button.svelte";
  import * as Card from "@/components/ui/card";
  import Input from "@/components/ui/input/input.svelte";
  import Label from "@/components/ui/label/label.svelte";
  import { orpc } from "@/orpc";
  import { createQuery } from "@tanstack/svelte-query";

  let customerEmail = $state("");
  let searchedEmail = $state("");

  const reservations = createQuery(() => ({
    ...orpc.reservations.list.queryOptions({
      input: {
        customerEmail: searchedEmail,
      },
    }),
    enabled: searchedEmail !== "",
  }));

  function search() {
    const email = customerEmail.trim().toLowerCase();

    if (!email) {
      return;
    }

    searchedEmail = email;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function formatTime(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  function statusClass(status: string) {
    switch (status) {
      case "CONFIRMED":
        return "text-primary";
      case "CANCELLED":
        return "text-muted-foreground";
      default:
        return "text-yellow-600";
    }
  }
</script>

<div class="space-y-8 mx-auto max-w-4xl">
  <div class="space-y-2">
    <h1 class="font-bold text-3xl tracking-tight">My Reservations</h1>
    <p class="text-muted-foreground">
      Enter your email to find your reservations.
    </p>
  </div>

  <Card.Root>
    <Card.Content>
      <form
        class="flex gap-3"
        onsubmit={(event) => {
          event.preventDefault();
          search();
        }}
      >
        <div class="flex-1 space-y-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            bind:value={customerEmail}
            required
          />
        </div>

        <Button
          type="submit"
          class="mt-auto"
          disabled={reservations.isFetching}
        >
          {reservations.isFetching ? "Searching..." : "Find Reservations"}
        </Button>
      </form>
    </Card.Content>
  </Card.Root>

  {#if reservations.isError}
    <Card.Root>
      <Card.Content class="py-10 text-center">
        <p class="text-destructive">Failed to load reservations.</p>
      </Card.Content>
    </Card.Root>
  {:else if reservations.data}
    {#if reservations.data.length === 0}
      <Card.Root>
        <Card.Content class="py-10 text-center">
          <p class="font-medium">No reservations found</p>
          <p class="mt-1 text-muted-foreground text-sm">
            We couldn't find any reservations for this email.
          </p>
        </Card.Content>
      </Card.Root>
    {:else}
      <div class="space-y-4">
        {#each reservations.data as reservation (reservation.id)}
          <Card.Root>
            <Card.Content class="space-y-4">
              <div class="flex justify-between items-start gap-4">
                <div class="space-y-1">
                  <h2 class="font-semibold text-lg">
                    {reservation.movieTitle}
                  </h2>

                  <p class="text-muted-foreground text-sm">
                    {formatDate(reservation.startTime)}
                    ·
                    {formatTime(reservation.startTime)}
                  </p>

                  <p class="text-muted-foreground text-sm">
                    {reservation.cinemaName}
                    ·
                    {reservation.auditoriumName}
                  </p>
                </div>

                <span
                  class={`font-medium text-sm ${statusClass(reservation.status)}`}
                >
                  {reservation.status}
                </span>
              </div>

              <div class="flex justify-between items-center gap-4">
                <div class="text-muted-foreground text-sm">
                  Seats:
                  {reservation.seats
                    .map((seat) => `${seat.row}${seat.number}`)
                    .join(", ")}
                </div>

                <Button
                  variant="outline"
                  onclick={() => goto(`/reservations/${reservation.id}`)}
                >
                  View Reservation
                </Button>
              </div>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    {/if}
  {/if}
</div>
