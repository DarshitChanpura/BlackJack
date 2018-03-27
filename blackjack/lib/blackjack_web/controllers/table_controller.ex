defmodule BlackjackWeb.TableController do
  use BlackjackWeb, :controller

  alias Blackjack.Games
  alias Blackjack.Games.Table

  def index(conn, _params) do
    tables = Games.list_tables()
    render(conn, "index.html", tables: tables)
  end

  def new(conn, _params) do
    changeset = Games.change_table(%Table{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"table" => table_params}) do
    case Games.create_table(table_params) do
      {:ok, table} ->
        conn
        |> put_flash(:info, "Table created successfully.")
        |> redirect(to: table_path(conn, :show, table))
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    table = Games.get_table!(id)
    render(conn, "show.html", table: table)
  end

  def edit(conn, %{"id" => id}) do
    table = Games.get_table!(id)
    changeset = Games.change_table(table)
    render(conn, "edit.html", table: table, changeset: changeset)
  end

  def update(conn, %{"id" => id, "table" => table_params}) do
    table = Games.get_table!(id)
    IO.inspect table_params
    case Games.update_table(table, table_params) do
      {:ok, table} ->
        conn
        |> put_flash(:info, "Table updated successfully.")
        |> redirect(to: table_path(conn, :show, table))
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", table: table, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    table = Games.get_table!(id)
    {:ok, _table} = Games.delete_table(table)

    conn
    |> put_flash(:info, "Table deleted successfully.")
    |> redirect(to: table_path(conn, :index))
  end

  def tableUpdate(conn, params) do
    #table = Games.get_table!(params.id)
    IO.inspect params
  end



end
