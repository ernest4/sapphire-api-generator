exports.randomName = gender => {
  const randomNameArrayMale = [
    "Alfred",
    "Barney",
    "Colin",
    "Daragh",
    "Ernest",
    "Fred",
    "Gerry",
    "Harry",
    "Isacc",
    "Jonathan",
    "Kenny",
    "Lenny",
    "Mark",
    "Noah",
    "Ostin",
    "Paddy",
    "Quentin",
    "Roy",
    "Stuart",
    "Ted",
    "Umberto",
    "Vance",
    "Walt",
    "Xavier",
    "Yoda",
    "Zack"
  ];

  const randomNameArrayFemale = [
    "Alison",
    "Beth",
    "Catherine",
    "Donna",
    "Esther",
    "Fox",
    "Gabriela",
    "Hanna",
    "Isabel",
    "Jessica",
    "Kacey",
    "Lisa",
    "Mary",
    "Naomi",
    "Oakley",
    "Patricia",
    "Quinn",
    "Rachel",
    "Saragh",
    "Tiffany",
    "Ursula",
    "Veronica",
    "Wendy",
    "Xabrina",
    "Yasmin",
    "Zara"
  ];

  const randomNameArray = [...randomNameArrayMale, ...randomNameArrayFemale];

  const randIndex = exports.randomNumber(26);

  if (gender === "male") return randomNameArrayMale[randIndex];
  else if (gender === "female") return randomNameArrayFemale[randIndex];
  else return randomNameArray[randIndex * 2];
};

exports.randomDate = (
  yearMax,
  yearMin,
  monthMax,
  monthMin,
  dayMax,
  dayMin,
  hourMax,
  hourMin,
  minuteMax,
  minuteMin,
  secondMax,
  secondMin
) => {
  // NOTE: months are from 0 - 11, Jan - Dec respectively, all other dates start counts from 1!

  yearMax = yearMax | 2100;
  yearMin = yearMin | 1971;
  monthMax = monthMax | 11;
  monthMin = monthMin | 0;
  dayMax = dayMax | 28;
  dayMin = dayMin | 1;
  hourMax = hourMax | 23;
  hourMin = hourMin | 1;
  minuteMax = minuteMax | 59;
  minuteMin = minuteMin | 1;
  secondMax = secondMax | 59;
  secondMin = secondMin | 1;

  const { randomNumber } = exports;
  const year = randomNumber(yearMax, yearMin);
  const month = randomNumber(monthMax, monthMin);
  const day = randomNumber(dayMax, dayMin);
  const hour = randomNumber(hourMax, hourMin);
  const minute = randomNumber(minuteMax, minuteMin);
  const second = randomNumber(secondMax, secondMin);

  return new Date(year, month, day, hour, minute, second).getTime();
};

exports.randomBirthday = age => {
  return new Date().setFullYear(new Date().getFullYear() - age).getTime();
};

exports.randomNumber = (max, min) => {
  min = min | 0;
  const diff = max - min;
  return Math.floor(Math.random() * diff + min);
};
