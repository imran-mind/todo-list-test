import React,{useState,useEffect,useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ToDoItem from './TodoItem';
import Input from '@material-ui/core/Input';
import {Link} from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import {config} from './config';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
}));

function TodoList() {
    const classes = useStyles();

    const [todos, setTodos] = useState([])
    const [todoItem,setTodoItem] = useState('')

    const createUpdateTodo = async (id,parentobj) =>{
        if(id || parentobj){
            const path = id ? `${config.todosUrl}/${id}`: config.todosUrl;
            console.log(' path => ',path)
            const response = await fetch(path,{
                method: id ? 'PUT' :'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(id ? parentobj : todoItem) 
            })
            const data = await response.json()
            console.log('create todo res ',data)
        }
    }

    const deleteTodo = async (id) =>{
        const path = `${config.todosUrl}/${id}`;
        const response = await fetch(path,{
            method:'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            // body: JSON.stringify(id ? parentobj : todoItem) 
        })
        const data = await response.json()
        console.log('create todo res ',data)
    }

    

    const fetchTodos =async () =>{
        const response = await fetch(config.todosUrl,{
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        })
        const res = await response.json()
        const {data} = res;
        console.log('updated data',data)
        if(data?.length){
            setTodos(data);
        }else{
            setTodos([])
        }
    }

    useEffect(()=>{
        fetchTodos()
    },[])

    const setInTodos = (e) =>{
        const todoObj = {
            id:uuidv4(),
            value:e.target.value,
            subtasks: [
            ]
        }
        setTodoItem(todoObj)
    }

    
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && todoItem) {
            createUpdateTodo(false,todoItem);
            fetchTodos()
            const todoObj = {
                id:uuidv4(),
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
        deleteTodo(id);
        setTimeout(()=>{
            fetchTodos();
        },500)
        // const filteredList = todos.filter(item=> item.id !== id);
        // console.log(filteredList)
        // setTodos(filteredList)
    }

    const onDeleteSubtaskCall = (parentId,subtaskId)=>{
        const foundParent = todos.findIndex(item=> item.id === parentId);
        const parent = todos[foundParent];
        const filteredSubtask = parent && parent.subtasks.filter(item=> item.id !== subtaskId)
        parent.subtasks = filteredSubtask;
        createUpdateTodo(parentId,parent);
        setTimeout(()=>{
            fetchTodos();
        },500)
        // const set = new Set([...todos,parent]);
        // setTodos([...set])
    }

    const onAddSubtask = (parentId)=>{
        const todo = prompt("Please enter your subtask", "");
        if (todo) {
            const todoObj = {
                id:uuidv4(),
                value: todo
            }
            const foundParent = todos.findIndex(item=> item.id === parentId);
            const parent = todos[foundParent];
            parent && parent.subtasks.push(todoObj);
            createUpdateTodo(parentId,parent);
            setTimeout(()=>{
                fetchTodos();
            },500)
        }
    }
    
    const onLogout = (e) =>{
        localStorage.removeItem('token');
    }

    const updateTodoTask= (editTodo) =>{
        if(editTodo){
            console.log(' parentId,editTodo ',editTodo?.id,editTodo)
            createUpdateTodo(editTodo?.id,editTodo);
            setTimeout(()=>{
                fetchTodos();
            },500)
        }
    }

    const TodoListMemo = useMemo(()=> { 
        return <List className={classes.root} id="container">
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
                                updateTodoTask= {updateTodoTask}
                            />
                            {
                                (item.subtasks && item.subtasks.length) ? 
                                    item.subtasks.map((subtask)=>{  
                                        return subtask ? (<div className="todo_subtask" key={subtask.id} >
                                                <ToDoItem
                                                    isSubTask={true}
                                                    parentId={item.id}
                                                    item={subtask}
                                                    key={subtask.id}
                                                    todos= {todos}
                                                    setTodos={setTodos}
                                                    updateTodoTask= {updateTodoTask}
                                                    onDeleteSubtaskCall={onDeleteSubtaskCall}
                                                /> 
                                        </div>): null
                                }): <div></div>
                            }
                        </div>
                    );
                })}
        </List>; 
    }, [todos])

    return (
        <div className="todo_list">
            <div className="todo_header">
                <h1>Todo App</h1>
                <Link to="/" onClick={()=>onLogout()}>Logout</Link>
            </div>
            <div className="todo__input">
                <Input
                    disableUnderline={true}
                    value={todoItem?.value}
                    placeholder={"Please Enter Todo Task"}
                    style={{"width": "330px"}}
                    onChange={e=>setInTodos(e)}
                    onKeyDown={handleKeyDown}
                />
                {TodoListMemo}
            </div>
        </div>
    )

}

export default TodoList
