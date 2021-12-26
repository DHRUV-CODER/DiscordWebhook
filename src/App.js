import SendMessage from "./components/SendMessage";
import Nav from "./components/Nav";
import "./styles/Global.css";
import { HashRouter as Router, Switch, Route} from "react-router-dom";
import Embed from "./components/Embed";

function App() {
  return (
    <Router>
      <>
        <Nav />
        <Switch>
          <Route exact path="/">
            <SendMessage/>
          </Route>
          <Route exact path="/embeds">
            <Embed/>
          </Route>
        </Switch>
      </>
    </Router>
  );
}

export default App;
