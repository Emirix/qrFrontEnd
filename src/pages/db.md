-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 07 Şub 2022, 13:39:10
-- Sunucu sürümü: 10.4.22-MariaDB
-- PHP Sürümü: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `qr`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `yorumlar`
--

CREATE TABLE `yorumlar` (
  `id` int(11) NOT NULL,
  `to_id` int(11) NOT NULL,
  `yorum` varchar(100) COLLATE utf8_turkish_ci NOT NULL,
  `ip` varchar(100) COLLATE utf8_turkish_ci NOT NULL,
  `tarih` timestamp NOT NULL DEFAULT current_timestamp(),
  `onay` text COLLATE utf8_turkish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `yorumlar`
--

INSERT INTO `yorumlar` (`id`, `to_id`, `yorum`, `ip`, `tarih`, `onay`) VALUES
(1, 2, 'Lezzetli ve büyük', '::ffff:192.168.1.80', '2022-02-07 10:36:43', 'onay'),
(23, 2, 'Hh', '::ffff:192.168.1.101', '2022-02-07 11:31:33', 'onay'),
(24, 4, 'sasas', '::ffff:192.168.1.80', '2022-02-07 12:27:18', 'onay'),
(25, 4, 'sa', '::ffff:192.168.1.80', '2022-02-07 12:28:10', 'bekliyor'),
(26, 1, 'sa', '::ffff:192.168.1.80', '2022-02-07 12:30:33', 'onay'),
(27, 4, 'xx', '::ffff:192.168.1.80', '2022-02-07 12:31:42', 'bekliyor');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `yorumlar`
--
ALTER TABLE `yorumlar`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `yorumlar`
--
ALTER TABLE `yorumlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;