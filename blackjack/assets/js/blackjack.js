import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import classnames from 'classnames';
import App from './app.js';

/* referred from https://github.com/jdlehman/react-Blackjack-game/ */

export default function run_game(root,channel,userId,userName,spectator) {
  ReactDOM.render(<Blackjack channel={channel} root={root} userId={userId} userName={userName} spectator={spectator}/>, root);
}

class Blackjack extends React.Component {

  constructor(props) {
    super(props);
    //this.renderCards= this.renderCards.bind(this);
    // this.isMatch = this.isMatch.bind(this);
    // this.reset = this.reset.bind(this);
    this.channel=props.channel;
    this.updateToken = this.updateToken.bind(this);
    this.appendMessages = this.appendMessages.bind(this);
    this.userId=props.userId;
    this.userName=props.userName;
    this.spectator=props.spectator;

    this.state = {
      cards: [],
      token: 1,
      tablePlayerCount: 0,
      tableProgress:[],
      tableMessages:[],
    };

    this.channel.join()
    .receive("ok",this.createState.bind(this))
    .receive("error",resp => console.log("Error in joining!"));

    this.channel.on("update", payload=>
    { let game = payload.game;
      this.setState(game)});

    this.channel.on("reset", payload=>
      { let game = payload.game;
        this.setState(game)});


  }//constructor()

  createState(state1){

    this.setState(state1.game);

    var st = state1.game;
    var plCount = st.tablePlayerCount;


    var flag = "false";
    var tPs = st.tableProgress;

    alert(this.spectator);
    if(this.spectator != "spectator")
    {
      // JOIN the user to the table
      for(var x=0; x<7; x++){
        if(tPs[x].userId == this.userId){
          flag="true";
        }
      }
      if(flag == "false"){
        plCount = plCount + 1;
        for(var i=0; i<7; i++){
          if(tPs[i].userId == ""){
            tPs[i].userId = this.userId;
            tPs[i].userName = this.userName;
            tPs[i].inPlay = "yes";
            break;
          }
        }

      }
      st.tableMessages.push(this.userName+" has joined the table");
    }else{
      st.tableMessages.push(this.userName+" is a spectator");
    }

    this.setState({
      cards: st.cards,
      tablePlayerCount: plCount,
      tableProgress: tPs,
      token: st.token,
      tableMessages: st.tableMessages
    });

    this.channel.push("update",{game: this.state}).receive("ok",resp=>{});
    this.appendMessages(this.state);

    var cardsOfUser = [];
    var pId=0;
    for(var i=1; i<8; i++){
      //if(st.tableProgress[i].userId == this.userId){
        //alert(i);
        cardsOfUser = [];
        cardsOfUser = st.tableProgress[i-1].cardsDealt;
        pId = st.token;
        var source;
        for(var j=0; j< cardsOfUser.length; j++){
          source = "/css/"+cardsOfUser[j].character+".png";
          $(".p"+i+"-cards").prepend($('<img>',{src:source, style: "width:3.5em"}));
        }
      //}
    }



    for(var i=1; i<8; i++)
    {
      $(".players").append($('<label>',{for:i+"-player", class: "p"+i+"-names", text: st.tableProgress[i-1].userName}));
      $(".players").append('<br/>');
      $(".players").append($('<label>',{for:i+"-score", class: "p"+i+"-scores", text: st.tableProgress[i-1].score}));
    }

    //Hide Button initially
    $(".btns").hide();

    //Show buttons if token equals users Player ID

    if(this.state.tableProgress[this.state.token-1].userId == this.userId && this.spectator != "spectator"){
      $(".btns").show();
    }

  }

  render(){
    return(
      <div>
        <div className="gameImg">
          <input type="submit" id="quit-btn" className="btn btn-danger" value="Quit" onClick={(e) => this.handleQuit(this.state,e)} />
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
        <div className="messageBoard">
        </div>
      </div>
    );
  }

  handleHit(state, event)
  {
    if(state.token==0){alert("return coz no token");return;}
    //alert(state.token);
    //Hide buttons if token != user's Player ID
    // for(var i=0;i<7;i++)
    // {
    //   if(state.tableProgress[i].player != state.token){
    //     $(".btns").hide();
    //     return;
    //   }
    // }


    var cards = state.cards;
    var cardDealt = cards[0];
    var cardVal = cardDealt.character;
    var source = "/css/"+cardVal+".png";
    var playerID = state.token;
    var tP = state.tableProgress;
    var newscore = tP[playerID-1].score; // -1 because of indexing
    var flag="";//busted flag

    var tCount = state.tablePlayerCount;

    $(".p"+playerID+"-cards").prepend($('<img>',{src:source, style: "width:3.5em"}));

    if(tP[playerID - 1].inPlay == "yes"){


      state.tableMessages.push(this.userName+" called HIT");
      //add the dealt cards
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
    if(newscore>21){
      $(".btns").hide();
      tP[playerID - 1].inPlay="no";
      //tP[playerID - 1].cardDealt=[];
      //tP[playerID - 1].score=0;
      state.tableMessages.push(this.userName+" is Busted");
      tCount = tCount - 1;
      gameover = this.updateToken(state);

      if(gameover == false){
        alert("You Win! GameOver!");
        location.replace("/lobby");
      }

        flag="busted";
    }

      var updatedCards = cards.filter(function(card){
        return card.character != cardVal;
      });

      var gm = ({ cards: updatedCards,
              tableProgress: tP,
              tablePlayerCount: tCount,
              tableMessages: state.tableMessages,
              token: this.state.token,
        });

      console.log(updatedCards);
      this.channel.push("update",{game: gm}).receive("ok",resp=>{});

      //Update Scores
      for(var i=1; i<8; i++)
      {
        $(".p"+i+"-scores").text(tP[i-1].score);
      }


      if(flag=="busted"){
        alert("Busted! You Lose!!!");
        //location.reload();
      }

      this.appendMessages(this.state);



    }//handleHIT() ends

    handleStay(state,event){

      console.log(state.token);
      //Change Token
      state.tableMessages.push(this.userName+" called STAY");

      //Hide Button initially
      $(".btns").hide();


      //check if next player exists
      this.updateToken(state);

      this.appendMessages(state);

      console.log(state.token);

      console.log("---"+state.token);

      //this.channel.push("update",{game: this.state}).receive("ok",resp=>{});

      //Show buttons if token equals user's Player ID


    }//handleStay() ends

    updateToken(state){
      var nextPlayerID = state.token + 1;

      var newToken;
      var preventInfiniteCounter = 0;

      if(nextPlayerID>7)
      {
        nextPlayerID=1;

      }

      if(state.tableProgress[nextPlayerID - 1].inPlay == "yes"){
        // if(nextPlayerID>7)
        // {
        //   newToken=1;
        //   while(state.tableProgress[newToken - 1].inPlay == "no"
        //   && preventInfiniteCounter<7){
        //     newToken = newToken + 1;
        //     preventInfiniteCounter = preventInfiniteCounter+1;
        //   }
        // }
        // else{

        newToken = nextPlayerID;

        //}
      }
      else{
        preventInfiniteCounter = 0;
        newToken = nextPlayerID;

        while(state.tableProgress[newToken - 1].inPlay == "no"
        && preventInfiniteCounter<7){

          newToken = newToken + 1;
          if(newToken>7){
            newToken=1;
          }
          preventInfiniteCounter = preventInfiniteCounter+1;
        }

        if(preventInfiniteCounter==7)
        {
          // no Players in Play
          newToken=1;
          this.channel.push("reset").receive("ok",resp=>{});
          return false;
        }
    }

    var gm = ({ cards: state.cards,
            tableProgress: state.tableProgress,
            tablePlayerCount: state.tablePlayerCount,
            tableMessages: state.tableMessages,
            token: newToken,
      });

    if(gm.tableProgress[newToken-1].userId == this.userId  && this.spectator != "spectator"){
        $(".btns").show();
      }

    this.setState(gm);
    console.log("--------"+gm.token);
    this.channel.push("update",{game: gm}).receive("ok",resp=>{});

  }//updateToken Ends

  handleQuit(state,event){
    //alert(event.target.value);

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

          //this.channel.push("update",{game: state}).receive("ok",resp=>{});

          this.updateToken(state);

          this.appendMessages(this.state);
        }
      }

      location.replace("/lobby");
    }
  }

  appendMessages(state){

    $(".messageBoard").empty();
    var msgs = "";
    for(var i=0; i<state.tableMessages.length; i++){
      $(".messageBoard").append($('<p>',{style:"color:black",text: " "+this.state.tableMessages[i]}));
    }

  }

}//class ends



class CardsContainer extends React.Component {

  constructor(props) {
    super(props);
  }//const ends
  render(){
    //this.props.channel.push("update",{game: this.props.state}).receive("ok",resp=>{});
    //var cardClass="p"+this.props.state.token+"-cards";
    return(
      <div>
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
  }//render

  // setImageElement(state1){
  //   state1
  //   var divId=1;
  //   var card=state1.cards[0].character;
  // }



} // CardsContainer ENds

// class Image extends React.Component {
//
//   constructor(props) {
//     super(props);
//     this.source=props.source;
//   }//const ends
//
//   render(){
//
//     let style={
//       width: '50em',
//       marginTop: '-30em',
//       marginLeft: '800px'
//     };
//
//     return (
//       <img src={this.source} style={style}/>
//     );
//   }
//
// }//Image Ends
