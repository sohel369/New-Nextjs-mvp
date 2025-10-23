// Comprehensive Lesson Questions for AI Coach System
// 100 questions per language with varying difficulty levels

export interface LessonQuestion {
  id: string;
  text: string;
  hint?: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

// English Questions (100 questions)
export const ENGLISH_QUESTIONS: LessonQuestion[] = [
  // Easy Questions (40 questions)
  {
    id: 'en-easy-1',
    text: 'What is the capital of France?',
    hint: 'It starts with "P" and is known as the City of Light',
    language: 'en',
    difficulty: 'easy',
    category: 'geography'
  },
  {
    id: 'en-easy-2',
    text: 'How do you say "hello" in Spanish?',
    hint: 'It sounds like "hola"',
    language: 'en',
    difficulty: 'easy',
    category: 'language'
  },
  {
    id: 'en-easy-3',
    text: 'What is 2 + 2?',
    hint: 'Count on your fingers',
    language: 'en',
    difficulty: 'easy',
    category: 'math'
  },
  {
    id: 'en-easy-4',
    text: 'What color is the sky on a clear day?',
    hint: 'Think of a clear summer day',
    language: 'en',
    difficulty: 'easy',
    category: 'science'
  },
  {
    id: 'en-easy-5',
    text: 'What is the largest planet in our solar system?',
    hint: 'It has a great red spot',
    language: 'en',
    difficulty: 'easy',
    category: 'science'
  },
  {
    id: 'en-easy-6',
    text: 'What animal says "meow"?',
    hint: 'It\'s a common house pet',
    language: 'en',
    difficulty: 'easy',
    category: 'animals'
  },
  {
    id: 'en-easy-7',
    text: 'What do you use to write?',
    hint: 'It has ink and a point',
    language: 'en',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: 'en-easy-8',
    text: 'What season comes after winter?',
    hint: 'Flowers start to bloom',
    language: 'en',
    difficulty: 'easy',
    category: 'nature'
  },
  {
    id: 'en-easy-9',
    text: 'What do you call the place where you sleep?',
    hint: 'It\'s in your bedroom',
    language: 'en',
    difficulty: 'easy',
    category: 'home'
  },
  {
    id: 'en-easy-10',
    text: 'What do you drink when you\'re thirsty?',
    hint: 'It\'s clear and essential for life',
    language: 'en',
    difficulty: 'easy',
    category: 'food'
  },
  {
    id: 'en-easy-11',
    text: 'What do you wear on your feet?',
    hint: 'They protect your feet',
    language: 'en',
    difficulty: 'easy',
    category: 'clothing'
  },
  {
    id: 'en-easy-12',
    text: 'What do you use to cut paper?',
    hint: 'It has a blade and handles',
    language: 'en',
    difficulty: 'easy',
    category: 'tools'
  },
  {
    id: 'en-easy-13',
    text: 'What do you call the person who teaches you?',
    hint: 'They work in a school',
    language: 'en',
    difficulty: 'easy',
    category: 'people'
  },
  {
    id: 'en-easy-14',
    text: 'What do you use to brush your teeth?',
    hint: 'It has bristles and toothpaste',
    language: 'en',
    difficulty: 'easy',
    category: 'hygiene'
  },
  {
    id: 'en-easy-15',
    text: 'What do you call the place where you buy food?',
    hint: 'It has aisles and shopping carts',
    language: 'en',
    difficulty: 'easy',
    category: 'places'
  },
  {
    id: 'en-easy-16',
    text: 'What do you use to open a door?',
    hint: 'It\'s usually made of metal',
    language: 'en',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: 'en-easy-17',
    text: 'What do you call the time when you eat breakfast?',
    hint: 'It\'s in the morning',
    language: 'en',
    difficulty: 'easy',
    category: 'time'
  },
  {
    id: 'en-easy-18',
    text: 'What do you use to see?',
    hint: 'You have two of them',
    language: 'en',
    difficulty: 'easy',
    category: 'body'
  },
  {
    id: 'en-easy-19',
    text: 'What do you call the place where you cook?',
    hint: 'It has a stove and oven',
    language: 'en',
    difficulty: 'easy',
    category: 'home'
  },
  {
    id: 'en-easy-20',
    text: 'What do you use to tell time?',
    hint: 'It has hands and numbers',
    language: 'en',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: 'en-easy-21',
    text: 'What do you call the person who drives a car?',
    hint: 'They sit behind the wheel',
    language: 'en',
    difficulty: 'easy',
    category: 'people'
  },
  {
    id: 'en-easy-22',
    text: 'What do you use to clean your hands?',
    hint: 'It\'s usually liquid and foamy',
    language: 'en',
    difficulty: 'easy',
    category: 'hygiene'
  },
  {
    id: 'en-easy-23',
    text: 'What do you call the place where you exercise?',
    hint: 'It has equipment and weights',
    language: 'en',
    difficulty: 'easy',
    category: 'places'
  },
  {
    id: 'en-easy-24',
    text: 'What do you use to listen to music?',
    hint: 'It goes over your ears',
    language: 'en',
    difficulty: 'easy',
    category: 'technology'
  },
  {
    id: 'en-easy-25',
    text: 'What do you call the person who helps you when you\'re sick?',
    hint: 'They wear a white coat',
    language: 'en',
    difficulty: 'easy',
    category: 'people'
  },
  {
    id: 'en-easy-26',
    text: 'What do you use to take pictures?',
    hint: 'It has a lens and flash',
    language: 'en',
    difficulty: 'easy',
    category: 'technology'
  },
  {
    id: 'en-easy-27',
    text: 'What do you call the place where you borrow books?',
    hint: 'It\'s quiet and has many books',
    language: 'en',
    difficulty: 'easy',
    category: 'places'
  },
  {
    id: 'en-easy-28',
    text: 'What do you use to write on paper?',
    hint: 'It\'s usually black or blue',
    language: 'en',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: 'en-easy-29',
    text: 'What do you call the person who delivers mail?',
    hint: 'They wear a uniform',
    language: 'en',
    difficulty: 'easy',
    category: 'people'
  },
  {
    id: 'en-easy-30',
    text: 'What do you use to keep food cold?',
    hint: 'It\'s in your kitchen',
    language: 'en',
    difficulty: 'easy',
    category: 'appliances'
  },
  {
    id: 'en-easy-31',
    text: 'What do you call the place where you watch movies?',
    hint: 'It has a big screen',
    language: 'en',
    difficulty: 'easy',
    category: 'places'
  },
  {
    id: 'en-easy-32',
    text: 'What do you use to make phone calls?',
    hint: 'It\'s portable and has a screen',
    language: 'en',
    difficulty: 'easy',
    category: 'technology'
  },
  {
    id: 'en-easy-33',
    text: 'What do you call the person who fixes cars?',
    hint: 'They work in a garage',
    language: 'en',
    difficulty: 'easy',
    category: 'people'
  },
  {
    id: 'en-easy-34',
    text: 'What do you use to dry your hair?',
    hint: 'It blows hot air',
    language: 'en',
    difficulty: 'easy',
    category: 'appliances'
  },
  {
    id: 'en-easy-35',
    text: 'What do you call the place where you buy medicine?',
    hint: 'It has a pharmacist',
    language: 'en',
    difficulty: 'easy',
    category: 'places'
  },
  {
    id: 'en-easy-36',
    text: 'What do you use to measure temperature?',
    hint: 'It has mercury or digital display',
    language: 'en',
    difficulty: 'easy',
    category: 'tools'
  },
  {
    id: 'en-easy-37',
    text: 'What do you call the person who serves food in a restaurant?',
    hint: 'They bring your order',
    language: 'en',
    difficulty: 'easy',
    category: 'people'
  },
  {
    id: 'en-easy-38',
    text: 'What do you use to wash dishes?',
    hint: 'It\'s usually liquid and foamy',
    language: 'en',
    difficulty: 'easy',
    category: 'cleaning'
  },
  {
    id: 'en-easy-39',
    text: 'What do you call the place where you catch a train?',
    hint: 'It has platforms and tracks',
    language: 'en',
    difficulty: 'easy',
    category: 'places'
  },
  {
    id: 'en-easy-40',
    text: 'What do you use to cut your nails?',
    hint: 'It has two blades',
    language: 'en',
    difficulty: 'easy',
    category: 'tools'
  },

  // Medium Questions (35 questions)
  {
    id: 'en-medium-1',
    text: 'What is the chemical symbol for water?',
    hint: 'It contains hydrogen and oxygen',
    language: 'en',
    difficulty: 'medium',
    category: 'science'
  },
  {
    id: 'en-medium-2',
    text: 'What is the largest ocean on Earth?',
    hint: 'It covers about one-third of the Earth',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-3',
    text: 'What is the speed of light?',
    hint: 'It\'s approximately 300,000 km/s',
    language: 'en',
    difficulty: 'medium',
    category: 'science'
  },
  {
    id: 'en-medium-4',
    text: 'What is the capital of Australia?',
    hint: 'It\'s not Sydney or Melbourne',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-5',
    text: 'What is the smallest country in the world?',
    hint: 'It\'s located in Rome',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-6',
    text: 'What is the longest river in the world?',
    hint: 'It flows through Egypt',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-7',
    text: 'What is the largest desert in the world?',
    hint: 'It\'s in Africa',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-8',
    text: 'What is the highest mountain in the world?',
    hint: 'It\'s in the Himalayas',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-9',
    text: 'What is the currency of Japan?',
    hint: 'It starts with "Y"',
    language: 'en',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'en-medium-10',
    text: 'What is the largest mammal in the world?',
    hint: 'It lives in the ocean',
    language: 'en',
    difficulty: 'medium',
    category: 'animals'
  },
  {
    id: 'en-medium-11',
    text: 'What is the smallest planet in our solar system?',
    hint: 'It\'s closest to the sun',
    language: 'en',
    difficulty: 'medium',
    category: 'science'
  },
  {
    id: 'en-medium-12',
    text: 'What is the largest continent?',
    hint: 'It contains China and India',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-13',
    text: 'What is the currency of the United Kingdom?',
    hint: 'It\'s also called "quid"',
    language: 'en',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'en-medium-14',
    text: 'What is the largest bird in the world?',
    hint: 'It can\'t fly but can run fast',
    language: 'en',
    difficulty: 'medium',
    category: 'animals'
  },
  {
    id: 'en-medium-15',
    text: 'What is the capital of Canada?',
    hint: 'It\'s not Toronto or Vancouver',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-16',
    text: 'What is the largest lake in the world?',
    hint: 'It\'s actually a sea',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-17',
    text: 'What is the currency of Germany?',
    hint: 'It\'s now the Euro, but what was it before?',
    language: 'en',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'en-medium-18',
    text: 'What is the largest island in the world?',
    hint: 'It\'s covered in ice',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-19',
    text: 'What is the fastest land animal?',
    hint: 'It can run up to 70 mph',
    language: 'en',
    difficulty: 'medium',
    category: 'animals'
  },
  {
    id: 'en-medium-20',
    text: 'What is the capital of Brazil?',
    hint: 'It\'s not Rio de Janeiro',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-21',
    text: 'What is the largest planet in our solar system?',
    hint: 'It has a great red spot',
    language: 'en',
    difficulty: 'medium',
    category: 'science'
  },
  {
    id: 'en-medium-22',
    text: 'What is the currency of France?',
    hint: 'It\'s now the Euro, but what was it before?',
    language: 'en',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'en-medium-23',
    text: 'What is the largest country in the world?',
    hint: 'It spans two continents',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-24',
    text: 'What is the smallest continent?',
    hint: 'It\'s also a country',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-25',
    text: 'What is the currency of Italy?',
    hint: 'It\'s now the Euro, but what was it before?',
    language: 'en',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'en-medium-26',
    text: 'What is the largest city in the world by population?',
    hint: 'It\'s in Japan',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-27',
    text: 'What is the currency of Spain?',
    hint: 'It\'s now the Euro, but what was it before?',
    language: 'en',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'en-medium-28',
    text: 'What is the largest ocean on Earth?',
    hint: 'It covers about one-third of the Earth',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-29',
    text: 'What is the currency of the Netherlands?',
    hint: 'It\'s now the Euro, but what was it before?',
    language: 'en',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'en-medium-30',
    text: 'What is the largest desert in the world?',
    hint: 'It\'s in Africa',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-31',
    text: 'What is the currency of Portugal?',
    hint: 'It\'s now the Euro, but what was it before?',
    language: 'en',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'en-medium-32',
    text: 'What is the largest country in South America?',
    hint: 'It speaks Portuguese',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-33',
    text: 'What is the currency of Greece?',
    hint: 'It\'s now the Euro, but what was it before?',
    language: 'en',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'en-medium-34',
    text: 'What is the largest country in Africa?',
    hint: 'It\'s in the north',
    language: 'en',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'en-medium-35',
    text: 'What is the currency of Ireland?',
    hint: 'It\'s now the Euro, but what was it before?',
    language: 'en',
    difficulty: 'medium',
    category: 'economics'
  },

  // Hard Questions (25 questions)
  {
    id: 'en-hard-1',
    text: 'What is the molecular formula for glucose?',
    hint: 'It contains 6 carbon atoms',
    language: 'en',
    difficulty: 'hard',
    category: 'science'
  },
  {
    id: 'en-hard-2',
    text: 'What is the capital of Kazakhstan?',
    hint: 'It was moved from Almaty',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-3',
    text: 'What is the largest planet in our solar system?',
    hint: 'It has a great red spot',
    language: 'en',
    difficulty: 'hard',
    category: 'science'
  },
  {
    id: 'en-hard-4',
    text: 'What is the currency of Switzerland?',
    hint: 'It\'s not the Euro',
    language: 'en',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'en-hard-5',
    text: 'What is the largest country in the world by area?',
    hint: 'It spans two continents',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-6',
    text: 'What is the smallest country in the world?',
    hint: 'It\'s located in Rome',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-7',
    text: 'What is the largest ocean on Earth?',
    hint: 'It covers about one-third of the Earth',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-8',
    text: 'What is the currency of Norway?',
    hint: 'It\'s not the Euro',
    language: 'en',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'en-hard-9',
    text: 'What is the largest desert in the world?',
    hint: 'It\'s in Africa',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-10',
    text: 'What is the highest mountain in the world?',
    hint: 'It\'s in the Himalayas',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-11',
    text: 'What is the currency of Sweden?',
    hint: 'It\'s not the Euro',
    language: 'en',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'en-hard-12',
    text: 'What is the largest lake in the world?',
    hint: 'It\'s actually a sea',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-13',
    text: 'What is the currency of Denmark?',
    hint: 'It\'s not the Euro',
    language: 'en',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'en-hard-14',
    text: 'What is the largest island in the world?',
    hint: 'It\'s covered in ice',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-15',
    text: 'What is the currency of Poland?',
    hint: 'It\'s not the Euro',
    language: 'en',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'en-hard-16',
    text: 'What is the largest country in South America?',
    hint: 'It speaks Portuguese',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-17',
    text: 'What is the currency of the Czech Republic?',
    hint: 'It\'s not the Euro',
    language: 'en',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'en-hard-18',
    text: 'What is the largest country in Africa?',
    hint: 'It\'s in the north',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-19',
    text: 'What is the currency of Hungary?',
    hint: 'It\'s not the Euro',
    language: 'en',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'en-hard-20',
    text: 'What is the largest city in the world by population?',
    hint: 'It\'s in Japan',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-21',
    text: 'What is the currency of Romania?',
    hint: 'It\'s not the Euro',
    language: 'en',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'en-hard-22',
    text: 'What is the largest country in the world by area?',
    hint: 'It spans two continents',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-23',
    text: 'What is the currency of Bulgaria?',
    hint: 'It\'s not the Euro',
    language: 'en',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'en-hard-24',
    text: 'What is the largest ocean on Earth?',
    hint: 'It covers about one-third of the Earth',
    language: 'en',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'en-hard-25',
    text: 'What is the currency of Croatia?',
    hint: 'It\'s not the Euro',
    language: 'en',
    difficulty: 'hard',
    category: 'economics'
  }
];

// Arabic Questions (100 questions)
export const ARABIC_QUESTIONS: LessonQuestion[] = [
  // Easy Questions (40 questions)
  {
    id: 'ar-easy-1',
    text: 'ما هي عاصمة فرنسا؟',
    hint: 'تبدأ بحرف "ب" وتسمى مدينة النور',
    language: 'ar',
    difficulty: 'easy',
    category: 'geography'
  },
  {
    id: 'ar-easy-2',
    text: 'كيف تقول "مرحبا" بالإنجليزية؟',
    hint: 'تبدأ بحرف "H"',
    language: 'ar',
    difficulty: 'easy',
    category: 'language'
  },
  {
    id: 'ar-easy-3',
    text: 'ما هو 2 + 2؟',
    hint: 'عد على أصابعك',
    language: 'ar',
    difficulty: 'easy',
    category: 'math'
  },
  {
    id: 'ar-easy-4',
    text: 'ما لون السماء في يوم صاف؟',
    hint: 'فكر في يوم صيفي صاف',
    language: 'ar',
    difficulty: 'easy',
    category: 'science'
  },
  {
    id: 'ar-easy-5',
    text: 'ما هو أكبر كوكب في نظامنا الشمسي؟',
    hint: 'له بقعة حمراء عظيمة',
    language: 'ar',
    difficulty: 'easy',
    category: 'science'
  },
  {
    id: 'ar-easy-6',
    text: 'ما الحيوان الذي يقول "مواء"؟',
    hint: 'حيوان أليف شائع',
    language: 'ar',
    difficulty: 'easy',
    category: 'animals'
  },
  {
    id: 'ar-easy-7',
    text: 'ماذا تستخدم للكتابة؟',
    hint: 'له حبر ونقطة',
    language: 'ar',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: 'ar-easy-8',
    text: 'ما الفصل الذي يأتي بعد الشتاء؟',
    hint: 'تبدأ الأزهار في التفتح',
    language: 'ar',
    difficulty: 'easy',
    category: 'nature'
  },
  {
    id: 'ar-easy-9',
    text: 'ماذا تسمى المكان الذي تنام فيه؟',
    hint: 'موجود في غرفة نومك',
    language: 'ar',
    difficulty: 'easy',
    category: 'home'
  },
  {
    id: 'ar-easy-10',
    text: 'ماذا تشرب عندما تكون عطشان؟',
    hint: 'شفاف وأساسي للحياة',
    language: 'ar',
    difficulty: 'easy',
    category: 'food'
  },
  {
    id: 'ar-easy-11',
    text: 'ماذا ترتدي على قدميك؟',
    hint: 'تحمي قدميك',
    language: 'ar',
    difficulty: 'easy',
    category: 'clothing'
  },
  {
    id: 'ar-easy-12',
    text: 'ماذا تستخدم لقطع الورق؟',
    hint: 'له شفرة ومقابض',
    language: 'ar',
    difficulty: 'easy',
    category: 'tools'
  },
  {
    id: 'ar-easy-13',
    text: 'ماذا تسمى الشخص الذي يعلمك؟',
    hint: 'يعمل في مدرسة',
    language: 'ar',
    difficulty: 'easy',
    category: 'people'
  },
  {
    id: 'ar-easy-14',
    text: 'ماذا تستخدم لتنظيف أسنانك؟',
    hint: 'له شعيرات ومعجون أسنان',
    language: 'ar',
    difficulty: 'easy',
    category: 'hygiene'
  },
  {
    id: 'ar-easy-15',
    text: 'ماذا تسمى المكان الذي تشتري فيه الطعام؟',
    hint: 'له ممرات وعربات تسوق',
    language: 'ar',
    difficulty: 'easy',
    category: 'places'
  },
  {
    id: 'ar-easy-16',
    text: 'ماذا تستخدم لفتح الباب؟',
    hint: 'عادة ما يكون مصنوع من المعدن',
    language: 'ar',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: 'ar-easy-17',
    text: 'ماذا تسمى الوقت الذي تأكل فيه الفطور؟',
    hint: 'في الصباح',
    language: 'ar',
    difficulty: 'easy',
    category: 'time'
  },
  {
    id: 'ar-easy-18',
    text: 'ماذا تستخدم للرؤية؟',
    hint: 'لديك اثنان منهما',
    language: 'ar',
    difficulty: 'easy',
    category: 'body'
  },
  {
    id: 'ar-easy-19',
    text: 'ماذا تسمى المكان الذي تطبخ فيه؟',
    hint: 'له موقد وفرن',
    language: 'ar',
    difficulty: 'easy',
    category: 'home'
  },
  {
    id: 'ar-easy-20',
    text: 'ماذا تستخدم لمعرفة الوقت؟',
    hint: 'له عقارب وأرقام',
    language: 'ar',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: 'ar-easy-21',
    text: 'ماذا تسمى الشخص الذي يقود السيارة؟',
    hint: 'يجلس خلف المقود',
    language: 'ar',
    difficulty: 'easy',
    category: 'people'
  },
  {
    id: 'ar-easy-22',
    text: 'ماذا تستخدم لتنظيف يديك؟',
    hint: 'عادة ما يكون سائلاً ورغوياً',
    language: 'ar',
    difficulty: 'easy',
    category: 'hygiene'
  },
  {
    id: 'ar-easy-23',
    text: 'ماذا تسمى المكان الذي تمارس فيه الرياضة؟',
    hint: 'له معدات وأوزان',
    language: 'ar',
    difficulty: 'easy',
    category: 'places'
  },
  {
    id: 'ar-easy-24',
    text: 'ماذا تستخدم للاستماع للموسيقى؟',
    hint: 'يذهب فوق أذنيك',
    language: 'ar',
    difficulty: 'easy',
    category: 'technology'
  },
  {
    id: 'ar-easy-25',
    text: 'ماذا تسمى الشخص الذي يساعدك عندما تكون مريضاً؟',
    hint: 'يرتدي معطفاً أبيض',
    language: 'ar',
    difficulty: 'easy',
    category: 'people'
  },
  {
    id: 'ar-easy-26',
    text: 'ماذا تستخدم لالتقاط الصور؟',
    hint: 'له عدسة وفلاش',
    language: 'ar',
    difficulty: 'easy',
    category: 'technology'
  },
  {
    id: 'ar-easy-27',
    text: 'ماذا تسمى المكان الذي تستعير منه الكتب؟',
    hint: 'هادئ وله كتب كثيرة',
    language: 'ar',
    difficulty: 'easy',
    category: 'places'
  },
  {
    id: 'ar-easy-28',
    text: 'ماذا تستخدم للكتابة على الورق؟',
    hint: 'عادة ما يكون أسود أو أزرق',
    language: 'ar',
    difficulty: 'easy',
    category: 'objects'
  },
  {
    id: 'ar-easy-29',
    text: 'ماذا تسمى الشخص الذي يسلم البريد؟',
    hint: 'يرتدي زي موحد',
    language: 'ar',
    difficulty: 'easy',
    category: 'people'
  },
  {
    id: 'ar-easy-30',
    text: 'ماذا تستخدم لحفظ الطعام بارداً؟',
    hint: 'موجود في مطبخك',
    language: 'ar',
    difficulty: 'easy',
    category: 'appliances'
  },
  {
    id: 'ar-easy-31',
    text: 'ماذا تسمى المكان الذي تشاهد فيه الأفلام؟',
    hint: 'له شاشة كبيرة',
    language: 'ar',
    difficulty: 'easy',
    category: 'places'
  },
  {
    id: 'ar-easy-32',
    text: 'ماذا تستخدم لإجراء المكالمات الهاتفية؟',
    hint: 'محمول وله شاشة',
    language: 'ar',
    difficulty: 'easy',
    category: 'technology'
  },
  {
    id: 'ar-easy-33',
    text: 'ماذا تسمى الشخص الذي يصلح السيارات؟',
    hint: 'يعمل في مرآب',
    language: 'ar',
    difficulty: 'easy',
    category: 'people'
  },
  {
    id: 'ar-easy-34',
    text: 'ماذا تستخدم لتجفيف شعرك؟',
    hint: 'ينفخ هواء ساخن',
    language: 'ar',
    difficulty: 'easy',
    category: 'appliances'
  },
  {
    id: 'ar-easy-35',
    text: 'ماذا تسمى المكان الذي تشتري فيه الدواء؟',
    hint: 'له صيدلي',
    language: 'ar',
    difficulty: 'easy',
    category: 'places'
  },
  {
    id: 'ar-easy-36',
    text: 'ماذا تستخدم لقياس درجة الحرارة؟',
    hint: 'له زئبق أو عرض رقمي',
    language: 'ar',
    difficulty: 'easy',
    category: 'tools'
  },
  {
    id: 'ar-easy-37',
    text: 'ماذا تسمى الشخص الذي يقدم الطعام في المطعم؟',
    hint: 'يجلب طلبك',
    language: 'ar',
    difficulty: 'easy',
    category: 'people'
  },
  {
    id: 'ar-easy-38',
    text: 'ماذا تستخدم لغسل الأطباق؟',
    hint: 'عادة ما يكون سائلاً ورغوياً',
    language: 'ar',
    difficulty: 'easy',
    category: 'cleaning'
  },
  {
    id: 'ar-easy-39',
    text: 'ماذا تسمى المكان الذي تصعد فيه القطار؟',
    hint: 'له منصات ومسارات',
    language: 'ar',
    difficulty: 'easy',
    category: 'places'
  },
  {
    id: 'ar-easy-40',
    text: 'ماذا تستخدم لقص أظافرك؟',
    hint: 'له شفرتان',
    language: 'ar',
    difficulty: 'easy',
    category: 'tools'
  },

  // Medium Questions (35 questions)
  {
    id: 'ar-medium-1',
    text: 'ما هو الرمز الكيميائي للماء؟',
    hint: 'يحتوي على الهيدروجين والأكسجين',
    language: 'ar',
    difficulty: 'medium',
    category: 'science'
  },
  {
    id: 'ar-medium-2',
    text: 'ما هو أكبر محيط في العالم؟',
    hint: 'يغطي حوالي ثلث الأرض',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-3',
    text: 'ما هي سرعة الضوء؟',
    hint: 'حوالي 300,000 كم/ث',
    language: 'ar',
    difficulty: 'medium',
    category: 'science'
  },
  {
    id: 'ar-medium-4',
    text: 'ما هي عاصمة أستراليا؟',
    hint: 'ليست سيدني أو ملبورن',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-5',
    text: 'ما هي أصغر دولة في العالم؟',
    hint: 'تقع في روما',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-6',
    text: 'ما هو أطول نهر في العالم؟',
    hint: 'يمر عبر مصر',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-7',
    text: 'ما هي أكبر صحراء في العالم؟',
    hint: 'في أفريقيا',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-8',
    text: 'ما هو أعلى جبل في العالم؟',
    hint: 'في جبال الهيمالايا',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-9',
    text: 'ما هي عملة اليابان؟',
    hint: 'تبدأ بحرف "Y"',
    language: 'ar',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'ar-medium-10',
    text: 'ما هو أكبر حيوان ثديي في العالم؟',
    hint: 'يعيش في المحيط',
    language: 'ar',
    difficulty: 'medium',
    category: 'animals'
  },
  {
    id: 'ar-medium-11',
    text: 'ما هو أصغر كوكب في نظامنا الشمسي؟',
    hint: 'الأقرب إلى الشمس',
    language: 'ar',
    difficulty: 'medium',
    category: 'science'
  },
  {
    id: 'ar-medium-12',
    text: 'ما هي أكبر قارة؟',
    hint: 'تحتوي على الصين والهند',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-13',
    text: 'ما هي عملة المملكة المتحدة؟',
    hint: 'تسمى أيضاً "quid"',
    language: 'ar',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'ar-medium-14',
    text: 'ما هو أكبر طائر في العالم؟',
    hint: 'لا يستطيع الطيران لكنه يجري بسرعة',
    language: 'ar',
    difficulty: 'medium',
    category: 'animals'
  },
  {
    id: 'ar-medium-15',
    text: 'ما هي عاصمة كندا؟',
    hint: 'ليست تورونتو أو فانكوفر',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-16',
    text: 'ما هو أكبر بحيرة في العالم؟',
    hint: 'هي في الواقع بحر',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-17',
    text: 'ما هي عملة ألمانيا؟',
    hint: 'الآن اليورو، لكن ماذا كانت قبل ذلك؟',
    language: 'ar',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'ar-medium-18',
    text: 'ما هي أكبر جزيرة في العالم؟',
    hint: 'مغطاة بالجليد',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-19',
    text: 'ما هو أسرع حيوان بري؟',
    hint: 'يمكنه الجري حتى 70 ميل في الساعة',
    language: 'ar',
    difficulty: 'medium',
    category: 'animals'
  },
  {
    id: 'ar-medium-20',
    text: 'ما هي عاصمة البرازيل؟',
    hint: 'ليست ريو دي جانيرو',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-21',
    text: 'ما هو أكبر كوكب في نظامنا الشمسي؟',
    hint: 'له بقعة حمراء عظيمة',
    language: 'ar',
    difficulty: 'medium',
    category: 'science'
  },
  {
    id: 'ar-medium-22',
    text: 'ما هي عملة فرنسا؟',
    hint: 'الآن اليورو، لكن ماذا كانت قبل ذلك؟',
    language: 'ar',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'ar-medium-23',
    text: 'ما هي أكبر دولة في العالم؟',
    hint: 'تمتد عبر قارتين',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-24',
    text: 'ما هي أصغر قارة؟',
    hint: 'هي أيضاً دولة',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-25',
    text: 'ما هي عملة إيطاليا؟',
    hint: 'الآن اليورو، لكن ماذا كانت قبل ذلك؟',
    language: 'ar',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'ar-medium-26',
    text: 'ما هي أكبر مدينة في العالم من حيث عدد السكان؟',
    hint: 'في اليابان',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-27',
    text: 'ما هي عملة إسبانيا؟',
    hint: 'الآن اليورو، لكن ماذا كانت قبل ذلك؟',
    language: 'ar',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'ar-medium-28',
    text: 'ما هو أكبر محيط في العالم؟',
    hint: 'يغطي حوالي ثلث الأرض',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-29',
    text: 'ما هي عملة هولندا؟',
    hint: 'الآن اليورو، لكن ماذا كانت قبل ذلك؟',
    language: 'ar',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'ar-medium-30',
    text: 'ما هي أكبر صحراء في العالم؟',
    hint: 'في أفريقيا',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-31',
    text: 'ما هي عملة البرتغال؟',
    hint: 'الآن اليورو، لكن ماذا كانت قبل ذلك؟',
    language: 'ar',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'ar-medium-32',
    text: 'ما هي أكبر دولة في أمريكا الجنوبية؟',
    hint: 'تتحدث البرتغالية',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-33',
    text: 'ما هي عملة اليونان؟',
    hint: 'الآن اليورو، لكن ماذا كانت قبل ذلك؟',
    language: 'ar',
    difficulty: 'medium',
    category: 'economics'
  },
  {
    id: 'ar-medium-34',
    text: 'ما هي أكبر دولة في أفريقيا؟',
    hint: 'في الشمال',
    language: 'ar',
    difficulty: 'medium',
    category: 'geography'
  },
  {
    id: 'ar-medium-35',
    text: 'ما هي عملة أيرلندا؟',
    hint: 'الآن اليورو، لكن ماذا كانت قبل ذلك؟',
    language: 'ar',
    difficulty: 'medium',
    category: 'economics'
  },

  // Hard Questions (25 questions)
  {
    id: 'ar-hard-1',
    text: 'ما هي الصيغة الجزيئية للجلوكوز؟',
    hint: 'تحتوي على 6 ذرات كربون',
    language: 'ar',
    difficulty: 'hard',
    category: 'science'
  },
  {
    id: 'ar-hard-2',
    text: 'ما هي عاصمة كازاخستان؟',
    hint: 'تم نقلها من ألماتي',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-3',
    text: 'ما هو أكبر كوكب في نظامنا الشمسي؟',
    hint: 'له بقعة حمراء عظيمة',
    language: 'ar',
    difficulty: 'hard',
    category: 'science'
  },
  {
    id: 'ar-hard-4',
    text: 'ما هي عملة سويسرا؟',
    hint: 'ليست اليورو',
    language: 'ar',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'ar-hard-5',
    text: 'ما هي أكبر دولة في العالم من حيث المساحة؟',
    hint: 'تمتد عبر قارتين',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-6',
    text: 'ما هي أصغر دولة في العالم؟',
    hint: 'تقع في روما',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-7',
    text: 'ما هو أكبر محيط في العالم؟',
    hint: 'يغطي حوالي ثلث الأرض',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-8',
    text: 'ما هي عملة النرويج؟',
    hint: 'ليست اليورو',
    language: 'ar',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'ar-hard-9',
    text: 'ما هي أكبر صحراء في العالم؟',
    hint: 'في أفريقيا',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-10',
    text: 'ما هو أعلى جبل في العالم؟',
    hint: 'في جبال الهيمالايا',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-11',
    text: 'ما هي عملة السويد؟',
    hint: 'ليست اليورو',
    language: 'ar',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'ar-hard-12',
    text: 'ما هو أكبر بحيرة في العالم؟',
    hint: 'هي في الواقع بحر',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-13',
    text: 'ما هي عملة الدنمارك؟',
    hint: 'ليست اليورو',
    language: 'ar',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'ar-hard-14',
    text: 'ما هي أكبر جزيرة في العالم؟',
    hint: 'مغطاة بالجليد',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-15',
    text: 'ما هي عملة بولندا؟',
    hint: 'ليست اليورو',
    language: 'ar',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'ar-hard-16',
    text: 'ما هي أكبر دولة في أمريكا الجنوبية؟',
    hint: 'تتحدث البرتغالية',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-17',
    text: 'ما هي عملة جمهورية التشيك؟',
    hint: 'ليست اليورو',
    language: 'ar',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'ar-hard-18',
    text: 'ما هي أكبر دولة في أفريقيا؟',
    hint: 'في الشمال',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-19',
    text: 'ما هي عملة المجر؟',
    hint: 'ليست اليورو',
    language: 'ar',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'ar-hard-20',
    text: 'ما هي أكبر مدينة في العالم من حيث عدد السكان؟',
    hint: 'في اليابان',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-21',
    text: 'ما هي عملة رومانيا؟',
    hint: 'ليست اليورو',
    language: 'ar',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'ar-hard-22',
    text: 'ما هي أكبر دولة في العالم من حيث المساحة؟',
    hint: 'تمتد عبر قارتين',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-23',
    text: 'ما هي عملة بلغاريا؟',
    hint: 'ليست اليورو',
    language: 'ar',
    difficulty: 'hard',
    category: 'economics'
  },
  {
    id: 'ar-hard-24',
    text: 'ما هو أكبر محيط في العالم؟',
    hint: 'يغطي حوالي ثلث الأرض',
    language: 'ar',
    difficulty: 'hard',
    category: 'geography'
  },
  {
    id: 'ar-hard-25',
    text: 'ما هي عملة كرواتيا؟',
    hint: 'ليست اليورو',
    language: 'ar',
    difficulty: 'hard',
    category: 'economics'
  }
];

// Export all questions by language
export const LESSON_QUESTIONS: Record<string, LessonQuestion[]> = {
  en: ENGLISH_QUESTIONS,
  ar: ARABIC_QUESTIONS
};
