import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ToDoItem from './TodoItem';
import Input from '@material-ui/core/Input';

let id = 3;
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
}));

function TodoList() {
    const classes = useStyles();

    const [todos, setTodos] = 
        useState([
            {id:1,value: "hello",subtasks:[]},
            {id:2,value: "world",subtasks:[]}]
        )
    const [todoItem,setTodoItem] = useState('')
    
    const setInTodos = (e) =>{
        const todoObj = {
            id:id,
            value:e.target.value,
            subtasks: [
            ]
        }
        setTodoItem(todoObj)
        id++;
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && todoItem) {
          const newItems = [...todos,todoItem];
          console.log('--newItems ',newItems)
          setTodos(newItems)
          const todoObj = {
            id:id,
            value:'',
            subtasks: [
            ]
        }
          setTodoItem(todoObj)
        }
    }
    
    // delete parent todo item
    const onDeleteCall = (id) =>{
        console.log('TodoList ',id)
        const filteredList = todos.filter(item=> item.id !== id);
        console.log(filteredList)
        setTodos(filteredList)
    }

    const onDeleteSubtaskCall = (parentId,subtaskId)=>{
        const foundParent = todos.findIndex(item=> item.id === parentId);
        const parent = todos[foundParent];
        const filteredSubtask = parent && parent.subtasks.filter(item=> item.id !== subtaskId)
        parent.subtasks = filteredSubtask;
        const set = new Set([...todos,parent]);
        setTodos([...set])
    }

    const onAddSubtask = (parentId)=>{
        const todo = prompt("Please enter your subtask", "");
        if (todo) {
            const todoObj = {
                id:id++,
                value: todo
            }
            const foundParent = todos.findIndex(item=> item.id === parentId);
            const parent = todos[foundParent];
            parent && parent.subtasks.push(todoObj);
            const set = new Set([...todos,parent]);
            setTodos([...set])
        }
    }

    

    return (
        <div className="todo_list">
            <h1>Todo App</h1>
            <div className="todo__input">
                <Input
                    disableUnderline={true}
                    value={todoItem?.value}
                    placeholder={"Please Enter Todo Task"}
                    style={{"width": "330px"}}
                    onChange={e=>setInTodos(e)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <List className={classes.root} id="container">
                {todos.map((item) => {
                    return (
                        <div key={item.id} className="todo_task" >
                            <ToDoItem
                                item={item}
                                key={item.id}
                                onDeleteCall={onDeleteCall}
                                onAddSubtask={onAddSubtask}
                                todos= {todos}
                                setTodos={setTodos}
                            />
                            {
                                (item.subtasks && item.subtasks.length) ? 
                                    item.subtasks.map((subtask)=>{   
                                        return (<div className="todo_subtask" key={subtask.id+1} >
                                                <ToDoItem
                                                    isSubTask={true}
                                                    parentId={item.id}
                                                    item={subtask}
                                                    key={subtask.id}
                                                    todos= {todos}
                                                    setTodos={setTodos}
                                                    onDeleteSubtaskCall={onDeleteSubtaskCall}
                                                /> 
                                            </div>
                                        )
                                }): <div></div>
                            }
                        </div>
                    );
                })}
            </List>
        </div>
    )

}

export default TodoList
