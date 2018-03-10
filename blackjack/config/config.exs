# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :blackjack,
  ecto_repos: [Blackjack.Repo]

# Configures the endpoint
config :blackjack, BlackjackWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "/ALAf43CMjjOhBhD232AGlB7SEtdj8a9ez3MzaEcVvwYzGSuvmYyna8o32cexnSJ",
  render_errors: [view: BlackjackWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Blackjack.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
