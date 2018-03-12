defmodule BlackjackWeb.GameLogController do
  use BlackjackWeb, :controller

  alias Blackjack.Games
  alias Blackjack.Games.GameLog

  def index(conn, _params) do
    gamelog = Games.list_gamelog()
    render(conn, "index.html", gamelog: gamelog)
  end

  def new(conn, _params) do
    changeset = Games.change_game_log(%GameLog{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"game_log" => game_log_params}) do
    case Games.create_game_log(game_log_params) do
      {:ok, game_log} ->
        conn
        |> put_flash(:info, "Game log created successfully.")
        |> redirect(to: game_log_path(conn, :show, game_log))
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    game_log = Games.get_game_log!(id)
    render(conn, "show.html", game_log: game_log)
  end

  def edit(conn, %{"id" => id}) do
    game_log = Games.get_game_log!(id)
    changeset = Games.change_game_log(game_log)
    render(conn, "edit.html", game_log: game_log, changeset: changeset)
  end

  def update(conn, %{"id" => id, "game_log" => game_log_params}) do
    game_log = Games.get_game_log!(id)

    case Games.update_game_log(game_log, game_log_params) do
      {:ok, game_log} ->
        conn
        |> put_flash(:info, "Game log updated successfully.")
        |> redirect(to: game_log_path(conn, :show, game_log))
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", game_log: game_log, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    game_log = Games.get_game_log!(id)
    {:ok, _game_log} = Games.delete_game_log(game_log)

    conn
    |> put_flash(:info, "Game log deleted successfully.")
    |> redirect(to: game_log_path(conn, :index))
  end
end
