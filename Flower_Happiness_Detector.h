/* ********************************************************************************************** */
/*                                                                                                */
/*   Flower Happiness Detector                                         :::::::::        :::       */
/*   flower_happiness_detector.h                                      :+:    :+:     :+: :+:      */
/*                                                                   +:+    +:+    +:+   +:+      */
/*   By: Roman Alexandrov <r.aleksandroff@gmail.com>                +#++:++#:    +#++:++#++:      */
/*                                                                 +#+    +#+   +#+     +#+       */
/*   Created: 2024/05/16 12:50:00                                 #+#    #+#   #+#     #+#        */
/*   Updated: 2024/05/16 18:45:00                                ###    ###   ###     ###         */
/*                                                                                                */
/*                                                                                                */
/*   This software allows to track moisture of plants via Telegram chat notifications.            */
/*                                                                                                */
/* ********************************************************************************************** */

#ifndef FLOWER_HAPPINESS_DETECTOR_H
# define FLOWER_HAPPINESS_DETECTOR_H

# include <Arduino.h>                                                  // for String type variables
# include <stdio.h>                                                    // for printf() in DEBUG macro
# include <stdint.h>                                                   // for fixed-width type variables
# include <time.h>                                                     // for NTP server time check
# include <LittleFS.h>                                                 // for the rtc_g.ota value storage
# include <esp_system.h>                                               // for deep sleep
# include <esp_sleep.h>                                                // for deep sleep
# include <driver/adc.h>                                               // for ADC measurements of battery and sensor
# include "driver/temp_sensor.h"                                       // for internal temperature sensor
# include "globals.h"

# define SOFTWARE_VERSION        4.01
# define DEBUG                                                         // comment out this line to turn off Serial output
# ifdef DEBUG
  # define DEBUG_PRINTF(x, y) Serial.printf(x, y)
# else
  # define DEBUG_PRINTF(x, y)
# endif
# define CONNECT_TIMEOUT         3000                                  // WiFi timeout per each AP, in milliseconds. Increase if cannot connect.
# define DEAD_BATTERY_SLEEP      86400000ul                            // 24 hours
# define SLEEP                   86400000ul                            // 24 hours
# define SENSOR_ANALOG           D1
# define SENSOR_GND              D2
# define SENSOR_VCC              D3
# define ON                      111
# define OFF                     101
# define ACTIVE                  "1"                                   // for OTA
# define CLOSED                  "0"                                   // for OTA
# define TOO_MUCH                200
# define JUST_OK                 201
# define NEED_WATER              202
# define DRYING_OUT              203

inline void      ft_ota_init(void) __attribute__((always_inline));
inline void      ft_ota_waiting_loop(void) __attribute__((always_inline));
void             ft_go_to_sleep(uint64_t time_in_millis);
void             ft_low_battery_handle(void);
bool             ft_charging_detection(void);
void             ft_battery_check(void);
static void      ft_moisture_sensor(int8_t status);
void             ft_moisture_check(void);
static void      ft_temperature_sensor(int8_t status);
static void      ft_temperature_calibration(void);
void             ft_temperature_check(void);
void IRAM_ATTR   ft_temp_sensor_init(void);
void IRAM_ATTR   ft_react(void);
bool IRAM_ATTR   ft_get_time(void);
int IRAM_ATTR    ft_how_moist(void);
void IRAM_ATTR   ft_notify_user(void);
static void      ft_reply_machine(String text);
static void      ft_new_messages(short message_count);
void IRAM_ATTR   ft_telegram_check(void);
unsigned int     ft_time_till_wakeup(void);
short IRAM_ATTR  ft_write_spiffs_file(const char* file_name, String input);
String IRAM_ATTR ft_read_spiffs_file(const char* file_name);
void IRAM_ATTR   ft_files_restore(void);
int IRAM_ATTR    ft_wifi_connect(void);
void IRAM_ATTR   ft_adc_init(void);
void IRAM_ATTR   ft_wifi_init(void);
void IRAM_ATTR   ft_spiffs_init(void);
void IRAM_ATTR   ft_serial_init(void);

# include "ota.h"                                                   // contains inline functions. It has to be here! 

#endif
 
