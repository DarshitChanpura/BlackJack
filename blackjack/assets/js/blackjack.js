import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import classnames from 'classnames';
import App from './app.js';

/* referred from https://github.com/jdlehman/react-Blackjack-game/ */

export default function run_game(root,channel,userId,userName) {
  ReactDOM.render(<Blackjack channel={channel} root={root} userId={userId} userName={userName} />, root);
}

class Blackjack extends React.Component {

  constructor(props) {
    super(props);
    //this.renderCards= this.renderCards.bind(this);
    // this.isMatch = this.isMatch.bind(this);
    // this.reset = this.reset.bind(this);
    this.channel=props.channel;
    this.updateToken = this.updateToken.bind(this);
    this.userId=props.userId;
    this.userName=props.userName;

    //console.log(this.user.id)
    this.state = {
      cards: [],
      token: 1,
      tablePlayerCount: 0,
      tableProgress:[],
    };

    this.channel.join()
    .receive("ok",this.createState.bind(this))
    .receive("error",resp => console.log("Error in joining!"));
  }//constructor()

  createState(state1){
    //console.log(state1.game.tableProgress);
    this.setState(state1.game);

    var st = state1.game;
    var plCount = st.tablePlayerCount;
    plCount = plCount + 1;

    var flag = "false";
    var tPs = st.tableProgress;
    // JOIN the user to the table
    for(var x=0; x<7; x++){
      if(tPs[x].userId == this.userId){
        flag="true";
      }
    }
    if(flag == "false"){
      tPs[plCount-1].userId = this.userId;
      tPs[plCount-1].userName = this.userName;
    }

    this.setState({
      cards: st.cards,
      tablePlayerCount: plCount,
      tableProgress: tPs,
      token: st.token
    });

    this.channel.push("update",{game: this.state}).receive("ok",resp=>{});

    var cardsOfUser = [];
    var pId=0;
    for(var i=0; i<7; i++){
      if(st.tableProgress[i].userId == this.userId){
        //alert(i);
        cardsOfUser = st.tableProgress[i].cardsDealt;
        pId = st.tableProgress[i].player;
      }
    }
    //console.log(pId);
    var source;
    for(var j=0; j< cardsOfUser.length; j++){
      source = "/css/"+cardsOfUser[j].character+".png";
      $(".p"+pId+"-cards").prepend($('<img>',{src:source, style: "width:3.5em"}));
    }

    for(var i=1; i<8; i++)
    {
      $(".players").append($('<label>',{for:i+"-player", class: "p"+i+"-names", text: this.state.tableProgress[i-1].userName}));
      $(".players").append('<br/>');
      $(".players").append($('<label>',{for:i+"-score", class: "p"+i+"-scores", text: this.state.tableProgress[i-1].score}));
    }

    //Hide Button initially
    $(".btns").hide();

    //Show buttons if token equals user's Player ID
    //  console.log("ddd");
    //console.log(this.state.tableProgress[this.state.token-1]);
    if(this.state.tableProgress[this.state.token-1].userId == this.userId){
      $(".btns").show();
    }

  }

  render(){
    return(
      <div>
      <div className="gameImg">
      <img src="/css/deck.png" className="deckImg"/>
      <div className="btns">
      <input type="submit" id="hit-btn" className="btn btn-warning" value="HIT" onClick={(e) => this.handleHit(this.state,e)} />
      &nbsp;&nbsp;&nbsp;
      <input type="submit" id="stay-btn" className="btn btn-primary" value="STAY" onClick={(e) => this.handleStay(this.state,e)} />
      </div>
      <div className="players">
      <CardsContainer channel={this.channel} state={this.state}/>
      </div>
      <input type="submit" id="quit-btn" className="btn btn-danger" value="Quit" onClick={(e) => this.handleQuit(this.state,e)} />
      </div>
      </div>
    );
  }

  handleHit(state, event)
  {
    if(state.token==0){alert("return coz no token");return;}
    alert(state.token);
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

    $(".p"+playerID+"-cards").prepend($('<img>',{src:source, style: "width:3.5em"}));

    if(tP[playerID - 1].inPlay == "yes"){


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

    if(newscore>21){
      $(".btns").hide();
      tP[playerID - 1].inPlay="no";
      //tP[playerID - 1].cardDealt=[];
      //tP[playerID - 1].score=0;
      this.setState(
        {tableProgress: tP,
          tablePlayerCount: state.tablePlayerCount - 1}
        );
        this.updateToken(state);
        this.channel.push("update",{game: this.state}).receive("ok",resp=>{});
        flag="busted";
      }else{
        this.setState(
          {tableProgress: tP}
        );
        //this.updateToken(state);
        this.channel.push("update",{game: this.state}).receive("ok",resp=>{});
      }

      var updatedCards =cards.filter(function(card){
        return card.character != cardVal;
      });

      this.setState(
        { cards: updatedCards}
      );

      this.channel.push("update",{game: this.state}).receive("ok",resp=>{});

      //Update Scores
      for(var i=1; i<8; i++)
      {
        $(".p"+i+"-scores").text(tP[i-1].score);
      }


      if(flag=="busted"){
        alert("Busted! You Lose!!!");
        //location.reload();
      }

    }//handleHIT() ends

    handleStay(state,event){
      alert(event.target.value);
      //Change Token

      //Hide Button initially
      $(".btns").hide();

      //check if next player exists
      this.updateToken(state);
      this.channel.push("update",{game: this.state}).receive("ok",resp=>{});

      //Show buttons if token equals user's Player ID
      console.log("curr table:");
      console.log(this.state.tableProgress[this.state.token-1]);
      if(this.state.tableProgress[this.state.token-1].userId == this.userId){
        $(".btns").show();
      }

    }//handleStay() ends

    updateToken(state){
      var nextPlayerID = state.token + 1;
      var newToken;
      var preventInfiniteCounter = 0;

      if(state.tableProgress[nextPlayerID - 1].inPlay == "yes"){
        if(state.token+1>7)
        {
          newToken=1;
          console.log("pehila"+this.state)
          while(this.state.tableProgress[newToken - 1].inPlay == "no"
          && preventInfiniteCounter<7){
            newToken = newToken + 1;
            preventInfiniteCounter = preventInfiniteCounter+1;
          }
        }
        else{
          newToken = this.state.token + 1;
        }
      }
      else{
        preventInfiniteCounter = 0;
        newToken = 1;
        //alert(state.tableProgress[newToken-1].inPlay);
        console.log(this.state);
        while(this.state.tableProgress[newToken - 1].inPlay == "no"
        && preventInfiniteCounter<7){
          newToken = newToken + 1;
          preventInfiniteCounter = preventInfiniteCounter+1;
        }
        if(preventInfiniteCounter>=7)
        {//alert(preventInfiniteCounter+"\t:Counter");
        newToken=0;
      }
    }

    this.setState(
      {
        token: newToken
      }
    );

  }//updateToken Ends

  cardsDealt(st){

    var cards=st.cards;
    var tableProgress=st.tableProgress;
    var token=st.token;

    //Render 2 cards

  }


}//class ends



class CardsContainer extends React.Component {

  constructor(props) {
    super(props);
  }//const ends
  render(){
    this.props.channel.push("update",{game: this.props.state}).receive("ok",resp=>{});
    var cardClass="p"+this.props.state.token+"-cards";
    return(
      <div className={cardClass}>
      </div>
    );
  }//render

  // setImageElement(state1){
  //   state1
  //   var divId=1;
  //   var card=state1.cards[0].character;
  // }



}//CardsContainer ENds

class Image extends React.Component {

  constructor(props) {
    super(props);
    this.source=props.source;
  }//const ends

  render(){

    let style={
      width: '50em',
      marginTop: '-30em',
      marginLeft: '800px'
    };

    return (
      <img src={this.source} style={style}/>
    );
  }

}//Image Ends
