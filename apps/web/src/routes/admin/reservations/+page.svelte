<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import Button from "@/components/ui/button/button.svelte";
  import * as Card from "@/components/ui/card";
  import Input from "@/components/ui/input/input.svelte";
  import { orpc } from "@/orpc";
  import { formatDate, formatTime } from "@/utils/date-format";
  import { createQuery } from "@tanstack/svelte-query";

  const statuses = ["ALL", "PENDING", "CONFIRMED", "CANCELLED"] as const;
  type Status = (typeof statuses)[number];

  let customerEmail = $state("");
  let selectedStatus = $state<Status>("ALL");

  const reservations = createQuery(() =>
    orpc.reservations.adminList.queryOptions({
      input: {
        customerEmail: customerEmail.trim() || undefined,
        status: selectedStatus === "ALL" ? undefined : selectedStatus,
      },
    }),
  );

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

<div class="space-y-8 mx-auto max-w-7xl">
  <div class="space-y-2">
    <h1 class="font-bold text-3xl tracking-tight">Reservations</h1>
    <p class="text-muted-foreground">View and manage customer reservations.</p>
  </div>

  <Card.Root>
    <Card.Content class="pt-6">
      <div class="flex md:flex-row flex-col md:items-end gap-4">
        <div class="flex-1 space-y-2">
          <label for="email" class="font-medium text-sm">
            Customer email
          </label>

          <Input
            id="email"
            type="email"
            placeholder="customer@example.com"
            bind:value={customerEmail}
          />
        </div>

        <div class="space-y-2">
          <label for="status" class="font-medium text-sm"> Status </label>

          <select
            id="status"
            bind:value={selectedStatus}
            class="flex bg-background shadow-xs px-3 py-1 border border-input rounded-md outline-none w-full md:w-40 h-9 text-sm"
          >
            {#each statuses as status}
              <option value={status}>
                {status === "ALL" ? "All statuses" : status}
              </option>
            {/each}
          </select>
        </div>
      </div>
    </Card.Content>
  </Card.Root>

  {#if reservations.isPending}
    <div class="py-12 text-muted-foreground text-center">
      Loading reservations...
    </div>
  {:else if reservations.isError}
    <Card.Root>
      <Card.Content class="py-12 text-center">
        <p class="text-destructive">Failed to load reservations.</p>
      </Card.Content>
    </Card.Root>
  {:else if reservations.data.length === 0}
    <Card.Root>
      <Card.Content class="py-12 text-center">
        <p class="font-medium">No reservations found</p>
        <p class="mt-1 text-muted-foreground text-sm">
          Try changing your filters.
        </p>
      </Card.Content>
    </Card.Root>
  {:else}
    <div class="space-y-4">
      {#each reservations.data as reservation (reservation.id)}
        <Card.Root>
          <Card.Content class="pt-6">
            <div
              class="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-6"
            >
              <div class="space-y-2 min-w-0">
                <div class="flex flex-wrap items-center gap-3">
                  <h2 class="font-semibold text-lg">
                    {reservation.movieTitle}
                  </h2>

                  <span
                    class={`font-medium text-sm ${statusClass(reservation.status)}`}
                  >
                    {reservation.status}
                  </span>
                </div>

                <div class="text-muted-foreground text-sm">
                  {formatDate(reservation.startTime)}
                  ·
                  {formatTime(reservation.startTime)}
                </div>

                <div class="text-muted-foreground text-sm">
                  {reservation.cinemaName}
                  ·
                  {reservation.auditoriumName}
                </div>

                <div class="text-sm">
                  <span class="font-medium">
                    {reservation.customerName || "No name"}
                  </span>

                  <span class="text-muted-foreground">
                    · {reservation.customerEmail}
                  </span>
                </div>

                <div class="text-muted-foreground text-sm">
                  Seats:
                  {reservation.seats
                    .map((seat) => `${seat.row}${seat.number}`)
                    .join(", ")}
                </div>
              </div>

              <Button
                variant="outline"
                class="shrink-0"
                onclick={() =>
                  goto(
                    resolve("/admin/reservations/[reservationId]", {
                      reservationId: reservation.id,
                    }),
                  )}
              >
                View Reservation
              </Button>
            </div>
          </Card.Content>
        </Card.Root>
      {/each}
    </div>
  {/if}
</div>
