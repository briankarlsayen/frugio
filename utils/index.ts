// return YYYY-MM-DD
export function convertUTCtoLocalDate(utcDate) {
  const options = {timeZone: 'Asia/Singapore'};
  const formatter = new Intl.DateTimeFormat('en-CA', options); // 'en-CA' gives YYYY-MM-DD format
  return formatter.format(utcDate);
}

// return UTC format
export function convertLocalDateToUTC(localDateStr: string): Date {
  let date = new Date(localDateStr + 'T00:00:00Z');

  let offset = 8 * 60;
  let localTime = new Date(date.getTime() + offset * 60000);

  return localTime;
}

export const formatedAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const convertToReadableDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    // year: "numeric",
    month: 'long',
    day: 'numeric',
  });
};

export const filteredExpenses = (dateFilter: number) => {
  const today = new Date();
  const thisWeek = new Date();
  const thisMonth = new Date();
  const thisYear = new Date();

  thisWeek.setDate(today.getDate() - 7);

  thisMonth.setDate(1);

  thisYear.setMonth(0);
  thisYear.setDate(1);

  const localToday = convertUTCtoLocalDate(today);
  const localThisWeek = convertUTCtoLocalDate(thisWeek);
  const localThisMonth = convertUTCtoLocalDate(thisMonth);
  const localThisYear = convertUTCtoLocalDate(thisYear);

  let from = null;
  let to = null;

  switch (dateFilter) {
    case 1:
      from = localToday;
      to = localToday;
      break;
    case 2:
      from = localThisWeek;
      to = localToday;
      break;
    case 3:
      from = localThisMonth;
      to = localToday;
      break;
    case 4:
      from = localThisYear;
      to = localToday;
      break;
  }

  return {
    from,
    to,
  };
};
