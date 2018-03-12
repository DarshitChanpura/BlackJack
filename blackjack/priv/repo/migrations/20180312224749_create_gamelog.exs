defmodule Blackjack.Repo.Migrations.CreateGamelog do
  use Ecto.Migration

  def change do
    create table(:gamelog) do
      add :status, :string
      add :table_id, references(:tables, on_delete: :nothing)
      add :winner_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:gamelog, [:table_id])
    create index(:gamelog, [:winner_id])
  end
end
