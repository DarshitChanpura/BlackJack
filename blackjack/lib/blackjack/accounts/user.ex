defmodule Blackjack.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset


  schema "users" do
    field :balance, :integer
    field :email, :string
    field :name, :string

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :balance, :name])
    |> validate_required([:email, :balance, :name])
  end
end
