import { Box, Button, Checkbox, ListItem, TextField } from '@mui/material'
import styles from './TodoPage.module.css'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import EditIcon from '@mui/icons-material/Edit';

const TodoPage = () => {
  const {register, handleSubmit} = useForm();
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  useEffect(()=>{
    fetch('http://localhost:3000/tasks').then(response => response.json()).then(data => setTasks(data))
  }, []);
  
  const onSubmit = (data) => {
    const formData = {
      id: String(Date.now()),
      description: data.task,
      done: false
    }
    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(response => response.json()).then(formData => setTasks([...tasks, formData]))
  }
  const removeTask = (id) => () => {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE'
    }).then(() => setTasks(tasks.filter(task => task.id !== id)))
  }

  const editTask = (task) => {
    setEditingTaskId(task.id);
    setEditedTask(task.description);
  };

  const saveTask = (id) => {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description: editedTask })
    })
    .then(() => {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, description: editedTask } : task
      ));
      setEditingTaskId(null);
    });
  };

  const toggleTaskStatus = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ done: !tasks.find(task => task.id === id).done })
    });
  };
  
  return (
    <Box className={styles.app}>
      
      <Box>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField className={styles.inputField} label='Введите свою задачу' {...register('task',{required: true})}/>
          <Button className={styles.buttonField} variant='contained' type='submit'>Добавить</Button>
        </form>
      </Box>
      <Box>
        {tasks.map((task, index) => (
          <Box key={task+index} className={styles.list}>
            <ListItem className={styles.itemList}>
              {editingTaskId !== task.id ?
                <>
                  <Checkbox checked={task.done} onChange={() => toggleTaskStatus(task.id)}/>{task.description}
                </> 
                :
                <>
                  <TextField className={styles.editInput} label='Редактировать задачу' value={editedTask} onChange={(e) => setEditedTask(e.target.value)} autoFocus/>
                  <Button variant='contained' onClick={() => saveTask(task.id)}>Сохранить</Button>
                </>
              }
            </ListItem>
            <Button className={styles.removeButton} variant='outlined' color="error" onClick={removeTask(task['id'])}>Удалить</Button>
            <Button className={styles.removeButton} variant='outlined' onClick={() => editTask(task)}><EditIcon></EditIcon></Button>
          </Box>
          ))}
      </Box>
    </Box>
  )
}

export default TodoPage