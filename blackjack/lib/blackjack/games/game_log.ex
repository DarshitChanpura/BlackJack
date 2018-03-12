defmodule Blackjack.Games.GameLog do
  use Ecto.Schema
  import Ecto.Changeset


  schema "gamelog" do
    field :status, :string
    field :table_id, :id
    field :winner_id, :id

    timestamps()
  end

  @doc false
  def changeset(game_log, attrs) do
    game_log
    |> cast(attrs, [:status])
    |> validate_required([:status])
  end
end
