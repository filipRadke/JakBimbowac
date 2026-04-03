CREATE TABLE `routes` (
  `route_id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `agency_id` int DEFAULT NULL,
  `route_short_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `route_long_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `route_desc` text COLLATE utf8mb4_general_ci,
  `route_type` int DEFAULT NULL,
  `route_color` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `route_text_color` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`route_id`)
)

CREATE TABLE `stop_times` (
      `trip_id` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
      `arrival_time` time DEFAULT NULL,
      `departure_time` time DEFAULT NULL,
      `stop_id` int DEFAULT NULL,
      `stop_sequence` int NOT NULL,
      `stop_headsign` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
      `pickup_type` int DEFAULT NULL,
      `drop_off_type` int DEFAULT NULL,
      PRIMARY KEY (`trip_id`,`stop_sequence`)
)

CREATE TABLE `stops` (
 `stop_id` int NOT NULL,
 `stop_code` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
 `stop_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
 `stop_lat` decimal(10,8) DEFAULT NULL,
 `stop_lon` decimal(11,8) DEFAULT NULL,
 `zone_id` varchar(5) COLLATE utf8mb4_general_ci DEFAULT NULL,
 PRIMARY KEY (`stop_id`)
)

CREATE TABLE `trips` (
 `route_id` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
 `service_id` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
 `trip_id` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
 `trip_headsign` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
 `direction_id` int DEFAULT NULL,
 `shape_id` int DEFAULT NULL,
 `wheelchair_accessible` int DEFAULT NULL,
 `brigade` int DEFAULT NULL,
 PRIMARY KEY (`trip_id`)
)