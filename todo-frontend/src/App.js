import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import TodoList from './components/TodoList';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      {/* <Router>
        <Switch>
          <Route exact path="/">
            <Login/>
          </Route>
          <Route exact path="/todos">
            <TodoList/>
          </Route>
        </Switch>
      </Router> */}
      <h1>React Successfully deployed on K8s Cluster with Nginx</h1>
    </div>
  );
}

export default App;
