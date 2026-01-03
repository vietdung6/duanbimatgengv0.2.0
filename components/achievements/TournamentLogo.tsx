import Image from "next/image";
import { motion } from "framer-motion";
import { EWCLogo, MSILogo, WorldsLogo, tournamentLogos } from "@/components/shared/Logos";
import { eraLogos } from "@/lib/data/eraLogos";

interface TournamentLogoProps {
  title: string;
  icon?: string;
  type?: string;
}

export function TournamentLogo({ title, icon, type }: TournamentLogoProps) {
  const titleLower = title.toLowerCase();

  let LogoComponent = null;

  if (icon === "logo:samsung") {
    LogoComponent = (
      <div className="relative w-8 h-8">
        <Image
          src={eraLogos["Samsung Galaxy"]!}
          alt="Samsung Galaxy"
          fill
          className="object-contain"
          sizes="32px"
        />
      </div>
    );
  } else if (icon === "logo:ksv") {
    LogoComponent = (
      <div className="relative w-8 h-8">
        <Image
          src={eraLogos["KSV"]!}
          alt="KSV eSports"
          fill
          className="object-contain"
          sizes="32px"
        />
      </div>
    );
  } else if (icon === "logo:geng") {
    LogoComponent = (
      <div className="relative w-8 h-8">
        <Image
          src={eraLogos["Gen.G"]!}
          alt="Gen.G"
          fill
          className="object-contain"
          sizes="32px"
        />
      </div>
    );
  } else if (titleLower.includes("worlds") || titleLower.includes("cktg") || titleLower.includes("thế giới")) {
    LogoComponent = <WorldsLogo className="w-8 h-8 text-yellow-400" />;
  } else if (titleLower.includes("msi")) {
    LogoComponent = <MSILogo className="w-8 h-8 text-blue-400" />;
  } else if (titleLower.includes("ewc")) {
    LogoComponent = <EWCLogo className="w-8 h-8 text-white" />;
  } else if (
    titleLower.includes("lck") ||
    titleLower.includes("ogn") ||
    titleLower.includes("champions")
  ) {
    LogoComponent = (
      <div className="relative w-8 h-8">
        <Image
          src={tournamentLogos.lck}
          alt="LCK"
          fill
          className="object-contain"
          sizes="32px"
        />
      </div>
    );
  }

  if (LogoComponent) {
    return (
      <motion.div
        className="flex-shrink-0"
        whileHover={{
          rotate: [0, -15, 15, 0],
          scale: 1.1,
        }}
        transition={{ duration: 0.5 }}
      >
        {LogoComponent}
      </motion.div>
    );
  }

  if (icon) {
    return (
      <motion.span
        className="text-xl sm:text-2xl md:text-3xl flex-shrink-0"
        animate={
          type === "legendary"
            ? {
              rotate: [0, 5, -5, 0],
            }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {icon}
      </motion.span>
    );
  }

  return null;
}
