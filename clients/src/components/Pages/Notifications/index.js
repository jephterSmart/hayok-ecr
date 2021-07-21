
import {useAuthStore} from '../../../store/authStore';

import NotificationCard from '../../UI/Card/Notification';

import classes from './notifications.module.css';

const NotificationsPage = () => {
    const authStore = useAuthStore();
    const {notifications} = authStore;
    notifications.reverse();

    return(
        <div className={classes.NotificationsPage}>
            <h1>Your recent notifications</h1>
            {notifications.map(not => {
               return <NotificationCard key={not._id} notification={not} />
            })}
        </div>
    )
}

export default NotificationsPage;