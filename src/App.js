import React, { useState } from 'react';
import { Box, Container, Grid, Link, SvgIcon, Typography } from '@mui/material'; // นำเข้าไลบรารีจาก Material UI สำหรับ UI components
import Search from './components/Search/Search'; // คอมโพเนนต์สำหรับการค้นหาข้อมูล
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast'; // คอมโพเนนต์แสดงพยากรณ์อากาศรายสัปดาห์
import TodayWeather from './components/TodayWeather/TodayWeather'; // คอมโพเนนต์แสดงสภาพอากาศวันนี้
import { fetchWeatherData } from './api/OpenWeatherService'; // ฟังก์ชันสำหรับดึงข้อมูลจาก OpenWeather API
import { transformDateFormat } from './utilities/DatetimeUtils'; // ฟังก์ชันสำหรับแปลงรูปแบบวันที่
import UTCDatetime from './components/Reusable/UTCDatetime'; // คอมโพเนนต์แสดงเวลา UTC
import LoadingBox from './components/Reusable/LoadingBox'; // คอมโพเนนต์แสดงขณะโหลดข้อมูล
import { ReactComponent as SplashIcon } from './assets/splash-icon.svg'; // ไอคอน splash
import Logo from './assets/logo.png'; // โลโก้แอป
import ErrorBox from './components/Reusable/ErrorBox'; // คอมโพเนนต์แสดงข้อผิดพลาด
import { ALL_DESCRIPTIONS } from './utilities/DateConstants'; // คำบรรยายของสภาพอากาศ
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from './utilities/DataUtils'; // ฟังก์ชันสำหรับคำนวณพยากรณ์อากาศ

// ฟังก์ชันหลักของแอป
function App() {
  // การประกาศสถานะ (state)
  const [todayWeather, setTodayWeather] = useState(null); // เก็บข้อมูลสภาพอากาศวันนี้
  const [todayForecast, setTodayForecast] = useState([]); // เก็บข้อมูลพยากรณ์อากาศวันนี้
  const [weekForecast, setWeekForecast] = useState(null); // เก็บข้อมูลพยากรณ์อากาศรายสัปดาห์
  const [isLoading, setIsLoading] = useState(false); // ใช้แสดงสถานะการโหลดข้อมูล
  const [error, setError] = useState(false); // ใช้แสดงสถานะข้อผิดพลาด

  // ฟังก์ชันที่ทำงานเมื่อมีการค้นหาข้อมูล
  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(' '); // แยกค่าละติจูดและลองจิจูดจากข้อมูลที่ผู้ใช้ป้อน

    setIsLoading(true); // เริ่มการโหลดข้อมูล

    const currentDate = transformDateFormat(); // แปลงวันที่ให้เป็นรูปแบบที่ต้องการ
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000); // คำนวณเวลาปัจจุบันใน UNIX timestamp

    try {
      // ดึงข้อมูลจาก API
      const [todayWeatherResponse, weekForecastResponse] =
        await fetchWeatherData(latitude, longitude);

      // คำนวณพยากรณ์อากาศวันนี้และรายสัปดาห์
      const all_today_forecasts_list = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        dt_now
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      // อัปเดตสถานะของข้อมูลที่ได้รับ
      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({
        city: enteredData.label,
        list: all_week_forecasts_list,
      });
    } catch (error) {
      // หากเกิดข้อผิดพลาดในการดึงข้อมูล
      setError(true);
    }

    setIsLoading(false); // สิ้นสุดการโหลดข้อมูล
  };

  // กำหนดคอนเทนต์เริ่มต้นที่จะใช้แสดง
  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100%',
        minHeight: '500px',
      }}
    >
      <SvgIcon
        component={SplashIcon}
        inheritViewBox
        sx={{ fontSize: { xs: '100px', sm: '120px', md: '140px' } }}
      />
        <Typography
          variant="h4"
          component="h4"
          sx={{
            fontSize: { xs: '12px', sm: '14px' },
            color: 'rgba(255,255,255, .85)',
            fontFamily: 'Kanit, Arial, sans-serif', // ใช้ฟอนต์ Kanit
            textAlign: 'center',
            margin: '2rem 0',
            maxWidth: '80%',
            lineHeight: '22px',
          }}
        >
          สำรวจข้อมูลสภาพอากาศปัจจุบันและพยากรณ์อากาศ 6 วันของเมืองมากกว่า 200,000 เมือง!
        </Typography>

    </Box>
  );

  // เมื่อได้รับข้อมูลจาก API แล้ว แสดงผลลัพธ์
  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={todayWeather ? 6 : 12}>
          <Grid item xs={12}>
            <TodayWeather data={todayWeather} forecastList={todayForecast} /> {/* แสดงข้อมูลสภาพอากาศวันนี้ */}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} /> {/* แสดงพยากรณ์อากาศรายสัปดาห์ */}
        </Grid>
      </React.Fragment>
    );
  }

  // หากเกิดข้อผิดพลาดในการดึงข้อมูล แสดงข้อความข้อผิดพลาด
  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong" // ข้อความข้อผิดพลาด
      />
    );
  }

  // เมื่อกำลังโหลดข้อมูล แสดงข้อความ "Loading..."
  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '500px',
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: '10px', sm: '12px' },
              color: 'rgba(255, 255, 255, .8)',
              lineHeight: 1,
              fontFamily: 'Poppins',
            }}
          >
            กำลังโหลด... {/* ข้อความแสดงสถานะการโหลด */}
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    // คอนเทนเนอร์หลักที่แสดงข้อมูลทั้งหมด
    <Container
      sx={{
        maxWidth: { xs: '95%', sm: '80%', md: '1100px' },
        width: '100%',
        height: '100%', // ความสูงเต็มหน้าจอ
        margin: '0 auto',
        padding: '1rem 0 3rem',
        marginTop: '2rem', // ระยะห่างด้านบน
        borderRadius: {
          xs: 'none',
          sm: '0 0 1rem 1rem',
        },
        boxShadow: {
          xs: 'none',
          sm: 'rgba(0,0,0, 0.5) 0px 10px 15px -3px, rgba(0,0,0, 0.5) 0px 4px 6px -2px',
        },
      }}
    >
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: '100%',
              marginBottom: '1rem',
            }}
          >
            <Box
              component="img"
              sx={{
                height: { xs: '16px', sm: '22px', md: '26px' },
                width: 'auto',
              }}
              alt="logo"
              src={Logo} // แสดงโลโก้
            />
            <UTCDatetime /> {/* แสดงเวลา UTC */}
          </Box>
          <Search onSearchChange={searchChangeHandler} /> {/* คอมโพเนนต์สำหรับการค้นหาข้อมูล */}
        </Grid>
        {appContent} {/* แสดงผลลัพธ์จากการค้นหา */}
      </Grid>
    </Container>
  );
}

export default App;
