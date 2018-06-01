drop database if exists for_real;
create database for_real;
use for_real;

CREATE TABLE IF NOT EXISTS `_SessionSqlStore` (
	`id` VARCHAR(300) NOT NULL PRIMARY KEY,
	`data` TEXT,
	`dtime` BIGINT
) ENGINE MyISAM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;


CREATE TABLE IF NOT EXISTS `User` (
	`code` BIGINT NOT NULL AUTO_INCREMENT,
	`id` VARCHAR(100) UNIQUE,
	`email` VARCHAR(100) UNIQUE,
	`name` VARCHAR(100),
	`gender` INT(2),
	`phone` VARCHAR(20),
	`height` VARCHAR(20),
	`weight` VARCHAR(20),
	`prakriti` VARCHAR(100),
	`password` VARCHAR(100),
	`verified` BOOLEAN,
	PRIMARY KEY (`code`)
) ENGINE MyISAM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;


CREATE TABLE IF NOT EXISTS `Oauth` (
	`userCode` BIGINT NOT NULL,
	`profileId` VARCHAR(50),
	`provider` NVARCHAR(50),
	PRIMARY KEY (`userCode`, `provider`)
) ENGINE MyISAM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;



CREATE TABLE IF NOT EXISTS `Pulse` (
	`code` BIGINT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100),
	`date` DATETIME,
	`day` VARCHAR(20),
	`time` VARCHAR(20),
	`height` VARCHAR(20),
    `weight` VARCHAR(20),
    `prakriti` VARCHAR(100),
	`activity` VARCHAR(200),
	`overall_impression` VARCHAR(200),
	`dry` BOOLEAN,
	`light` BOOLEAN,
	`cold` BOOLEAN,
	`rough` BOOLEAN,
	`clear` BOOLEAN,
	`movable` BOOLEAN,
	`sharp` BOOLEAN,
	`liquid` BOOLEAN,
	`subtle` BOOLEAN,
	`hard` BOOLEAN,
	`oily` BOOLEAN,
	`heavy` BOOLEAN,
	`hot` BOOLEAN,
	`smooth` BOOLEAN,
	`cloudy` BOOLEAN,
	`stable` BOOLEAN,
	`dull` BOOLEAN,
	`dense` BOOLEAN,
	`gross` BOOLEAN,
	`soft` BOOLEAN,
	`quality_note` VARCHAR(200),
	`prana` BOOLEAN,
	`udana` BOOLEAN,
	`samana` BOOLEAN,
	`apana` BOOLEAN,
	`vyana` BOOLEAN,
	`pachaka` BOOLEAN,
	`ranjaka` BOOLEAN,
	`sadhaka` BOOLEAN,
	`alochaka` BOOLEAN,
	`bhrajaka` BOOLEAN,
	`kledaka` BOOLEAN,
	`avalambaka` BOOLEAN,
	`bodhaka` BOOLEAN,
	`tarpaka` BOOLEAN,
	`shelshaka` BOOLEAN,
	`sub_dosha_note` VARCHAR(200),
	`rasa` BOOLEAN,
	`rakta` BOOLEAN,
	`mamsa` BOOLEAN,
	`meda` BOOLEAN,
	`asthi` BOOLEAN,
	`majja` BOOLEAN,
	`shukra` BOOLEAN,
	`rasa_tendency` VARCHAR(100),
	`rakta_tendency` VARCHAR(100),
	`mamsa_tendency` VARCHAR(100),
	`meda_tendency` VARCHAR(100),
	`asthi_tendency` VARCHAR(100),
	`majja_tendency` VARCHAR(100),
	`shukra_tendency` VARCHAR(100),
	`dhatu_note` VARCHAR(200),
	`deep_level_type` VARCHAR(20),
	`deep_level_note` VARCHAR(200),
	`intepretation` VARCHAR(200),
	`comments` VARCHAR(200),
	`user` BIGINT,
	PRIMARY KEY (`code`)
) ENGINE MyISAM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

