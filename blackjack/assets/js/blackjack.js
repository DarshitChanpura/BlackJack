import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import classnames from 'classnames';
import App from './app.js';

/* referred from https://github.com/jdlehman/react-Blackjack-game/ */

export default function run_game(root,channel,userId,userName,spectator) {
  ReactDOM.render(<Blackjack channel={channel} root={root} userId={userId} userName={userName} spectator={spectator}/>, root);
}
// main component
class Blackjack extends React.Component {

  constructor(props) {
    super(props);
    this.channel=props.channel;
    this.updateToken = this.updateToken.bind(this);
    this.appendMessages = this.appendMessages.bind(this);
    this.updateState = this.updateState.bind(this);
    this.updateChat = this.updateChat.bind(this);
    this.userId=props.userId;
    this.userName=props.userName;
    this.spectator=props.spectator;
    this.handleWin=this.handleWin.bind(this)

    this.state = {
      cards: [],
      token: 1,
      winner: "",
      tablePlayerCount: 0,
      tableProgress:[],
      tableMessages:[],
    };

    // joining the channel
    this.channel.join()
    .receive("ok",this.createState.bind(this))
    .receive("error",resp => console.log("Error in joining!"));

    // listening to incoming updates
    this.channel.on("update", payload=>
    { let game = payload.game;
      this.setState(game);
      this.updateState(payload);
    });

    this.channel.on("chats", payload=>
    {
      this.updateChat(payload.message, payload.userName);
    });

    this.channel.on("reset", payload=>
      { let game = payload.game;
        this.setState(game);
        this.updateState(payload);});


  }//constructor ends

  // initial state
  createState(state1){

    this.setState(state1.game);

    // handle table chats
    let newMsg = $("#message-input");
    newMsg.focus();
    newMsg.on('keypress', event => {
        if(event.keyCode == 13) {
          this.channel.push("chats", {userId: parseInt(this.userId), message: newMsg.val()})
          newMsg.val("");
        }
      });

    var st = state1.game;

    var flag = "false";

    // check if user joined as a spectator or player
    if(this.spectator != "spectator")
    {
      // JOIN the returning user to the table
      for(var x=0; x<7; x++){
        if(st.tableProgress[x].userId == this.userId){
          flag="true";
        }
      }
      // find a seat for the user
      if(flag == "false"){
        st.tablePlayerCount = st.tablePlayerCount + 1;
        var tableFull= "true";
        for(var i=0; i<7; i++){
          if(st.tableProgress[i].userId == ""){
            st.tableProgress[i].userId = this.userId;
            st.tableProgress[i].userName = this.userName;
            st.tableProgress[i].inPlay = "yes";
            tableFull= "false";
            break;
          }
        }
        // check if table full
        if(tableFull == "true"){
          alert("Sorry, Table Full!");
          st.tableMessages.push(this.userName+" is now as a spectator");
        }
        else{
          st.tableMessages.push(this.userName+" has joined the table");
        }
      }
    }else{
      st.tableMessages.push(this.userName+" is now as a spectator");
    }
    st.winner="";
    this.setState({
      st
    });

    this.appendMessages(this.state);
    this.channel.push("update",{game: this.state}).receive("ok",resp=>{
       this.updateState(resp);});

    // updates table events

    var cardsOfUser = [];
    var pId=0;
    var plC=0;
    for(var i=1; i<8; i++){

        //check number of Players
        if(st.tableProgress[i-1].userId != ""){
          plC = plC +1;
        }

        cardsOfUser = [];
        cardsOfUser = st.tableProgress[i-1].cardsDealt;
        pId = st.token;
        var source;
        // display cards of users
        for(var j=0; j< cardsOfUser.length; j++){
          source = "/css/"+cardsOfUser[j].character+".png";
          $(".p"+i+"-cards").prepend($('<img>',{src:source, style: "width:3.5em"}));
        }

    }

    // update the scores and usernames
    for(var i=1; i<8; i++)
    {
      $(".players").append($('<label>',{for:i+"-player", class: "p"+i+"-names", text: st.tableProgress[i-1].userName}));
      $(".players").append('<br/>');
      $(".players").append($('<label>',{for:i+"-score", class: "p"+i+"-scores", text: st.tableProgress[i-1].score}));
    }

    //Hide Button initially
    $(".btns").hide();

    // wait for other players to join
    if(plC==1){
      st.tableMessages.push("Waiting for other players to join");
      this.appendMessages(st);
    }

    // Show buttons if token equals users Player ID
    // and current user is not a spectator
    // and playerCount atleast 2
    if(this.state.tableProgress[this.state.token-1].userId == this.userId && this.spectator != "spectator" && plC > 1){
      $(".btns").show();
    }

  }

  // update the state of the game on the go
  updateState(state1){

      var st = state1.game;
      this.setState({st});

      this.appendMessages(st);

      var cardsOfUser = [];
      var pId=0;
      $(".p1-cards").empty();
      $(".p2-cards").empty();
      $(".p3-cards").empty();
      $(".p4-cards").empty();
      $(".p5-cards").empty();
      $(".p6-cards").empty();
      $(".p7-cards").empty();

      // display cards of users
      var plC = 0;
      for(var i=1; i<8; i++){
          cardsOfUser = [];
          cardsOfUser = st.tableProgress[i-1].cardsDealt;
          pId = st.token;
          var source;

          if(st.tableProgress[i-1].userId != ""){
            plC = plC + 1;
          }
          for(var j=0; j< cardsOfUser.length; j++){
            source = "/css/"+cardsOfUser[j].character+".png";
            $(".p"+i+"-cards").prepend($('<img>',{src:source, style: "width:3.5em"}));
          }
      }

      // update scores and usernames
      for(var i=1; i<8; i++)
      {
        $(".p"+i+"-names").html(st.tableProgress[i-1].userName);
        $(".p"+i+"-scores").html(st.tableProgress[i-1].score);
      }

      //Hide Button initially
      $(".btns").hide();

      // wait for other players to join
      if(plC==1){
        st.tableMessages.push("Waiting for other players to join");
        this.appendMessages(st);
      }

      // Show buttons if token equals users Player ID
      // and current user is not a spectator
      // and playerCount atleast 2
      if(st.tableProgress[st.token-1].userId == this.userId && this.spectator != "spectator" && plC > 1){
        $(".btns").show();
      }

      // check if there is a winner
      if(st.winner != ""){
        alert(st.winner+" WON!");
        this.channel.push("reset").receive("ok",resp => {this.updateState(resp);});
        alert("You are being redirected to lobby!");
        location.replace("/lobby");
        return;
      }

  }

  // handles what to do on if a player wins
  handleWin(state){
    var st=state;

    st.tableMessages.push(this.userName +" Won!");
    this.appendMessages(st);
    this.channel.push("update",{game: st}).receive("ok",resp=>{
      this.updateState(resp);});
  }

  // handles what to do on if a player clicks "HIT" button
  handleHit(state, event){
    // if there are no more players
    if(state.token==0){return;}

    var cards = state.cards;
    var cardDealt = cards[0]; // card dealt from top of the deck
    var cardVal = cardDealt.character;
    var source = "/css/"+cardVal+".png"; // the new card being dealt
    var playerID = state.token;
    var tP = state.tableProgress;
    var newscore = tP[playerID-1].score; // -1 because of indexing
    var flag="";//busted flag

    var tCount = state.tablePlayerCount;

    // show new card to user
    $(".p"+playerID+"-cards").prepend($('<img>',{src:source, style: "width:3.5em"}));

    // if the player is still in play
    if(tP[playerID - 1].inPlay == "yes"){


      state.tableMessages.push(this.userName+" called HIT");

      //add the dealt cards to players catalogue for showing on updates
      tP[playerID - 1].cardsDealt.push(cardDealt);

      // update score
      if(parseInt(cardVal)%13 >= 10 || parseInt(cardVal)%13 == 0)
      {
        newscore=newscore+10;
      }else{
        newscore = newscore + parseInt(cardVal)%13;
      }
    }
    tP[playerID - 1].score=newscore;

    var gameover = true;

    // remove the dealt card from top of the deck
    var updatedCards = cards.filter(function(card){
      return card.character != cardVal;
    });

    // check if the player is busted
    if(newscore>21){
      $(".btns").hide();
      tP[playerID - 1].inPlay="no";
      //tP[playerID - 1].cardDealt=[];
      //tP[playerID - 1].score=0;
      state.cards = updatedCards;
      state.tableMessages.push(this.userName+" is Busted");
      tCount = tCount - 1;
      state.tablePlayerCount = tCount;
      state.tableProgress = tP;

      gameover = this.updateToken(state);

      // if there are two players left
      // and one of them is Busted
      // declare other as winner
      if(gameover == false){
        this.handleWin(state);
        return;
      }

        flag="busted";
    }

    // if score is 21, then player wins
    if(newscore==21){
      state.winner = this.userName;
      this.handleWin(state);
      return;
    }

    // the new game state
    var gm = ({ cards: updatedCards,
            tableProgress: tP,
            tablePlayerCount: tCount,
            tableMessages: state.tableMessages,
            token: state.token,
            winner: state.winner,
      });

    if(flag != "busted"){
      this.channel.push("update",{game: gm}).receive("ok",resp=>{
        this.updateState(resp);});
    }

    //Update Scores of each player
    for(var i=1; i<8; i++)
    {
      $(".p"+i+"-scores").text(tP[i-1].score);
    }

    this.appendMessages(this.state);

    if(flag=="busted"){
      alert("Busted! You Lose!!!");
    }


  }//handleHIT() ends

  // handles the flow when user clicks 'STAY' button
  handleStay(state,event){

      state.tableMessages.push(this.userName+" called STAY");

      //Hide Buttons
      $(".btns").hide();

      // give token to next existing player
      this.updateToken(state);

      this.appendMessages(state);

  }//handleStay() ends

  // updates token so that server knows to which player
  // it should deal the next card

  updateToken(state){

    var nextPlayerID = state.token + 1;

    var newToken;
    var preventInfiniteCounter = 0;

    // if token increments to more than 7
    // then pass it to player-1 to form a cycle
    if(nextPlayerID>7){
      nextPlayerID=1;
    }

    // check if next player is in the game
    // if yes then pass token to next player
    // otherwise check for next possible player
    // playing in the game
    if(state.tableProgress[nextPlayerID - 1].inPlay == "yes"){
      newToken = nextPlayerID;
    }
    else{
      // to prevent the cycle from running infinite times
      preventInfiniteCounter = 0;

      newToken = nextPlayerID;

      // find next possible match to assign token
      while(state.tableProgress[newToken - 1].inPlay == "no"
      && preventInfiniteCounter<7){

        newToken = newToken + 1;
        if(newToken>7){
          newToken=1;
        }
        preventInfiniteCounter = preventInfiniteCounter+1;
      }

      // no Players in Play
      if(preventInfiniteCounter==7){
        newToken=1;
        this.channel.push("reset").receive("ok",resp=>{this.updateState(resp);});
        return false;
      }
    }

    // check if next player is the only player;
    // if so, he is the winner

    var tC=0;
    var user;
    for(var i=0; i<7; i++){
      if(state.tableProgress[i].userId != "" && state.tableProgress[i].inPlay == "yes"){
        tC = tC+1;
        user=i;
      }
    }

    // if there is only one player left
    // then he is the winner
    if(tC == 1){
      state.winner = state.tableProgress[user].userName;
      this.handleWin(state);
      return ;
    }

    // the new game state
    var gm = ({ cards: state.cards,
            tableProgress: state.tableProgress,
            tablePlayerCount: state.tablePlayerCount,
            tableMessages: state.tableMessages,
            token: newToken,
            winner: state.winner
      });

    if(gm.tableProgress[newToken-1].userId == this.userId  && this.spectator != "spectator"){
        $(".btns").show();
      }

    this.setState(gm);

    this.channel.push("update",{game: gm}).receive("ok",resp=>{this.updateState(resp);});

  }//updateToken Ends

  // handles what to do on if a player clicks "Surrender" button
  handleQuit(state,event){

    var x = confirm("Are you sure? If yes, click OK");

    if(x){
      for(var i=0; i<7; i++){
        if(state.tableProgress[i].userId == this.userId){
          state.tableMessages.push(state.tableProgress[i].userName+" quit the table");
          state.tableProgress[i].userId = "";
          state.tableProgress[i].userName = "-";
          state.tableProgress[i].inPlay = "no";
          state.tableProgress[i].score = 0;
          state.tableProgress[i].cardsDealt = [];
          state.tablePlayerCount = state.tablePlayerCount - 1;

          this.updateToken(state);

          this.appendMessages(this.state);
        }
      }

      location.replace("/lobby");
    }
  }

  // adds latest table events in the side bar
  appendMessages(state){

    $(".tableEvents").empty();
    var msgs = "";
    for(var i=0; i<state.tableMessages.length; i++){
      $(".tableEvents").append($('<p>',{style:"color:black",text: " "+this.state.tableMessages[i]}));
    }
  }

  updateChat(msg,uName){

    let newMsg = document.createElement("div");
    let chatBoard = document.getElementById("chat-messages");
    newMsg.innerHTML = `<i><b>${uName} </b></i>:
                        ${msg}<br>`;
    chatBoard.appendChild(newMsg);
    chatBoard.scrollTop = chatBoard.scrollHeight;
  }

  render(){
    return(
      <div className="row">
        <div className="col-md-10">
          <div className="gameImg">
            <input type="submit" id="quit-btn" className="btn btn-danger" value="Surrender" onClick={(e) => this.handleQuit(this.state,e)} />
            <img src="/css/deck.png" className="deckImg"/>
            <div className="btns">
              <input type="submit" id="hit-btn" className="btn btn-warning" value="HIT" onClick={(e) => this.handleHit(this.state,e)} />
              &nbsp;&nbsp;&nbsp;
              <input type="submit" id="stay-btn" className="btn btn-primary" value="STAY" onClick={(e) => this.handleStay(this.state,e)} />
            </div>
            <div className="players">
              <CardsContainer channel={this.channel} state={this.state}/>
            </div>
          </div>
        </div>
        <div className="col-md-1">
          <div className="chatBoard panel">
            <div className="panel-heading chat-heading">
              <i><strong>Chat Messages</strong></i>
            </div>
            <div id="chat-messages" className="panel-body">
            </div>
            <div className="panel-footer">
              <input type="text" id="message-input" className="form-control"
                          placeholder="Type a message…"/>
            </div>
          </div>
          <br/>
          <div className="messageBoard panel">
            <div className="panel-heading messageboard-heading">
              <i><strong>Table Events</strong></i>
            </div>
            <div className="tableEvents panel-body">
            </div>
          </div>
        </div>
      </div>
    );
  }

}//component ends


// component within which cards are being displayed

class CardsContainer extends React.Component {

  constructor(props) {
    super(props);
  }
  render(){
    return(
      <div id="cardCon">
        <div className="p1-cards">
        </div>
        <div className="p2-cards">
        </div>
        <div className="p3-cards">
        </div>
        <div className="p4-cards">
        </div>
        <div className="p5-cards">
        </div>
        <div className="p6-cards">
        </div>
        <div className="p7-cards">
        </div>
      </div>
    );
  }

} // component ends
