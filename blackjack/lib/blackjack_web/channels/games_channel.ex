# defmodule BlackjackWeb.GamesChannel do
#   use BlackjackWeb, :channel
#
#   alias Blackjack.Game
#
#   def join("games:" <> name, payload, socket) do
#     IO.puts name
#     if authorized?(payload) do
#       game = Memory.GameBackup.load(name) || Game.reset()
#       #game = Game.reset()
#       socket = socket
#                |> assign(:game, game)
#                |> assign(:name, name)
#
#       Memory.GameBackup.save(socket.assigns[:name], game)
#       {:ok, %{"game" => game},socket}
#     else
#       {:error, %{reason: "unauthorized"}}
#     end
#   end
#
#   # Channels can be used in a request/response fashion
#   # by sending replies to requests from the client
#   def handle_in("reset", payload, socket) do
#     game = Game.reset()
#     socket = socket
#       |> assign(:game, game)
#
#
#     Memory.GameBackup.save(socket.assigns[:name], game)
#     {:reply, {:ok, %{"game" => game}}, socket}
#   end
#
#   def handle_in("click", payload, socket) do
#     game = Game.update(socket.assigns[:game],payload["id"], payload["value"])
#     socket = socket
#       |> assign(:game, game)
#
#     Memory.GameBackup.save(socket.assigns[:name], game)
#     {:reply, {:ok, %{"game" => game}}, socket}
#   end
#
#   def handle_in("update",payload,socket) do
#     game = %{
#       cards: payload["game"]["cards"],
# 			openedCard: payload["game"]["openedCard"],
# 			matchCount: payload["game"]["matchCount"],
# 			locked: payload["game"]["locked"],
# 			clickCount: payload["game"]["clickCount"],
#       mismatch: payload["game"]["mismatch"]
#     }
#     socket = assign(socket,:game, game)
#
#     Memory.GameBackup.save(socket.assigns[:name], game)
#
#     {:reply, {:ok, %{"game" => game}}, socket}
#
#   end
#
#   # It is also common to receive messages from the client and
#   # broadcast to everyone in the current topic (games:lobby).
#   def handle_in("shout", payload, socket) do
#     broadcast socket, "shout", payload
#     {:noreply, socket}
#   end
#
#   # Add authorization logic here as required.
#   defp authorized?(_payload) do
#     true
#   end
# end
