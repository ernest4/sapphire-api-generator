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

  let randomNameArray = [...randomNameArrayMale, ...randomNameArrayFemale];

  const randIndex = Math.floor(Math.random() * 100 + 1);

  if (gender === "male") return randomNameArrayMale[randIndex];
  else if (gender === "female") return randomNameArrayFemale[randIndex];
  else return randomNameArray[randIndex];
};

exports.randomDate = () => {
  // TODO: implement

  return 0;
};
