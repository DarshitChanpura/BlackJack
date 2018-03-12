defmodule Blackjack.Games do
  @moduledoc """
  The Games context.
  """

  import Ecto.Query, warn: false
  alias Blackjack.Repo

  alias Blackjack.Games.Table

  @doc """
  Returns the list of tables.

  ## Examples

      iex> list_tables()
      [%Table{}, ...]

  """
  def list_tables do
    Repo.all(Table)
  end

  @doc """
  Gets a single table.

  Raises `Ecto.NoResultsError` if the Table does not exist.

  ## Examples

      iex> get_table!(123)
      %Table{}

      iex> get_table!(456)
      ** (Ecto.NoResultsError)

  """
  def get_table!(id), do: Repo.get!(Table, id)

  @doc """
  Creates a table.

  ## Examples

      iex> create_table(%{field: value})
      {:ok, %Table{}}

      iex> create_table(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_table(attrs \\ %{}) do
    %Table{}
    |> Table.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a table.

  ## Examples

      iex> update_table(table, %{field: new_value})
      {:ok, %Table{}}

      iex> update_table(table, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_table(%Table{} = table, attrs) do
    table
    |> Table.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Table.

  ## Examples

      iex> delete_table(table)
      {:ok, %Table{}}

      iex> delete_table(table)
      {:error, %Ecto.Changeset{}}

  """
  def delete_table(%Table{} = table) do
    Repo.delete(table)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking table changes.

  ## Examples

      iex> change_table(table)
      %Ecto.Changeset{source: %Table{}}

  """
  def change_table(%Table{} = table) do
    Table.changeset(table, %{})
  end

  alias Blackjack.Games.GameLog

  @doc """
  Returns the list of gamelog.

  ## Examples

      iex> list_gamelog()
      [%GameLog{}, ...]

  """
  def list_gamelog do
    Repo.all(GameLog)
  end

  @doc """
  Gets a single game_log.

  Raises `Ecto.NoResultsError` if the Game log does not exist.

  ## Examples

      iex> get_game_log!(123)
      %GameLog{}

      iex> get_game_log!(456)
      ** (Ecto.NoResultsError)

  """
  def get_game_log!(id), do: Repo.get!(GameLog, id)

  @doc """
  Creates a game_log.

  ## Examples

      iex> create_game_log(%{field: value})
      {:ok, %GameLog{}}

      iex> create_game_log(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_game_log(attrs \\ %{}) do
    %GameLog{}
    |> GameLog.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a game_log.

  ## Examples

      iex> update_game_log(game_log, %{field: new_value})
      {:ok, %GameLog{}}

      iex> update_game_log(game_log, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_game_log(%GameLog{} = game_log, attrs) do
    game_log
    |> GameLog.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a GameLog.

  ## Examples

      iex> delete_game_log(game_log)
      {:ok, %GameLog{}}

      iex> delete_game_log(game_log)
      {:error, %Ecto.Changeset{}}

  """
  def delete_game_log(%GameLog{} = game_log) do
    Repo.delete(game_log)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking game_log changes.

  ## Examples

      iex> change_game_log(game_log)
      %Ecto.Changeset{source: %GameLog{}}

  """
  def change_game_log(%GameLog{} = game_log) do
    GameLog.changeset(game_log, %{})
  end
end
