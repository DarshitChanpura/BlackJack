import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import classnames from 'classnames';
import App from './app.js';

/* referred from https://github.com/jdlehman/react-Blackjack-game/ */

export default function run_game(root,channel) {
  ReactDOM.render(<Blackjack channel={channel} root={root}/>, root);
}

class Blackjack extends React.Component {

  constructor(props) {
    super(props);
     //this.renderCards= this.renderCards.bind(this);
    // this.isMatch = this.isMatch.bind(this);
    // this.reset = this.reset.bind(this);
    this.channel=props.channel;

    this.state = {
      cards: [],
      token: 1,
      tableProgress:[],
    };

    this.channel.join()
                      .receive("ok",this.createState.bind(this))
                      .receive("error",resp => console.log("Error in joining!"));
  }//constructor()

createState(state1){
  //console.log(state1.game);
  this.setState(state1.game);
}

  render(){
    return(
    <div>

      <div className="gameImg">
        <div className="btns">
          <input type="submit" id="hit-btn" className="btn btn-warning" value="HIT" onClick={(e) => this.handleHit(this.state,e)} />
          &nbsp;&nbsp;&nbsp;
          <input type="submit" id="stay-btn" className="btn btn-primary" value="STAY" onClick={(e) => this.handleStay(this.state,e)} />
        </div>
        <div>
        <CardsContainer channel={this.channel} state={this.state}/>
        </div>
      </div>
    </div>
  );
  }

  handleHit(state, event){

  var cards = state.cards;
  var cardDealt = cards[0];
  var cardVal = cardDealt.character;
  var source = "/css/"+cardVal+".png";
  var playerID = this.state.token;
  var tP = this.state.tableProgress;
  var newscore = tP[playerID-1].score; // -1 because of indexing

  $(".p"+playerID+"-cards").prepend($('<img>',{src:source, style: "width:3.5em"}));

  //add the dealt cards
  tP[playerID - 1].cardsDealt.push(cardDealt);

  // update score
  if(parseInt(cardVal)%13 >= 10 || parseInt(cardVal)%13 == 0)
  {
    alert(parseInt(cardVal));
    newscore=newscore+10;
  }else{
    newscore = newscore + parseInt(cardVal)%13;
  }
  tP[playerID - 1].score=newscore;

  var updatedCards = this.state.cards.filter(function(card){
    return card.character != cardVal;
  });

  console.log(tP);
  this.setState(
    { cards: updatedCards,
      tableProgress: tP}
  );

  }//handleHIT() ends

  handleStay(state,event){
    alert(event.target.value);
    //Change Token

    //check if next player exists
    var nextPlayerID = this.state.token + 1;

    var newToken;

    if(state.tableProgress[nextPlayerID - 1].inPlay == "yes"){
      if(state.token+1>7)
      {
       newToken=1;
      }
      else{
        newToken = this.state.token + 1;
      }
    }
    else{
      newToken = 1;
    }

    this.setState(
      {
        token: newToken
      }
    );

  }//handleStay() ends

  cardsDealt(st){

    var cards=st.cards;
    var tableProgress=st.tableProgress;
    var token=st.token;

    //Render 2 cards

  }


}//class endsS



class CardsContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state=props.state;

  }//const ends

  render(){

    var cardClass="p"+this.state.token+"-cards";

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
      marginTop: '170px',
      marginLeft: '800px'
  };

  return (
    <img src={this.source} style={style}/>
  );
}

}//Image Ends
