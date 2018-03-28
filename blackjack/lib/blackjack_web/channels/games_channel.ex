defmodule BlackjackWeb.GamesChannel do
  use BlackjackWeb, :channel

  alias Blackjack.Game

  def join("games:" <> name, payload, socket) do
    IO.puts name
    game = Blackjack.GameBackup.load(name) || Game.reset()
    #game = Game.reset()
    socket = socket
             |> assign(:game, game)
             |> assign(:name, name)

    Blackjack.GameBackup.save(socket.assigns[:name], game)
    if authorized?(payload) do

      {:ok, %{"game" => game},socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("reset", payload, socket) do

    game = Game.reset()
    socket = socket
      |> assign(:game, game)

    Blackjack.GameBackup.save(socket.assigns[:name], game)
    #{:reply, {:ok, %{"game" => game}}, socket}

    broadcast! socket, "reset", %{"game" => game}
    {:noreply, socket}
  end

  def handle_in("update", payload, socket) do

    game = %{
      cards: payload["game"]["cards"],
      tablePlayerCount: payload["game"]["tablePlayerCount"],
      token: payload["game"]["token"],
      winner: payload["game"]["winner"],
      tableProgress: payload["game"]["tableProgress"],
      tableMessages: payload["game"]["tableMessages"]
    };
    socket=assign(socket, :game, game);
    Blackjack.GameBackup.save(socket.assigns[:name], game)
    #{:reply, {:ok, %{"game" => game}}, socket}

    broadcast! socket, "update", %{"game" => game}
    {:noreply, socket}
  end

  def handle_in("chats", payload, socket) do
    user = Blackjack.Accounts.get_user!(payload["userId"])
    broadcast! socket, "chats", %{userName: user.name, message: payload["message"]}
    {:noreply, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end




end
