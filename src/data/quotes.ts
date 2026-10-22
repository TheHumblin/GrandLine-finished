export interface DenDenMessage {
  text: string;
  speaker: string;
  type: 'quote' | 'trivia' | 'fact';
}

export const DEN_DEN_MESSAGES: DenDenMessage[] = [
  // Famous Quotes
  { text: "I'm going to be King of the Pirates!", speaker: "Monkey D. Luffy", type: 'quote' },
  { text: "Nothing happened.", speaker: "Roronoa Zoro", type: 'quote' },
  { text: "People's dreams... never end!", speaker: "Marshall D. Teach", type: 'quote' },
  { text: "The sea is vast. There's always someone stronger out there.", speaker: "Shanks", type: 'quote' },
  { text: "I'll die smiling! Because if you're going to laugh, do it now!", speaker: "Portgas D. Ace", type: 'quote' },
  { text: "Pirates are evil? The Marines are righteous? These labels are lies. Children who have never seen peace will never know when there's peace at stake.", speaker: "Gol D. Roger", type: 'quote' },
  { text: "When do you think people die? When they are shot through the heart by the bullet of a pistol? No. When they are ravaged by an incurable disease? No. When they drink a soup made from a poisonous mushroom? No! It's when... they are forgotten!", speaker: "Dr. Hiluluk", type: 'quote' },
  { text: "Inherited Will, The destiny of the Age, The dreams of its people. As long as people continue to pursue the meaning of Freedom, these things will never cease to be!", speaker: "Gol D. Roger", type: 'quote' },
  { text: "Whatever you lose, you'll find it again, but what you throw away you'll never get back.", speaker: "Kenshin Himura (Nami)", type: 'quote' },
  { text: "Power isn't determined by your size, but the size of your heart and dreams!", speaker: "Monkey D. Luffy", type: 'quote' },
  { text: "There comes a time when a man has to stand and fight! That time is when his friend's dreams are being laughed at.", speaker: "Usopp", type: 'quote' },
  { text: "Wealth. Fame. Power. The man who had acquired everything in this world, the Pirate King, Gold Roger.", speaker: "Narrator", type: 'quote' },
  { text: "I don't want to conquer anything. I just think the guy with the most freedom in the whole ocean... that's the Pirate King!", speaker: "Monkey D. Luffy", type: 'quote' },
  { text: "One Piece... does exist!", speaker: "Whitebeard (Newgate)", type: 'quote' },
  { text: "If I can't even protect my captain's dream, then whatever ambitions I have are nothing but page-filler!", speaker: "Roronoa Zoro", type: 'quote' },
  { text: "A real swordsman does not use a sword to kill. It is a tool to give life.", speaker: "Roronoa Zoro", type: 'quote' },
  { text: "I've set myself to become the King of the Pirates... and if I die trying... then at least I tried!", speaker: "Monkey D. Luffy", type: 'quote' },
  { text: "Cooking is a gift from the gods. Spices are a gift from the devil. We serve both God and the devil in the kitchen.", speaker: "Vinsmoke Sanji", type: 'quote' },
  { text: "Even if I have to fight the whole world, I'll always be on your side.", speaker: "Monkey D. Luffy", type: 'quote' },
  { text: "It may be hard right now, but you must silence those thoughts! Stop counting only those things that you have lost! What is gone, is gone!", speaker: "Jinbei", type: 'quote' },
  { text: "Nico Robin: The people of this country have endured great hardships, and they will overcome them too. I can read history. It's written on the Poneglyph... the history of this island.", speaker: "Nico Robin", type: 'quote' },
  { text: "There are things you can't give up even if it kills you.", speaker: "Usopp", type: 'quote' },
  { text: "A man's dream will never die!", speaker: "Whitebeard (Newgate)", type: 'quote' },
  { text: "If you can't stand, crawl forward.", speaker: "Monkey D. Luffy", type: 'quote' },
  { text: "The sea is the greatest classroom. You can't learn what's out there by staying on shore.", speaker: "Shanks", type: 'quote' },

  // Trivia
  { text: "Oda revealed that Luffy's Devil Fruit was always supposed to be the most ridiculous-sounding one to emphasize his free spirit.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "The Going Merry's 'Klabautermann' (ship spirit) is said to appear only when a ship is about to die. The Merry's farewell is one of the most emotional moments in anime history.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "Gol D. Roger could hear the 'Voice of All Things' — an ability shared by Luffy and Oden. It allows hearing the voice of animals, Sea Kings, and even Poneglyphs.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "Oda confirmed that if One Piece were set in the real world, the Straw Hats would be sailing in the Indian Ocean.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "The 'D.' initial in many characters' names (Luffy, Roger, Ace, Law) is called the 'Will of D.' — a bloodline that has always stood against the Celestial Dragons.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "Eiichiro Oda started One Piece in 1997 and has stated the story is about 80% complete. The series has sold over 520 million copies worldwide.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "Zoro's scar over his eye was self-inflicted during the time skip — a training scar from his brutal training under Mihawk.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "The Void Century — 800 years of erased history — is the greatest mystery in One Piece. The World Government erases all records of this period from existence.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "Brook was alone on the ghost ship for approximately 50 years waiting for the crew that never returned before Luffy found him.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "Shanks' scar across his eye was given to him by Blackbeard — one of the few people capable of wounding a future Yonko.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "The Poneglyph stones were created by the Kozuki clan of Wano 800 years ago — the only clan who could read and write on them.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "Oda based the Grand Line on the 'impossible geography' concept — a sea so unpredictable and dangerous that only the most exceptional pirates could traverse it.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "The current highest canon bounty in One Piece is Monkey D. Luffy's — 3,000,000,000 Berri after defeating Kaido.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "Gear Fifth — Luffy's awakened form — reveals that the Gomu Gomu no Mi was actually the Hito Hito no Mi, Model: Nika, a Mythical Zoan stolen by the World Government 800 years ago.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "Devil Fruits exist in the sea of One Piece as the incarnation of the sea devil. Those who eat them gain powers but lose the ability to swim.", speaker: "One Piece Trivia", type: 'trivia' },
  { text: "The 'All Blue' — Sanji's dream — is a legendary sea where the North, South, East, and West Blue all meet. Oda confirmed it is real.", speaker: "One Piece Trivia", type: 'trivia' },
];

export function getDailyMessage(): DenDenMessage {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return DEN_DEN_MESSAGES[dayOfYear % DEN_DEN_MESSAGES.length];
}
