"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pagination, Modal, Card, Skeleton } from "antd";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import styles from "./Estudante.module.css";

const HEADERS = { "x-api-key": process.env.NEXT_PUBLIC_API_KEY };

export default function Estudantes() {
  const [data, setData] = useState({
    estudantes: [],
    loading: true,
    current: 1,
    pageSize: 0,
  });

  const [modalInfo, setModalInfo] = useState({
    visible: false,
    estudante: null,
    avaliacao: null,
    loading: false,
  });

  useEffect(() => {
    sessionStorage.removeItem("estudantesData");
    const fetchEstudantes = async () => {
      const cached = getSessionStorage("estudantesData", []);
      if (cached.length > 0) {
        console.log("Estudantes no cache:", cached.length);
        setData({ estudantes: cached, loading: false, current: 1, pageSize: 5 });
        return;
      }

      try {
        const { data: estudantes } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/estudante`,
          {
            headers: HEADERS,
          }
        );
        setSessionStorage("estudanteData", estudantes);
        setData({ estudantes, loading: false, current: 1, pageSize: 5 });
      } catch {
        toast.error("Erro ao carregar estudantes");
        setData((d) => ({ ...d, loading: false }));
      }
    };

    fetchEstudantes();
  }, []);

  const openModal = async (estudante) => {
    setModalInfo({ visible: true, estudante, avaliacao: null, loading: true });

    const cacheKey = `avaliacao_${estudante.id}`;
    const cached = getSessionStorage(cacheKey, null);
    if (cached) {
      setModalInfo((m) => ({ ...m, avaliacao: cached, loading: false }));
      return;
    }

    try {
      const { data: avaliacao } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/avaliacao/${estudante.id}`,
        {
          headers: HEADERS,
        }
      );
      setSessionStorage(cacheKey, avaliacao);
      setModalInfo((m) => ({ ...m, avaliacao, loading: false }));
    } catch {
      toast.error("Erro ao carregar avaliação.");
      setModalInfo((m) => ({ ...m, loading: false }));
    }
  };

  const paginatedEstudante = () => {
    const start = (data.current - 1) * data.pageSize;
    return data.estudantes.slice(start, start + data.pageSize);
  };

  return (
    <div>
      <h1>Lista de Estudantes</h1>
      <Pagination
        current={data.current}
        pageSize={data.pageSize}
        total={data.estudante.length}
        onChange={(page, size) =>
          setData((d) => ({ ...d, current: page, pageSize: size }))
        }
        showSizeChanger
        pageSizeOptions={["5", "10", "100"]}
      />

      {data.loading ? (
        <Image
          src="/images/loading.gif"
          width={300}
          height={200}
          alt="Loading"
        />
      ) : (
        <div className={styles.cardsContainer}>
          {paginatedEstudantes().map((estudante) => (
            <Card
              key={estudante.id}
              className={styles.card}
              hoverable
              onClick={() => openModal(estudante)}
              cover={
                <Image
                  alt={estudante.name}
                  src={estudante.photo ? estudante.photo : "/images/220.svg"}
                  width={220}
                  height={220}
                />
              }
            >
              <Card.Meta
                title={estudante.name}
                description={estudante.numero_registro}
              />
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={`Avaliação de ${modalInfo.estudante?.name}`}
        open={modalInfo.visible}
        onCancel={() =>
          setModalInfo({
            visible: false,
            estudante: null,
            avaliacao: null,
            loading: false,
          })
        }
        onOk={() =>
          setModalInfo({
            visible: false,
            estudante: null,
            avaliacao: null,
            loading: false,
          })
        }
        width={600}
      >
        {modalInfo.loading ? (
          <Skeleton active />
        ) : modalInfo.avaliacao ? (
          <div className={styles.avaliacaoInfo}>
            <p>
              <span className={styles.label}>Nota:</span>{" "}
              {modalInfo.avaliacao.nota}
            </p>
            <p>
              <span className={styles.label}>Professor:</span>{" "}
              {modalInfo.avaliacao.professor}
            </p>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>Avaliação não encontrada.</p>
        )}
      </Modal>
      <ToastContainer position="top-right" autoClose={4500} />
    </div>
  );
}