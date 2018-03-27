defmodule Blackjack.Game do

  def reset do
    %{
			cards: Enum.map(Enum.shuffle(["1","2","3","4","5","6","7","8","9","10","11","12","13",
                                        "14","15","16","17","18","19","20","21","22","23","24","25","26",
                                        "27","28","29","30","31","32","33","34","35","36","37","38","39",
                                        "40","41","42","43","44","45","46","47","48","49","50","51","52"]),
                                         fn(x) -> %{"character" => x} end),
      token: 1,
      tablePlayerCount: 0,
      tableMessages: [],
      winner: "",
      tableProgress: [
        %{"player" => 1, "userId"=> "", "userName"=> "-", "score" => 0, "inPlay" => "no", "cardsDealt" => []},
        %{"player" => 2, "userId"=> "", "userName"=> "-", "score" => 0, "inPlay" => "no", "cardsDealt" => []},
        %{"player" => 3, "userId"=> "", "userName"=> "-", "score" => 0, "inPlay" => "no", "cardsDealt" => []},
        %{"player" => 4, "userId"=> "", "userName"=> "-", "score" => 0, "inPlay" => "no", "cardsDealt" => []},
        %{"player" => 5, "userId"=> "", "userName"=> "-", "score" => 0, "inPlay" => "no", "cardsDealt" => []},
        %{"player" => 6, "userId"=> "", "userName"=> "-", "score" => 0, "inPlay" => "no", "cardsDealt" => []},
        %{"player" => 7, "userId"=> "", "userName"=> "-", "score" => 0, "inPlay" => "no", "cardsDealt" => []}
      ]
		}
  end

end
