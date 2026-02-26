import { useState } from "react";

export default function CompraAutoExpress() {
    const [form, setForm] = useState({
        nombre: "",
        telefono: "",
        auto: "",
        comentarios: ""
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const sendWhatsApp = (e) => {
        e.preventDefault();

        const msg = `Hola, quiero cotizar mi auto:
Nombre: ${form.nombre}
Teléfono: ${form.telefono}
Auto: ${form.auto}
Comentarios: ${form.comentarios}`;

        window.open(
            `https://wa.me/56973301653?text=${encodeURIComponent(msg)}`,
            "_blank"
        );
    };

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div style={styles.logo}>CompraAutoExpress</div>

                    <div style={styles.headerRight}>
                        <span style={{ fontWeight: 600 }}>📞 +56 9 7330 1653</span>

                        <a
                            href="https://wa.me/56973301653"
                            target="_blank"
                            rel="noreferrer"
                            style={styles.headerBtn}
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section style={styles.hero}>
                <div style={styles.heroInner}>
                    {/* Texto */}
                    <div style={styles.heroText}>
                        <h1 style={styles.title}>
                            ¡Vende tu auto <span style={styles.highlight}>HOY</span> y recibe
                            el <span style={styles.highlight}>mejor pago!</span>
                        </h1>

                        <ul style={styles.list}>
                            <li>✔ Cotización inmediata</li>
                            <li>✔ Dinero en el acto</li>
                            <li>✔ Transferencia segura</li>
                        </ul>

                        <button
                            style={styles.primaryBtn}
                            onClick={() =>
                                document
                                    .getElementById("form")
                                    .scrollIntoView({ behavior: "smooth" })
                            }
                        >
                            ¡COTIZA AHORA!
                        </button>
                    </div>

                    {/* Formulario (Above the fold) */}
                    <div id="form" style={styles.formCard}>
                        <h3>Obtén tu cotización</h3>

                        <form onSubmit={sendWhatsApp} style={styles.form}>
                            <input
                                name="nombre"
                                placeholder="Nombre"
                                onChange={handleChange}
                                required
                            />
                            <input
                                name="telefono"
                                placeholder="Teléfono"
                                onChange={handleChange}
                                required
                            />
                            <input
                                name="auto"
                                placeholder="Marca, Modelo y Año"
                                onChange={handleChange}
                                required
                            />
                            <textarea
                                name="comentarios"
                                placeholder="Comentarios"
                                onChange={handleChange}
                            />

                            <button type="submit" style={styles.whatsappBtn}>
                                Obtener Cotización por WhatsApp
                            </button>

                            <small style={{ opacity: 0.7 }}>
                                Te contactamos en minutos
                            </small>
                        </form>
                    </div>
                </div>
            </section>

            {/* BENEFICIOS RÁPIDOS */}
            <section style={styles.quickBar}>
                <div>📄 Sin trámites</div>
                <div>💰 Pago inmediato</div>
                <div>🔒 Compra segura</div>
            </section>

            {/* POR QUÉ ELEGIRNOS */}
            <section style={styles.features}>
                <h2>¿Por qué elegirnos?</h2>

                <div style={styles.grid}>
                    <div style={styles.card}>
                        <h4>⏱ Rápido y Seguro</h4>
                        <p>Compra en minutos sin complicaciones.</p>
                    </div>

                    <div style={styles.card}>
                        <h4>💰 Mejor Precio</h4>
                        <p>Evaluación profesional del mercado.</p>
                    </div>

                    <div style={styles.card}>
                        <h4>🤝 Atención Profesional</h4>
                        <p>Asesoría clara y transparente.</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={styles.footer}>
                <p>bhununezhenriquezz@gmail.com</p>
                <p>+56 9 7330 1653</p>
                <p>© 2026 CompraAutoExpress</p>
            </footer>

            {/* BOTÓN FLOTANTE WHATSAPP */}
            <a
                href="https://wa.me/56973301653"
                target="_blank"
                rel="noreferrer"
                style={styles.floating}
            >
                WhatsApp
            </a>
        </div>
    );
}

/* ================== STYLES ================== */

const styles = {
    page: {
        fontFamily: "Arial, sans-serif",
        background: "#f5f7fa"
    },

    header: {
        background: "#0d3b66",
        color: "#fff",
        padding: "12px 20px",
        position: "sticky",
        top: 0,
        zIndex: 10
    },

    headerInner: {
        maxWidth: 1100,
        margin: "auto",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        alignItems: "center"
    },

    logo: {
        fontSize: 22,
        fontWeight: "bold"
    },

    headerRight: {
        display: "flex",
        gap: 15,
        alignItems: "center"
    },

    headerBtn: {
        background: "#25D366",
        padding: "8px 14px",
        borderRadius: 6,
        color: "#fff",
        textDecoration: "none",
        fontWeight: "bold"
    },

    hero: {
        background:
            "linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600') center/cover",
        padding: "60px 20px",
        color: "#fff"
    },

    heroInner: {
        maxWidth: 1100,
        margin: "auto",
        display: "flex",
        gap: 40,
        flexWrap: "wrap",
        alignItems: "center"
    },

    heroText: {
        flex: 1,
        minWidth: 280
    },

    title: {
        fontSize: 38,
        marginBottom: 20
    },

    highlight: {
        color: "#ffc107"
    },

    list: {
        lineHeight: 1.8,
        marginBottom: 20
    },

    primaryBtn: {
        background: "#ff8c00",
        border: "none",
        padding: "14px 24px",
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        borderRadius: 6,
        cursor: "pointer"
    },

    formCard: {
        flex: 1,
        minWidth: 300,
        background: "#fff",
        color: "#333",
        padding: 25,
        borderRadius: 10,
        boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginTop: 10
    },

    whatsappBtn: {
        background: "#25D366",
        color: "#fff",
        padding: 14,
        border: "none",
        borderRadius: 6,
        fontSize: 16,
        fontWeight: "bold",
        cursor: "pointer"
    },

    quickBar: {
        background: "#e9edf2",
        display: "flex",
        justifyContent: "center",
        gap: 40,
        padding: 15,
        flexWrap: "wrap",
        fontWeight: 600
    },

    features: {
        maxWidth: 1100,
        margin: "40px auto",
        textAlign: "center",
        padding: "0 20px"
    },

    grid: {
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 20
    },

    card: {
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
        minWidth: 240
    },

    footer: {
        background: "#0d3b66",
        color: "#fff",
        textAlign: "center",
        padding: 20,
        marginTop: 40
    },

    floating: {
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "#25D366",
        color: "#fff",
        padding: "14px 18px",
        borderRadius: 50,
        fontWeight: "bold",
        textDecoration: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    }
};