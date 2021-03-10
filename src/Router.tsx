import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MakeAppointment, NotFound, Succeed } from "./screens";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={MakeAppointment} />
        <Route path="/succeed" exact component={Succeed} />
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
