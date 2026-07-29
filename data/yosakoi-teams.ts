export type YosakoiTeam = {
  id: string;
  name: string;
};

/**
 * Canonical team IDs and display names.
 *
 * Add a team here before referencing it from a work. The archive validator
 * rejects unknown IDs and mismatched names to prevent spelling drift.
 */
export const yosakoiTeams: YosakoiTeam[] = [
  { id: "chibako-fujin", name: "千葉工業大学 風神" },
  { id: "geta", name: "早稲田大学 下駄っぱーず" },
  { id: "hamakkodandan", name: "浜っ鼓★弾★DAN" },
  { id: "hanamaionibachi", name: "華舞鬼蜂" },
  { id: "himabito", name: "関西大学 飛舞人" },
  { id: "hokosaki", name: "関東学院大学 誇咲" },
  { id: "hyakumonogatari", name: "百物語" },
  { id: "icchome", name: "さぬき一丁目一番地" },
  { id: "ichipage", name: "ゐちぺぃじ" },
  { id: "iku", name: "祭三代・IKU!" },
  { id: "jiyuu", name: "時遊" },
  { id: "kacyofugetsu", name: "花鶴風月" },
  { id: "kiryu", name: "妃龍" },
  { id: "kokushi", name: "國士舞双" },
  { id: "matsuriya", name: "祭や倶楽部" },
  { id: "okirakuya", name: "お喜楽家" },
  { id: "ringou", name: "凛轟" },
  { id: "sakuyakonohana", name: "咲くやこの花" },
  { id: "samurai", name: "早稲田大学 踊り侍" },
  { id: "shishameki", name: "柳葉魚のざわめき" },
  { id: "t-hibiki", name: "東海大学 響" },
  { id: "takamatsuyosakoiren", name: "高松よさこい連" },
  { id: "tokyohanabi", name: "早稲田大学 東京花火" },
  { id: "tsunagi", name: "絆葵" },
  { id: "yosarou", name: "同志社大学 よさ朗" },
  { id: "yusuhara", name: "檮原" },
  { id: "yusyoryu", name: "北里三陸湧昇龍" },
  { id: "zokkon", name: "ぞっこん町田 ’98" },
];
