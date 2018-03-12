defmodule BlackjackWeb.GameLogControllerTest do
  use BlackjackWeb.ConnCase

  alias Blackjack.Games

  @create_attrs %{status: "some status"}
  @update_attrs %{status: "some updated status"}
  @invalid_attrs %{status: nil}

  def fixture(:game_log) do
    {:ok, game_log} = Games.create_game_log(@create_attrs)
    game_log
  end

  describe "index" do
    test "lists all gamelog", %{conn: conn} do
      conn = get conn, game_log_path(conn, :index)
      assert html_response(conn, 200) =~ "Listing Gamelog"
    end
  end

  describe "new game_log" do
    test "renders form", %{conn: conn} do
      conn = get conn, game_log_path(conn, :new)
      assert html_response(conn, 200) =~ "New Game log"
    end
  end

  describe "create game_log" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post conn, game_log_path(conn, :create), game_log: @create_attrs

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == game_log_path(conn, :show, id)

      conn = get conn, game_log_path(conn, :show, id)
      assert html_response(conn, 200) =~ "Show Game log"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, game_log_path(conn, :create), game_log: @invalid_attrs
      assert html_response(conn, 200) =~ "New Game log"
    end
  end

  describe "edit game_log" do
    setup [:create_game_log]

    test "renders form for editing chosen game_log", %{conn: conn, game_log: game_log} do
      conn = get conn, game_log_path(conn, :edit, game_log)
      assert html_response(conn, 200) =~ "Edit Game log"
    end
  end

  describe "update game_log" do
    setup [:create_game_log]

    test "redirects when data is valid", %{conn: conn, game_log: game_log} do
      conn = put conn, game_log_path(conn, :update, game_log), game_log: @update_attrs
      assert redirected_to(conn) == game_log_path(conn, :show, game_log)

      conn = get conn, game_log_path(conn, :show, game_log)
      assert html_response(conn, 200) =~ "some updated status"
    end

    test "renders errors when data is invalid", %{conn: conn, game_log: game_log} do
      conn = put conn, game_log_path(conn, :update, game_log), game_log: @invalid_attrs
      assert html_response(conn, 200) =~ "Edit Game log"
    end
  end

  describe "delete game_log" do
    setup [:create_game_log]

    test "deletes chosen game_log", %{conn: conn, game_log: game_log} do
      conn = delete conn, game_log_path(conn, :delete, game_log)
      assert redirected_to(conn) == game_log_path(conn, :index)
      assert_error_sent 404, fn ->
        get conn, game_log_path(conn, :show, game_log)
      end
    end
  end

  defp create_game_log(_) do
    game_log = fixture(:game_log)
    {:ok, game_log: game_log}
  end
end
