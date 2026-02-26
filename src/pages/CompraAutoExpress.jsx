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

        const mensaje = `Hola, quiero cotizar mi auto:
Nombre: ${form.nombre}
Teléfono: ${form.telefono}
Auto: ${form.auto}
Comentarios: ${form.comentarios}`;

        window.open(
            `https://wa.me/56973301653?text=${encodeURIComponent(mensaje)}`,
            "_blank"
        );
    };

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div style={styles.logo}>
                        🚗 <span style={{ color: "#ffb703" }}>CompraAutoExpress</span>
                    </div>

                    <div style={styles.headerRight}>
                        <span>📞 ¡Llámanos! +56 9 7330 1653</span>

                        <a
                            href="https://wa.me/56973301653"
                            target="_blank"
                            rel="noreferrer"
                            style={styles.whatsappTop}
                        >
                            Escríbenos por WhatsApp
                        </a>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.title}>
                        ¡Vende tu auto <span style={styles.yellow}>HOY</span> y recibe el{" "}
                        <span style={styles.yellow}>mejor pago!</span>
                    </h1>

                    <ul style={styles.list}>
                        <li>✔ Cotización Inmediata</li>
                        <li>✔ Dinero en el Acto</li>
                        <li>✔ Transferencia Segura</li>
                    </ul>

                    <button
                        style={styles.cta}
                        onClick={() =>
                            document
                                .getElementById("form")
                                .scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        ¡COTIZA AHORA!
                    </button>
                </div>
            </section>

            {/* BENEFICIOS */}
            <div style={styles.bar}>
                <div>📋 Sin Trámites Engorrosos</div>
                <div>💰 Pago al Instante</div>
                <div>🛡 Compra Segura</div>
            </div>

            {/* FORMULARIO */}
            <section id="form" style={styles.formSection}>
                <h2>Completa el formulario y obtén tu cotización al instante</h2>

                <form style={styles.form} onSubmit={sendWhatsApp}>
                    <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
                    <input name="telefono" placeholder="Teléfono" onChange={handleChange} required />
                    <input name="auto" placeholder="Marca, Modelo y Año" onChange={handleChange} required />
                    <textarea name="comentarios" placeholder="Comentarios" onChange={handleChange} />

                    <button type="submit" style={styles.whatsappBtn}>
                        Obtener Cotización por WhatsApp
                    </button>

                    <p style={styles.microcopy}>
                        Te contactaremos por WhatsApp con tu oferta de inmediato.
                    </p>
                </form>
            </section>

            {/* POR QUE ELEGIRNOS */}
            <section style={styles.features}>
                <h2>¿Por qué elegirnos?</h2>

                <div style={styles.featureGrid}>
                    <div style={styles.feature}>
                        <h4>⏱ Rápido y Seguro</h4>
                        <p>Venta en minutos, sin complicaciones.</p>
                    </div>

                    <div style={styles.feature}>
                        <h4>🤝 Mejor Precio</h4>
                        <p>Tasamos tu auto con la mejor oferta.</p>
                    </div>

                    <div style={styles.feature}>
                        <h4>👍 Atención Profesional</h4>
                        <p>Asesoría experta, trato transparente.</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={styles.footer}>
                <p>bhununezhenriquezz@gmail.com</p>
                <p>+56 9 7330 1653</p>
                <p>© 2026 CompraAutoExpress</p>
            </footer>

            {/* BOTON FLOTANTE */}
            <a
                href="https://wa.me/56973301653"
                target="_blank"
                rel="noreferrer"
                style={styles.float}
            >
                WhatsApp
            </a>
        </div>
    );
}

const styles = {
    page: { fontFamily: "Arial, sans-serif", background: "#f3f5f8" },

    header: {
        background: "#0b3a75",
        color: "#fff",
        padding: "14px 20px"
    },

    headerInner: {
        maxWidth: 1100,
        margin: "auto",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        alignItems: "center"
    },

    logo: { fontSize: 22, fontWeight: "bold" },

    headerRight: { display: "flex", gap: 15, alignItems: "center" },

    whatsappTop: {
        background: "#25D366",
        padding: "8px 14px",
        color: "#fff",
        borderRadius: 6,
        textDecoration: "none",
        fontWeight: "bold"
    },

    hero: {
        background:
            "linear-gradient(rgba(11,58,117,0.85), rgba(11,58,117,0.85)), url('/hero.jpg') center/cover",
        padding: "80px 20px",
        color: "#fff",
        textAlign: "center"
    },

    heroContent: { maxWidth: 900, margin: "auto" },

    title: { fontSize: 42, fontWeight: 700, marginBottom: 20 },

    yellow: { color: "#ffb703" },

    list: {
        listStyle: "none",
        lineHeight: 1.8,
        marginBottom: 25,
        fontSize: 18
    },

    cta: {
        background: "#ff8c00",
        border: "none",
        padding: "14px 30px",
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        borderRadius: 6,
        cursor: "pointer"
    },

    bar: {
        background: "#e6ebf1",
        display: "flex",
        justifyContent: "center",
        gap: 40,
        padding: 15,
        flexWrap: "wrap",
        fontWeight: 600
    },

    formSection: {
        maxWidth: 700,
        margin: "40px auto",
        textAlign: "center",
        padding: "0 20px"
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginTop: 20
    },

    whatsappBtn: {
        background: "#1fa855",
        color: "#fff",
        padding: 16,
        border: "none",
        borderRadius: 6,
        fontSize: 18,
        fontWeight: "bold",
        cursor: "pointer"
    },

    microcopy: { marginTop: 10, color: "#666" },

    features: {
        maxWidth: 1000,
        margin: "40px auto",
        textAlign: "center",
        padding: "0 20px"
    },

    featureGrid: {
        display: "flex",
        gap: 30,
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 20
    },

    feature: {
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        minWidth: 250
    },

    footer: {
        background: "linear-gradient(#0b3a75, #06244a)",
        color: "#fff",
        textAlign: "center",
        padding: 25,
        marginTop: 40
    },

    float: {
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "#25D366",
        color: "#fff",
        padding: "14px 18px",
        borderRadius: 50,
        fontWeight: "bold",
        textDecoration: "none",
        boxShadow: "0 6px 18px rgba(0,0,0,0.3)"
    }
};