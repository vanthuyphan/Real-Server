drop database if exists for_real;
create database for_real;
use for_real;

CREATE TABLE IF NOT EXISTS `_SessionSqlStore` (
	`id` VARCHAR(300) NOT NULL PRIMARY KEY,
	`data` TEXT,
	`dtime` BIGINT
) ENGINE MyISAM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;


-- Create syntax for TABLE 'Pulse'
Drop table Pulse;
CREATE TABLE `Pulse` (
  `code` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `date` varchar(100) DEFAULT NULL,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `day` varchar(20) DEFAULT NULL,
  `time` varchar(20) DEFAULT NULL,
  `height` varchar(20) DEFAULT NULL,
  `dob` varchar(50) DEFAULT NULL,
  `prikriti` varchar(500) DEFAULT NULL,
  `weight` varchar(20) DEFAULT NULL,
  `prakriti` varchar(100) DEFAULT NULL,
  `activity` varchar(200) DEFAULT NULL,
  `overall_impression` varchar(200) DEFAULT NULL,
  `dry` tinyint(1) DEFAULT NULL,
  `light` tinyint(1) DEFAULT NULL,
  `cold` tinyint(1) DEFAULT NULL,
  `rough` tinyint(1) DEFAULT NULL,
  `clear` tinyint(1) DEFAULT NULL,
  `movable` tinyint(1) DEFAULT NULL,
  `sharp` tinyint(1) DEFAULT NULL,
  `liquid` tinyint(1) DEFAULT NULL,
  `subtle` tinyint(1) DEFAULT NULL,
  `hard` tinyint(1) DEFAULT NULL,
  `oily` tinyint(1) DEFAULT NULL,
  `heavy` tinyint(1) DEFAULT NULL,
  `hot` tinyint(1) DEFAULT NULL,
  `smooth` tinyint(1) DEFAULT NULL,
  `cloudy` tinyint(1) DEFAULT NULL,
  `stable` tinyint(1) DEFAULT NULL,
  `dull` tinyint(1) DEFAULT NULL,
  `dense` tinyint(1) DEFAULT NULL,
  `gross` tinyint(1) DEFAULT NULL,
  `soft` tinyint(1) DEFAULT NULL,
  `quality_note` varchar(200) DEFAULT NULL,
  `prana_tendency` varchar(100) DEFAULT NULL,
    `udana_tendency` varchar(100) DEFAULT NULL,
    `samana_tendency` varchar(100) DEFAULT NULL,
    `apana_tendency` varchar(100) DEFAULT NULL,
    `vyana_tendency` varchar(100) DEFAULT NULL,
    `pachaka_tendency` varchar(100) DEFAULT NULL,
    `ranjaka_tendency` varchar(100) DEFAULT NULL,
    `sadhaka_tendency` varchar(100) DEFAULT NULL,
        `alochaka_tendency` varchar(100) DEFAULT NULL,
        `bhrajaka_tendency` varchar(100) DEFAULT NULL,
        `kledaka_tendency` varchar(100) DEFAULT NULL,
        `avalambaka_tendency` varchar(100) DEFAULT NULL,
        `bodhaka_tendency` varchar(100) DEFAULT NULL,
        `tarpaka_tendency` varchar(100) DEFAULT NULL,
        `shelshaka_tendency` varchar(100) DEFAULT NULL,
  `prana` tinyint(1) DEFAULT NULL,
  `udana` tinyint(1) DEFAULT NULL,
  `samana` tinyint(1) DEFAULT NULL,
  `apana` tinyint(1) DEFAULT NULL,
  `vyana` tinyint(1) DEFAULT NULL,
  `pachaka` tinyint(1) DEFAULT NULL,
  `ranjaka` tinyint(1) DEFAULT NULL,
  `sadhaka` tinyint(1) DEFAULT NULL,
  `alochaka` tinyint(1) DEFAULT NULL,
  `bhrajaka` tinyint(1) DEFAULT NULL,
  `kledaka` tinyint(1) DEFAULT NULL,
  `avalambaka` tinyint(1) DEFAULT NULL,
  `bodhaka` tinyint(1) DEFAULT NULL,
  `tarpaka` tinyint(1) DEFAULT NULL,
  `shelshaka` tinyint(1) DEFAULT NULL,
  `sub_dosha_note` varchar(200) DEFAULT NULL,
  `rasa` tinyint(1) DEFAULT NULL,
  `rakta` tinyint(1) DEFAULT NULL,
  `mamsa` tinyint(1) DEFAULT NULL,
  `meda` tinyint(1) DEFAULT NULL,
  `asthi` tinyint(1) DEFAULT NULL,
  `majja` tinyint(1) DEFAULT NULL,
  `shukra` tinyint(1) DEFAULT NULL,
  `rasa_tendency` varchar(100) DEFAULT NULL,
  `rakta_tendency` varchar(100) DEFAULT NULL,
  `mamsa_tendency` varchar(100) DEFAULT NULL,
  `meda_tendency` varchar(100) DEFAULT NULL,
  `asthi_tendency` varchar(100) DEFAULT NULL,
  `majja_tendency` varchar(100) DEFAULT NULL,
  `shukra_tendency` varchar(100) DEFAULT NULL,
  `dhatu_note` varchar(200) DEFAULT NULL,
  `deep_level_type` varchar(20) DEFAULT NULL,
  `deep_level_note` varchar(200) DEFAULT NULL,
  `interpretation` varchar(200) DEFAULT NULL,
  `comments` varchar(200) DEFAULT NULL,
  `system_note` varchar(200) DEFAULT NULL,
  `user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=MyISAM AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;

-- Create syntax for TABLE 'User'
CREATE TABLE `User` (
  `code` bigint(20) NOT NULL AUTO_INCREMENT,
  `id` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `gender` int(2) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `height` varchar(20) DEFAULT NULL,
  `weight` varchar(20) DEFAULT NULL,
  `prakriti` varchar(100) DEFAULT NULL,
  `dob` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT NULL,
  `reset` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`code`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

ALTER TABLE User
ADD token varchar(250);

ALTER TABLE User
ADD is_admin SMALLINT;

ALTER TABLE Pulse
ADD submit_note varchar(250);

ALTER TABLE Pulse
MODIFY activity text,
MODIFY overall_impression text,
MODIFY dhatu_note text,
MODIFY deep_level_type text,
MODIFY deep_level_note text,
MODIFY interpretation text,
MODIFY comments text,
MODIFY sub_dosha_note text,
MODIFY quality_note text;