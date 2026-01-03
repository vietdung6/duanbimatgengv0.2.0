export interface LocalizedString {
  en: string;
  vi: string;
}

export interface CommunityLink {
  name: LocalizedString | string;
  link: string;
  description: LocalizedString;
}

export const playerSupportData: CommunityLink[] = [
  // Kiin
  {
    name: { en: "Kim Kiin da nau mi chua?", vi: "Kim Kiin đã nấu mì chưa?" },
    link: "https://www.facebook.com/kiindanaumychua",
    description: {
      en: "Fan-run page for Kiin with casual updates and memes.",
      vi: "Fanpage do fan lập cho Kiin, cập nhật đời thường và meme.",
    },
  },
  // Canyon
  {
    name: { en: "Big White Bear Canyon", vi: "Hẻm núi Gấu trắng của Kim Canyon" },
    link: "https://www.facebook.com/bigwhitebearcanyon",
    description: {
      en: "Vietnamese fanpage for Canyon; highlights and memes.",
      vi: "Fanpage Canyon cho fan Việt, tổng hợp highlight và meme.",
    },
  },
  // Chovy
  {
    name: { en: "Anchovy Shark", vi: "Cá mập Anchovy" },
    link: "https://www.facebook.com/cacomChovy",
    description: {
      en: "Fanpage for Chovy with memes and match reactions.",
      vi: "Fanpage Chovy, nhiều meme và reaction trận đấu.",
    },
  },
  {
    name: { en: "Singer Jihun (Chovy)", vi: "Ca sĩ Jihun - Singer Chovy" },
    link: "https://www.facebook.com/profile.php?id=61557548111539",
    description: {
      en: "Fun fanpage imagining Chovy as singer Jihun.",
      vi: "Fanpage vui về Chovy dưới vai ca sĩ Jihun.",
    },
  },
  {
    name: { en: "Chovy’s Journey", vi: "Hành trình của tuyển thủ Chovy" },
    link: "https://www.facebook.com/chobimine",
    description: {
      en: "Timeline-style fanpage for Chovy’s career moments.",
      vi: "Fanpage kiểu timeline, theo hành trình sự nghiệp của Chovy.",
    },
  },
  {
    name: "Chovywings",
    link: "https://www.facebook.com/profile.php?id=61560270600529",
    description: {
      en: "Fan-run Chovy page with edits and updates.",
      vi: "Fanpage Chovy do fan quản lý, có nhiều edit và cập nhật.",
    },
  },
  {
    name: { en: "Chovy Esport - VN Fanpage", vi: "Chovy esport - Fan Vietnam Fanpage" },
    link: "https://www.facebook.com/profile.php?id=100069287362906",
    description: {
      en: "Vietnam-based Chovy fanpage sharing news and memes.",
      vi: "Fanpage Chovy tại Việt Nam, chia sẻ tin và meme.",
    },
  },
  // Ruler
  {
    name: { en: "Ruler’s Pentagram", vi: "Pentagram của Ruler" },
    link: "https://www.facebook.com/profile.php?id=61578654754957",
    description: {
      en: "Fanpage for Ruler with highlights and community posts.",
      vi: "Fanpage Ruler, chia sẻ highlight và bài cộng đồng.",
    },
  },
  {
    name: { en: "Ruler & Lehends", vi: "Ruler ơi, Lehends à" },
    link: "https://www.facebook.com/ruler.lehends",
    description: {
      en: "Fan-run duo page for Ruler x Lehends moments.",
      vi: "Fanpage do fan lập, lưu giữ khoảnh khắc Ruler x Lehends.",
    },
  },
  // Duro
  {
    name: { en: "Study With Duro", vi: "ôn thi đại học cùng duro." },
    link: "https://www.facebook.com/profile.php?id=61568895128172",
    description: {
      en: "Lighthearted fanpage about Duro with study/meme theme.",
      vi: "Fanpage vui về Duro với concept ôn thi + meme.",
    },
  },
  {
    name: "Duro Duro Duroro",
    link: "https://www.facebook.com/profile.php?id=61569849747863",
    description: {
      en: "Fanpage for Duro with clips and playful edits.",
      vi: "Fanpage Duro, đăng clip và edit vui.",
    },
  },
  {
    name: { en: "Introvert with Joo Minkyu", vi: "Hướng nội cùng Joo Minkyu" },
    link: "https://www.facebook.com/profile.php?id=61569427462200",
    description: {
      en: "Fan-run page for Duro (Joo Minkyu) with daily content.",
      vi: "Fanpage do fan lập cho Duro (Joo Minkyu), nội dung đời thường.",
    },
  },
];

export const teamSupportData: CommunityLink[] = [
  {
    name: { en: "Lien Meme Huyen Thoai", vi: "Liên meme huyền thoại" },
    link: "https://www.facebook.com/lienmemehuyenthoai",
    description: {
      en: "Vietnamese meme community about League of Legends and Gen.G",
      vi: "Cộng đồng meme LMHT, nơi thường xuyên có content về Gen.G.",
    },
  },
  {
    name: { en: "Biet Doi Vang Den", vi: "Biệt đội vàng đen" },
    link: "https://www.facebook.com/bietdoivangden",
    description: {
      en: "Vietnamese Gen.G fan community (black & gold squad)",
      vi: "Cộng đồng fan Gen.G Việt Nam – Biệt đội vàng đen.",
    },
  },
  {
    name: "Gencon LOL",
    link: "https://www.facebook.com/GenconLOL",
    description: {
      en: "Gen.G Vietnamese fan community",
      vi: "Fanpage cộng đồng Gen.G dành cho fan Việt.",
    },
  },
  {
    name: { en: "Gen.G Esports LOL Vietnam", vi: "Gen.G Esports LOL Việt Nam" },
    link: "https://www.facebook.com/GenGLOLVN",
    description: {
      en: "Page sharing news and content about Gen.G for Vietnamese fans",
      vi: "Trang chia sẻ tin tức, nội dung về Gen.G cho fan Việt.",
    },
  },
  {
    name: {
      en: "Gen.G Pro-Game LOL Team Vietnam Fanpage",
      vi: "Gen.G Pro-Game LOL Team Vietnam Fanpage",
    },
    link: "https://www.facebook.com/GenGVNFP",
    description: {
      en: "Vietnamese fanpage following Gen.G pro team",
      vi: "Fanpage theo dõi đội tuyển Gen.G dành cho fan Việt Nam.",
    },
  },
];

export const otherCommunitiesData: CommunityLink[] = [
  {
    name: { en: "1021kwt - Chenchi gau gau gau", vi: "1021kwt - Chenchi gâu gâu gâu" },
    link: "https://www.facebook.com/profile.php?id=61562086325683",
    description: {
      en: "Fan-run page with Genrang memes and Valorant/Gen.G updates.",
      vi: "Fanpage do fan quản lý, meme Genrang và cập nhật Gen.G/Valorant.",
    },
  },
];

export const officialMerchData: CommunityLink[] = [
  {
    name: { en: "Gen.G Official Shop", vi: "Shop chính thức Gen.G" },
    link: "https://en.gengshop.com/",
    description: {
      en: "Official global Gen.G store (international shipping).",
      vi: "Shop chính thức toàn cầu của Gen.G (có ship quốc tế).",
    },
  },
  {
    name: {
      en: "Gen.G Buy/Sell/Exchange Group",
      vi: "Nhóm mua, trao đổi, mọi thứ về Gen.G",
    },
    link: "https://www.facebook.com/groups/435113395569129",
    description: {
      en: "Vietnamese fan-run group for buying/selling/exchanging Gen.G merch (not official).",
      vi: "Group fan Việt tự phát để mua/bán/trao đổi đồ Gen.G (không phải shop chính thức).",
    },
  },
  {
    name: {
      en: "Chovy the Nyangnyangie",
      vi: "Chovy the nyangnyangie",
    },
    link: "https://www.facebook.com/chovythenyangnyangie",
    description: {
      en: "Fan-run Chovy page; sometimes shares merch info (not official store).",
      vi: "Fanpage do fan quản lý, đôi khi chia sẻ merch (không phải shop chính thức).",
    },
  },
  {
    name: {
      en: "Chovy Thang Thi Moi Vui",
      vi: "chovy thắng thì mới vui",
    },
    link: "https://www.facebook.com/profile.php?id=61575035294975",
    description: {
      en: "This is a personal vietnamese blog supporting Chovy and GenG. It accepts orders for GenG products and The MAU - Chovy's shop (not the official shop).",
      vi: "Blog cá nhân support Chovy & GenG. Có nhận order merch GenG, The MAU - shop của Chovy (không phải shop chính thức).",
    },
  },
];
