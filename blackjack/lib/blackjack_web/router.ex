defmodule BlackjackWeb.Router do
  use BlackjackWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :get_current_user
    plug :fetch_flash
    #plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  def get_current_user(conn, params) do
    user_id = get_session(conn, :user_id)
    if user_id do
      user = Blackjack.Accounts.get_user!(user_id)
      assign(conn, :current_user, user)
    else
      assign(conn, :current_user, nil)
    end
  end

  scope "/", BlackjackWeb do
    pipe_through :browser # Use the default browser stack



    get "/", PageController, :index
    get "/lobby", PageController, :lobby
    post "/game/:table_id", PageController, :game
    get "/game/:table_id", PageController, :game

    resources "/users", UserController
    resources "/tables", TableController
    resources "/gamelog", GameLogController


    post "/session", SessionController, :create
    delete "/session", SessionController, :delete

  end

  # Other scopes may use custom stacks.
  # scope "/api", BlackjackWeb do
  #   pipe_through :api
  # end
end
