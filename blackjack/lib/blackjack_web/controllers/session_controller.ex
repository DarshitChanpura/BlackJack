defmodule BlackjackWeb.SessionController do
  use BlackjackWeb, :controller

  def create(conn, %{"email" => email}) do
    user = Blackjack.Accounts.get_user_by_email(email)
    if user do
      conn
      |> put_session(:user_id, user.id)
      |> put_flash(:info, "Welcome back, #{user.name}")

      # redirect to our lobby page
      |> redirect(to: "/lobby")
    else
      conn
      |> put_flash(:error, "Can't create session")
      |> redirect(to: page_path(conn, :index))
    end

  end

  def delete(conn, _params) do
    conn
    |> delete_session(:user_id)
    |> put_flash(:info, "Logged out successfully")
    |> redirect(to: page_path(conn, :index))
  end
end
