defmodule BlackjackWeb.PageController do
  use BlackjackWeb, :controller
  alias Blackjack.Games

  def index(conn, _params) do
    render conn, "index.html"
  end

  def lobby(conn, _params) do
    tables = Games.list_tables()
    render conn, "lobby.html", tables: tables
  end

  def game(conn, params) do
   render conn, "games.html", table_id: params["table_id"]
 end

end
