import Banner from '../../images/HayokBanner.png'

import classes from './home.module.css';

const Home = (props) => {
    return(
        <section className={classes.Banner} 
        style={{backgroundImage:`url(${Banner})`}}>

        </section>
    )
}
export default Home;