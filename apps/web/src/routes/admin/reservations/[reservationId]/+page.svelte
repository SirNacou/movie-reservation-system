<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Button from "@/components/ui/button/button.svelte";
  import * as Card from "@/components/ui/card";
  import * as Dialog from "@/components/ui/dialog";
  import Separator from "@/components/ui/separator/separator.svelte";
  import { orpc } from "@/orpc";
  import { formatDate, formatTime } from "@/utils/date-format";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { toast } from "svelte-sonner";

  const reservationId = page.params.reservationId!;

  const reservation = createQuery(() =>
    orpc.reservations.get.queryOptions({
      input: {
        reservationId,
      },
    }),
  );

  const cancelReservation = createMutation(() =>
    orpc.reservations.cancel.mutationOptions({
      onSuccess: async () => {
        await reservation.refetch();
        toast.success("Reservation cancelled");
      },
      onError: (error) => {
        toast.error(error.message);
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

  function cancel() {
    cancelReservation.mutate({
      reservationId,
    });
  }
</script>

<div class="space-y-8 mx-auto max-w-3xl">
  <div class="flex justify-between items-center gap-4">
    <div>
      <Button
        variant="ghost"
        class="mb-2 -ml-3"
        onclick={() => goto("/admin/reservations")}
      >
        ← Reservations
      </Button>

      <h1 class="font-bold text-3xl tracking-tight">Reservation</h1>
    </div>
  </div>

  {#if reservation.isPending}
    <div class="py-12 text-muted-foreground text-center">
      Loading reservation...
    </div>
  {:else if reservation.isError}
    <Card.Root>
      <Card.Content class="py-12 text-center">
        <p class="text-destructive">Failed to load reservation.</p>
      </Card.Content>
    </Card.Root>
  {:else if reservation.data}
    {@const data = reservation.data}

    <Card.Root>
      <Card.Header>
        <div class="flex justify-between items-start gap-4">
          <div>
            <Card.Title>{data.movieTitle}</Card.Title>
            <Card.Description>
              {data.cinemaName} · {data.auditoriumName}
            </Card.Description>
          </div>

          <span class={`font-medium ${statusClass(data.status)}`}>
            {data.status}
          </span>
        </div>
      </Card.Header>

      <Card.Content class="space-y-6">
        <div class="space-y-2">
          <h2 class="font-semibold">Screening</h2>

          <div class="text-muted-foreground text-sm">
            <p>{formatDate(data.startTime)}</p>
            <p>
              {formatTime(data.startTime)}
              –
              {formatTime(data.endTime)}
            </p>
          </div>
        </div>

        <Separator />

        <div class="space-y-2">
          <h2 class="font-semibold">Customer</h2>

          <div class="text-muted-foreground text-sm">
            <p>{data.customerName || "No name"}</p>
            <p>{data.customerEmail}</p>
          </div>
        </div>

        <Separator />

        <div class="space-y-2">
          <h2 class="font-semibold">Seats</h2>

          <div class="flex flex-wrap gap-2">
            {#each data.seats as seat (seat.id)}
              <div class="px-4 py-2 border rounded-md text-sm">
                {seat.row}{seat.number}
              </div>
            {/each}
          </div>
        </div>

        <Separator />

        <div class="gap-4 grid sm:grid-cols-2 text-sm">
          <div>
            <p class="text-muted-foreground">Reservation ID</p>
            <p class="mt-1 font-mono break-all">
              {data.id}
            </p>
          </div>

          <div>
            <p class="text-muted-foreground">Created</p>
            <p class="mt-1">
              {formatDate(data.createdAt)}
              ·
              {formatTime(data.createdAt)}
            </p>
          </div>

          {#if data.status === "PENDING"}
            <div>
              <p class="text-muted-foreground">Hold expires</p>
              <p class="mt-1">
                {formatDate(data.expiresAt)}
                ·
                {formatTime(data.expiresAt)}
              </p>
            </div>
          {/if}
        </div>

        {#if data.status === "PENDING" || data.status === "CONFIRMED"}
          <Separator />

          <div class="flex justify-end">
            <Dialog.Root>
              <Dialog.Trigger>
                <Button variant="destructive">Cancel Reservation</Button>
              </Dialog.Trigger>

              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Cancel Reservation?</Dialog.Title>

                  <Dialog.Description>
                    Are you sure you want to cancel this reservation? This
                    action cannot be undone.
                  </Dialog.Description>
                </Dialog.Header>

                <div class="space-y-2 py-4 text-sm">
                  <div>
                    <span class="text-muted-foreground">Movie:</span>
                    {data.movieTitle}
                  </div>

                  <div>
                    <span class="text-muted-foreground">Date:</span>
                    {formatDate(data.startTime)}
                    ·
                    {formatTime(data.startTime)}
                  </div>

                  <div>
                    <span class="text-muted-foreground">Seats:</span>
                    {data.seats
                      .map((seat) => `${seat.row}${seat.number}`)
                      .join(", ")}
                  </div>
                </div>

                <Dialog.Footer>
                  <Dialog.Close>
                    <Button variant="outline">Keep Reservation</Button>
                  </Dialog.Close>

                  <Button
                    variant="destructive"
                    disabled={cancelReservation.isPending}
                    onclick={cancel}
                  >
                    {cancelReservation.isPending
                      ? "Cancelling..."
                      : "Cancel Reservation"}
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          </div>
        {/if}
      </Card.Content>
    </Card.Root>
  {/if}
</div>
