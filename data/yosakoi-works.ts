export type YosakoiWork = {
  id: string;
  years: number[];
  teamId: string;
  teamName: string;
  workTitle?: string;
  youtubeId?: string;
  featured?: boolean;
  location?: string;
  notes?: string;
  thumbnailVariant?: string;
  accentColor?: string;
  thumbnailImage?: string;
  order?: number;
};

/**
 * Initial sample data only.
 * The complete 104-work migration will happen after the data audit phase.
 */
export const yosakoiWorks: YosakoiWork[] = [
  {
    id: "y2025-001",
    years: [2025],
    teamId: "takamatsu-yosakoiren",
    teamName: "高松よさこい連",
    workTitle: "青き羅針盤",
    youtubeId: "NpEgk5tcMRU",
    featured: true,
    location: "香川",
    order: 10,
  },
  {
    id: "y2025-002",
    years: [2025, 2026],
    teamId: "tsunagi",
    teamName: "絆葵",
    workTitle: "和魂燃ゆ",
    youtubeId: "0cVMboraXyo",
    featured: true,
    order: 20,
  },
  {
    id: "y2025-003",
    years: [2025],
    teamId: "hamakko-dan-dan",
    teamName: "浜っ鼓★弾★DAN",
    workTitle: "ふるさと",
    youtubeId: "if2cLP48KGg",
    location: "大阪",
    order: 30,
  },
  {
    id: "y2025-004",
    years: [2025],
    teamId: "sakuya-konohana",
    teamName: "咲くやこの花",
    workTitle: "花つむぎ",
    youtubeId: "JHBdTyd-sss",
    featured: true,
    order: 40,
  },
  {
    id: "y2025-005",
    years: [2025],
    teamId: "hanamai-onibachi",
    teamName: "華舞鬼蜂",
    workTitle: "joker",
    youtubeId: "kNxDa4OeRNE",
    location: "岡山",
    order: 50,
  },
  {
    id: "y2022-001",
    years: [2022],
    teamId: "kokushi-musou",
    teamName: "國士舞双",
    workTitle: "HOTAERU!",
    youtubeId: "RQyDJsJmaIg",
    featured: true,
    location: "高知・東京",
    order: 10,
  },
  {
    id: "y2019-001",
    years: [2019],
    teamId: "kokushi-musou",
    teamName: "國士舞双",
    workTitle: "土佐より",
    youtubeId: "gp7ZLGd5_Dc",
    location: "高知・東京",
    order: 10,
  },
  {
    id: "y2008-001",
    years: [2008],
    teamId: "kokushi-musou",
    teamName: "國士舞双",
    workTitle: "新たなる時代への挑戦",
    youtubeId: "h2AaLyIgkBg",
    location: "高知・東京",
    order: 10,
  },
];

export const featuredWorks = yosakoiWorks
  .filter((work) => work.featured)
  .slice(0, 6);
