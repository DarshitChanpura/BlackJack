defmodule Blackjack.GamesTest do
  use Blackjack.DataCase

  alias Blackjack.Games

  describe "tables" do
    alias Blackjack.Games.Table

    @valid_attrs %{playerCount: 42, status: "some status", tableName: "some tableName"}
    @update_attrs %{playerCount: 43, status: "some updated status", tableName: "some updated tableName"}
    @invalid_attrs %{playerCount: nil, status: nil, tableName: nil}

    def table_fixture(attrs \\ %{}) do
      {:ok, table} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Games.create_table()

      table
    end

    test "list_tables/0 returns all tables" do
      table = table_fixture()
      assert Games.list_tables() == [table]
    end

    test "get_table!/1 returns the table with given id" do
      table = table_fixture()
      assert Games.get_table!(table.id) == table
    end

    test "create_table/1 with valid data creates a table" do
      assert {:ok, %Table{} = table} = Games.create_table(@valid_attrs)
      assert table.playerCount == 42
      assert table.status == "some status"
      assert table.tableName == "some tableName"
    end

    test "create_table/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Games.create_table(@invalid_attrs)
    end

    test "update_table/2 with valid data updates the table" do
      table = table_fixture()
      assert {:ok, table} = Games.update_table(table, @update_attrs)
      assert %Table{} = table
      assert table.playerCount == 43
      assert table.status == "some updated status"
      assert table.tableName == "some updated tableName"
    end

    test "update_table/2 with invalid data returns error changeset" do
      table = table_fixture()
      assert {:error, %Ecto.Changeset{}} = Games.update_table(table, @invalid_attrs)
      assert table == Games.get_table!(table.id)
    end

    test "delete_table/1 deletes the table" do
      table = table_fixture()
      assert {:ok, %Table{}} = Games.delete_table(table)
      assert_raise Ecto.NoResultsError, fn -> Games.get_table!(table.id) end
    end

    test "change_table/1 returns a table changeset" do
      table = table_fixture()
      assert %Ecto.Changeset{} = Games.change_table(table)
    end
  end
end
