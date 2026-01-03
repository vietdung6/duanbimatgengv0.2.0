export type HomeTeamIdentity = 
  | "Samsung Ozone"
  | "Samsung White"
  | "Samsung Blue"
  | "Samsung Galaxy"
  | "KSV"
  | "Gen.G";

export interface IdentityResult {
  identity: HomeTeamIdentity;
  isAmbiguous?: boolean; // True if it could be White or Blue
  options?: HomeTeamIdentity[];
}

export function getHomeTeamIdentity(dateStr: string): IdentityResult {
  const date = new Date(dateStr);
  const time = date.getTime();

  // Helper to create date from string "YYYY-MM-DD"
  const d = (str: string) => new Date(str).getTime();

  // Samsung Ozone: 07/09/2013 - 10/06/2014
  const ozoneStart = d("2013-09-07");
  const ozoneEnd = d("2014-06-10");

  // Samsung White: 11/06/2014 - 28/11/2014
  const whiteStart = d("2014-06-11");
  const whiteEnd = d("2014-11-28");

  // Samsung Blue: 07/09/2013 - 28/11/2014
  const blueStart = d("2013-09-07");
  const blueEnd = d("2014-11-28");

  // Samsung Galaxy: 29/11/2014 - 30/11/2017
  const ssgStart = d("2014-11-29");
  const ssgEnd = d("2017-11-30");

  // KSV: 16/01/2018 - 31/03/2018
  const ksvStart = d("2018-01-16");
  const ksvEnd = d("2018-03-31");

  // Gen.G: 03/05/2018 - Present
  const gengStart = d("2018-05-03");

  // Logic Check
  
  // Overlap Period (White/Ozone vs Blue): 07/09/2013 - 28/11/2014
  if (time >= blueStart && time <= blueEnd) {
    // Determine if it's Ozone or White era
    let variant: "Samsung Ozone" | "Samsung White" = "Samsung Ozone";
    if (time >= whiteStart) {
      variant = "Samsung White";
    }

    // Since Blue exists throughout this whole period, it's always ambiguous
    return {
      identity: variant, // Default to White/Ozone as they are often the "main" subject, but flag as ambiguous
      isAmbiguous: true,
      options: [variant, "Samsung Blue"]
    };
  }

  if (time >= ssgStart && time <= ssgEnd) {
    return { identity: "Samsung Galaxy" };
  }

  if (time >= ksvStart && time <= ksvEnd) {
    return { identity: "KSV" };
  }

  if (time >= gengStart) {
    return { identity: "Gen.G" };
  }

  // Handle gaps
  if (time > ssgEnd && time < ksvStart) return { identity: "Samsung Galaxy" }; 
  if (time > ksvEnd && time < gengStart) return { identity: "KSV" }; 
  
  // Default fallback
  if (time < ozoneStart) return { identity: "Samsung Ozone" }; 
  
  return { identity: "Gen.G" };
}

export function getIdentityLogo(identity: string): string {
    switch (identity) {
      case "Samsung Ozone":
        return "/images/logo_teams/Samsung_Galaxy_Ozone_Logo.webp";
      case "Samsung White":
        return "/images/logo_teams/Samsung_Whitelogo.webp";
      case "Samsung Blue":
        // Fallback to Galaxy logo if specific Blue logo is missing, or user might have named it differently?
        // Based on available files, we'll use the Galaxy logo or keep external?
        // User said "updated for EACH era", so likely expected local files.
        // Assuming Blue uses the generic Galaxy logo or user forgot to upload Blue specific.
        return "/images/logo_teams/Samsung_Galaxylogo.webp"; 
      case "Samsung Galaxy":
        return "/images/logo_teams/Samsung_Galaxylogo.webp";
      case "KSV":
        return "/images/logo_teams/KSV_eSportslogo_square.webp";
      case "Gen.G":
      case "Gen.G Esports":
      default:
        return "/images/logo_teams/GenG_logo.webp";
    }
}
