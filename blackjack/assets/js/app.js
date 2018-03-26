// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"


import socket from "./socket"

import run_game from "./blackjack";

function init() {
  //$('#bodyImg').css("opacity", "0.8");
  //Modal jQuery for Landing page
  if(document.getElementById('landing-modal'))
  {
    let modal = document.getElementById('landing-modal');
    modal.style.display="none";
    //alert(modal);
    if(modal)
    {
      setTimeout(function(){
        modal.style.display = "block";
      },1000);
    }
  }
  ////////////////////////////////////////////////
  //Join Socket
  let root = document.getElementById('game');
  if(root){
    // Now that you are connected, you can join channels with a topic:
    let channel = socket.channel("games:" + window.tableId, {});
    let userId=user_id;
    let userName=user_name;
    let spectator=spectator;
    alert(spectator);
    run_game(root,channel,userId,userName,spectator);

    //$('#gameImg').css("width", "100em");
  }
  else{
    // $("#joinGame").click(function() {
    //   document.getElementById("gameLink").setAttribute("href", "/game/"+$("#playerName").val());
    //
    // });
  }

}

// Use jQuery to delay until page loaded.
$(init);
$(init_join_game);
$(init_observe_game);

function init_observe_game(){
  if(!$(".observe_button")){return;}
  $(".observe-button").click(observe_game_click);
}

function observe_game_click(ev)
{
  let btn=$(ev.target);
  let table_id=btn.data("table-id");

  window.location.href="/game/"+table_id+"/spectator";

}


function init_join_game(){
  if(!$(".join_button")){return;}
  $(".join-button").click(join_game_click);
}

function join_game_click(ev)
{
  let btn=$(ev.target);
  let table_id=btn.data("table-id");
  let table_status=btn.data("table-status");
  let table_playercount=btn.data("table-playercount");

  table_playercount=table_playercount + 1;
  let text = JSON.stringify({
    table: {
      table_id: table_id,
      table_status: table_status,
      table_playercount:  table_playercount
    }
  });

  let t2 = JSON.stringify({
    id: table_id,
    table: {
      table_id: table_id,
      table_status: table_status,
      table_playercount:  table_playercount
    }
  });
  //Update Table in Database
  $.ajax("/tablesUpdate", {
    method: "POST",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: t2,
    success: (resp) => {}
  });



  let x=0;
  $.ajax("/game/" + table_id, {
    method: "POST",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: text,
    success: (resp) => {}
  });
  window.location.href="/game/"+table_id;


}
