import styles from '../styles/Button.module.css'

export default function Button({ title }) {
    return (
        <div className={styles.button} >
            <h3 className={styles.title}>{title}</h3>
        </div>
    );
};