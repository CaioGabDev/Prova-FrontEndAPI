import styles from "./Profile.module.css";
import Image from "next/image";
import Link from "next/link";
import Button from "../../components/Button";

export default function Profile() {
    return (    
        <div className={styles.container}>
            <div className={styles.cardCentral}>
            <h1>Estudantes e Avaliação</h1>
                <Image className={styles.avatar}
                    src="/images/avatar.png"
                    alt="Avatar"
                    width={120}
                    height={120}
                    priority 
                />
                <h2>Caio Gabriel Lacerda Silva</h2>
                <h2>Turma: 2TDS1</h2>
                <h3>Instrutores: Thiago e Marcelo</h3>
                <h3>Matéria: Front-End com Back-End</h3>
                <h4>Minha API serve para estudantes e avaliações onde eu posso ter acesso a todos
                    os dados dos estudantes e avaliações.</h4>
                <Link href="/estudantes" prefetch>
                    <Button title="Acessar minha API via NET" />
                </Link>
            </div>
        </div>
    );
}
