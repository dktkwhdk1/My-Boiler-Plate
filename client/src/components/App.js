import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './views/LandingPage/LandingPage';
import LoginPage from './views/LoginPage/LoginPage';
import RegisterPage from './views/RegisterPage/RegisterPage';
import Auth from '../hoc/auth';
import Footer from './views/Footer/Footer';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path='/' component={Auth(LandingPage, null)} />
          <Route exact path='/login' component={Auth(LoginPage, false)} />
          <Route exact path='/register' component={Auth(RegisterPage, false)} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
// What is Formik, Yup?
