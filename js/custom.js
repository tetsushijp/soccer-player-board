// TIPS 
// browserのwebconsoleで、プレイヤーインスタンスを操作
// g_instance_array[1].item(1).set({text:"HI"})
// g_instance_array[1].item(1).textであたいを取得
// g_instance_array[1].item(1).isPlay 試合にでているかどうかの判定
// g_instance_array[1].top = 150
// g_can.renderAll();

// 試合に出ているかどうかの判定マトリクス
// 

// 試合に出ているかの判定
function isPlayOrNot(plyr) {
  var baseFieldH = 874;
  var baseFieldStartH = 130;
  var currFieldH = $(".content").outerHeight();
  var currFieldStartH = currFieldH / baseFieldH * baseFieldStartH;
  var top = plyr.top;
  var isPlaying = top >= currFieldStartH;
  return isPlaying;
}


var g_memberAttArr = new Array(25);
function showPlayersAttendGameCount() {
  // もしも、保存されているプレイヤーの位置情報があれば、それを使って画面を描写する
  // g_gameNoArr[gameNo] にg_instance_arryの中身が入っている。
  if (JSON.parse(localStorage.getItem("playerArrayObj"))) {
    g_gameNoArr = JSON.parse(localStorage.getItem("playerArrayObj"));
  }
  // var gameNo = $('input:radio[name="gameNo"]:checked').val();

  g_memberAttArr.fill(0);
  for(var gameNo=1; gameNo<=8; gameNo ++ ) {
    for(var playerNo=0; playerNo<10; playerNo++) {
      if (g_gameNoArr[gameNo] && g_gameNoArr[gameNo][playerNo] ) {
        //console.log("player TOP:"+ g_gameNoArr[gameNo][playerNo].top );
        console.log(gameNo+","+playerNo+" isPlay:"+isPlayOrNot(g_gameNoArr[gameNo][playerNo]));
        if( isPlayOrNot(g_gameNoArr[gameNo][playerNo]) ) {
          g_memberAttArr[playerNo] = g_memberAttArr[playerNo] + 1;

        }
      }    
    }
  }
  console.log("================");
  console.log(g_memberAttArr);
}

// Drag OJBをFabric インスタンス化し配置する
function AddInstance(im, txt, x, y, size, name_updatable, idx) {
  var dragInstance;
  fabric.Image.fromURL(im, function (img) {
    // Imageの設定
    img.scale(1).set({ width: size, height: size, originX: 100, angle: 0 });
    // text追加
    var text = new fabric.Text(txt, {
      fontSize: g_icon_size / 3,
      originX: 100,
    });
    text.set({ fill: "#fff" });
    //  var circle = new fabric.Circle({radius:100, fill:"#eef",scaleY:1.1})

    // これが実際に配置さえるオブジェクト
    dragInstance = new fabric.Group([img, text], {
      left: x - (size - 50) / 2,
      top: y - (size - 50) / 2,
      angle: 0,
    });
    dragInstance.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      bl: false,
      br: false,
      tl: false,
      tr: false,
      mtr: true,
    });
    dragInstance.hasBorders = false;
    dragInstance.cornerSize = 25;
    dragInstance.cornerColor = "#EEEEEE";
    //    dragInstance.borderColor = '#FF0000';
    dragInstance.enableRetinaScaling = true;
    dragInstance.imageSmoothingEnabled = true;
    //    g_can.add(img).setActiveObject(img);
    dragInstance.lockUniScaling = true; // ピンチでresizeをさせない。
    g_can.add(dragInstance); // グローバル変数のキャンバスに配置する
    g_can.renderAll();
    g_instance = dragInstance; // just for debug
    if (name_updatable) {
      g_instance_array[idx] = dragInstance;
      // console.log("refresh_ins_arr:");
      // console.log(dragInstance.item(1));
    }
  });
}

function drawPlayers() {
  var savedMemberList = JSON.parse(localStorage.getItem("member-list"));
  if (!savedMemberList) savedMemberList = new Array(25).fill("");

  var field_padding = window.innerWidth / 10; // field_rect.height / 10; // 描画開始時のpadding
  var icon_num = 5;
  var icon_sz = Math.floor(
    (window.innerWidth - field_padding * 2) / (icon_num + 1)
  ); //サッカー場の横幅に10人並ぶぐらいの大きさ
  g_icon_size = icon_sz;
  // console.log("SSS -- Icon Size (x,y):" + icon_sz);

  var init_x = 10; //field_rect.width/2;
  var init_y = 15; // + field_padding;
  var sz = icon_sz + 10;
  var sz_y = (icon_sz * 2) / 3 + 5;
  var memImg = "img/hito_red-tate.png";

  //      for (var i in members) {
  for (var i in savedMemberList) {
    if (g_member_drawed[i]) {
      // 選手名があれば上書き、なければ削除
      if (savedMemberList[i]) {
        // 文字を上書き
        // console.log("instance i:"+i+" name:"+savedMemberList[i]);
        g_instance_array[i].item(1).set({ text: savedMemberList[i] });
        g_can.renderAll();
      } else {
        g_can.remove(g_instance_array[i]);
        g_member_drawed[i] = false;
        continue;
      }
    }
    // まだ描画されてないメンバーの場合
    if (!g_member_drawed[i] && savedMemberList[i]) {
      //      console.log("初期描画 :" + savedMemberList[i]);
      var inst_x = init_x + i * sz - Math.floor(i / icon_num) * icon_num * sz;
      var inst_y = init_y + Math.floor(i / icon_num) * sz_y;
      // もしも、保存されているプレイヤーの位置情報があれば、それを使って画面を描写する
      // g_gameNoArr[gameNo] にg_instance_arryの中身が入っている。
      if (JSON.parse(localStorage.getItem("playerArrayObj"))) {
        g_gameNoArr = JSON.parse(localStorage.getItem("playerArrayObj"));
      }
      // 常に8試合分のデータ保存ができるように保存さえていないものを初期化
      for(var lll=0; lll<9; lll++ ) {
        if(!g_gameNoArr[lll]) {
          g_gameNoArr[lll]="";
        }
      }
      var gameNo = $('input:radio[name="gameNo"]:checked').val();

      if (g_gameNoArr && g_gameNoArr[gameNo][i]) {
        inst_x = g_gameNoArr[gameNo][i].left;
        inst_y = g_gameNoArr[gameNo][i].top;
      }

      var inst = AddInstance(
        memImg,
        savedMemberList[i],
        inst_x, // init_x + i * sz - Math.floor(i / icon_num) * icon_num * sz,
        inst_y, // init_y + Math.floor(i / icon_num) * sz_y,
        icon_sz,
        true,
        i
      );
      g_member_drawed[i] = true;
    } else continue;
  } // end for
  if (!g_ball_drawed) {
    AddInstance("img/ball_big.png", "", 200, 200, icon_sz / 2, false, 21);
    g_ball_drawed = true;
  }
}

function save() {
  console.log("save");

  // member_list配列を初期化して、フォーム入力された名前を入れる
  {
    // console.log("length:" + $("#member_list").find(".player-name").length);
    var len = $("#member_list").find(".player-name").length;
    g_member_array = new Array(); // 初期化
    for (var i = 0; i < len; i++) {
      var player_name = $("#member_list").find(".player-name")[i].value;
      //console.log("player-name:" + player_name);
      g_member_array.push(player_name);
    }
    localStorage.setItem("member-list", JSON.stringify(g_member_array));
    // console.log("----- getItem --- ");
    // console.log(JSON.parse(localStorage.getItem("member-list")));
  }

  // windowを閉じて、スクロールを補正する
  {
    $("#menu-check").removeAttr("checked").prop("checked", false).change();
    window.scrollTo(0, 0);
  }

  // 新しいGameNoで再描画させるために、すべてfalseに
  g_member_drawed = new Array(20).fill(false);
  for (var i in g_instance_array) {
    // playerも書き直し
    g_can.remove(g_instance_array[i]);
  }

  // playerの名前などを上書き
  drawPlayers();
}
var cursorFocus = function (elem) {
  var x = window.scrollX,
    y = window.scrollY;
  elem.focus();
  window.scrollTo(x, y);
};

function showMemberListForm() {
  var savedMemberList = JSON.parse(localStorage.getItem("member-list"));
  if (!savedMemberList) savedMemberList = new Array(20).fill("");

  showPlayersAttendGameCount();

  $("#member_list").html("");
  for (var counter = 1; counter <= 18; counter++) {
    var newTextBoxDiv = $(document.createElement("div")).attr(
      "id",
      "TextBoxDiv" + counter
    );

    newTextBoxDiv
      .after()
      .html(
        ("00" + counter).slice(-2) +
          '.<input type="text" class="player-name" name="textbox' +
          counter +
          '" id="textbox' +
          counter +
          '" value="' +
          savedMemberList[counter - 1] +
          '" onblur="javascript:window.scrollTo(0, 0);" > ' + g_memberAttArr[counter-1] + '試合'
      );
    //    cursorFocus(newTextBoxDiv.focus);
    newTextBoxDiv.appendTo("#member_list");
  }
}

// ----------------------------------------------//
// ----------------------------------------------//
// ############# ここが最初に呼ばれる ############## //
// g_instance.item(1).set({text:'hello'});
var g_can, g_icon_size, g_instance;
var g_instance_array = new Array(26); // 25 + 1 ２１はボールよう
var g_member_array = new Array();
var g_member_drawed = new Array(25).fill(false);
var g_ball_drawed = false;
var field_rect;
//var g_gameNoArr = new Array(4);
var g_gameNoArr = new Array(8 + 1).fill(""); // 初期化 ４試合分初期化
g_gameNoArr = new Array(9);
g_gameNoArr.fill("");

var g_targetOBJ;

$(document).ready(function () {
  showMemberListForm();

  // var field_rect = document.querySelector("#fld").getBoundingClientRect()
  // $('#c').get(0).width=field_rect.width; //  1100;//$(window).width()-150;
  // $('#c').get(0).height=field_rect.height; // 700;//$(window).height()-30;
  field_rect = document.querySelector("body").getBoundingClientRect();
  $("#c").get(0).width = window.innerWidth; // field_rect.width; //  1100;//$(window).width()-150;
  $("#c").get(0).height = window.innerHeight; //field_rect.height; // 700;//$(window).height()-30;

  g_can = new fabric.Canvas("c");
  g_can.selection = false; // disable group selection

  var zidx = 100;
  g_can.on("mouse:over", function (e) {
    e.target.moveTo(zidx++);
  }); //can.renderAll();
  g_can.on("mouse:up", function (e) {
    //ここでプレーヤの位置を保存
    if (e.target) {
      console.log("mouse up:" + e.target);
      console.log(e.target);
      g_targetOBJ = e.target;

      //
      for (var i in g_instance_array) {
        var pname = g_instance_array[i].item(1).text;
        var top = g_instance_array[i].top;
        var left = g_instance_array[i].left;

        // 試合に出ているかどうかの判定。 コートの矩形の中にいるか。一旦top座標が特定の場所以下かだけ見る
        var isPlaying = isPlayOrNot(g_instance_array[i]);
        // g_instance_array[i].item(1).set({isPlay:isPlaying});
        // g_instance_array[i].isPlay = isPlaying;
        // g_can.renderAll();

        console.log("i:" + i + " name:" + pname + "(" + top + "," + left + ") - plaing? "+isPlaying);
      }
      var gameNo = $('input:radio[name="gameNo"]:checked').val();
      console.log("試合番号:" + gameNo);
      g_gameNoArr[gameNo] = g_instance_array; // 今の状態を試合noに保存
      console.log(g_gameNoArr);
      localStorage.setItem("playerArrayObj", JSON.stringify(g_gameNoArr));
      showMemberListForm();

    }
  });

  //drawPlayers();

  $(window).resize(function () {
    // console.log(" window resize Fld Ht:"+$("#fld").height());
    // console.log(" window resize CAN Ht:"+g_can.height);

    //        if (g_can.height != $("#fld").height()) {
    if (true) {
      var scaleMultiplier = $("#fld").height() / g_can.height; // TODO:調整
      var objects = g_can.getObjects();
      for (var i in objects) {
        objects[i].scaleX = objects[i].scaleX * scaleMultiplier;
        objects[i].scaleY = objects[i].scaleY * scaleMultiplier;
        objects[i].left = objects[i].left * scaleMultiplier;
        objects[i].top = objects[i].top * scaleMultiplier;
        objects[i].setCoords();
      }

      g_can.setWidth(g_can.getWidth() * scaleMultiplier);
      g_can.setHeight(g_can.getHeight() * scaleMultiplier);
      g_can.renderAll();
      g_can.calcOffset();

      // canvasサイズもリサイズ
      //                    var field_rect = document.querySelector("body").getBoundingClientRect();
      // console.log("body w:"+field_rect.width);
      // $('#c').get(0).width=field_rect.width; //  1100;//$(window).width()-150;
      // $('.upper-canvas').get(0).width=field_rect.width;
      // $('#c').get(0).height=field_rect.height; // 700;//$(window).height()-30;
      // $('.upper-canvas').get(0).width=field_rect.width;
    }
  });

  // game noを押すとすぐに消える
  $('input:radio[name="gameNo"]').on("click", function () {
    // console.log("gameno change");
    save();
  });

  // document ready end
});
// TODO:
// ----------------------------------------------------------------------------
// LocalStrageをクリアする仕組み入れる
//  localStorage.removeItem("playerArrayObj");
