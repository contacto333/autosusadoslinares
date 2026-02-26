import React, { useState } from "react";
import { Phone, MessageCircle, Check, ClipboardList, Banknote, ShieldCheck, Clock, Handshake, ThumbsUp, Mail } from 'lucide-react';

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
        const mensaje = `Hola, quiero cotizar mi auto:\nNombre: ${form.nombre}\nTeléfono: ${form.telefono}\nAuto: ${form.auto}\nComentarios: ${form.comentarios}`;
        window.open(`https://wa.me/56973301653?text=${encodeURIComponent(mensaje)}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">

            {/* 1. Header */}
            <header className="bg-gradient-to-r from-[#0b3a75] to-[#124d9c] text-white py-3 shadow-md relative z-20">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">

                    {/* Logo Section */}
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-300 fill-blue-500">
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                            <circle cx="7" cy="17" r="2" />
                            <path d="M9 17h6" />
                            <circle cx="17" cy="17" r="2" />
                        </svg>
                        <span className="text-2xl font-black italic tracking-tight">
                            CompraAuto<span className="text-[#ffb703]">Express</span>
                        </span>
                    </div>

                    {/* Contact Section */}
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2">
                            <Phone className="h-5 w-5 text-current" />
                            <span className="font-bold text-lg">¡Llámanos! <span className="font-black">+56 9 7330 1653</span></span>
                        </div>
                        <a
                            href="https://wa.me/56973301653"
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#218c34] hover:bg-[#1b7a2b] bg-gradient-to-b from-[#25d366] to-[#1b8c3f] text-white text-sm font-bold py-2 px-4 shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center rounded-sm"
                        >
                            Escríbenos por WhatsApp
                        </a>
                    </div>
                </div>
            </header>

            {/* 2. Hero Section */}
            <section className="relative w-full overflow-hidden min-h-[450px] flex items-center border-b-[8px] border-white z-10">
                {/* Background Image Setup */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
                        }}
                    ></div>
                    {/* The specific gradient overlay from the image */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#031b3e]/90 via-[#031b3e]/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#154687]/40 to-transparent"></div>
                </div>

                <div className="max-w-6xl mx-auto px-4 w-full relative z-10 pt-8 pb-16">
                    <div className="max-w-xl">
                        {/* Orange banner-like background behind title text as seen in reference */}
                        <div className="inline-block bg-[#0f3460]/60 backdrop-blur-sm p-4 rounded-lg mb-6 shadow-xl border border-white/10">
                            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
                                ¡Vende tu auto <span className="text-[#ffb703]">HOY</span> y recibe el <span className="text-[#ffb703]">mejor pago!</span>
                            </h1>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {["Cotización Inmediata", "Dinero en el Acto", "Transferencia Segura"].map((text, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-white text-xl font-bold drop-shadow-md">
                                    <div className="text-[#ff8c00]">
                                        <Check className="h-6 w-6 stroke-[4]" />
                                    </div>
                                    {text}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => document.getElementById("form").scrollIntoView({ behavior: "smooth" })}
                            className="bg-gradient-to-b from-[#ffb703] to-[#e67e22] text-white font-black py-3 px-8 rounded shadow-[0_4px_6px_rgba(0,0,0,0.4)] hover:brightness-110 active:translate-y-0.5 transition-all text-xl"
                        >
                            ¡COTIZA AHORA!
                        </button>
                    </div>
                </div>

                {/* Optional decorative car overlay for desktop (simulating the cars in the image) */}
                <div className="hidden lg:block absolute right-0 bottom-[-20px] w-1/2 max-w-2xl z-10">
                    <img
                        src="https://www.pngmart.com/files/10/White-SUV-Car-PNG-Transparent-Image.png"
                        alt="Autos"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                    />
                </div>
            </section>

            {/* 3. Trust Bar */}
            <div className="bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] border-y border-gray-300 shadow-inner z-20 relative">
                <div className="max-w-5xl mx-auto px-4 py-3">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16">
                        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                            <div className="text-gray-600">
                                <ClipboardList className="h-8 w-8" />
                            </div>
                            <span className="font-bold text-[#1a365d] text-lg">Sin Trámites Engorrosos</span>
                        </div>
                        <div className="hidden md:block w-px h-10 bg-gray-300"></div>
                        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                            <div className="text-green-600">
                                <Banknote className="h-8 w-8" />
                            </div>
                            <span className="font-bold text-[#1a365d] text-lg">Pago al Instante</span>
                        </div>
                        <div className="hidden md:block w-px h-10 bg-gray-300"></div>
                        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                            <div className="text-teal-600">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <span className="font-bold text-[#1a365d] text-lg">Compra Segura</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Form Section */}
            <section id="form" className="py-12 px-4 bg-white relative">
                <div className="max-w-3xl mx-auto">

                    <div className="text-center mb-8 relative">
                        <h2 className="text-2xl font-bold text-[#1a365d] relative z-10 inline-block bg-white px-4">
                            Completa el formulario y obtén tu cotización al instante
                        </h2>
                        {/* Decorative line behind title */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 -z-0"></div>
                    </div>

                    <form onSubmit={sendWhatsApp} className="space-y-4 max-w-2xl mx-auto">
                        <input
                            name="nombre"
                            type="text"
                            placeholder="Nombre"
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded shadow-sm focus:border-[#1a365d] focus:ring-1 focus:ring-[#1a365d] outline-none"
                        />
                        <input
                            name="telefono"
                            type="tel"
                            placeholder="Teléfono"
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded shadow-sm focus:border-[#1a365d] focus:ring-1 focus:ring-[#1a365d] outline-none"
                        />
                        <input
                            name="auto"
                            type="text"
                            placeholder="Marca, Modelo y Año"
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded shadow-sm focus:border-[#1a365d] focus:ring-1 focus:ring-[#1a365d] outline-none"
                        />
                        <textarea
                            name="comentarios"
                            placeholder="Comentarios"
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded shadow-sm focus:border-[#1a365d] focus:ring-1 focus:ring-[#1a365d] outline-none resize-none"
                        ></textarea>

                        <div className="text-center pt-4">
                            <button
                                type="submit"
                                className="w-full relative overflow-hidden bg-gradient-to-b from-[#2e9f4c] to-[#1e7e37] text-white font-bold py-4 px-8 rounded shadow-[0_4px_6px_rgba(0,0,0,0.3)] hover:brightness-110 active:translate-y-0.5 transition-all text-lg sm:text-xl flex items-center justify-center gap-3"
                            >
                                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Obtener Cotización por WhatsApp
                            </button>
                            <p className="mt-3 text-[#1a365d] text-sm">
                                Te contactaremos por WhatsApp con tu oferta de inmediato.
                            </p>
                        </div>
                    </form>
                </div>
            </section>

            {/* 5. Why Choose Us Section */}
            <section className="py-12 px-4 bg-white border-t border-gray-100">
                <div className="max-w-5xl mx-auto">

                    <div className="text-center mb-12 relative">
                        {/* Decorative styling matching the image */}
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] w-20 bg-gray-300"></div>
                            <h2 className="text-2xl font-bold text-[#1a365d]">
                                ¿Por qué elegirnos?
                            </h2>
                            <div className="h-[1px] w-20 bg-gray-300"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 text-[#1a365d]">
                                {/* Replicating the clock icon from the image */}
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a365d]">
                                    <circle cx="12" cy="12" r="10" fill="#f8f9fa" />
                                    <path d="M12 6v6l4 2" stroke="#ff8c00" strokeWidth="2.5" />
                                </svg>
                            </div>
                            <h4 className="font-extrabold text-[#1a365d] text-lg mb-2">Rápido y Seguro</h4>
                            <p className="text-gray-600 text-sm leading-relaxed max-w-[250px]">
                                Venta en minutos,<br />sin complicaciones.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 text-[#1a365d]">
                                {/* Replicating the handshake icon from the image */}
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a365d]">
                                    <circle cx="12" cy="12" r="10" fill="#f8f9fa" />
                                    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#ff8c00" strokeWidth="2.5" />
                                    <path d="M9 18h6" stroke="#1a365d" />
                                    <path d="M8 10h.01M16 10h.01" stroke="#1a365d" strokeWidth="2.5" />
                                </svg>
                            </div>
                            <h4 className="font-extrabold text-[#1a365d] text-lg mb-2">Mejor Precio</h4>
                            <p className="text-gray-600 text-sm leading-relaxed max-w-[250px]">
                                Tasamos tu auto con<br />la mejor oferta.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 text-[#1a365d]">
                                {/* Replicating the thumbs-up icon from the image */}
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a365d]">
                                    <circle cx="12" cy="12" r="10" fill="#f8f9fa" />
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="#ff8c00" strokeWidth="2" fill="#ff8c00" />
                                </svg>
                            </div>
                            <h4 className="font-extrabold text-[#1a365d] text-lg mb-2">Atención Profesional</h4>
                            <p className="text-gray-600 text-sm leading-relaxed max-w-[250px]">
                                Asesoría experta,<br />trato transparente.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Footer */}
            <footer className="mt-auto bg-[#1b345f] text-white pt-10 pb-6 w-full relative">
                {/* Visual decorative lines like in image */}
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <div className="absolute top-1.5 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex flex-col items-center gap-6">

                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-12">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 opacity-80" />
                                <a href="mailto:bnunezhenriquezz@gmail.com" className="font-bold border-b border-transparent hover:border-white transition-colors">
                                    bnunezhenriquezz@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 opacity-80" />
                                <a href="tel:+56973301653" className="font-bold border-b border-transparent hover:border-white transition-colors">
                                    +56 9 7330 1653
                                </a>
                            </div>
                        </div>

                        {/* Lower decorative line matching the road line in image footer */}
                        <div className="w-full relative mt-4">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                {/* Simulating the road texture visible in the footer */}
                                <div className="w-full h-[60px] bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]"></div>
                            </div>

                            <div className="relative flex justify-center py-4 border-t border-white/20">
                                <p className="text-xs text-center font-medium text-gray-300 z-10">
                                    © 2024 CompraAutoExpress. Todos los derechos reservados.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
