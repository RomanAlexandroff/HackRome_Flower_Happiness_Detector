/* ********************************************************************************************** */
/*                                                                                                */
/*   Flower Happiness Detector                                         :::::::::        :::       */
/*   Flower_Happiness_Detector.ino                                    :+:    :+:     :+: :+:      */
/*                                                                   +:+    +:+    +:+   +:+      */
/*   By: Roman Alexandrov <r.aleksandroff@gmail.com>                +#++:++#:    +#++:++#++:      */
/*                                                                 +#+    +#+   +#+     +#+       */
/*   Created: 2024/05/16 12:50:00                                 #+#    #+#   #+#     #+#        */
/*   Updated: 2024/05/16 18:45:00                                ###    ###   ###     ###         */
/*                                                                                                */
/*                                                                                                */
/*   This software allows to track moisture of plants via Telegram chat notifications.            */
/*                                                                                                */
/*   This project is interesting because:                                                         */
/*      - here I use a digital GPIO to source power to a sensor. Effectively, it allows me        */
/*        to turn the sensor's power on and off without soldering external MOSFETs.               */
/*      - here I use another digital GPIO as ground. I had to go this way due to some physical    */
/*        restrictions of the boards used in the project. This solution is far from perfect,      */
/*        because later experiments showed that connecting sensor's GND to the proper ground      */
/*        would have provided more voltage for the sensor.                                        */
/*      - it's the first time I use inner temperature sensor of ESP32.                            */
/*      - it's the first time I managed to start OTA functionality by a Telegram chat command.    */
/*                                                                                                */
/* ********************************************************************************************** */

#include "Flower_Happiness_Detector.h"

void  setup(void)
{
    #ifdef DEBUG
        ft_serial_init();
    #endif
    ft_spiffs_init();
    ft_wifi_init();                                 // sets up the Wi-Fi module but does not connect
    ft_adc_init();
    ft_temp_sensor_init();
    ft_ota_init();
}

void  loop(void)
{
    ft_ota_waiting_loop();
    ft_temperature_check();
    ft_battery_check();
    ft_moisture_check();
    ft_react();
    ft_get_time();
    ft_notify_user();
    ft_telegram_check();
    ft_go_to_sleep(ft_time_till_wakeup());
}
 
