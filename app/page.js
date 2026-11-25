"use client";
import { useState } from "react";

export default function HalamanSimulasi() {
  const pesanAwal = {
    role: "assistant",
    text: "Selamat siang, Dok... Maaf mengganggu waktunya. Saya membawa anak saya ke sini karena belakangan ini saya khawatir sekali dengan kondisinya. Boleh saya ceritakan keluhannya, Dok?",
  };

  const [pesan, setPesan] = useState([pesanAwal]);
  const [ketikan, setKetikan] = useState("");
  const [sedangMengetik, setSedangMengetik] = useState(false);

  async function kirimPesan(teksKirim) {
    if (!teksKirim.trim() || sedangMengetik) return;

    const riwayatBaru = [...pesan, { role: "user", text: teksKirim }];
    setPesan(riwayatBaru);
    setKetikan("");
    setSedangMengetik(true);

    try {
      const respon = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: riwayatBaru }),
      });
      const data = await respon.json();
      setPesan([...riwayatBaru, { role: "assistant", text: data.reply || data.error }]);
    } catch {
      setPesan([...riwayatBaru, { role: "assistant", text: "Gagal terhubung ke server." }]);
    } finally {
      setSedangMengetik(false);
    }
  }

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", fontFamily: "sans-serif", padding: "15px" }}>
      <div style={{ backgroundColor: "#f0f7ff", padding: "20px", borderRadius: "12px", border: "1px solid #cce3ff", marginBottom: "20px" }}>
        <small style={{ color: "#0056b3", fontWeight: "bold" }}>RSUP DR. HASAN SADIKIN BANDUNG</small>
        <h2 style={{ margin: "5px 0 10px 0", color: "#1a202c" }}>Workshop Penemuan Dini Kanker Anak bagi Tenaga Kesehatan</h2>
        <p style={{ fontSize: "14px", color: "#4a5568", margin: "0 0 15px 0" }}>
          Silakan lakukan anamnesis kepada orang tua pasien di bawah ini. Kenali tanda bahayanya, tentukan kapan harus merujuk, dan susun poin konsultasi untuk Subspesialis Hemato-Onkologi Anak.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => kirimPesan("[GANTI KASUS]")} style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e0", background: "white", cursor: "pointer" }}>
            🔄 Ganti Kasus Lain
          </button>
          <button onClick={() => kirimPesan("[EVALUASI]")} style={{ padding: "8px 12px", borderRadius: "6px", border: "none", background: "#0056b3", color: "white", cursor: "pointer" }}>
            📋 Selesai & Minta Evaluasi
          </button>
          <button onClick={() => setPesan([pesanAwal])} style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e0", background: "white", cursor: "pointer" }}>
            🗑️ Ulangi dari Awal
          </button>
        </div>
      </div>

      <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "15px", minHeight: "350px", maxHeight: "500px", overflowY: "auto", backgroundColor: "#fafafa", marginBottom: "15px" }}>
        {pesan.map((item, index) => (
          <div key={index} style={{ marginBottom: "12px", textAlign: item.role === "user" ? "right" : "left" }}>
            <div style={{
              display: "inline-block",
              padding: "10px 15px",
              borderRadius: "12px",
              maxWidth: "80%",
              textAlign: "left",
              whiteSpace: "pre-line",
              fontSize: "14px",
              lineHeight: "1.5",
              backgroundColor: item.role === "user" ? "#0056b3" : "white",
              color: item.role === "user" ? "white" : "#1a202c",
              border: item.role === "user" ? "none" : "1px solid #e2e8f0"
            }}>
              {item.text}
            </div>
          </div>
        ))}
        {sedangMengetik && <p style={{ fontSize: "13px", color: "#718096" }}>Orang tua pasien sedang mengetik...</p>}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); kirimPesan(ketikan); }} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={ketikan}
          onChange={(e) => setKetikan(e.target.value)}
          placeholder="Ketik pertanyaan Anda di sini, Dok..."
          style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e0", fontSize: "14px" }}
        />
        <button type="submit" disabled={sedangMengetik} style={{ padding: "12px 20px", borderRadius: "8px", border: "none", background: "#0056b3", color: "white", fontWeight: "bold", cursor: "pointer" }}>
          Kirim
        </button>
      </form>
    </div>
  );
}
