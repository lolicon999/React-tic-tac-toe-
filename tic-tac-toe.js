function Square(props) {
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
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinLine={this.props.winnerLine?this.props.winnerLine.includes(i):false}
      />
    );
  }

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
}

class Game extends React.Component {
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

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : 'O';
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
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  toggle()
  {
    this.setState({
      isDesc: !this.state.isDesc
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner_list = calculateWinner(current.squares);
    const winner = winner_list? winner_list.winner:null;
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move +' on ('+ Math.floor(step.pos/3)+ ',' + step.pos%3 + ')':
        'Go to game start';
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
      
    });
    if(this.state.isDesc)
    {
      moves.reverse();
    }
    
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      if(this.state.stepNumber==9)
        status='No One Win';
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winnerLine={winner_list? winner_list.line:null}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
           <button onClick={()=>this.toggle()}>toggle</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
