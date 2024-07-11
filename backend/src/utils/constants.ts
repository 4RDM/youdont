import { HexColorString } from "discord.js";

interface Color {
    blue: HexColorString;
    green: HexColorString;
    red: HexColorString;
    orange: HexColorString;
    purple: HexColorString;
}

export const embedColors: Color = {
    blue: "#5865f2",
    green: "#4fdf62",
    red: "#f54242",
    orange: "#e69138",
    purple: "#924ed1",
};

const Owner = "843444624193486859";
const Zarzad = "843444626726584370";
const Dodaj = "981302216692498443";
const Nick = "981302459043577907";
const HeadAdmin = "843444636793176064";
const SeniorAdmin = "1013520114865414195";
const Admin = "843444637565321236";
const JuniorAdmin = "1013519805518708778";
const SeniorModerator = "1013519589277192362";
const Moderator = "843444638219370497";
const JuniorModerator = "1013519449489428491";
const Support = "843444639666143252";
const TrialSupport = "843444639997886465";
const Developer = "883475949964906516";
const TrialDeveloper = "863107202365390879";
const Team = "843444642539110400";
const OpiekunHounds = "962784956197765192";
const Hounds = "932345054142529538";
const Czlonek = "843476029226221609";
const Antilag = "1196829757363474554"; // zostawiam na kiedyś ale na razie niech będzie tylko owner bo nie szanują

export const Roles = {
    DodajTeam: [ Owner, Zarzad, Dodaj, HeadAdmin ],
    NickTeam: [ Owner, Zarzad, Nick, HeadAdmin ],
    AntilagTeam: [ Owner, Antilag ],
    NotatkaTeam: [ Owner, Zarzad, HeadAdmin, Developer ],
    DeveloperTeam: [ Owner, Zarzad, HeadAdmin, Developer ],
    Owner,
    Zarzad,
    Dodaj,
    Nick,
    HeadAdmin,
    SeniorAdmin,
    Admin,
    JuniorAdmin,
    SeniorModerator,
    Moderator,
    JuniorModerator,
    Support,
    TrialSupport,
    Developer,
    TrialDeveloper,
    Team,
    OpiekunHounds,
    Hounds,
    HoundsTeam: [ Hounds, OpiekunHounds, Team ],
    Czlonek
};
