export interface TimezoneDetails {
  localTimeStr: string; // e.g. "19:42:05"
  dateStr: string; // e.g. "24 июля, Чт"
  utcOffsetStr: string; // e.g. "UTC+3"
  isDaytime: boolean;
  dayNightIcon: string;
}

export function getTimezoneDetails(timeZone: string): TimezoneDetails {
  try {
    const now = new Date();
    
    // Format time
    const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const localTimeStr = timeFormatter.format(now);

    // Format date
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone,
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
    const dateStr = dateFormatter.format(now);

    // Hour number for day/night check
    const hourFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      hour12: false
    });
    const hour = parseInt(hourFormatter.format(now), 10);
    const isDaytime = hour >= 6 && hour < 21;
    const dayNightIcon = isDaytime ? '🌞' : '🌙';

    // UTC offset computation
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone }));
    const offsetMinutes = Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const remMinutes = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const minutesPart = remMinutes > 0 ? `:${remMinutes < 10 ? '0' : ''}${remMinutes}` : '';
    const utcOffsetStr = `UTC${sign}${offsetHours}${minutesPart}`;

    return {
      localTimeStr,
      dateStr,
      utcOffsetStr,
      isDaytime,
      dayNightIcon
    };
  } catch (err) {
    return {
      localTimeStr: new Date().toLocaleTimeString('ru-RU'),
      dateStr: new Date().toLocaleDateString('ru-RU'),
      utcOffsetStr: 'UTC',
      isDaytime: true,
      dayNightIcon: '🌞'
    };
  }
}
