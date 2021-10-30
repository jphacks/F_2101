import React, { useState, useEffect } from 'react'; // 修正
import './App.css';
import Todo from './pages/Todo';
import styled from 'styled-components';
import firebase from 'firebase'; // 追記
import 'firebase/firestore'; // 追記

// カレンダー入力用
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";


function App() {

  // 第１変数がstate, 第２変数がstateを変化させる関数
  const [input, setInput] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [finishedList, setFinishedList] = useState([]);
  // Loadingを判定する変数
  const [isLoading, setIsLoading] = useState(true);
  // 未完了のTodoが変化したかを監視する変数
  const [isChangedTodo, setIsChangedTodo] = useState(false);
  // 完了済みのTodoが変化したかを監視する変数
  const [isChangedFinished, setIsChangedFinished] = useState(false);

  const [input_cost, setInputCost] = useState('');
  const [kind_time, setKindTime] = React.useState('react');
  const [input_time, setInputTime] = useState('');


  const db = firebase.firestore(); // 追記

  // カレンダー入力用
  registerLocale("ja", ja);
  const initialDate = new Date()
  const [startDate, setStartDate] = useState(initialDate)
  const handleChange = (date) => {
    setStartDate(date)
  }

  // 追記 一番最初にfirestoreからデータを取ってきてstateに入れる
  useEffect(() => {
    (async () => {
      const resTodo = await db.collection("todoList").doc("todo").get();
      // stateに入れる
      setTodoList(resTodo.data().tasks);
      const resFinishedTodo = await db.collection("todoList").doc("finishedTodo").get();
      // stateに入れる
      setFinishedList(resFinishedTodo.data().tasks);
      // Loading終了
      setIsLoading(false);
    })()
  }, [db])

  useEffect(() => {
    if (isChangedTodo) {
      (async () => {
        // 通信をするのでLoadingをtrue
        setIsLoading(true)
        const docRef = await db.collection('todoList').doc('todo');
        docRef.update({ tasks: todoList })
        // Loading終了
        setIsLoading(false)
      })()
    }
  }, [todoList, isChangedTodo, db])

  useEffect(() => {
    if (isChangedFinished) {
      (async () => {
        // 通信をするのでLoadingをtrue
        setIsLoading(true)
        const docRef = await db.collection('todoList').doc('finishedTodo');
        docRef.update({ tasks: finishedList })
        // Loading終了
        setIsLoading(false)
      })()
    }
    setIsChangedFinished(false)
  }, [db, finishedList, isChangedFinished])

  const addTodo = async () => {
    if (!!(input && input_cost)) {
      // 追記 Todoが変化したのでtrue
      setIsChangedTodo(true);
      var info_all = input+','+input_cost;
      setTodoList([...todoList, input, input_cost, info_all]);
      setInput('');
      setInputCost('');
    }
  }

  const deleteTodo = (index) => {
    // 追記 Todoが変化したのでtrue
    setIsChangedTodo(true);
    setTodoList(todoList.filter((_, idx) => idx !== index))
  }

  const deleteFinishTodo = (index) => {
    // 追記 完了済みTodoが変化したのでtrue
    setIsChangedFinished(true);
    setFinishedList(finishedList.filter((_, idx) => idx !== index))
  }

  const finishTodo = (index) => {
    // 追記 Todo、完了済みTodoがともに変化したのでtrue
    setIsChangedTodo(true);
    setIsChangedFinished(true);
    deleteTodo(index)
    setFinishedList([...finishedList,todoList.find((_, idx) => idx === index)])
  }

  const reopenTodo = (index) => {
    // 追記 Todo、完了済みTodoがともに変化したのでtrue
    setIsChangedTodo(true);
    setIsChangedFinished(true);
    deleteFinishTodo(index)
    setTodoList([...todoList,finishedList.find((_, idx) => idx === index)])
  }

  return (
    <div className="App">
      <Title><center>Find My "KOSUPA"</center></Title>
      <Background>
        <p>
          商品名：
          <input onChange={(e) => setInput(e.target.value)} value={input}/>
        </p>
        <p>
          買ったときの価格：
          <input onChange={(e) => setInputCost(e.target.value)} value={input_cost}/>
          円
        </p>

        <div>
          <p>
            購入日：
            <DatePicker
              dateFormat="yyyy/MM/dd"
              locale="ja"
              onChange={handleChange}
              placeholderText="購入日を選択してください"
              selected={startDate}
              //minDate={Today}
            />
          </p>
        </div>

        <div>
          頻度：
          <select value={kind_time} onChange={(e) => setKindTime(e.target.value)}>
            <option value="year">年</option>
            <option value="month">月</option>
            <option value="week">週</option>
          </select>
          に
          <input onChange={(e) => setInputTime(e.target.value)} style={{width: "20px"}} value={input_time}/>
          回
        </div>
        

        <div>
          <p>
            <button onClick={() => addTodo()}>決定</button>
          </p>
        </div>
      </Background>
      
      {isLoading ? 
        <Loading>Loading List</Loading>
      :
        <TodoContainer>
        {/* todoListという変数とdeleteTodoという関数をpropsとしてTodoコンポーネントに渡している*/}
          <SubContainer>
            <SubTitle>未完了</SubTitle>
            <Todo todoList={todoList} deleteTodo={deleteTodo} changeTodoStatus={finishTodo} type="todo"/>
          </SubContainer>
          <SubContainer>
            <SubTitle>完了済み</SubTitle>
            <Todo todoList={finishedList} deleteTodo={deleteFinishTodo} changeTodoStatus={reopenTodo} type="done"/>
          </SubContainer>
        </TodoContainer>
      }
      
    </div>
  );
};



export default App;


const Title = styled.p`
  font-size: 26px;
  color: #0097a7;
  letter-spacing: 2.8px;
  font-weight: 500;
  width: 500px;
`;

const SubTitle = styled.p`
  font-size: 22px;
  color: #5c5c5c;
`;

const SubContainer = styled.div`
  width: 400px;
`;

const TodoContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  margin: 0 auto;
  justify-content: space-between;
`;

const Loading = styled.div`
  margin: 40px auto;
`;

const Background = styled.div`
  width: 500px;
  background-color: rgba(0, 255, 100, 0.5);
`;