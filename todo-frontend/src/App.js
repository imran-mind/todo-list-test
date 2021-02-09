import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import TodoList from './components/TodoList';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/auth">
            <Login/>
          </Route>
          <Route exact path="/">
            <TodoList/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
