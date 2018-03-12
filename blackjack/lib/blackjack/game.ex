defmodule Memory.Game do

  def reset do
    %{
			cards: Enum.map(Enum.shuffle(["A","B","C","D","E","F","G","H","A","B","C","D","E","F","G","H"]), fn(x) -> %{"character" => x, "flipped" => false, "matched" => false} end),
			openedCard: nil,
			matchCount: 0,
			locked: false,
			clickCount: 0,
      mismatch: nil,

		}
  end

  def update(state,id,value) do

    if (!state.locked) do

      cards = state.cards
      card = Enum.fetch!(cards, id)

      card = Map.put(card, "flipped", true)
      #IO.puts "asbdkasdkbk"



      cards = List.replace_at(cards, id, card)

      state = Map.put(state, :cards, cards)
      # IO.puts "asdklknlandsl"
      # IO.inspect state

    	count = state.clickCount

      gameState = %{
              			cards: state.cards,
              			openedCard: state.openedCard,
              			matchCount: state.matchCount,
              			locked: true,
              			clickCount: count + 1,
                    mismatch: state.mismatch
              		}

      # IO.inspect "new"
      # IO.inspect state
      #if there is an openedCard match it
      opCard = gameState.openedCard

      if (opCard != nil) do

        if (value === Map.get(opCard, "character")) do

          matchCount = Map.get(gameState, :matchCount)
          card = Map.put(card, "matched", true)
          cards = List.replace_at(cards, id, card)
          state = Map.put(state, :cards, cards)

          card1 = Enum.fetch!(cards, Map.get(opCard, "id"))
          card1 = Map.put(card1, "matched", true)
          cards = List.replace_at(cards, Map.get(opCard, "id"), card1)
          state = Map.put(state, :cards, cards)
          # IO.inspect "here"
          %{
            cards: state.cards,
            openedCard: nil,
            matchCount: matchCount + 1,
            locked: false,
            clickCount: gameState.clickCount,
            mismatch: nil
          }
        else

          #if (!Map.get(state, "mismatch")) do
    			  card = Map.put(card, "flipped", true)
            cards = List.replace_at(cards, id, card)
            state = Map.put(state, :cards, cards)

    			  card1 = Enum.fetch!(cards, Map.get(opCard, "id"))
            card1 = Map.put(card1, "flipped", true)
            cards = List.replace_at(cards, Map.get(opCard, "id"), card1)
            state = Map.put(state, :cards, cards)

            %{
              cards: state.cards,
              openedCard: nil,
              matchCount: gameState.matchCount,
              locked: true,
              clickCount: gameState.clickCount,
              mismatch: %{id1: id, id2: Map.get(opCard, "id")}
            }
          # else
          #   #:timer.sleep(1000)
          #
          #   IO.inspect state.mismatch
          #
          #
          #   card = Map.put(card, "flipped", false)
          #   cards = List.replace_at(cards, Map.get(state.mismatch, :id1), card)
          #   state = Map.put(state, :cards, cards)
          #
          #   card1 = Enum.fetch!(cards, Map.get(state.mismatch, :id2))
          #   card1 = Map.put(card1, "flipped", false)
          #   cards = List.replace_at(cards, Map.get(state.mismatch, :id2), card1)
          #   state = Map.put(state, :cards, cards)
          #   %{
          #     cards: state.cards,
          #     openedCard: nil,
          #     matchCount: gameState.matchCount,
          #     locked: false,
          #     clickCount: gameState.clickCount,
          #     mismatch: nil
          #   }
          #end

  			end
      else

        %{
    			cards: gameState.cards,
          openedCard: %{id: id, character: value},
    			matchCount: gameState.matchCount,
    			locked: false,
    			clickCount: gameState.clickCount,
          mismatch: nil
    		}
      end

    else

      %{
  			cards: state.cards,
  			openedCard: state.openedCard,
  			matchCount: state.matchCount,
  			locked: state.locked,
  			clickCount: state.clickCount,
        mismatch: state.mismatch
  		}
    end

  end

end
