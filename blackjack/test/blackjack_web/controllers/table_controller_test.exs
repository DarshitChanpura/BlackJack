defmodule BlackjackWeb.TableControllerTest do
  use BlackjackWeb.ConnCase

  alias Blackjack.Games

  @create_attrs %{playerCount: 42, status: "some status", tableName: "some tableName"}
  @update_attrs %{playerCount: 43, status: "some updated status", tableName: "some updated tableName"}
  @invalid_attrs %{playerCount: nil, status: nil, tableName: nil}

  def fixture(:table) do
    {:ok, table} = Games.create_table(@create_attrs)
    table
  end

  describe "index" do
    test "lists all tables", %{conn: conn} do
      conn = get conn, table_path(conn, :index)
      assert html_response(conn, 200) =~ "Listing Tables"
    end
  end

  describe "new table" do
    test "renders form", %{conn: conn} do
      conn = get conn, table_path(conn, :new)
      assert html_response(conn, 200) =~ "New Table"
    end
  end

  describe "create table" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post conn, table_path(conn, :create), table: @create_attrs

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == table_path(conn, :show, id)

      conn = get conn, table_path(conn, :show, id)
      assert html_response(conn, 200) =~ "Show Table"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, table_path(conn, :create), table: @invalid_attrs
      assert html_response(conn, 200) =~ "New Table"
    end
  end

  describe "edit table" do
    setup [:create_table]

    test "renders form for editing chosen table", %{conn: conn, table: table} do
      conn = get conn, table_path(conn, :edit, table)
      assert html_response(conn, 200) =~ "Edit Table"
    end
  end

  describe "update table" do
    setup [:create_table]

    test "redirects when data is valid", %{conn: conn, table: table} do
      conn = put conn, table_path(conn, :update, table), table: @update_attrs
      assert redirected_to(conn) == table_path(conn, :show, table)

      conn = get conn, table_path(conn, :show, table)
      assert html_response(conn, 200) =~ "some updated status"
    end

    test "renders errors when data is invalid", %{conn: conn, table: table} do
      conn = put conn, table_path(conn, :update, table), table: @invalid_attrs
      assert html_response(conn, 200) =~ "Edit Table"
    end
  end

  describe "delete table" do
    setup [:create_table]

    test "deletes chosen table", %{conn: conn, table: table} do
      conn = delete conn, table_path(conn, :delete, table)
      assert redirected_to(conn) == table_path(conn, :index)
      assert_error_sent 404, fn ->
        get conn, table_path(conn, :show, table)
      end
    end
  end

  defp create_table(_) do
    table = fixture(:table)
    {:ok, table: table}
  end
end
