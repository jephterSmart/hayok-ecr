import {Component} from 'react';

import classes from './error.module.css';
function ErrorComponent(props){
    return(
        <div className={classes.Error}>
            <p>An <strong>Error</strong> has occured due to:</p>
            <p className={classes.Red}>{props.error}</p>
        </div>
    )
}
class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false,errorState:null };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true,errorState:error };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <ErrorComponent error={this.state.errorState} />
      }
  
      return this.props.children; 
    }
  }

  export default ErrorBoundary;