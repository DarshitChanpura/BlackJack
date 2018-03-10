defmodule Blackjack.Games.Table do
  use Ecto.Schema
  import Ecto.Changeset


  schema "tables" do
    field :playerCount, :integer
    field :status, :string
    field :tableName, :string

    timestamps()
  end

  @doc false
  def changeset(table, attrs) do
    table
    |> cast(attrs, [:tableName, :playerCount, :status])
    |> validate_required([:tableName, :playerCount, :status])
  end
end
