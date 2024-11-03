
import './Home.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Row from '../components/Row';
import { UseUser } from '../context/UseUser';

const url = 'http://localhost:3001';


function Home() {

  const { user } = UseUser();
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get(url)
    .then(response => {
      setTasks(response.data);
    }).catch(error => {
      alert(error.response.data.error ? error.response.data.error : error);
    });
  }, []);



  const addTask = (e) => {
    e.preventDefault();
    // const headers = { headers: { Authorization: user.token } };
    const headers = { headers: { Authorization: user.token } };
      axios.post(url + '/create', {description: task}, headers)
      .then(response => {
        setTasks([...tasks, {id: response.data.id, description: task}]);
        setTask('');
      }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error);
      });
  }

  const deleteTask = (id) => {
    const headers = { headers: { Authorization: user.token } };
    axios.delete(url + '/delete/' + id, headers)
    .then(response => {
      const withoutRemoved = tasks.filter(item => item.id !== id);
      setTasks(withoutRemoved);
    }).catch(error => {
      alert(error.response.data.error ? error.response.data.error : error);
    });
  }



  return (
    <div id="container">

      <h1>TRAHIM's Todos</h1>
      <form className='form' onSubmit={addTask}>
        <input className="input"
        type="text" 
        placeholder="Add new task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        />
        <button className="btn" onClick={addTask}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="whitesmoke" className="size-6">
          <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
        </svg>

        </button>
      </form>
      <ul className="tasks">

        {tasks.map(item => (
          <Row key={item.id} item={item} deleteTask={deleteTask} />
          

        ))}

      </ul>
      
    </div>
  );
}

export default Home;
