import { Link} from 'react-router-dom';
import style from './HomePage.module.scss';
import Button from '../../components/Button/Button';

export default function HomePage() {

    return (
        <div className={style.container}>
            <Link to={'/test'}>
                <Button className={style.button} text='Пройти тест' onClick='' isDisabled={false}/>
            </Link>
        </div>
    )
}