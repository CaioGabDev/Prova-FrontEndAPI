//"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Pagination, Modal, Card, Skeleton } from "antd";
import { getSessionStorage, setSessionStorage } from "../../utils/sessionStorage";
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
}