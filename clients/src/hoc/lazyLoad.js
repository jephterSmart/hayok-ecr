import React, {Component} from 'react';

import Spinner from '../components/UI/Spinner';

const asyncComponent = (importFunction) => {
    return class extends Component{
        state = {
            component : null
        }
        componentDidMount(){
            importFunction()
            .then(component =>{
                this.setState({component: component.default})
            })
        }
        render(){
            const C = this.state.component;
           
            return C ? <C {...this.props}/> : <Spinner /> ;
        }
    }
}
export default asyncComponent;