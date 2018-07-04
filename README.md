# React-tic-tac-toe-
tic-tac-toe的練習

好的，雖然我本來很早之前就想開始記錄自己所學的東西，不過一直都沒做，真是對自己的惰性感到絕望了。
雖然最近發生了各式各樣的事，有很多東西也不知道該怎麼做，對自己的未來也不知道該怎麼走，
不過不管怎麼樣，都得帶著樂觀的心情前進，對吧。

好了，言歸正傳，今天要看到的是一個網路前端的框架，名叫React，算是最近挺有名的東西，加上一直很想要自己搞一個網站，就決定用這個來搞了。


因為之前只寫過相關Jquery的東西，以下是幾點寫給自己的注意：
1. 在React中，所定義的class 需要 extend React.Component，反正就是繼承react內部自定義的class
2. 使用JSX語法，JSX語法可以更簡約的在React中使用。
3. 當每次網站刷新時，會去呼叫 render()中的東西，而class所需的資料，則可以存在state中，而state裡的東西及初始化則在constructor中定義
4.在創建自訂的react class，可以用這種方式傳入參數
<class
	prop1
	prop2
	prop3
/>


有關官網上的教學我這裡就不贅述，以下將解說有關額外的項目

1. Display the location for each move in the format (col, row) in the move history list.

在History list 中紀錄移動的行列位置。
這項功能還算簡單，在history 中加入的pos，儲存這一個Move所點的位置。
constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          pos:-1 
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isDesc:true,
    };
  }
並在handleClick中(每一次點擊時紀錄)，這樣就完成儲存位置的部分了。
this.setState({
      history: history.concat([
        {
          squares: squares,
          pos:i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
接下來是讓他能在顯示時，這部分很好理解，把抓出來的pos做一些處理讓他加進button的字串中。
const desc = move ?
        'Go to move #' + move +' on ('+ Math.floor(step.pos/3)+ ',' + step.pos%3 + ')':
        'Go to game start';


2. Bold the currently selected item in the move list.
讓最近選擇的item呈現粗體。
這一個挺簡單的(雖然我也是上網查)，在製作move list 的button中先檢查他是不是最新的一步(stepNumber)

 if(move==this.state.stepNumber)
       {
          return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
          );
       }
      else
      {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }

	  
3. Rewrite Board to use two loops to make the squares instead of hardcoding them
用兩個迴圈去製作回傳的table，這裡要注意的是，需要在裡面加上key 以免會出warning，雖然我不知道會出甚麼問題，不過還是注意一下吧。
這第方似乎沒有其他好講解了，網路上還有許多解法的樣子。
 render() {
    let table = [];
    for(let i=0;i<3;i++)
      {
        let child=[];
        for(let j=0;j<3;j++)
        {
          child.push(this.renderSquare(i*3+j));
        }
        table.push(<div key={i} className='board-row'>{child}</div>)
      }
      return (
      <div>
        {table}
      </div>
    );
  }
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
加一個toggle的按鈕迴轉move list
先在state裡面加個boolean去存是哪個狀態

isDesc:true,

寫一個toggle來反轉他的狀態
toggle()
  {
    this.setState({
      isDesc: !this.state.isDesc
    })
  }

接著創建一個按鈕，把toggle放進去就好。  
  
<button onClick={()=>this.toggle()}>toggle</button>

5. When someone wins, highlight the three squares that caused the win.
把獲勝的那條線highlight。
這算是我想最久的一個部分，在怎麼傳遞參數時花了很多時間，
還有這裡要注意的是，每一層傳參數都需要檢查他是不是null(有點麻煩呢...)
先是改變回傳的東西
在checkWinner中改動
不但要回傳之前的winner，順便把3個數字包起來一起傳回去。
return { winner: squares[a], line: [a, b, c] };

在 Game 的render中
const winner_list = calculateWinner(current.squares);
const winner = winner_list? winner_list.winner:null;
然後將獲得的line傳回Board然後再傳進squares
<Board
    squares={current.squares}
    onClick={i => this.handleClick(i)}
    winnerLine={winner_list? winner_list.line:null}
/>

renderSquare(i)內，在傳進下一層。
<Square
    key={i}
    value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)}
    isWinLine={this.props.winnerLine?this.props.winnerLine.includes(i):false}
/>
最後在square中判斷到底要不要加上highlight
這地方的style不知道為什麼之前的寫法不行，一定要用{{}}包起來，可能是JSX語法的問題(?)
if(props.isWinLine)
{
    return (
      <button className="square" onClick={props.onClick}  style={{color: "red"}}>
        {props.value}
      </button>
    );
    
}
return (
  <button className="square" onClick={props.onClick} >
    {props.value}
  </button>
);

6. When no one wins, display a message about the result being a draw
顯示平局。
這部分也很簡單，判斷在最後一步還沒有贏家的情況就好。

let status;
if (winner) {
  status = "Winner: " + winner;
}else {
  status = "Next player: " + (this.state.xIsNext ? "X" : "O");
  if(this.state.stepNumber==9)
  status='No One Win';
}

好的，那麼今天的介紹就到這裡為止了，本來想說簡單打一打(雖然真的只是簡單打一打)，不過還真花時間呢。



