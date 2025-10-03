import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./OrdersWidget.module.scss";

interface OrderCard {
  id: number;
  title: string;
  image: string;
}

const mockOrders: OrderCard[] = [
  {
    id: 1,
    title: "Счета на оплату для Юр. Лиц",
    image: "/images/doc1.png",
  },
  {
    id: 2,
    title: "Гарантия на детали для бампера",
    image: "/images/doc2.png",
  },
  {
    id: 3,
    title: "Чеки для Физ.лиц",
    image: "/images/doc3.png",
  },
  {
    id: 4,
    title: "Акт выполненных работ",
    image: "/images/doc4.png",
  },
  {
    id: 5,
    title: "Договор на техобслуживание",
    image: "/images/doc1.png",
  },
  {
    id: 6,
    title: "Справка о ремонте",
    image: "/images/doc2.png",
  },
  {
    id: 7,
    title: "Накладная на запчасти",
    image: "/images/doc3.png",
  },
  {
    id: 8,
    title: "Счёт-фактура",
    image: "/images/doc4.png",
  },
  {
    id: 9,
    title: "Договор аренды авто",
    image: "/images/doc1.png",
  },
  {
    id: 10,
    title: "Гарантийный акт",
    image: "/images/doc2.png",
  },
  {
    id: 11,
    title: "Отчёт о доставке",
    image: "/images/doc3.png",
  },
  {
    id: 12,
    title: "Акт приёма-передачи",
    image: "/images/doc4.png",
  },
  {
    id: 13,
    title: "Чек оплаты онлайн",
    image: "/images/doc1.png",
  },
  {
    id: 14,
    title: "Справка об обслуживании",
    image: "/images/doc2.png",
  },
  {
    id: 15,
    title: "Счёт на диагностику",
    image: "/images/doc3.png",
  },
  {
    id: 16,
    title: "Договор страхования",
    image: "/images/doc4.png",
  },
];

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
};

const OrdersWidget: React.FC = () => {
  const [swiperSettings, setSwiperSettings] = React.useState({
    slidesPerView: 1,
    spaceBetween: 0,
    cardsPerSlide: 4,
  });

  React.useEffect(() => {
    const updateSwiperSettings = () => {
      if (window.innerWidth <= 480) {
        setSwiperSettings({
          slidesPerView: "auto" as any,
          spaceBetween: 12,
          cardsPerSlide: 1,
        });
      } else if (window.innerWidth <= 768) {
        setSwiperSettings({
          slidesPerView: "auto" as any,
          spaceBetween: 12,
          cardsPerSlide: 1,
        });
      } else if (window.innerWidth <= 1376) {
        setSwiperSettings({
          slidesPerView: "auto" as any,
          spaceBetween: 8,
          cardsPerSlide: 3,
        });
      } else {
        setSwiperSettings({
          slidesPerView: 1,
          spaceBetween: 0,
          cardsPerSlide: 4,
        });
      }
    };

    updateSwiperSettings();
    window.addEventListener("resize", updateSwiperSettings);

    return () => window.removeEventListener("resize", updateSwiperSettings);
  }, []);

  const slides = React.useMemo(() => {
    // Для мобильных (1 карточка на слайд) и для 769-1376px (по 1 карточке для auto режима)
    if (
      swiperSettings.cardsPerSlide === 1 ||
      (swiperSettings.cardsPerSlide === 3 &&
        window.innerWidth > 768 &&
        window.innerWidth <= 1376)
    ) {
      return mockOrders.map((order) => [order]);
    }
    // Для остальных случаев (>1376px) - чанками по 4
    return chunk(mockOrders, swiperSettings.cardsPerSlide);
  }, [swiperSettings.cardsPerSlide]);

  return (
    <div className={styles.ordersBlock}>
      <div className={styles.title}>
        <div className={styles.titleBar}></div>
        Заказы
      </div>

      <Swiper
        modules={[Pagination]}
        spaceBetween={swiperSettings.spaceBetween}
        slidesPerView={swiperSettings.slidesPerView}
        slidesPerGroup={1}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} ${styles.paginationDot}"></span>`;
          },
        }}
        className={styles.swiperContainer}
        watchOverflow={true}
        allowTouchMove={true}
        grabCursor={true}
      >
        {slides.map((chunkOrders, idx) => (
          <SwiperSlide key={idx} className={styles.slide}>
            {chunkOrders.map((order) => (
              <div key={order.id} className={styles.card}>
                <div className={styles.documentPreview}>
                  <div className={styles.documentImage}>
                    <img
                      src={order.image}
                      alt={order.title}
                      className={styles.documentImageFile}
                    />
                  </div>
                </div>
                <div className={styles.cardTitle}>{order.title}</div>
              </div>
            ))}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export { OrdersWidget };
