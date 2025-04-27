import { type MetadataRoute } from "next"
import iconsData from '../../public/icons.json'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Score Keeper",
    short_name: "Score Keeper",
    description: "Score keeping app for games",
    start_url: "/",
    display: "standalone",
    background_color: "#1f2937",
    theme_color: "#1f2937",
    id: "com.a2score.app",
    scope: "/",
    orientation: "landscape",
    icons: iconsData.icons
  }
}
