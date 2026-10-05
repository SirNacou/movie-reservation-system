<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Button from "@/components/ui/button/button.svelte";
  import * as Card from "@/components/ui/card";
  import Separator from "@/components/ui/separator/separator.svelte";
  import { orpc } from "@/orpc";
  import { getApiErrorMessage } from "@/utils/api-error";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { toast } from "svelte-sonner";

  let now = $state(Date.now());

  const timer = setInterval(() => {
    now = Date.now();
  }, 1000);

  $effect(() => {
    return () => clearInterval(timer);
  });

  const reservationId = page.params.reservationId!;

  const reservation = createQuery(() =>
    orpc.reservations.get.queryOptions({
      input: {
        reservationId,
      },
    }),
  );
  const confirmReservation = createMutation(() =>
    orpc.reservations.confirm.mutationOptions({
      onSuccess: () => {
        reservation.refetch();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const cancelReservation = createMutation(() =>
    orpc.reservations.cancel.mutationOptions({
      onSuccess: () => {
        reservation.refetch();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);
  }

  function formatTimeRemaining(expiresAt: Date) {
    const remaining = Math.max(0, expiresAt.getTime() - now);

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const isExpired = $derived(
    reservation.data ? reservation.data.expiresAt.getTime() <= now : false,
  );
</script>

<div class="space-y-6 mx-auto max-w-3xl">
  {#if reservation.isPending}
    <div class="py-16 text-muted-foreground text-center">
      Loading reservation...
    </div>
  {:else if reservation.isError}
    <Card.Root>
      <Card.Content class="py-12 text-center">
        <p class="font-medium text-destructive">Failed to load reservation.</p>
        <p class="mt-1 text-muted-foreground text-sm">
          {getApiErrorMessage(reservation.error)}
        </p>
      </Card.Content>
    </Card.Root>
  {:else if reservation.data}
    {@const data = reservation.data}

    <div>
      <h1 class="font-semibold text-2xl tracking-tight">Your Reservation</h1>
      <p class="mt-1 text-muted-foreground">
        Reservation details and seat information.
      </p>
    </div>

    <Card.Root>
      <Card.Header>
        <div class="flex justify-between items-start gap-4">
          <div>
            <Card.Title>Reservation</Card.Title>
            <Card.Description>
              Created {formatDate(data.createdAt)}
            </Card.Description>
          </div>

          <div
            class={[
              "rounded-full px-3 py-1 text-xs font-medium",
              data.status === "PENDING" &&
                "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
              data.status === "CONFIRMED" &&
                "bg-green-500/10 text-green-600 dark:text-green-400",
              data.status === "CANCELLED" && "bg-muted text-muted-foreground",
            ]}
          >
            {data.status}
          </div>
        </div>
      </Card.Header>

      <Card.Content class="space-y-6">
        {#if data.status === "PENDING"}
          <div class="bg-muted/50 p-4 border rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">Seats are being held</p>
                <p class="text-muted-foreground text-sm">
                  Your reservation expires in
                </p>
              </div>

              {#if isExpired}
                <p class="font-medium text-destructive">
                  Reservation hold expired
                </p>
              {:else}
                <p class="font-mono font-semibold text-2xl">
                  {formatTimeRemaining(reservation.data.expiresAt)}
                </p>
              {/if}
            </div>
          </div>
        {/if}

        <div class="space-y-2">
          <h2 class="font-medium">Reservation ID</h2>
          <p class="font-mono text-muted-foreground text-sm break-all">
            {data.id}
          </p>
        </div>

        <Separator />

        <div class="space-y-3">
          <h2 class="font-medium">Seats</h2>

          <div class="flex flex-wrap gap-2">
            {#each data.seats as seat (seat.id)}
              <div class="px-4 py-2 border rounded-md font-medium">
                {seat.row}{seat.number}
              </div>
            {/each}
          </div>
        </div>

        <Separator />

        <div class="space-y-3">
          <h2 class="font-medium">Customer</h2>

          <div class="gap-3 grid sm:grid-cols-2">
            <div>
              <p class="text-muted-foreground text-sm">Name</p>
              <p>{data.customerName || "—"}</p>
            </div>

            <div>
              <p class="text-muted-foreground text-sm">Email</p>
              <p>{data.customerEmail}</p>
            </div>
          </div>
        </div>

        {#if reservation.data?.status === "PENDING"}
          <div class="flex gap-3">
            <Button
              class="flex-1"
              disabled={confirmReservation.isPending}
              onclick={() => confirmReservation.mutate({ reservationId })}
            >
              {confirmReservation.isPending
                ? "Confirming..."
                : "Confirm Reservation"}
            </Button>

            <Button
              variant="outline"
              disabled={cancelReservation.isPending}
              onclick={() => cancelReservation.mutate({ reservationId })}
            >
              {cancelReservation.isPending ? "Cancelling..." : "Cancel"}
            </Button>
          </div>
        {:else if reservation.data?.status === "CONFIRMED"}
          <p class="font-medium text-primary text-center">
            Reservation confirmed
          </p>
        {:else if reservation.data?.status === "CANCELLED"}
          <p class="font-medium text-muted-foreground text-center">
            Reservation cancelled
          </p>
        {/if}

        <div class="flex justify-center">
          <Button variant="ghost" onclick={() => goto("/showtimes")}>
            Back to Showtimes
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  {/if}
</div>
