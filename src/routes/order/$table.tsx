import { createFileRoute } from "@tanstack/react-router";

import { OrderPage } from "../order";

export const Route = createFileRoute("/order/$table")({
  component: OrderPage,
});