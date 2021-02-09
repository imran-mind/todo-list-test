import React, { useState } from "react";
import {
  IconButton,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from '@material-ui/core/Tooltip';
import Input from '@material-ui/core/Input';
import uniqBy from 'lodash.uniqby';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';


export default function ToDoItem({item,isSubTask,todos,setTodos,
    onAddSubtask,onDeleteCall,onDeleteSubtaskCall,parentId}) {

    const [isParentEdit,setIsParentEdit] = useState(false);
    
    const [editTodo,setEditTodo] = useState('');
    const {value,id} = item;


    const findParentNode = (parentId) =>{
        return todos?.find(item=> item.id === parentId);
    }

    const updateTask = () =>{
        setIsParentEdit(false);
        const filtered = todos && todos.filter(item => item.id !== editTodo.id)
        console.log('---> before ',filtered)
        const a = editTodo ? filtered.push(editTodo) : '';
        console.log('---> ',filtered)
        const updatedTodos = uniqBy(filtered, 'id')
        // const set = new Set([...todos, editTodo]);
        setTodos && setTodos(updatedTodos)
        console.log(updatedTodos)
        setEditTodo('')
    }

    const updateSubTask = () =>{
        setIsParentEdit(false);
        console.log('click away')
        const foundParent = findParentNode(parentId);
        console.log('foundParent ',foundParent)
        const filtered = foundParent?.subtasks?.filter(item => item.id !== editTodo.id);
        
        console.log('filtered ',filtered)
        if(!filtered.length){ //if there is not sub task
            foundParent.subtasks = [editTodo]
        } else{
            console.log('else part')
            filtered?.push(editTodo);
            console.log('filtered elese',filtered)
            foundParent.subtasks = filtered
        }
        console.log(todos)
        todos.push(foundParent);
        
        const updatedTodos = uniqBy(todos, 'id')
        console.log(updatedTodos)
        setTodos && setTodos(updatedTodos)
        setEditTodo('')
    }

    const handleClickAway = () => {
        console.log('away',editTodo)
        if(isSubTask && editTodo){
            updateSubTask()
        }
        else if(editTodo){
            updateTask()
        }
    };

    

    const onDelete = (id) =>{
        console.log('on delete ',id)
        onDeleteCall(id);
    }

    const onEditTask = (parentId,id) =>{
        if(isSubTask){
            console.log('sub task edit')
            const foundParent = findParentNode(parentId)
            console.log('foundParent ',foundParent)
            const foundSubTaskNode = foundParent?.subtasks.find(item=> item.id === id);
            console.log('foundSubTaskNode ',foundSubTaskNode)
            setEditTodo(foundSubTaskNode)
            setIsParentEdit(true);
        }else{
            setIsParentEdit(true);
            const foundParent = findParentNode(id) //todos.find(item=> item.id === id);
            setEditTodo(foundParent)
        }
    }

    const setInTodos = (e) =>{
        if(isSubTask){
            const parentNode = findParentNode(parentId);
            const subTask = parentNode?.subtasks.find(item=>item.id === id);
            setEditTodo({...subTask, value: e.target.value})
        }else{
            const foundParent = todos.find(item=> item.id === id);
            setEditTodo({...foundParent, value: e.target.value})
        }
    }

    
    const handleKeyDown = (event) =>{
        if(isSubTask && event.key === 'Enter'){
            console.log('sub')
            updateSubTask()
        }
        else if (event.key === 'Enter') {
            updateTask()
        }
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
        <div className="todo__container">
            {isParentEdit ? 
                <Input
                    defaultValue={editTodo?.value}
                    style={{"width": "330px"}}
                    onChange={e=>setInTodos(e)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                /> :
                <div className={isSubTask ? "todo__itemSubtask" : "todo__item"}>
                    <ListItem key={id} role={undefined} dense button>
                        <ListItemText id={id} primary={value} />
                        <ListItemSecondaryAction>
                            {isSubTask ? '' :<Tooltip title="Add Subtask" placement="left-start">
                                <IconButton onClick={()=>onAddSubtask(id)} edge="end" aria-label="add">
                                    <AddIcon/>
                                </IconButton>
                            </Tooltip>}

                            <Tooltip  title="Edit" placement="top">
                                <IconButton edge="end" aria-label="edit" onClick={()=>{onEditTask(parentId,id)}}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" placement="right-start">
                                <IconButton onClick={()=>isSubTask ? onDeleteSubtaskCall(parentId,id) : onDelete(id)} edge="end" aria-label="comments">
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction>
                    </ListItem>
                </div>
            }
        </div>
    </ClickAwayListener>
    );
  }