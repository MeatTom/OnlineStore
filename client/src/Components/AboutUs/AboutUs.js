import React, { useState } from 'react';
import AboutUsStyle from './AboutUs.module.scss';
import Header from "../Header/header";
import ScrollToTop from "react-scroll-up";
import SideCart from "../SideCart/SideCart";
import { useInView } from 'react-intersection-observer';

const AboutUs = () => {
    const [cartIsOpen, setCartIsOpen] = useState(false);


    const [refMission, inViewMission] = useInView({ triggerOnce: true });
    const [refTeam, inViewTeam] = useInView({ triggerOnce: true });
    const [refProducts, inViewProducts] = useInView({ triggerOnce: true });

    return (

        <div className={AboutUsStyle.aboutUs}>
            <ScrollToTop showUnder={200} style={{ zIndex: 1000, position: 'fixed', bottom: '2rem', right: '2rem' }}>
                <span><img  src="/statics/ButtonUp.png" alt="UP" /></span>
            </ScrollToTop>
            <Header onClickedCart={() => setCartIsOpen(true)} cartIsOpen={cartIsOpen}/>
            {cartIsOpen && <SideCart onClosedCart={() => setCartIsOpen(false)} />}
            <div className={AboutUsStyle.header}>
                <h1>О Нас</h1>
            </div>
            <div className={AboutUsStyle.content}>
                <section ref={refMission} className={`${AboutUsStyle.section} ${inViewMission ? AboutUsStyle.animateLeft : ''}`}>
                    <img src="/statics/mission.jpg" alt="Наша миссия" className={AboutUsStyle.image} />
                    <div className={AboutUsStyle.text}>
                        <h2>Наша миссия</h2>
                        <p>
                            Наша миссия - привнести яркость и радость в каждую пару носков. Мы тщательно отбираем лучших поставщиков, чтобы предложить вам уникальные и качественные носки, которые сделают ваш день ярче.
                        </p>
                    </div>
                </section>
                <section ref={refTeam} className={`${AboutUsStyle.section} ${inViewTeam ? AboutUsStyle.animateLeft : ''}`}>
                    <img src="/statics/team.jpg" alt="Наша команда" className={AboutUsStyle.image} />
                    <div className={AboutUsStyle.text}>
                        <h2>Наша команда</h2>
                        <p>
                            Мы - команда энтузиастов, увлеченных модой и дизайном. Каждый из нас стремится найти и предложить вам самые лучшие и яркие носки от разных производителей по всему миру.
                        </p>
                    </div>
                </section>
                <section ref={refProducts} className={`${AboutUsStyle.section} ${inViewProducts ? AboutUsStyle.animateLeft : ''}`}>
                    <img src="/statics/products.jpg" alt="Наши продукты" className={AboutUsStyle.image} />
                    <div className={AboutUsStyle.text}>
                        <h2>Наши продукты</h2>
                        <p>
                            Мы предлагаем широкий ассортимент носков самых разных цветов и узоров. Наши поставщики используют только высококачественные материалы, чтобы обеспечить вам комфорт и долговечность.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AboutUs;
