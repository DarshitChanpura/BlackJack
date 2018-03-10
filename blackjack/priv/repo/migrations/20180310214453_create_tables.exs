defmodule Blackjack.Repo.Migrations.CreateTables do
  use Ecto.Migration

  def change do
    create table(:tables) do
      add :tableName, :string
      add :playerCount, :integer
      add :status, :string

      timestamps()
    end

  end
end
