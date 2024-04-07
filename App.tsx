import React,{useState,useEffect} from 'react';
import './App.css';
import Appbar from './components/Appbar'
import Appbar2 from './components/Appbar2'

import Button from '@mui/material/Button';
import {db} from './firebase'
import {collection,doc,setDoc,deleteDoc,addDoc,updateDoc,where,query,getDocs,} from 'firebase/firestore';
import Grid from '@mui/material/Grid';

function App() {
  const [title,setTitle]=useState("");
  const [contents,setContents]=useState("")
  const [answer,setAnswer] =useState("")
  const [textList,setTextList] =useState<any[]>([])
  const [data,setData] =useState<any[]>([])
  const [titleEdit,setTitleEdit]=useState("")
  const [contentEdit,setContentEdit]=useState("")
  const [answerEdit,setAnswerEdit]=useState("")
  const [status,setStatus]=useState(false)

  const toggleClick =(id:string)=>{
    Promise.all(data.map(async (item) => { // Promise.allを使用してPromiseを解決します。
      if(item.id===id){
        const stat={...item,status:!item.status};
        await updateDoc(doc(db,"todos",id), {
          status: !item.status // statのstatusを直接使用
        })
        return stat;
      }
      return item;
    })).then(newData => {
      setData(newData); // Promiseが全て解決された後にsetDataを呼び出します。
    })
  }

type todo={
  title:string,
  contents:string,
  answer:string,
  status:boolean
}

//初期入力用
const titleText=(e: { target: { value: React.SetStateAction<string>; }; })=>{
  setTitle(e.target.value)
}
const contentsText =(e: { target: { value: React.SetStateAction<string>; }; })=>{
  setContents(e.target.value)
}
const answerText=(e: { target: { value: React.SetStateAction<string>; }; })=>{
  setAnswer(e.target.value)
}


//編集用
const handleTitleEdit=(e: React.ChangeEvent<HTMLTextAreaElement>)=>{
  setTitleEdit(e.target.value)
}

const handleContentEdit=(e: React.ChangeEvent<HTMLTextAreaElement>)=>{
  setContentEdit(e.target.value)
}

const handleAnswerEdit=(e: React.ChangeEvent<HTMLTextAreaElement>)=>{
  setAnswerEdit(e.target.value)
}


const handleClick= async ()=>{
  if(title==""){
    alert("タイトルを入力してね");
    return false
  }else if(contents==""){
    alert("内容を入力してね")
    return false
  }else if(answer==""){
    alert("回答を入力してね")
    return false
  }
  
   const docRef= await addDoc(collection(db,"todos"),{
    title:title,
    contents:contents,
    answer:answer,
    status:"作業中"
  })

  const querySnapshot = await getDocs(collection(db,"todos"));
  
    const newData = querySnapshot.docs.map((doc) => (
    { id: doc.id, data: doc.data()}));
  setData(newData);
    };
  //addvar

useEffect(() => {
  (async()=>{
    const querySnapshot = await getDocs(collection(db,"todos"));
    const newData = querySnapshot.docs.map((doc) => (
    { id: doc.id, data: doc.data()}));
  setData(newData);
    })();
  },[]);

const deleteClick=async(id:string)=>{
  const numericId = parseInt(id, 10);
  await deleteDoc(doc(db,"todos",id));
  const deleteData = data.filter((data)=>data.id !== id);
  setData(deleteData)
  // setOpen(false);  //ダイアログの繰り返し防止
}

const editClick=async(id:string)=>{
  // idに該当する現在の項目を見つけます。
  const currentItem = data.find(item => item.id === id);
  console.log(currentItem)
  
  if (!currentItem) {
    console.error('該当する項目が見つかりません。');
    return;
  }
  
  // 現在値を基準にして、新しい値をセットします。
  const updatedTitle = titleEdit ? titleEdit : currentItem.data.title;
  const updatedContents = contentEdit ? contentEdit : currentItem.data.contents;
  const updatedAnswer = answerEdit ? answerEdit : currentItem.data.answer;

  await setDoc(doc(db,"todos", id), {
    title: updatedTitle,
    contents: updatedContents,
    answer: updatedAnswer,
    status:data
    });

  // ここでデータを再読み込みするか、stateを直接更新してUIをリフレッシュします。
};

  return (
    <div  className="App">
          <Appbar/>
        <table className="tableClass">
          <thead>
            <tr>
              <th><h1>項目</h1></th>
              <th><h1>内容</h1></th>
              <th><h1>会社回答</h1></th>
            </tr>
            </thead>
          
          <tbody>
            <tr>
          <td><textarea
            placeholder="項目名"   className="textArea"   rows={4}  cols={30}
            onChange={titleText} 
            /></td>
          <td><textarea
            placeholder="内容"     className="textArea"   rows={4} cols={50} 
            onChange={contentsText}
            /></td>
          <td><textarea
            placeholder="会社回答"  className="textArea"   rows={4} cols={50} 
            onChange={answerText}
            /></td>

          <Button className="btn" variant="contained" size="large" onClick={handleClick}>決定</Button>
          </tr>

          </tbody>
          </table>
          <div className="mapclass" >
          <Appbar2/>

            {data && (
              <div>
                {data.map((item) => (
                  <div key={item.id}>
              <h2>【{item.data.title}】{item.status==true ? "完了":"未完了" }</h2>
              <textarea 
                    className="textArea" rows={6} cols={35} defaultValue={item.data.contents} 
                    key={item.id}
                    onChange={handleContentEdit}
               />
               <textarea 
                    className="textArea" rows={6} cols={35} defaultValue={item.data.answer}
                    key={item.id}
                    onChange={handleAnswerEdit}
                />
                <div>
                  <Button size="large"
                     variant="contained"
                     color="warning"
                     onClick={()=>deleteClick(item.id)}>
                     削除
                  </Button>
                  <Button size="large"
                     variant="contained"
                     color="success"
                     onClick={()=>editClick(item.id)}>
                     変更
                  </Button>
                  
                  <Button size="large"
                    variant="contained"
                    color={status ? "secondary":"primary"}
                    onClick={()=>toggleClick(item.id)}>
                    {item.status ? "完了にする":"未完了にする" }
                  </Button>
                  </div>
                  </div>
                ))}
                
            </div>
            
            )}
            <hr color="black"></hr>
          </div>
        </div>
);
}

export default App;
