import { Typography } from '@mui/material';
import React from 'react';
import { getUTCDatetime } from '../../utilities/DatetimeUtils';

const UTCDatetime = () => {
  // ดึงวันที่และเวลาปัจจุบันใน UTC
  const utcFullDate = getUTCDatetime();

  // แยกวันที่ออกจากเวลาของ UTC
  const dateOnly = utcFullDate.split(' ')[0]; // ใช้ split เพื่อแยกวันที่ออกจากเวลา

  const utcDateValue = (
    <Typography
      variant="h3"
      component="h3"
      sx={{
        fontWeight: '400',
        fontSize: { xs: '10px', sm: '12px' },
        color: 'rgba(255, 255, 255, .7)',
        lineHeight: 1,
        paddingRight: '2px',
        fontFamily: 'Poppins',
      }}
    >
      วันที่ {dateOnly}{/* แสดงแค่วันที่ */}
    </Typography>
  );
  
  return utcDateValue; // ส่งคืนเฉพาะวันที่
};

export default UTCDatetime;
